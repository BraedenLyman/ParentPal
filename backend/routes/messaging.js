const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/conversations/:account_id", async (req, res) => {
  try {
    const { account_id } = req.params;
    const result = await pool.query(
      `SELECT
        c.conversation_id,
        bs.parent_id,
        bs.babysitter_id,
        c.last_message_at,
        CASE
          WHEN bs.parent_id = $1 THEN CONCAT(a_babysitter.first_name, ' ', a_babysitter.last_name)
          ELSE CONCAT(a_parent.first_name, ' ', a_parent.last_name)
        END as other_user_name,
        CASE
          WHEN bs.parent_id = $1 THEN bs.babysitter_id
          ELSE bs.parent_id
        END as other_user_id,
        CASE
          WHEN bs.parent_id = $1 THEN 'babysitter'
          ELSE 'parent'
        END as other_user_type,
        m.content as last_message,
        m.created_at as last_message_time,
        m.sender_id as last_message_sender_id,
        COALESCE(unread.count, 0) as unread_count
      FROM babysitter_shares bs
      LEFT JOIN account a_parent ON a_parent.account_id = bs.parent_id
      LEFT JOIN account a_babysitter ON a_babysitter.account_id = bs.babysitter_id
      LEFT JOIN conversations c ON c.parent_id = bs.parent_id AND c.babysitter_id = bs.babysitter_id
      LEFT JOIN LATERAL (
        SELECT content, created_at, sender_id
        FROM messages
        WHERE conversation_id = c.conversation_id
        ORDER BY created_at DESC
        LIMIT 1
      ) m ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*) as count
        FROM messages
        WHERE conversation_id = c.conversation_id
          AND sender_id != $1
          AND is_read = false
      ) unread ON true
      WHERE (bs.parent_id = $1 OR bs.babysitter_id = $1)
        AND bs.is_verified = true
      ORDER BY COALESCE(c.last_message_at, c.created_at, bs.created_at) DESC`,
      [account_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.get("/messages/:conversation_id", async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const { account_id } = req.query;

    const result = await pool.query(
      `SELECT
        m.message_id,
        m.conversation_id,
        m.sender_id,
        m.content,
        m.created_at,
        m.is_read,
        CONCAT(a.first_name, ' ', a.last_name) as sender_name
      FROM messages m
      JOIN account a ON a.account_id = m.sender_id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC`,
      [conversation_id]
    );

    if (account_id) {
      await pool.query(
        `UPDATE messages
        SET is_read = true
        WHERE conversation_id = $1
          AND sender_id != $2
          AND is_read = false`,
        [conversation_id, account_id]
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/send", async (req, res) => {
  try {
    const { sender_id, recipient_id, content } = req.body;

    if (!sender_id || !recipient_id || !content || content.trim() === "") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const shareCheck = await pool.query(
      `SELECT share_id FROM babysitter_shares
      WHERE ((parent_id = $1 AND babysitter_id = $2) OR (parent_id = $2 AND babysitter_id = $1))
        AND is_verified = true`,
      [sender_id, recipient_id]
    );

    if (shareCheck.rows.length === 0) {
      return res.status(403).json({ error: "No verified relationship between users" });
    }

    const userTypes = await pool.query(
      `SELECT account_id, account_type FROM account WHERE account_id IN ($1, $2)`,
      [sender_id, recipient_id]
    );

    let parent_id, babysitter_id;
    userTypes.rows.forEach(user => {
      if (user.account_type === 'parent') {
        parent_id = user.account_id;
      } else if (user.account_type === 'babysitter') {
        babysitter_id = user.account_id;
      }
    });

    if (!parent_id || !babysitter_id) {
      return res.status(400).json({ error: "Invalid user types" });
    }

    let conversation = await pool.query(
      `SELECT conversation_id FROM conversations
      WHERE parent_id = $1 AND babysitter_id = $2`,
      [parent_id, babysitter_id]
    );

    let conversation_id;
    if (conversation.rows.length === 0) {
      const newConversation = await pool.query(
        `INSERT INTO conversations (parent_id, babysitter_id, last_message_at)
        VALUES ($1, $2, NOW())
        RETURNING conversation_id`,
        [parent_id, babysitter_id]
      );
      conversation_id = newConversation.rows[0].conversation_id;
    } else {
      conversation_id = conversation.rows[0].conversation_id;
      await pool.query(
        `UPDATE conversations SET last_message_at = NOW() WHERE conversation_id = $1`,
        [conversation_id]
      );
    }

    const result = await pool.query(
      `INSERT INTO messages (conversation_id, sender_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING message_id, conversation_id, sender_id, content, created_at, is_read`,
      [conversation_id, sender_id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/recipients/:account_id", async (req, res) => {
  try {
    const { account_id } = req.params;

    const userResult = await pool.query(
      `SELECT account_type FROM account WHERE account_id = $1`,
      [account_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const accountType = userResult.rows[0].account_type;

    let result;
    if (accountType === 'parent') {
      result = await pool.query(
        `SELECT
          a.account_id,
          CONCAT(a.first_name, ' ', a.last_name) as name,
          a.email_address as email,
          bs.share_id
        FROM babysitter_shares bs
        JOIN account a ON a.account_id = bs.babysitter_id
        WHERE bs.parent_id = $1 AND bs.is_verified = true
        ORDER BY a.first_name, a.last_name`,
        [account_id]
      );
    } else if (accountType === 'babysitter') {
      result = await pool.query(
        `SELECT
          a.account_id,
          CONCAT(a.first_name, ' ', a.last_name) as name,
          a.email_address as email,
          bs.share_id
        FROM babysitter_shares bs
        JOIN account a ON a.account_id = bs.parent_id
        WHERE bs.babysitter_id = $1 AND bs.is_verified = true
        ORDER BY a.first_name, a.last_name`,
        [account_id]
      );
    } else {
      return res.status(400).json({ error: "Invalid account type" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching recipients:", err);
    res.status(500).json({ error: "Failed to fetch recipients" });
  }
});

router.put("/read/:conversation_id", async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const { account_id } = req.body;

    await pool.query(
      `UPDATE messages
      SET is_read = true
      WHERE conversation_id = $1
        AND sender_id != $2
        AND is_read = false`,
      [conversation_id, account_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
});

router.get("/unread-count/:account_id", async (req, res) => {
  try {
    const { account_id } = req.params;

    const result = await pool.query(
      `SELECT COUNT(*) as count
      FROM messages m
      JOIN conversations c ON c.conversation_id = m.conversation_id
      WHERE (c.parent_id = $1 OR c.babysitter_id = $1)
        AND m.sender_id != $1
        AND m.is_read = false`,
      [account_id]
    );

    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

module.exports = router;
