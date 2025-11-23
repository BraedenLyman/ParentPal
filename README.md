<div align="center">

<img src="public/images/ParentPal.png" alt="ParentPal Logo" width="240"/>

### A comprehensive childcare management platform for parents and babysitters

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[Visit ParentPal](https://parentpals.ca) • [Documentation](#-user-manual-parent-user) • [Security](#-security)

</div>

<br/>

---

## Table of Contents

- [Overview](#-overview)
- [Tech Stack](#️-tech-stack)
- [User Manual (Parent)](#-user-manual-parent-user)
- [User Manual (Babysitter)](#-user-manual-babysitter-user)
- [Security](#-security)

---

<br/>

## Overview

**ParentPal** is a comprehensive childcare management platform designed to simplify parenting and babysitting tasks. Track your child's growth, monitor sleep patterns, manage health records, coordinate with babysitters, and access personalized insights—all in one intuitive application.

### Who is ParentPal for?

- **Parents** - Track and manage every aspect of your child's development
- **Babysitters** - Access necessary child information and collaborate with parents

<br/>

---

## Tech Stack

```javascript
Framework:        React 18.3.1
Build Tool:       Vite 6.3.5
Language:         JavaScript (JSX) + TypeScript 5.6.3
UI Libraries:     HeroUI 2.8.3, Chakra UI 3.28.0, TailwindCSS 4.1.11
Routing:          React Router DOM 6.23.0
HTTP Client:      Axios 1.12.2
Authentication:   Firebase 12.2.1
Animation:        Framer Motion 11.18.2
Charts:           Recharts 3.3.0
Testing:          Jest 30.2.0, Cypress 15.3.0, React Testing Library 16.3.0
Hosting:          Firebase Hosting
```

<br/>

---

## User Manual (Parent User)

###  Home Page

The main dashboard provides quick access to all major features:
- **Log Cards** - Click any card to view/add records (Growth, Sleep, Health, Feeding, Observations)
- **Assigned Tasks** - Manage tasks for babysitters
- **Photo Gallery** - View and upload photos

<details>
<summary><h3>Logs</h3></summary>

#### Growth Tracker
**Viewing Growth Records**
1. Select "Growth Tracker" from the first dropdown
2. Select one of your children from the second dropdown (if you have more than one child)
3. A list of all growth records for that child will then appear

**Adding Grwoth Records**
1. Click the **"Add"** button (bottom right)
2. Enter the corresponding growth record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the list of growth records for that child

**Filtering Growth Records**
1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of growth records will be filtered accordingly

**Editing GrowthRecords**
1. Click the **Edit** icon (The pencial icon on the growth record card)
2. A modal will appear with the current growth record details
3. Update the details as needed
4. Click **"Save"** to save changes or **"Cancel"** to cancel

**Deleting Growth Records**
1. Click the **Delete** icon (The trash icon on the growth record card)
2. A modal will appear with a delete growth record confirmation
3. Click **"Delete"** to delete the record or **"Cancel"** to cancel


#### Sleep Analytics
**Viewing sleep Records**
1. Select "Sleep Analytics" from the first dropdown
2. Select one of your children from the second dropdown (if you have more than one child)
3. A list of all sleep records for that child will then appear

**Adding Sleep Records**
1. Click the **"Add"** button (bottom right)
2. Enter the corresponding sleep record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the list of sleep records for that child

**Filtering Sleep Records**
1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of sleep records will be filtered accordingly

**Editing Sleep Records**
1. Click the **Edit** icon (The pencial icon on the sleep record card)
2. A modal will appear with the current sleep record details
3. Update the details as needed
4. Click **"Save"** to save changes or **"Cancel"** to cancel

**Deleting Sleep Records**
1. Click the **Delete** icon (The trash icon on the sleep record card)
2. A modal will appear with a delete sleep record confirmation
3. Click **"Delete"** to delete the record or **"Cancel"** to cancel


#### Health Journal
**Viewing Health Records**
1. Select "Health Journal" from the first dropdown
2. Select one of your children from the second dropdown (if you have more than one child)
3. Select the type of Health Records you want to view from the navigation bar (e.g., "Medications", "Allergies", "Vaccinations" or "Sick Days")
3. A list of all selected Health records types for that child will then appear

**Adding Health Records**
(Note: The selected Health Record type (From the navigation bar) will be the type of Health Record that you are adding)

1. Click the **"Add"** button (bottom right)
2. Enter the corresponding health record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the selected type of Health Records list for that child

**Filtering Health Records**
(Note: The selected Health Record type (From the navigation bar) will be the type of Health Record that you are filtering)

1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of the selected Health Record type will be filtered accordingly

**Editing Health Records**
(Note: The selected Health Record type (From the navigation bar) will be the type of Health Record that you are editing)

1. Click the **Edit** icon (The pencial icon on the health record card)
2. A modal will appear with the current health record details
3. Update the details as needed
4. Click **"Save"** to save changes or **"Cancel"** to cancel

**Deleting Health Records**
(Note: The selected Health Record type (From the navigation bar) will be the type of Health Record that you are deleting)

1. Click the **Delete** icon (The trash icon on the health record card)
2. A modal will appear with a delete health record confirmation
3. Click **"Delete"** to delete the record or **"Cancel"** to cancel


#### Feeding Notes
**Viewing feeding Records**
1. Select "Feeding Notes" from the first dropdown
2. Select one of your children from the second dropdown (if you have more than one child)
3. A list of all feeding records for that child will then appear

**Adding Feeding Records**
1. Click the **"Add"** button (bottom right)
2. Enter the corresponding feeding record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the list of feeding records for that child

**Filtering Feeding Records**
1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of feeding records will be filtered accordingly

**Editing Records**
1. Click the **Edit** icon (The pencial icon on the feeding record card)
2. A modal will appear with the current feeding record details
3. Update the details as needed
4. Click **"Save"** to save changes or **"Cancel"** to cancel

**Deleting Growth Records**
1. Click the **Delete** icon (The trash icon on the feeding record card)
2. A modal will appear with a delete feeding record confirmation
3. Click **"Delete"** to delete the record or **"Cancel"** to cancel


#### Observation Notes
**Viewing Observation Records**
1. Select "Observation Notes" from the first dropdown
2. Select one of your children from the second dropdown (if you have more than one child)
3. A list of all observation records for that child will then appear

**Adding Observation Records**
1. Click the **"Add"** button (bottom right)
2. Enterr the corresponding observation record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the list of observation records for that child

**Filtering Observation Records**
1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of observation records will be filtered accordingly

**Editing Records**
1. Click the **Edit** icon (The pencial icon on the observation record card)
2. A modal will appear with the current observation record details
3. Update the details as needed
4. Click **"Save"** to save changes or **"Cancel"** to cancel

**Deleting Growth Records**
1. Click the **Delete** icon (The trash icon on the observation record card)
2. A modal will appear with a delete observation record confirmation
3. Click **"Delete"** to delete the record or **"Cancel"** to cancel

</details>

<details>
<summary><h3>Assigned Tasks</h3></summary>

#### Viewing Tasks
1. All tasks will be displayed on the main tasks page showing the task title, assigned baby and assigned babysitter.

#### Adding Tasks
1. Click **"+ Add Task"**
2. Enter the required corresponding task details (along with optional details if applicable)
3. Click **"Add Task"** to save or **"Cancel"** to cancel

#### Editing Tasks
1. Click the **Edit** icon (The pencial icon on the task card)
2. Update the details as needed
3. Click **"Save Changes"** to save changes or **"Cancel"** to cancel

#### Deleting Tasks
1. Click the **Delete** icon (The trash icon on the task card)
2. A modal will appear with a delete task confirmation
3. Click **"Delete"** to delete the task or **"Cancel"** to cancel

</details>

<details>
<summary><h3>Messages</h3></summary>

(Note: In order to view messages, you must have a shared account set up with a babysitter)

#### Unread Messages
1. There will be a red circle badge in the top right corner of the messages navigation tab (At the bottom of the applicaton) with a number indicating the number of unread messages
2. The unread messages will be in a bolded font and have a green circle bage indicating the number of unread messages in the corrisponding conversation with a babysitter
2. Once you have read the messages, the badges will disappear

#### Viewing Conversations 
1. All conversations will be displayed on the main messages page (As conversation cards) showing the babysitter's name, the most recent message and the date/time of the most recent message.

#### Viewing Conversation Messages
1. Click the conversation card to view the messages for that conversation
2. A page will appear with a history of all messages from that conversation with the most recent message at the bottom
3. As a parent, your messages are in a green text bubble, while the babysitter's messages are in a white text bubble
4. You will see the time of each message underneath the message bubbles

#### Sending Messages
1. Type your message in the text box at the bottom of the page in the corresponding conversation with the babysitter
2. Click **"Send"** to send the message
3. The message will be sent to the babysitter and will appear in the conversation with the babysitter

</details>

<details>
<summary><h3>Reports</h3></summary>

**Available Reports:**
- **Growth Over Time** - Height/weight charts
- **Sleep Patterns** - Sleep duration trends
- **Feeding Patterns** - Feeding frequency analysis

Select report type and child from dropdowns to view visualizations.

</details>

<details>
<summary><h3>⚙️ Settings - Click to expand</h3></summary>

#### Personal Information
- **Add Baby**: Enter name, DOB, gender, category
- **Delete Baby**: Click trash icon, confirm deletion
- **Change Password**: Enter new password (min 8 chars, 1 uppercase, 1 number, 1 special char)

#### Shared Accounts
- **Add Babysitter**: Click "+ Add Babysitter", enter name and email, send invitation
- **Delete Access**: Click trash icon to revoke access

#### Data Export
1. Select child from dropdown
2. Check data types to include
3. Click **"Generate PDF"**

#### Delete Account
Click **"Delete"** button, confirm to permanently delete account.

</details>

<details>
<summary><h3>📸 Photo Gallery - Click to expand</h3></summary>

#### Uploading Photos
1. Click **"Upload Photo"**
2. Select baby from dropdown
3. Choose photo (max 5MB)
4. Add caption (optional)
5. Click **"Upload"**

#### Deleting Photos
1. Click trash icon on photo
2. Confirm deletion

</details>

<br/>

---

## 📗 User Manual (Babysitter User)

> **Quick Navigation**: [Home](#-home-page-1) • [Logs](#-logs-1) • [Tasks](#-assigned-tasks-1) • [Messages](#-messages-1) • [Settings](#-settings-1) • [Photos](#-photo-gallery-1)

### 🏠 Home Page

- **No Access Yet** - Wait for parent invitation
- **After Access** - View log cards, assigned tasks, photo gallery

<details>
<summary><h3>📝 Logs - Click to expand</h3></summary>

Babysitters can view and add records for:
- **Sleep Analytics** - View/add sleep records
- **Health Journal** - View/add medication records
- **Feeding Notes** - View/add feeding records
- **Observation Notes** - View/add observations

*Same process as parent users for adding records.*

</details>

<details>
<summary><h3>✅ Assigned Tasks - Click to expand</h3></summary>

#### Completing Tasks
1. View tasks in **Pending Tasks** section
2. Click task card to expand
3. Enter completion comments (optional)
4. Click **"Mark as Complete"**
5. Task moves to **Completed Tasks**

</details>

<details>
<summary><h3>💬 Messages - Click to expand</h3></summary>

Same as parent users - view conversations, send messages to parents.

</details>

<details>
<summary><h3>⚙️ Settings - Click to expand</h3></summary>

#### Personal Information
- View email
- Change password

#### Shared Accounts
1. Check email for 4-digit access code (check spam folder)
2. Navigate to Settings > Shared Accounts
3. Enter 4-digit code
4. Click **"Verify Code"**
5. Access granted to view children's data

#### Delete Account
Click **"Delete"** button, confirm to permanently delete account.

</details>

<details>
<summary><h3>📸 Photo Gallery - Click to expand</h3></summary>

- **View Photos** - See photos uploaded by parents and yourself
- **Upload Photos** - Same process as parents (cannot delete parent photos)

</details>

<br/>

---

## 🔐 Security

<div align="center">

![Security](https://img.shields.io/badge/Secure%20Connection-HTTPS%2FTLS-brightgreen?style=for-the-badge)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Firebase-blue?style=for-the-badge)
![Privacy](https://img.shields.io/badge/Data%20Privacy-Protected-orange?style=for-the-badge)

</div>

<br/>

### 🛡️ Security Measures

ParentPal takes your family's data security seriously. We implement industry-standard security practices:

<table>
<tr>
<td width="50%" valign="top">

#### 🔒 Authentication & Access
- **Firebase Authentication** for secure user management
- **JWT Tokens** for session handling
- **Role-based Access Control** (Parent vs Babysitter)
- **Secure Password Requirements** (min 8 chars, uppercase, number, special char)
- **Access Code System** for babysitter invitations

</td>
<td width="50%" valign="top">

#### 🔐 Data Protection
- **HTTPS/TLS Encryption** for all data transmission
- **Secure Storage** of credentials and sensitive data
- **Input Validation** to prevent XSS and SQL injection
- **CORS Protection** for API endpoints
- **Regular Security Audits** and updates

</td>
</tr>
</table>

### 🔏 Privacy Features

- **Data Isolation** - Parents and babysitters only see authorized data
- **Granular Sharing** - Parents control what babysitters can access
- **Account Deletion** - Full data removal upon account deletion
- **Data Export** - Download your data anytime as PDF
- **No Third-party Sharing** - Your data stays with ParentPal

<br/>

<div align="center">

---

**© 2025 ParentPal. All rights reserved.**

Built with ❤️ for parents and babysitters everywhere

</div>
