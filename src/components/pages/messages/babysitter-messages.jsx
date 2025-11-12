import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../config/api';
import Navbar from '../nav-bar/navbar';
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import './messages.css';
import { Button } from '@heroui/react';

export default function BabysitterMessages() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }

      try {
        const idToken = await currentUser.getIdToken();
        const response = await axios.post(
          `${API_URL}/api/sign-in`,
          { idToken },
          { withCredentials: true }
        );
        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const fetchConversations = async () => {
    if (!currentUser || !userData?.account_id) return;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await axios.get(
        `${API_URL}/api/messaging/conversations/${userData.account_id}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
          withCredentials: true,
        }
      );
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    if (!currentUser || !userData?.account_id) return;

    try {
      const idToken = await currentUser.getIdToken();
      const response = await axios.get(
        `${API_URL}/api/messaging/messages/${conversationId}?account_id=${userData.account_id}`,
        {
          headers: { Authorization: `Bearer ${idToken}` },
          withCredentials: true,
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    setSending(true);
    try {
      const idToken = await currentUser.getIdToken();
      await axios.post(
        `${API_URL}/api/messaging/send`,
        {
          sender_id: userData.account_id,
          recipient_id: selectedConversation.other_user_id,
          content: newMessage.trim(),
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
          withCredentials: true,
        }
      );

      setNewMessage('');
      await fetchMessages(selectedConversation.conversation_id);
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.conversation_id);
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
  };

  useEffect(() => {
    if (currentUser && userData?.account_id) {
      fetchConversations();
    }
  }, [currentUser, userData]);

  useEffect(() => {
    if (selectedConversation) {
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(selectedConversation.conversation_id);
        fetchConversations();
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [selectedConversation]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="messages-container">
          <div className="loading-messages">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="messages-container">
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
        </div>
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <EnvelopeIcon />
              <h3>No Messages Yet</h3>
              <p>Accept a parent invitation in Settings to start messaging</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.conversation_id}
                className={`conversation-item ${
                  selectedConversation?.conversation_id === conversation.conversation_id
                    ? 'active'
                    : ''
                } ${conversation.unread_count > 0 ? 'unread' : ''}`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="conversation-avatar">
                  {getInitials(conversation.other_user_name)}
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <span className="conversation-name">
                      {conversation.other_user_name}
                    </span>
                    {conversation.last_message_time && (
                      <span className="conversation-time">
                        {formatTime(conversation.last_message_time)}
                      </span>
                    )}
                  </div>
                  <div className="conversation-preview">
                    {conversation.last_message || 'No messages yet'}
                  </div>
                </div>
                {conversation.unread_count > 0 && (
                  <span className="unread-badge">{conversation.unread_count}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="messages-main">
        {!selectedConversation ? (
          <div className="messages-empty-state">
            <ChatBubbleLeftRightIcon />
            <h3>Select a conversation</h3>
            <p>Choose a parent from the list to start messaging</p>
          </div>
        ) : (
          <>
            <div className="conversation-header-bar">
              <Button
                isIconOnly
                variant="light"
                className="back-button-mobile"
                onPress={handleBackToConversations}
              >
                <ArrowLeftIcon />
              </Button>
              <div className="conversation-avatar">
                {getInitials(selectedConversation.other_user_name)}
              </div>
              <h3>{selectedConversation.other_user_name}</h3>
              <span className="conversation-user-type">Parent</span>
            </div>

            <div className="messages-thread">
              {messages.map((message) => (
                <div
                  key={message.message_id}
                  className={`message-group ${
                    message.sender_id === userData.account_id ? 'sent' : 'received'
                  }`}
                >
                  <div className="message-bubble">{message.content}</div>
                  <div className="message-timestamp">
                    {new Date(message.created_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input-container">
              <form onSubmit={handleSendMessage} className="message-input-form">
                <div className="message-input-wrapper">
                  <textarea
                    className="message-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    rows={1}
                  />
                </div>
                <button
                  type="submit"
                  className="send-button"
                  disabled={!newMessage.trim() || sending}
                >
                  <span>{sending ? 'Sending...' : 'Send'}</span>
                  <PaperAirplaneIcon />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
