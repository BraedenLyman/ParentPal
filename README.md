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

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
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

### Frontend
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

## 📘 User Manual (Parent User)

> **Quick Navigation**: [Home](#-home-page) • [Logs](#-logs) • [Tasks](#-assigned-tasks) • [Messages](#-messages) • [Reports](#-reports) • [Settings](#-settings) • [Photos](#-photo-gallery)

### 🏠 Home Page

Your dashboard provides quick access to all major features:
- **Log Cards** - Click any card to view/add records (Growth, Sleep, Health, Feeding, Observations)
- **Assigned Tasks** - Manage tasks for babysitters
- **Photo Gallery** - View and upload photos

<details>
<summary><h3>📝 Logs - Click to expand</h3></summary>

#### 📈 Growth Tracker
**Viewing Records**
1. Select "Growth Tracker" from the first dropdown
2. Select your child from the second dropdown

**Adding Records**
1. Click the **"Add"** button (bottom right)
2. Enter: Height (ft/in), Weight (lbs), Date
3. Click **"Add"** to save

#### 😴 Sleep Analytics
**Viewing Records**
1. Select "Sleep Analytics" from dropdown
2. Select your child

**Adding Records**
1. Click **"Add"** button
2. Enter: Duration (hours), Time fell asleep, Date
3. Click **"Add"** to save

#### 🏥 Health Journal
**Medications** - Track medications with dosage and symptoms
**Allergies** - Record allergies with severity levels
**Vaccinations** - Log vaccine history
**Sick Days** - Document illness with temperature and medications

#### 🍼 Feeding Notes
**Adding Records**
1. Click **"Add"** button
2. Enter: Time, Date, Fed from (Bottle/Breast), Food type, Amount (fl oz), Notes
3. Click **"Add"** to save

#### 📋 Observation Notes
**Adding Records**
1. Click **"Add"** button
2. Select: Priority level (Low/Medium/High)
3. Enter: Observation notes
4. Click **"Add"** to save

</details>

<details>
<summary><h3>✅ Assigned Tasks - Click to expand</h3></summary>

#### Adding Tasks
1. Click **"+ Add Task"**
2. Enter: Title, Description (optional), Assign to babysitter, Assign to baby, Due date (optional)
3. Click **"Add Task"**

#### Editing Tasks
1. Click the **Edit** icon on task card
2. Update information
3. Click **"Save Changes"**

#### Deleting Tasks
1. Click the **Delete** icon
2. Confirm deletion

</details>

<details>
<summary><h3>💬 Messages - Click to expand</h3></summary>

1. View conversations on the left sidebar
2. Click a conversation to view messages
3. Type message at bottom
4. Click **"Send"**

</details>

<details>
<summary><h3>📊 Reports - Click to expand</h3></summary>

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
