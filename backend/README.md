# ParentPal Backend

<div align="center">

<img src="../public/images/ParentPal.png" alt="ParentPal Logo" width="200"/>

### 🔌 REST API & Database Documentation

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

</div>

---

## 📑 Table of Contents
- [🧭 Overview](#-overview)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔌 API Endpoints](#-api-endpoints)
  - [Authentication](#-authentication)
  - [User Management](#-user-management)
  - [Baby Management](#-baby-management)
  - [Health Records](#-health-records)
  - [Photo Gallery](#-photo-gallery)
  - [Babysitter Sharing](#-babysitter-sharing)
  - [Shared Tasks](#-shared-tasks)
  - [Messaging](#-messaging)
- [🔐 Security](#-security)
- [🧠 Developer Notes](#-developer-notes)

---

## 🧭 Overview

The **ParentPal backend** powers the application's data management and authentication systems. Built with Node.js and Express, it provides a comprehensive REST API for managing childcare data, babysitter coordination, and real-time messaging.

### 📊 API Statistics
- **Total Endpoints**: 72
- **Authentication**: Firebase Auth + JWT
- **Database**: PostgreSQL
- **File Storage**: Local filesystem for photos

---

## 🛠️ Tech Stack

```javascript
Runtime:              Node.js
Framework:            Express.js
Database:             PostgreSQL
Authentication:       Firebase Admin SDK
File Upload:          Multer
Email Service:        Nodemailer
Security:             CORS, Input Validation
```

---

## 🔌 API Endpoints

# 🧾 Accounts API Documentation

This document describes the `/accounts` endpoint used for creating user accounts (and optionally, their associated baby profiles).

---

## **POST /accounts**

### 📘 Description
Creates a new user account in the database.  
Optionally creates an associated baby record if baby information is provided.

---

### 🧩 Request Body

| Field | Type | Required | Description |
|-------|------|-----------|-------------|
| `firebaseUid` | `string` | ✅ | The Firebase UID of the user. |
| `fName` | `string` | ✅ | User's first name. |
| `lName` | `string` | ✅ | User's last name. |
| `email` | `string` | ✅ | User's email address. |
| `accountType` | `string` | ✅ | Type of account (e.g., `"parent"`, `"admin"`). |
| `dob` | `string (YYYY-MM-DD)` | ❌ | User's date of birth. |
| `gender` | `string` | ❌ | User's gender (max 7 characters stored). |
| `baby` | `object` | ❌ | Optional baby object with details below. |

---

### 👶 Baby Object (optional)

| Field | Type | Required | Description |
|-------|------|-----------|-------------|
| `bFName` | `string` | ✅ | Baby's first name. |
| `bLName` | `string` | ✅ | Baby's last name. |
| `bDob` | `string (YYYY-MM-DD)` | ❌ | Baby's date of birth. |
| `bGender` | `string` | ❌ | Baby's gender (max 7 characters stored). |

---

### 📨 Example Request

```json
POST /accounts
Content-Type: application/json

{
  "firebaseUid": "abcd1234",
  "fName": "Alex",
  "lName": "Johnson",
  "email": "alex.johnson@example.com",
  "accountType": "parent",
  "dob": "1990-06-15",
  "gender": "female",
  "baby": {
    "bFName": "Charlie",
    "bLName": "Johnson",
    "bDob": "2022-01-10",
    "bGender": "male"
  }
}


### 🔐 Authentication

#### POST `/api/sign-in`
Authenticates a user using Firebase ID token and retrieves account data

**Request Body:**
```json
{
  "idToken": "firebase_id_token"
}
```

**Response:**
```json
{
  "user": {
    "account_id": 1,
    "firebase_uid": "...",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "account_type": "parent"
  },
  "babies": [...]
}
```

---

### 👤 User Management

#### POST `/api/accounts`
Creates a new parent or babysitter account

**Request Body:**
```json
{
  "firebaseUid": "...",
  "fName": "John",
  "lName": "Doe",
  "email": "john@example.com",
  "accountType": "parent",
  "dob": "1990-01-01",
  "gender": "Male",
  "baby": {
    "bFName": "Baby",
    "bLName": "Doe",
    "bDob": "2024-01-01",
    "bGender": "Female"
  }
}
```

#### DELETE `/api/user`
Deletes a user account and all associated data

**Query Parameters:**
- `firebase_uid` - User's Firebase UID

---

### 👶 Baby Management

#### GET `/api/babies/:accountId`
Retrieves all babies for a parent account

#### GET `/api/babies?firebase_uid=...`
Retrieves the first baby for a parent

#### POST `/api/babies`
Creates a new baby record

**Request Body:**
```json
{
  "parent_id": 1,
  "first_name": "Baby",
  "last_name": "Doe",
  "birth_date": "2024-01-01",
  "gender": "Female",
  "category": "Baby"
}
```

#### DELETE `/api/babies/:baby_id`
Deletes a baby and all associated health records

---

### 🏥 Health Records

All health record endpoints follow a similar pattern:

<details>
<summary><b>📈 Growth Records</b></summary>

#### GET `/api/growth?baby_id=1`
Retrieves growth records for a baby

#### POST `/api/growth`
Creates a growth record
```json
{
  "baby_id": 1,
  "date": "2024-01-01",
  "weight": 20.5,
  "height": 30.2
}
```

#### PUT `/api/growth/:growth_id`
Updates a growth record

#### DELETE `/api/growth/:growth_id`
Deletes a growth record

</details>

<details>
<summary><b>😴 Sleep Records</b></summary>

#### GET `/api/sleep?baby_id=1`
#### POST `/api/sleep`
```json
{
  "baby_id": 1,
  "time_fell_asleep": "20:00",
  "date": "2024-01-01",
  "sleep_duration": 8,
  "created_by_account_id": 1,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe"
}
```
#### PUT `/api/sleep/:sleep_id`
#### DELETE `/api/sleep/:sleep_id`

</details>

<details>
<summary><b>💊 Medication Records</b></summary>

#### GET `/api/meds?baby_id=1`
#### POST `/api/meds`
```json
{
  "baby_id": 1,
  "medication_name": "Tylenol",
  "time_taken": "10:00",
  "date": "2024-01-01",
  "dosage": "5ml",
  "symptoms": "Fever"
}
```
#### PUT `/api/meds/:med_id`
#### DELETE `/api/meds/:med_id`

</details>

<details>
<summary><b>🍼 Feeding Records</b></summary>

#### GET `/api/feeding?baby_id=1`
#### POST `/api/feeding`
```json
{
  "baby_id": 1,
  "time_fed": "08:00",
  "date": "2024-01-01",
  "fed_from": "Bottle",
  "type_of_food": "Milk",
  "amount": "6oz",
  "notes": "Finished all"
}
```
#### PUT `/api/feeding/:feeding_id`
#### DELETE `/api/feeding/:feeding_id`

</details>

<details>
<summary><b>📋 Observation Records</b></summary>

#### GET `/api/observation?baby_id=1`
#### POST `/api/observation`
```json
{
  "baby_id": 1,
  "priority_level": "Medium",
  "notes": "Baby seems fussy today"
}
```
#### PUT `/api/observation/:observation_id`
#### DELETE `/api/observation/:observation_id`

</details>

<details>
<summary><b>🤒 Sick Day Records</b></summary>

#### GET `/api/sickday?baby_id=1`
#### POST `/api/sickday`
```json
{
  "baby_id": 1,
  "date": "2024-01-01",
  "meds_taken": "Tylenol",
  "temp": "101.5"
}
```
#### PUT `/api/sickday/:sick_id`
#### DELETE `/api/sickday/:sick_id`

</details>

<details>
<summary><b>🥜 Allergy Records</b></summary>

#### GET `/api/allergies?baby_id=1`
#### POST `/api/allergies`
```json
{
  "baby_id": 1,
  "allergy_name": "Peanuts",
  "severity": "High",
  "epi_pen": "Yes",
  "notes": "Severe reaction"
}
```
#### PUT `/api/allergies/:allergy_id`
#### DELETE `/api/allergies/:allergy_id`

</details>

<details>
<summary><b>💉 Vaccination Records</b></summary>

#### GET `/api/vaccinations?baby_id=1`
#### POST `/api/vaccinations`
```json
{
  "baby_id": 1,
  "vaccination_name": "MMR",
  "date_of_vaccine": "2024-01-01"
}
```
#### PUT `/api/vaccinations/:vaccine_id`
#### DELETE `/api/vaccinations/:vaccine_id`

</details>

---

### 📸 Photo Gallery

#### GET `/api/photo-gallery/baby/:babyId`
Retrieves all photos for a specific baby

#### GET `/api/photo-gallery/parent/:parentId`
Retrieves all photos uploaded by a parent

#### GET `/api/photo-gallery/babysitter/:babysitterId`
Retrieves all photos for babies accessible by a babysitter

#### POST `/api/photo-gallery/upload`
Uploads a new photo (multipart/form-data)

**Form Data:**
- `photo` - Image file (max 5MB, jpeg/jpg/png/gif/webp)
- `baby_id` - Baby ID
- `parent_id` - Parent ID
- `caption` - Photo caption (optional)

#### DELETE `/api/photo-gallery/:photoId`
Deletes a photo from gallery and filesystem

---

### 🔗 Babysitter Sharing

#### POST `/api/babysitter-sharing/invite`
Sends invitation email with 4-digit code (expires in 7 days)

**Request Body:**
```json
{
  "parent_id": 1,
  "babysitter_email": "sitter@example.com",
  "babysitter_name": "Jane"
}
```

#### POST `/api/babysitter-sharing/verify`
Verifies babysitter with code from email

**Request Body:**
```json
{
  "verification_code": "1234",
  "babysitter_id": 2
}
```

#### GET `/api/babysitter-sharing/children/:babysitter_id`
Retrieves all children accessible by a babysitter

#### GET `/api/babysitter-sharing/babysitters/:parent_id`
Retrieves all babysitters (verified and pending) for a parent

#### DELETE `/api/babysitter-sharing/remove/:share_id`
Removes babysitter access to children

---

### ✅ Shared Tasks

#### GET `/api/shared-tasks/parent/:parentId`
Retrieves all tasks created by a parent

#### GET `/api/shared-tasks/babysitter/:babysitterId`
Retrieves all tasks assigned to a babysitter

#### POST `/api/shared-tasks`
Creates a new shared task

**Request Body:**
```json
{
  "share_id": 1,
  "parent_id": 1,
  "babysitter_id": 2,
  "baby_id": 1,
  "task_title": "Feed baby",
  "task_description": "Give bottle at 2pm",
  "due_date": "2024-01-01"
}
```

#### PUT `/api/shared-tasks/:taskId`
Updates an existing task

#### PATCH `/api/shared-tasks/:taskId/complete`
Marks task as completed

**Request Body:**
```json
{
  "babysitter_notes": "Task completed successfully"
}
```

#### PATCH `/api/shared-tasks/:taskId/incomplete`
Marks task as incomplete

#### DELETE `/api/shared-tasks/:taskId`
Deletes a task

---

### 💬 Messaging

#### GET `/api/messaging/conversations/:account_id`
Retrieves all conversations with last message and unread count

**Response:**
```json
[
  {
    "conversation_id": 1,
    "other_user_id": 2,
    "other_user_name": "Jane Smith",
    "last_message": "Hello!",
    "last_message_time": "2024-01-01T10:00:00",
    "unread_count": 3
  }
]
```

#### GET `/api/messaging/messages/:conversation_id?account_id=1`
Retrieves all messages in conversation and marks as read

#### POST `/api/messaging/send`
Sends a new message

**Request Body:**
```json
{
  "sender_id": 1,
  "recipient_id": 2,
  "content": "Hello! How is everything?"
}
```

#### GET `/api/messaging/recipients/:account_id`
Retrieves potential message recipients (verified babysitters/parents)

#### PUT `/api/messaging/read/:conversation_id`
Marks all messages as read

**Request Body:**
```json
{
  "account_id": 1
}
```

#### GET `/api/messaging/unread-count/:account_id`
Retrieves total unread message count

**Response:**
```json
{
  "count": 5
}
```

---

## 🔐 Security

### Authentication
- **Firebase Authentication** - User identity verification
- **JWT Tokens** - Session management
- **Firebase Admin SDK** - Server-side token verification

### Data Protection
- **Input Validation** - All POST/PUT requests validated with middleware
- **CORS Configuration** - Restricts API access to authorized origins
- **SQL Injection Prevention** - Parameterized queries throughout
- **File Upload Security** - Size limits (5MB) and file type validation
- **Password Security** - Handled by Firebase Auth (bcrypt hashing)

### Access Control
- **Role-based Access** - Parent vs Babysitter permissions
- **Verification System** - 4-digit codes with 7-day expiry
- **Share Relationships** - Babysitters can only access authorized children

---

## 🧠 Developer Notes

### Environment Variables
Create a `.env` file with the following:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/parentpal
FIREBASE_PROJECT_ID=your-project-id
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Running the Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Database Migrations
```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### API Testing
All endpoints can be tested using:
- **Postman** - Import collection from `/docs/postman_collection.json`
- **cURL** - Example commands in `/docs/api-examples.sh`
- **Thunder Client** - VS Code extension for API testing

---

<div align="center">

**© 2025 ParentPal Backend**

Built with Node.js, Express, and PostgreSQL

</div>
