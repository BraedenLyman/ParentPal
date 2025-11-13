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

# ParentPal Backend API Documentation

This document provides comprehensive documentation for the ParentPal backend API endpoints, including request parameters, example API calls, and expected responses.

## Table of Contents

- [Create Account](#create-account)
- [Sign In](#sign-in)
- [Delete User](#delete-user)
- [Baby Management](#baby-management)
  - [Get Babies by Account ID](#get-babies-by-account-id)
  - [Get Baby by Firebase UID](#get-baby-by-firebase-uid)
  - [Add Baby](#add-baby)
  - [Delete Baby](#delete-baby)
- [Shared Tasks](#shared-tasks)
  - [Get Tasks by Share ID](#get-tasks-by-share-id)
  - [Get Tasks by Parent ID](#get-tasks-by-parent-id)
  - [Get Tasks by Babysitter ID](#get-tasks-by-babysitter-id)
  - [Create Task](#create-task)
  - [Update Task](#update-task)
  - [Mark Task as Complete](#mark-task-as-complete)
  - [Mark Task as Incomplete](#mark-task-as-incomplete)
  - [Delete Task](#delete-task)
- [Health Monitoring](#health-monitoring)
  - [Growth](#growth)
  - [Sleep](#sleep)
  - [Medications](#medications)
  - [Allergies](#allergies)
  - [Vaccinations](#vaccinations)
  - [Sick Days](#sick-days)
  - [Feeding](#feeding)
  - [Observations](#observations)
- [Messaging](#messaging)
  - [Get User Conversations](#get-user-conversations)
  - [Get Conversation Messages](#get-conversation-messages)
  - [Send Message](#send-message)
  - [Get Available Recipients](#get-available-recipients)
  - [Mark Messages as Read](#mark-messages-as-read)
  - [Get Unread Messages Count](#get-unread-messages-count)
- [Photo Gallery](#photo-gallery)
  - [Get Photos by Baby ID](#get-photos-by-baby-id)
  - [Get Photos by Parent ID](#get-photos-by-parent-id)
  - [Get Photos by Babysitter ID](#get-photos-by-babysitter-id)
  - [Upload Photo](#upload-photo)
  - [Delete Photo](#delete-photo)

## Create Account

### Endpoint: `/accounts`

**Method:** POST

**Description:** 
Creates a new user account in the system, with optional baby registration. The API registers a parent account and, if baby information is provided, also creates a baby record linked to the parent.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firebaseUid | string | Yes | The Firebase UID of the user |
| fName | string | Yes | First name of the parent |
| lName | string | Yes | Last name of the parent |
| email | string | Yes | Email address of the parent |
| accountType | string | Yes | Type of account (parent, provider, etc.) |
| dob | string | No | Date of birth of the parent in YYYY-MM-DD format |
| gender | string | No | Gender of the parent (limited to 7 characters) |
| baby | object | No | Baby information if registering a child |
| baby.bFName | string | No* | First name of the baby (*Required if baby object is present) |
| baby.bLName | string | No* | Last name of the baby (*Required if baby object is present) |
| baby.bDob | string | No | Date of birth of the baby in YYYY-MM-DD format |
| baby.bGender | string | No | Gender of the baby (limited to 7 characters) |

### Example API Call

```javascript
const createAccount = async () => {
  try {
    const response = await fetch('https://yourapi.com/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUid: 'firebase123uid456',
        fName: 'John',
        lName: 'Doe',
        email: 'john.doe@example.com',
        accountType: 'parent',
        dob: '1985-05-15',
        gender: 'male',
        baby: {
          bFName: 'Jane',
          bLName: 'Doe',
          bDob: '2023-01-10',
          bGender: 'female'
        }
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating account:', error);
  }
};
```

### Successful Response

```json
{
  "accountId": 12345
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "Missing required fields"
}

// Database error
{
  "error": "Failed to create account in DB"
}
```

## Sign In

### Endpoint: `/sign-in`

**Method:** POST

**Description:** 
Authenticates a user using Firebase ID token, retrieves the user's account information from the database, and returns user details along with associated baby data if the account type is 'parent'.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| idToken | string | Yes | Firebase ID token obtained after user authentication |

### Example API Call

```javascript
const signIn = async () => {
  try {
    const response = await fetch('https://yourapi.com/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: 'firebase-id-token-here'
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
  }
};
```

### Successful Response

```json
{
  "user": {
    "account_id": 12345,
    "firebase_uid": "firebase123uid456",
    "first_name": "John",
    "last_name": "Doe",
    "email_address": "john.doe@example.com",
    "account_type": "parent",
    "birth_date": "1985-05-15",
    "gender": "male"
  },
  "babyData": [
    {
      "baby_id": 54321,
      "first_name": "Jane",
      "last_name": "Doe",
      "birth_date": "2023-01-10",
      "gender": "female"
    }
  ]
}
```

### Error Responses

```json
// Missing ID token
{
  "error": "Missing ID token"
}

// Invalid Firebase token
{
  "error": "Invalid Firebase token"
}

// User not found in database
{
  "error": "User exists in Firebase but not in database"
}

// Server error
{
  "error": "Failed to sign in",
  "details": "Error message details"
}
```

## Delete User

### Endpoint: `/user`

**Method:** DELETE

**Description:** 
Completely removes a user account and all associated data from the database, including any linked babies and their records (growth, sleep, feeding, observations, medications, allergies, and vaccinations). The operation is handled as a transaction to ensure data integrity.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firebase_uid | string | Yes | The Firebase UID of the user to delete |

### Example API Call

```javascript
const deleteUser = async (firebaseUid) => {
  try {
    const response = await fetch(`https://yourapi.com/user?firebase_uid=${firebaseUid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
```

### Successful Response

```json
{
  "message": "User account and all associated data deleted successfully"
}
```

### Error Responses

```json
// Missing firebase_uid parameter
{
  "error": "Missing firebase_uid parameter"
}

// User not found
{
  "error": "User not found"
}

// Database error
{
  "error": "Failed to delete user account",
  "details": "Error message details"
}
```

## Baby Management

### Get Babies by Account ID

#### Endpoint: `/babies/:accountId`

**Method:** GET

**Description:** 
Retrieves all babies associated with a specific parent account ID.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| accountId | string | Yes | The account ID of the parent |

### Example API Call

```javascript
const getBabiesByAccountId = async (accountId) => {
  try {
    const response = await fetch(`https://yourapi.com/babies/${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching babies:', error);
  }
};
```

### Successful Response

```json
[
  {
    "baby_id": 54321,
    "parent_id": 12345,
    "first_name": "Jane",
    "last_name": "Doe",
    "birth_date": "2023-01-10",
    "gender": "female",
    "category": "infant"
  },
  {
    "baby_id": 54322,
    "parent_id": 12345,
    "first_name": "John",
    "last_name": "Doe",
    "birth_date": "2021-05-20",
    "gender": "male",
    "category": "toddler"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch babies"
}
```

### Get Baby by Firebase UID

#### Endpoint: `/babies`

**Method:** GET

**Description:** 
Retrieves the first baby associated with a parent's Firebase UID. This endpoint is typically used when a parent has only one baby registered.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firebase_uid | string | Yes | The Firebase UID of the parent |

### Example API Call

```javascript
const getBabyByFirebaseUid = async (firebaseUid) => {
  try {
    const response = await fetch(`https://yourapi.com/babies?firebase_uid=${firebaseUid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching baby:', error);
  }
};
```

### Successful Response

```json
{
  "baby_id": 54321,
  "parent_id": 12345,
  "first_name": "Jane",
  "last_name": "Doe",
  "birth_date": "2023-01-10",
  "gender": "female",
  "category": "infant"
}
```

### Error Responses

```json
// Missing firebase_uid
{
  "error": "firebase_uid is required"
}

// Parent not found
{
  "error": "Parent not found"
}

// No baby found
{
  "error": "No baby found for this parent"
}

// Database error
{
  "error": "Failed to fetch baby"
}
```

### Add Baby

#### Endpoint: `/babies`

**Method:** POST

**Description:** 
Creates a new baby record associated with a parent account.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| parent_id | number | Yes | The account ID of the parent |
| first_name | string | Yes | First name of the baby |
| last_name | string | Yes | Last name of the baby |
| birth_date | string | Yes | Date of birth of the baby in YYYY-MM-DD format |
| gender | string | Yes | Gender of the baby |
| category | string | Yes | Category of the baby (e.g., infant, toddler) |

### Example API Call

```javascript
const addBaby = async () => {
  try {
    const response = await fetch('https://yourapi.com/babies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent_id: 12345,
        first_name: 'Emma',
        last_name: 'Doe',
        birth_date: '2023-05-15',
        gender: 'female',
        category: 'infant'
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding baby:', error);
  }
};
```

### Successful Response

```json
{
  "baby_id": 54323,
  "parent_id": 12345,
  "first_name": "Emma",
  "last_name": "Doe",
  "birth_date": "2023-05-15",
  "gender": "female",
  "category": "infant"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "All fields are required: parent_id, first_name, last_name, birth_date, gender, category"
}

// Database error
{
  "error": "Failed to add baby"
}
```

### Delete Baby

#### Endpoint: `/babies/:baby_id`

**Method:** DELETE

**Description:** 
Deletes a baby record and all associated data (growth, sleep, feeding, observations, medications, allergies, vaccinations, and sick days) from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby to delete |

### Example API Call

```javascript
const deleteBaby = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/babies/${babyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting baby:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Baby and all associated records deleted successfully",
  "deleted_baby_id": 54323
}
```

### Error Responses

```json
// Missing baby_id
{
  "error": "Baby ID is required"
}

// Baby not found
{
  "error": "Baby not found"
}

// Database error
{
  "error": "Failed to delete baby",
  "details": "Error message details"
}
```

## Shared Tasks

### Get Tasks by Share ID

#### Endpoint: `/shared-tasks/share/:shareId`

**Method:** GET

**Description:** 
Retrieves all tasks associated with a specific share ID. This endpoint returns tasks with parent and babysitter information.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| shareId | string | Yes | The unique identifier for the share between parent and babysitter |

### Example API Call

```javascript
const getTasksByShareId = async (shareId) => {
  try {
    const response = await fetch(`https://yourapi.com/shared-tasks/share/${shareId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shared tasks:', error);
  }
};
```

### Successful Response

```json
[
  {
    "task_id": 1001,
    "share_id": "share123",
    "parent_id": 12345,
    "babysitter_id": 67890,
    "baby_id": 54321,
    "task_title": "Give medication",
    "task_description": "Give 5ml of children's Tylenol if fever over 100.4F",
    "due_date": "2024-05-15T15:30:00Z",
    "is_completed": false,
    "completed_at": null,
    "babysitter_notes": null,
    "created_at": "2024-05-14T10:00:00Z",
    "updated_at": "2024-05-14T10:00:00Z",
    "parent_first_name": "John",
    "parent_last_name": "Doe",
    "babysitter_first_name": "Sarah",
    "babysitter_last_name": "Smith"
  },
  {
    "task_id": 1002,
    "share_id": "share123",
    "parent_id": 12345,
    "babysitter_id": 67890,
    "baby_id": 54321,
    "task_title": "Afternoon nap",
    "task_description": "Make sure baby naps for at least 1 hour",
    "due_date": "2024-05-15T13:00:00Z",
    "is_completed": true,
    "completed_at": "2024-05-15T14:15:00Z",
    "babysitter_notes": "Baby slept for 1.5 hours",
    "created_at": "2024-05-14T10:00:00Z",
    "updated_at": "2024-05-15T14:15:00Z",
    "parent_first_name": "John",
    "parent_last_name": "Doe",
    "babysitter_first_name": "Sarah",
    "babysitter_last_name": "Smith"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch tasks"
}
```

### Get Tasks by Parent ID

#### Endpoint: `/shared-tasks/parent/:parentId`

**Method:** GET

**Description:** 
Retrieves all shared tasks created by a specific parent. This endpoint returns tasks with babysitter and baby information.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| parentId | number | Yes | The account ID of the parent |

### Example API Call

```javascript
const getTasksByParentId = async (parentId) => {
  try {
    const response = await fetch(`https://yourapi.com/shared-tasks/parent/${parentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching parent tasks:', error);
  }
};
```

### Successful Response

```json
{
  "tasks": [
    {
      "task_id": 1001,
      "share_id": "share123",
      "parent_id": 12345,
      "babysitter_id": 67890,
      "baby_id": 54321,
      "task_title": "Give medication",
      "task_description": "Give 5ml of children's Tylenol if fever over 100.4F",
      "due_date": "2024-05-15T15:30:00Z",
      "is_completed": false,
      "completed_at": null,
      "babysitter_notes": null,
      "created_at": "2024-05-14T10:00:00Z",
      "updated_at": "2024-05-14T10:00:00Z",
      "babysitter_name": "Sarah Smith",
      "babysitter_email": "sarah.smith@example.com",
      "babysitter_first_name": "Sarah",
      "babysitter_last_name": "Smith",
      "baby_first_name": "Jane"
    },
    {
      "task_id": 1002,
      "share_id": "share123",
      "parent_id": 12345,
      "babysitter_id": 67890,
      "baby_id": 54321,
      "task_title": "Afternoon nap",
      "task_description": "Make sure baby naps for at least 1 hour",
      "due_date": "2024-05-15T13:00:00Z",
      "is_completed": true,
      "completed_at": "2024-05-15T14:15:00Z",
      "babysitter_notes": "Baby slept for 1.5 hours",
      "created_at": "2024-05-14T10:00:00Z",
      "updated_at": "2024-05-15T14:15:00Z",
      "babysitter_name": "Sarah Smith",
      "babysitter_email": "sarah.smith@example.com",
      "babysitter_first_name": "Sarah",
      "babysitter_last_name": "Smith",
      "baby_first_name": "Jane"
    }
  ]
}
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch tasks"
}
```

### Get Tasks by Babysitter ID

#### Endpoint: `/shared-tasks/babysitter/:babysitterId`

**Method:** GET

**Description:** 
Retrieves all shared tasks assigned to a specific babysitter. This endpoint returns tasks with parent and baby information.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| babysitterId | number | Yes | The ID of the babysitter |

### Example API Call

```javascript
const getTasksByBabysitterId = async (babysitterId) => {
  try {
    const response = await fetch(`https://yourapi.com/shared-tasks/babysitter/${babysitterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching babysitter tasks:', error);
  }
};
```

### Successful Response

```json
{
  "tasks": [
    {
      "task_id": 1001,
      "share_id": "share123",
      "parent_id": 12345,
      "babysitter_id": 67890,
      "baby_id": 54321,
      "task_title": "Give medication",
      "task_description": "Give 5ml of children's Tylenol if fever over 100.4F",
      "due_date": "2024-05-15T15:30:00Z",
      "is_completed": false,
      "completed_at": null,
      "babysitter_notes": null,
      "created_at": "2024-05-14T10:00:00Z",
      "updated_at": "2024-05-14T10:00:00Z",
      "parent_first_name": "John",
      "parent_last_name": "Doe",
      "babysitter_name": "Sarah Smith",
      "baby_first_name": "Jane"
    },
    {
      "task_id": 1002,
      "share_id": "share123",
      "parent_id": 12345,
      "babysitter_id": 67890,
      "baby_id": 54321,
      "task_title": "Afternoon nap",
      "task_description": "Make sure baby naps for at least 1 hour",
      "due_date": "2024-05-15T13:00:00Z",
      "is_completed": true,
      "completed_at": "2024-05-15T14:15:00Z",
      "babysitter_notes": "Baby slept for 1.5 hours",
      "created_at": "2024-05-14T10:00:00Z",
      "updated_at": "2024-05-15T14:15:00Z",
      "parent_first_name": "John",
      "parent_last_name": "Doe",
      "babysitter_name": "Sarah Smith",
      "baby_first_name": "Jane"
    }
  ]
}
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch tasks"
}
```

### Create Task

#### Endpoint: `/shared-tasks`

**Method:** POST

**Description:** 
Creates a new shared task for a babysitter, linked to a parent, share ID, and optionally to a specific baby.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| share_id | string | Yes | The unique identifier for the share between parent and babysitter |
| parent_id | number | Yes | The account ID of the parent |
| babysitter_id | number | No | The ID of the babysitter |
| baby_id | number | No | The ID of the baby the task is associated with |
| task_title | string | Yes | Title of the task |
| task_description | string | No | Detailed description of the task |
| due_date | string | No | Due date/time of the task in ISO format |

### Example API Call

```javascript
const createTask = async () => {
  try {
    const response = await fetch('https://yourapi.com/shared-tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        share_id: 'share123',
        parent_id: 12345,
        babysitter_id: 67890,
        baby_id: 54321,
        task_title: 'Feed baby lunch',
        task_description: 'Pureed vegetables in the fridge, 4oz serving',
        due_date: '2024-05-15T12:00:00Z'
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
  }
};
```

### Successful Response

```json
{
  "task_id": 1003,
  "share_id": "share123",
  "parent_id": 12345,
  "babysitter_id": 67890,
  "baby_id": 54321,
  "task_title": "Feed baby lunch",
  "task_description": "Pureed vegetables in the fridge, 4oz serving",
  "due_date": "2024-05-15T12:00:00Z",
  "is_completed": false,
  "completed_at": null,
  "babysitter_notes": null,
  "created_at": "2024-05-14T11:30:00Z",
  "updated_at": "2024-05-14T11:30:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "Missing required fields: share_id, parent_id"
}

// Database error
{
  "error": "Failed to create task"
}
```

### Update Task

#### Endpoint: `/shared-tasks/:taskId`

**Method:** PUT

**Description:** 
Updates an existing shared task with new information.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| taskId | number | Yes | The ID of the task to update |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| share_id | string | Yes | The unique identifier for the share between parent and babysitter |
| babysitter_id | number | No | The ID of the babysitter |
| baby_id | number | No | The ID of the baby the task is associated with |
| task_title | string | Yes | Title of the task |
| task_description | string | No | Detailed description of the task |
| due_date | string | No | Due date/time of the task in ISO format |

### Example API Call

```javascript
const updateTask = async (taskId) => {
  try {
    const response = await fetch(`https://yourapi.com/shared-tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        share_id: 'share123',
        babysitter_id: 67890,
        baby_id: 54321,
        task_title: 'Feed baby lunch (updated)',
        task_description: 'Pureed vegetables in the fridge, 6oz serving',
        due_date: '2024-05-15T12:30:00Z'
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
  }
};
```

### Successful Response

```json
{
  "task_id": 1003,
  "share_id": "share123",
  "parent_id": 12345,
  "babysitter_id": 67890,
  "baby_id": 54321,
  "task_title": "Feed baby lunch (updated)",
  "task_description": "Pureed vegetables in the fridge, 6oz serving",
  "due_date": "2024-05-15T12:30:00Z",
  "is_completed": false,
  "completed_at": null,
  "babysitter_notes": null,
  "created_at": "2024-05-14T11:30:00Z",
  "updated_at": "2024-05-14T11:45:00Z"
}
```

### Error Responses

```json
// Task not found
{
  "error": "Task not found"
}

// Database error
{
  "error": "Failed to update task"
}
```

### Mark Task as Complete

#### Endpoint: `/shared-tasks/:taskId/complete`

**Method:** PATCH

**Description:** 
Marks a shared task as completed and optionally adds notes from the babysitter.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| taskId | number | Yes | The ID of the task to mark as complete |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| babysitter_notes | string | No | Notes from the babysitter about task completion |

### Example API Call

```javascript
const markTaskAsComplete = async (taskId) => {
  try {
    const response = await fetch(`https://yourapi.com/shared-tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        babysitter_notes: 'Baby ate all the food and seemed to enjoy it'
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking task as complete:', error);
  }
};
```

### Successful Response

```json
{
  "task_id": 1003,
  "share_id": "share123",
  "parent_id": 12345,
  "babysitter_id": 67890,
  "baby_id": 54321,
  "task_title": "Feed baby lunch (updated)",
  "task_description": "Pureed vegetables in the fridge, 6oz serving",
  "due_date": "2024-05-15T12:30:00Z",
  "is_completed": true,
  "completed_at": "2024-05-15T12:35:00Z",
  "babysitter_notes": "Baby ate all the food and seemed to enjoy it",
  "created_at": "2024-05-14T11:30:00Z",
  "updated_at": "2024-05-15T12:35:00Z"
}
```

### Error Responses

```json
// Task not found
{
  "error": "Task not found"
}

// Database error
{
  "error": "Failed to complete task"
}
```

### Mark Task as Incomplete

#### Endpoint: `/shared-tasks/:taskId/incomplete`

**Method:** PATCH

**Description:** 
Marks a previously completed shared task as incomplete and clears the completion timestamp.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| taskId | number | Yes | The ID of the task to mark as incomplete |

### Example API Call

```javascript
const markTaskAsIncomplete = async (taskId) => {
  try {
    const response = await fetch(`https://yourapi.com/shared-tasks/${taskId}/incomplete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking task as incomplete:', error);
  }
};
```

### Successful Response

```json
{
  "task_id": 1003,
  "share_id": "share123",
  "parent_id": 12345,
  "babysitter_id": 67890,
  "baby_id": 54321,
  "task_title": "Feed baby lunch (updated)",
  "task_description": "Pureed vegetables in the fridge, 6oz serving",
  "due_date": "2024-05-15T12:30:00Z",
  "is_completed": false,
  "completed_at": null,
  "babysitter_notes": "Baby ate all the food and seemed to enjoy it",
  "created_at": "2024-05-14T11:30:00Z",
  "updated_at": "2024-05-15T12:40:00Z"
}
```

### Error Responses

```json
// Task not found
{
  "error": "Task not found"
}

// Database error
{
  "error": "Failed to update task"
}
```

### Delete Task

#### Endpoint: `/shared-tasks/:taskId`

**Method:** DELETE

**Description:** 
Deletes a shared task from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| taskId | number | Yes | The ID of the task to delete |

### Example API Call

```javascript
const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`https://yourapi.com/shared-tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Task deleted successfully"
}
```

### Error Responses

```json
// Task not found
{
  "error": "Task not found"
}

// Database error
{
  "error": "Failed to delete task"
}
```

# Health Monitoring

## Growth

### Get Growth Records

#### Endpoint: `/growth`

**Method:** GET

**Description:** 
Retrieves all growth records or filters by baby ID.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | No | The ID of the baby to filter records by |

### Example API Call

```javascript
const getGrowthRecords = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/growth?baby_id=${babyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching growth records:', error);
  }
};
```

### Successful Response

```json
[
  {
    "growth_id": 1001,
    "baby_id": 54321,
    "weight": 8.5,
    "height": 68.2,
    "date": "2024-04-15",
    "created_at": "2024-04-15T10:30:00Z"
  },
  {
    "growth_id": 1002,
    "baby_id": 54321,
    "weight": 9.1,
    "height": 69.5,
    "date": "2024-05-15",
    "created_at": "2024-05-15T09:45:00Z"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch growth records"
}
```

### Add Growth Record

#### Endpoint: `/growth`

**Method:** POST

**Description:** 
Creates a new growth record for a baby.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| weight | number | No | Weight of the baby (in kilograms or pounds) |
| height | number | No | Height of the baby (in centimeters or inches) |
| date | string | Yes | Date of the growth measurement in YYYY-MM-DD format |

### Example API Call

```javascript
const addGrowthRecord = async () => {
  try {
    const response = await fetch('https://yourapi.com/growth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        weight: 9.8,
        height: 71.3,
        date: '2024-06-15'
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding growth record:', error);
  }
};
```

### Successful Response

```json
{
  "growth_id": 1003,
  "baby_id": 54321,
  "weight": 9.8,
  "height": 71.3,
  "date": "2024-06-15",
  "created_at": "2024-06-15T14:20:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id and date are required"
}

// Database error
{
  "error": "Failed to add growth record"
}
```

### Update Growth Record

#### Endpoint: `/growth/:growth_id`

**Method:** PUT

**Description:** 
Updates an existing growth record.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| growth_id | number | Yes | The ID of the growth record to update |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| weight | number | No | Weight of the baby (in kilograms or pounds) |
| height | number | No | Height of the baby (in centimeters or inches) |
| date | string | Yes | Date of the growth measurement in YYYY-MM-DD format |

### Example API Call

```javascript
const updateGrowthRecord = async (growthId) => {
  try {
    const response = await fetch(`https://yourapi.com/growth/${growthId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        weight: 10.0,
        height: 71.5,
        date: '2024-06-15'
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating growth record:', error);
  }
};
```

### Successful Response

```json
{
  "growth_id": 1003,
  "baby_id": 54321,
  "weight": 10.0,
  "height": 71.5,
  "date": "2024-06-15",
  "created_at": "2024-06-15T14:20:00Z",
  "updated_at": "2024-06-15T15:30:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id and date are required"
}

// Growth record not found
{
  "error": "Growth record not found"
}

// Database error
{
  "error": "Failed to update growth record"
}
```

### Delete Growth Record

#### Endpoint: `/growth/:growth_id`

**Method:** DELETE

**Description:** 
Deletes a growth record from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| growth_id | number | Yes | The ID of the growth record to delete |

### Example API Call

```javascript
const deleteGrowthRecord = async (growthId) => {
  try {
    const response = await fetch(`https://yourapi.com/growth/${growthId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting growth record:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Growth record deleted successfully",
  "growth_id": 1003
}
```

### Error Responses

```json
// Growth record not found
{
  "error": "Growth record not found"
}

// Database error
{
  "error": "Failed to delete growth record"
}
```

## Sleep

### Get Sleep Records

#### Endpoint: `/sleep`

**Method:** GET

**Description:** 
Retrieves all sleep records or filters by baby ID.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | No | The ID of the baby to filter records by |

### Example API Call

```javascript
const getSleepRecords = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/sleep?baby_id=${babyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sleep records:', error);
  }
};
```

### Successful Response

```json
[
  {
    "sleep_id": 2001,
    "baby_id": 54321,
    "sleep_duration": 120,
    "time_fell_asleep": "19:30:00",
    "date": "2024-05-15",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-15T19:35:00Z"
  },
  {
    "sleep_id": 2002,
    "baby_id": 54321,
    "sleep_duration": 540,
    "time_fell_asleep": "22:00:00",
    "date": "2024-05-15",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-16T06:30:00Z"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch sleep records"
}
```

### Add Sleep Record

#### Endpoint: `/sleep`

**Method:** POST

**Description:** 
Creates a new sleep record for a baby.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| sleep_duration | number | No | Duration of sleep in minutes |
| time_fell_asleep | string | Yes | Time when the baby fell asleep (HH:MM:SS format) |
| date | string | Yes | Date of the sleep record in YYYY-MM-DD format |
| created_by_account_id | number | No | ID of the account that created the record |
| created_by_first_name | string | No | First name of the person who created the record |
| created_by_last_name | string | No | Last name of the person who created the record |

### Example API Call

```javascript
const addSleepRecord = async () => {
  try {
    const response = await fetch('https://yourapi.com/sleep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        sleep_duration: 120,
        time_fell_asleep: "13:30:00",
        date: "2024-06-15",
        created_by_account_id: 12345,
        created_by_first_name: "John",
        created_by_last_name: "Doe"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding sleep record:', error);
  }
};
```

### Successful Response

```json
{
  "sleep_id": 2003,
  "baby_id": 54321,
  "sleep_duration": 120,
  "time_fell_asleep": "13:30:00",
  "date": "2024-06-15",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T13:35:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id, time_fell_asleep, and date are required"
}

// Database error
{
  "error": "Failed to add sleep record"
}
```

### Update Sleep Record

#### Endpoint: `/sleep/:sleep_id`

**Method:** PUT

**Description:** 
Updates an existing sleep record.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sleep_id | number | Yes | The ID of the sleep record to update |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| sleep_duration | number | No | Duration of sleep in minutes |
| time_fell_asleep | string | Yes | Time when the baby fell asleep (HH:MM:SS format) |
| date | string | Yes | Date of the sleep record in YYYY-MM-DD format |

### Example API Call

```javascript
const updateSleepRecord = async (sleepId) => {
  try {
    const response = await fetch(`https://yourapi.com/sleep/${sleepId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        sleep_duration: 150,
        time_fell_asleep: "13:30:00",
        date: "2024-06-15"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating sleep record:', error);
  }
};
```

### Successful Response

```json
{
  "sleep_id": 2003,
  "baby_id": 54321,
  "sleep_duration": 150,
  "time_fell_asleep": "13:30:00",
  "date": "2024-06-15",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T13:35:00Z",
  "updated_at": "2024-06-15T15:45:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id, time_fell_asleep, and date are required"
}

// Sleep record not found
{
  "error": "Sleep record not found"
}

// Database error
{
  "error": "Failed to update sleep record"
}
```

### Delete Sleep Record

#### Endpoint: `/sleep/:sleep_id`

**Method:** DELETE

**Description:** 
Deletes a sleep record from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sleep_id | number | Yes | The ID of the sleep record to delete |

### Example API Call

```javascript
const deleteSleepRecord = async (sleepId) => {
  try {
    const response = await fetch(`https://yourapi.com/sleep/${sleepId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting sleep record:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Sleep record deleted successfully",
  "sleep_id": 2003
}
```

### Error Responses

```json
// Sleep record not found
{
  "error": "Sleep record not found"
}

// Database error
{
  "error": "Failed to delete sleep record"
}
```

## Medications

### Get Medication Records

#### Endpoint: `/meds`

**Method:** GET

**Description:** 
Retrieves all medication records or filters by baby ID.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | No | The ID of the baby to filter records by |

### Example API Call

```javascript
const getMedicationRecords = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/meds?baby_id=${babyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching medication records:', error);
  }
};
```

### Successful Response

```json
[
  {
    "med_id": 3001,
    "baby_id": 54321,
    "medication_name": "Children's Tylenol",
    "time_taken": "14:30:00",
    "date": "2024-05-15",
    "dosage": "5ml",
    "symptoms": "Fever",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-15T14:35:00Z"
  },
  {
    "med_id": 3002,
    "baby_id": 54321,
    "medication_name": "Children's Tylenol",
    "time_taken": "20:30:00",
    "date": "2024-05-15",
    "dosage": "5ml",
    "symptoms": "Fever",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-15T20:35:00Z"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch meds records"
}
```

### Add Medication Record

#### Endpoint: `/meds`

**Method:** POST

**Description:** 
Creates a new medication record for a baby.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| medication_name | string | Yes | Name of the medication given |
| time_taken | string | Yes | Time when the medication was taken (HH:MM:SS format) |
| date | string | Yes | Date of the medication record in YYYY-MM-DD format |
| dosage | string | Yes | Dosage of the medication (e.g., "5ml") |
| symptoms | string | Yes | Symptoms for which medication was given |
| created_by_account_id | number | No | ID of the account that created the record |
| created_by_first_name | string | No | First name of the person who created the record |
| created_by_last_name | string | No | Last name of the person who created the record |

### Example API Call

```javascript
const addMedicationRecord = async () => {
  try {
    const response = await fetch('https://yourapi.com/meds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        medication_name: "Children's Tylenol",
        time_taken: "14:30:00",
        date: "2024-06-15",
        dosage: "5ml",
        symptoms: "Fever",
        created_by_account_id: 12345,
        created_by_first_name: "John",
        created_by_last_name: "Doe"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding medication record:', error);
  }
};
```

### Successful Response

```json
{
  "med_id": 3003,
  "baby_id": 54321,
  "medication_name": "Children's Tylenol",
  "time_taken": "14:30:00",
  "date": "2024-06-15",
  "dosage": "5ml",
  "symptoms": "Fever",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T14:35:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id, medication_name, time_taken, date, dosage and symptoms are required"
}

// Database error
{
  "error": "Failed to add meds record"
}
```

### Update Medication Record

#### Endpoint: `/meds/:med_id`

**Method:** PUT

**Description:** 
Updates an existing medication record.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| med_id | number | Yes | The ID of the medication record to update |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| medication_name | string | Yes | Name of the medication given |
| time_taken | string | Yes | Time when the medication was taken (HH:MM:SS format) |
| date | string | Yes | Date of the medication record in YYYY-MM-DD format |
| dosage | string | Yes | Dosage of the medication (e.g., "5ml") |
| symptoms | string | Yes | Symptoms for which medication was given |

### Example API Call

```javascript
const updateMedicationRecord = async (medId) => {
  try {
    const response = await fetch(`https://yourapi.com/meds/${medId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        medication_name: "Children's Tylenol",
        time_taken: "14:30:00",
        date: "2024-06-15",
        dosage: "7.5ml",
        symptoms: "High fever"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating medication record:', error);
  }
};
```

### Successful Response

```json
{
  "med_id": 3003,
  "baby_id": 54321,
  "medication_name": "Children's Tylenol",
  "time_taken": "14:30:00",
  "date": "2024-06-15",
  "dosage": "7.5ml",
  "symptoms": "High fever",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T14:35:00Z",
  "updated_at": "2024-06-15T15:50:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id, medication_name, time_taken, date, dosage and symptoms are required"
}

// Medication record not found
{
  "error": "Medication record not found"
}

// Database error
{
  "error": "Failed to update meds record"
}
```

### Delete Medication Record

#### Endpoint: `/meds/:med_id`

**Method:** DELETE

**Description:** 
Deletes a medication record from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| med_id | number | Yes | The ID of the medication record to delete |

### Example API Call

```javascript
const deleteMedicationRecord = async (medId) => {
  try {
    const response = await fetch(`https://yourapi.com/meds/${medId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting medication record:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Medication record deleted successfully",
  "med_id": 3003
}
```

### Error Responses

```json
// Medication record not found
{
  "error": "Medication record not found"
}

// Database error
{
  "error": "Failed to delete meds record"
}
```

## Allergies

### Get Allergy Records

#### Endpoint: `/allergies`

**Method:** GET

**Description:** 
Retrieves all allergy records or filters by baby ID.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | No | The ID of the baby to filter records by |

### Example API Call

```javascript
const getAllergyRecords = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/allergies?baby_id=${babyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching allergy records:', error);
  }
};
```

### Successful Response

```json
[
  {
    "allergy_id": 4001,
    "baby_id": 54321,
    "allergy_name": "Peanuts",
    "severity": "High",
    "epi_pen": true,
    "notes": "Avoid all peanut products",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-01T10:35:00Z"
  },
  {
    "allergy_id": 4002,
    "baby_id": 54321,
    "allergy_name": "Eggs",
    "severity": "Medium",
    "epi_pen": false,
    "notes": "Causes rash",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-01T10:40:00Z"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch allergies records"
}
```

### Add Allergy Record

#### Endpoint: `/allergies`

**Method:** POST

**Description:** 
Creates a new allergy record for a baby.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| allergy_name | string | Yes | Name of the allergen |
| severity | string | Yes | Severity of the allergic reaction (e.g., "Low", "Medium", "High") |
| epi_pen | boolean | Yes | Whether an EpiPen is required (true/false) |
| notes | string | No | Additional notes about the allergy |
| created_by_account_id | number | No | ID of the account that created the record |
| created_by_first_name | string | No | First name of the person who created the record |
| created_by_last_name | string | No | Last name of the person who created the record |

### Example API Call

```javascript
const addAllergyRecord = async () => {
  try {
    const response = await fetch('https://yourapi.com/allergies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        allergy_name: "Dairy",
        severity: "Medium",
        epi_pen: false,
        notes: "Causes digestive issues",
        created_by_account_id: 12345,
        created_by_first_name: "John",
        created_by_last_name: "Doe"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding allergy record:', error);
  }
};
```

### Successful Response

```json
{
  "allergy_id": 4003,
  "baby_id": 54321,
  "allergy_name": "Dairy",
  "severity": "Medium",
  "epi_pen": false,
  "notes": "Causes digestive issues",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T14:35:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id, allergy_name, severity, and epi_pen are required"
}

// Database error
{
  "error": "Failed to add allergies record"
}
```

### Update Allergy Record

#### Endpoint: `/allergies/:allergy_id`

**Method:** PUT

**Description:** 
Updates an existing allergy record.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| allergy_id | number | Yes | The ID of the allergy record to update |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| allergy_name | string | Yes | Name of the allergen |
| severity | string | Yes | Severity of the allergic reaction (e.g., "Low", "Medium", "High") |
| epi_pen | boolean | Yes | Whether an EpiPen is required (true/false) |
| notes | string | No | Additional notes about the allergy |

### Example API Call

```javascript
const updateAllergyRecord = async (allergyId) => {
  try {
    const response = await fetch(`https://yourapi.com/allergies/${allergyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        allergy_name: "Dairy",
        severity: "High",
        epi_pen: true,
        notes: "Severe digestive issues and hives"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating allergy record:', error);
  }
};
```

### Successful Response

```json
{
  "allergy_id": 4003,
  "baby_id": 54321,
  "allergy_name": "Dairy",
  "severity": "High",
  "epi_pen": true,
  "notes": "Severe digestive issues and hives",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T14:35:00Z",
  "updated_at": "2024-06-15T16:00:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id, allergy_name, severity, and epi_pen are required"
}

// Allergy record not found
{
  "error": "Allergy record not found"
}

// Database error
{
  "error": "Failed to update allergies record"
}
```

### Delete Allergy Record

#### Endpoint: `/allergies/:allergy_id`

**Method:** DELETE

**Description:** 
Deletes an allergy record from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| allergy_id | number | Yes | The ID of the allergy record to delete |

### Example API Call

```javascript
const deleteAllergyRecord = async (allergyId) => {
  try {
    const response = await fetch(`https://yourapi.com/allergies/${allergyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting allergy record:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Allergy record deleted successfully",
  "allergy_id": 4003
}
```

### Error Responses

```json
// Allergy record not found
{
  "error": "Allergy record not found"
}

// Database error
{
  "error": "Failed to delete allergies record"
}
```

## Vaccinations

### Get Vaccination Records

#### Endpoint: `/vaccinations`

**Method:** GET

**Description:** 
Retrieves all vaccination records or filters by baby ID.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | No | The ID of the baby to filter records by |

### Example API Call

```javascript
const getVaccinationRecords = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/vaccinations?baby_id=${babyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vaccination records:', error);
  }
};
```

### Successful Response

```json
[
  {
    "vaccine_id": 5001,
    "baby_id": 54321,
    "vaccination_name": "DTaP",
    "date_of_vaccine": "2024-01-15",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-01-15T10:35:00Z"
  },
  {
    "vaccine_id": 5002,
    "baby_id": 54321,
    "vaccination_name": "MMR",
    "date_of_vaccine": "2024-03-20",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-03-20T10:40:00Z"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch vaccinations records"
}
```

### Add Vaccination Record

#### Endpoint: `/vaccinations`

**Method:** POST

**Description:** 
Creates a new vaccination record for a baby.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| vaccination_name | string | No | Name of the vaccination |
| date_of_vaccine | string | Yes | Date the vaccination was given in YYYY-MM-DD format |
| created_by_account_id | number | No | ID of the account that created the record |
| created_by_first_name | string | No | First name of the person who created the record |
| created_by_last_name | string | No | Last name of the person who created the record |

### Example API Call

```javascript
const addVaccinationRecord = async () => {
  try {
    const response = await fetch('https://yourapi.com/vaccinations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        vaccination_name: "Hepatitis B",
        date_of_vaccine: "2024-05-15",
        created_by_account_id: 12345,
        created_by_first_name: "John",
        created_by_last_name: "Doe"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding vaccination record:', error);
  }
};
```

### Successful Response

```json
{
  "vaccine_id": 5003,
  "baby_id": 54321,
  "vaccination_name": "Hepatitis B",
  "date_of_vaccine": "2024-05-15",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T14:35:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id and date_of_vaccine are required"
}

// Database error
{
  "error": "Failed to add vaccination record"
}
```

### Update Vaccination Record

#### Endpoint: `/vaccinations/:vaccine_id`

**Method:** PUT

**Description:** 
Updates an existing vaccination record.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vaccine_id | number | Yes | The ID of the vaccination record to update |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| vaccination_name | string | No | Name of the vaccination |
| date_of_vaccine | string | Yes | Date the vaccination was given in YYYY-MM-DD format |

### Example API Call

```javascript
const updateVaccinationRecord = async (vaccineId) => {
  try {
    const response = await fetch(`https://yourapi.com/vaccinations/${vaccineId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        vaccination_name: "Hepatitis B (2nd dose)",
        date_of_vaccine: "2024-05-16"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating vaccination record:', error);
  }
};
```

### Successful Response

```json
{
  "vaccine_id": 5003,
  "baby_id": 54321,
  "vaccination_name": "Hepatitis B (2nd dose)",
  "date_of_vaccine": "2024-05-16",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T14:35:00Z",
  "updated_at": "2024-06-15T16:15:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id and date_of_vaccine are required"
}

// Vaccination record not found
{
  "error": "Vaccination record not found"
}

// Database error
{
  "error": "Failed to update vaccination record"
}
```

### Delete Vaccination Record

#### Endpoint: `/vaccinations/:vaccine_id`

**Method:** DELETE

**Description:** 
Deletes a vaccination record from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vaccine_id | number | Yes | The ID of the vaccination record to delete |

### Example API Call

```javascript
const deleteVaccinationRecord = async (vaccineId) => {
  try {
    const response = await fetch(`https://yourapi.com/vaccinations/${vaccineId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting vaccination record:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Vaccination record deleted successfully",
  "vaccine_id": 5003
}
```

### Error Responses

```json
// Vaccination record not found
{
  "error": "Vaccination record not found"
}

// Database error
{
  "error": "Failed to delete vaccination record"
}
```

## Sick Days

### Get Sick Day Records

#### Endpoint: `/sickday`

**Method:** GET

**Description:** 
Retrieves all sick day records or filters by baby ID.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | No | The ID of the baby to filter records by |

### Example API Call

```javascript
const getSickDayRecords = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/sickday?baby_id=${babyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sick day records:', error);
  }
};
```

### Successful Response

```json
[
  {
    "sick_id": 6001,
    "baby_id": 54321,
    "date": "2024-05-15",
    "meds_taken": "Children's Tylenol",
    "temp": 100.4,
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-15T10:35:00Z"
  },
  {
    "sick_id": 6002,
    "baby_id": 54321,
    "date": "2024-05-16",
    "meds_taken": "Children's Tylenol",
    "temp": 99.8,
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-16T10:40:00Z"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch sick day records"
}
```

### Add Sick Day Record

#### Endpoint: `/sickday`

**Method:** POST

**Description:** 
Creates a new sick day record for a baby.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| date | string | Yes | Date of the sick day in YYYY-MM-DD format |
| meds_taken | string | No | Medications that were administered |
| temp | number | No | Temperature reading (in Fahrenheit or Celsius) |
| created_by_account_id | number | No | ID of the account that created the record |
| created_by_first_name | string | No | First name of the person who created the record |
| created_by_last_name | string | No | Last name of the person who created the record |

### Example API Call

```javascript
const addSickDayRecord = async () => {
  try {
    const response = await fetch('https://yourapi.com/sickday', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        date: "2024-06-15",
        meds_taken: "Children's Advil",
        temp: 101.2,
        created_by_account_id: 12345,
        created_by_first_name: "John",
        created_by_last_name: "Doe"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding sick day record:', error);
  }
};
```

### Successful Response

```json
{
  "sick_id": 6003,
  "baby_id": 54321,
  "date": "2024-06-15",
  "meds_taken": "Children's Advil",
  "temp": 101.2,
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T14:35:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id and date are required"
}

// Database error
{
  "error": "Failed to add sick day record"
}
```

### Update Sick Day Record

#### Endpoint: `/sickday/:sick_id`

**Method:** PUT

**Description:** 
Updates an existing sick day record.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sick_id | number | Yes | The ID of the sick day record to update |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| date | string | Yes | Date of the sick day in YYYY-MM-DD format |
| meds_taken | string | No | Medications that were administered |
| temp | number | No | Temperature reading (in Fahrenheit or Celsius) |

### Example API Call

```javascript
const updateSickDayRecord = async (sickId) => {
  try {
    const response = await fetch(`https://yourapi.com/sickday/${sickId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        date: "2024-06-15",
        meds_taken: "Children's Advil and Children's Tylenol",
        temp: 102.0
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating sick day record:', error);
  }
};
```

### Successful Response

```json
{
  "sick_id": 6003,
  "baby_id": 54321,
  "date": "2024-06-15",
  "meds_taken": "Children's Advil and Children's Tylenol",
  "temp": 102.0,
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-06-15T14:35:00Z",
  "updated_at": "2024-06-15T16:30:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id and date are required"
}

// Sick day record not found
{
  "error": "Sick day record not found"
}

// Database error
{
  "error": "Failed to update sick day record"
}
```

### Delete Sick Day Record

#### Endpoint: `/sickday/:sick_id`

**Method:** DELETE

**Description:** 
Deletes a sick day record from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sick_id | number | Yes | The ID of the sick day record to delete |

### Example API Call

```javascript
const deleteSickDayRecord = async (sickId) => {
  try {
    const response = await fetch(`https://yourapi.com/sickday/${sickId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting sick day record:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Sick day record deleted successfully",
  "sick_id": 6003
}
```

### Error Responses

```json
// Sick day record not found
{
  "error": "Sick day record not found"
}

// Database error
{
  "error": "Failed to delete sick day record"
}
```

## Feeding

### Get Feeding Records

#### Endpoint: `/feeding`

**Method:** GET

**Description:** 
Retrieves all feeding records or filters by baby ID.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | No | The ID of the baby to filter records by |

### Example API Call

```javascript
const getFeedingRecords = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/feeding?baby_id=${babyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching feeding records:', error);
  }
};
```

### Successful Response

```json
[
  {
    "feeding_id": 7001,
    "baby_id": 54321,
    "time_fed": "08:30:00",
    "date": "2024-05-15",
    "fed_from": "Bottle",
    "type_of_food": "Formula",
    "amount": "4oz",
    "notes": "Finished entire bottle",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-15T08:35:00Z"
  },
  {
    "feeding_id": 7002,
    "baby_id": 54321,
    "time_fed": "12:30:00",
    "date": "2024-05-15",
    "fed_from": "Bottle",
    "type_of_food": "Formula",
    "amount": "5oz",
    "notes": "Left 1oz",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-15T12:35:00Z"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch feeding records"
}
```

### Add Feeding Record

#### Endpoint: `/feeding`

**Method:** POST

**Description:** 
Creates a new feeding record for a baby.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| time_fed | string | Yes | Time when the baby was fed (HH:MM:SS format) |
| date | string | Yes | Date of the feeding in YYYY-MM-DD format |
| fed_from | string | Yes | Source of feeding (e.g., "Bottle", "Breast", "Solid food") |
| type_of_food | string | Yes | Type of food given (e.g., "Formula", "Breast milk", "Puree") |
| amount | string | No | Amount of food consumed (e.g., "4oz", "10 minutes", "2 tbsp") |
| notes | string | No | Additional notes about the feeding |
| created_by_account_id | number | No | ID of the account that created the record |
| created_by_first_name | string | No | First name of the person who created the record |
| created_by_last_name | string | No | Last name of the person who created the record |

### Example API Call

```javascript
const addFeedingRecord = async () => {
  try {
    const response = await fetch('https://yourapi.com/feeding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        time_fed: "16:30:00",
        date: "2024-05-15",
        fed_from: "Bottle",
        type_of_food: "Formula",
        amount: "6oz",
        notes: "Finished entire bottle",
        created_by_account_id: 12345,
        created_by_first_name: "John",
        created_by_last_name: "Doe"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding feeding record:', error);
  }
};
```

### Successful Response

```json
{
  "feeding_id": 7003,
  "baby_id": 54321,
  "time_fed": "16:30:00",
  "date": "2024-05-15",
  "fed_from": "Bottle",
  "type_of_food": "Formula",
  "amount": "6oz",
  "notes": "Finished entire bottle",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-05-15T16:35:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id, time_fed, date, fed_from, and type_of_food are required"
}

// Database error
{
  "error": "Failed to add feeding record"
}
```

### Update Feeding Record

#### Endpoint: `/feeding/:feeding_id`

**Method:** PUT

**Description:** 
Updates an existing feeding record.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| feeding_id | number | Yes | The ID of the feeding record to update |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| time_fed | string | Yes | Time when the baby was fed (HH:MM:SS format) |
| date | string | Yes | Date of the feeding in YYYY-MM-DD format |
| fed_from | string | Yes | Source of feeding (e.g., "Bottle", "Breast", "Solid food") |
| type_of_food | string | Yes | Type of food given (e.g., "Formula", "Breast milk", "Puree") |
| amount | string | No | Amount of food consumed (e.g., "4oz", "10 minutes", "2 tbsp") |
| notes | string | No | Additional notes about the feeding |

### Example API Call

```javascript
const updateFeedingRecord = async (feedingId) => {
  try {
    const response = await fetch(`https://yourapi.com/feeding/${feedingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        time_fed: "16:30:00",
        date: "2024-05-15",
        fed_from: "Bottle",
        type_of_food: "Formula",
        amount: "5.5oz",
        notes: "Left a small amount"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating feeding record:', error);
  }
};
```

### Successful Response

```json
{
  "feeding_id": 7003,
  "baby_id": 54321,
  "time_fed": "16:30:00",
  "date": "2024-05-15",
  "fed_from": "Bottle",
  "type_of_food": "Formula",
  "amount": "5.5oz",
  "notes": "Left a small amount",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-05-15T16:35:00Z",
  "updated_at": "2024-05-15T16:45:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id, time_fed, date, fed_from, and type_of_food are required"
}

// Feeding record not found
{
  "error": "Feeding record not found"
}

// Database error
{
  "error": "Failed to update feeding record"
}
```

### Delete Feeding Record

#### Endpoint: `/feeding/:feeding_id`

**Method:** DELETE

**Description:** 
Deletes a feeding record from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| feeding_id | number | Yes | The ID of the feeding record to delete |

### Example API Call

```javascript
const deleteFeedingRecord = async (feedingId) => {
  try {
    const response = await fetch(`https://yourapi.com/feeding/${feedingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting feeding record:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Feeding record deleted successfully",
  "feeding_id": 7003
}
```

### Error Responses

```json
// Feeding record not found
{
  "error": "Feeding record not found"
}

// Database error
{
  "error": "Failed to delete feeding record"
}
```

## Observations

### Get Observation Records

#### Endpoint: `/observation`

**Method:** GET

**Description:** 
Retrieves all observation records or filters by baby ID.

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | No | The ID of the baby to filter records by |

### Example API Call

```javascript
const getObservationRecords = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/observation?baby_id=${babyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching observation records:', error);
  }
};
```

### Successful Response

```json
[
  {
    "observation_id": 8001,
    "baby_id": 54321,
    "priority_level": "High",
    "notes": "Started crawling today",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-15T14:35:00Z"
  },
  {
    "observation_id": 8002,
    "baby_id": 54321,
    "priority_level": "Medium",
    "notes": "Seems interested in books with colors",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "created_at": "2024-05-16T10:40:00Z"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch observation records"
}
```

### Add Observation Record

#### Endpoint: `/observation`

**Method:** POST

**Description:** 
Creates a new observation record for a baby.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| priority_level | string | Yes | Priority level of the observation (e.g., "Low", "Medium", "High") |
| notes | string | No | Detailed notes about the observation |
| created_by_account_id | number | No | ID of the account that created the record |
| created_by_first_name | string | No | First name of the person who created the record |
| created_by_last_name | string | No | Last name of the person who created the record |

### Example API Call

```javascript
const addObservationRecord = async () => {
  try {
    const response = await fetch('https://yourapi.com/observation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        priority_level: "High",
        notes: "Said first word today - 'mama'",
        created_by_account_id: 12345,
        created_by_first_name: "John",
        created_by_last_name: "Doe"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding observation record:', error);
  }
};
```

### Successful Response

```json
{
  "observation_id": 8003,
  "baby_id": 54321,
  "priority_level": "High",
  "notes": "Said first word today - 'mama'",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-05-20T14:35:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id and priority_level are required"
}

// Database error
{
  "error": "Failed to add observation record"
}
```

### Update Observation Record

#### Endpoint: `/observation/:observation_id`

**Method:** PUT

**Description:** 
Updates an existing observation record.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| observation_id | number | Yes | The ID of the observation record to update |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baby_id | number | Yes | The ID of the baby |
| priority_level | string | Yes | Priority level of the observation (e.g., "Low", "Medium", "High") |
| notes | string | No | Detailed notes about the observation |

### Example API Call

```javascript
const updateObservationRecord = async (observationId) => {
  try {
    const response = await fetch(`https://yourapi.com/observation/${observationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baby_id: 54321,
        priority_level: "High",
        notes: "Said first words today - 'mama' and 'dada'"
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating observation record:', error);
  }
};
```

### Successful Response

```json
{
  "observation_id": 8003,
  "baby_id": 54321,
  "priority_level": "High",
  "notes": "Said first words today - 'mama' and 'dada'",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "created_at": "2024-05-20T14:35:00Z",
  "updated_at": "2024-05-20T15:30:00Z"
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "baby_id and priority_level are required"
}

// Observation record not found
{
  "error": "Observation record not found"
}

// Database error
{
  "error": "Failed to update observation record"
}
```

### Delete Observation Record

#### Endpoint: `/observation/:observation_id`

**Method:** DELETE

**Description:** 
Deletes an observation record from the database.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| observation_id | number | Yes | The ID of the observation record to delete |

### Example API Call

```javascript
const deleteObservationRecord = async (observationId) => {
  try {
    const response = await fetch(`https://yourapi.com/observation/${observationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting observation record:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Observation record deleted successfully",
  "observation_id": 8003
}
```

### Error Responses

```json
// Observation record not found
{
  "error": "Observation record not found"
}

// Database error
{
  "error": "Failed to delete observation record"
}
```

# Messaging

## Get User Conversations

### Endpoint: `/conversations/:account_id`

**Method:** GET

**Description:** 
Retrieves all conversations for a specific user (parent or babysitter). The conversations are ordered by the most recent message.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| account_id | number | Yes | The account ID of the user whose conversations to retrieve |

### Example API Call

```javascript
const getUserConversations = async (accountId) => {
  try {
    const response = await fetch(`https://yourapi.com/conversations/${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
  }
};
```

### Successful Response

```json
[
  {
    "conversation_id": 1001,
    "parent_id": 12345,
    "babysitter_id": 67890,
    "last_message_at": "2024-05-15T14:35:00Z",
    "other_user_name": "Sarah Smith",
    "other_user_id": 67890,
    "other_user_type": "babysitter",
    "last_message": "What time should I arrive tomorrow?",
    "last_message_time": "2024-05-15T14:35:00Z",
    "last_message_sender_id": 67890,
    "unread_count": 1
  },
  {
    "conversation_id": 1002,
    "parent_id": 12345,
    "babysitter_id": 67891,
    "last_message_at": "2024-05-14T10:30:00Z",
    "other_user_name": "Emma Johnson",
    "other_user_id": 67891,
    "other_user_type": "babysitter",
    "last_message": "Thank you for booking me for Saturday!",
    "last_message_time": "2024-05-14T10:30:00Z",
    "last_message_sender_id": 12345,
    "unread_count": 0
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch conversations"
}
```

## Get Conversation Messages

### Endpoint: `/messages/:conversation_id`

**Method:** GET

**Description:** 
Retrieves all messages for a specific conversation, ordered chronologically. Also marks messages as read if account_id is provided.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| conversation_id | number | Yes | The ID of the conversation to retrieve messages from |

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| account_id | number | No | The ID of the user viewing the messages (will mark messages as read) |

### Example API Call

```javascript
const getConversationMessages = async (conversationId, accountId) => {
  try {
    const response = await fetch(`https://yourapi.com/messages/${conversationId}?account_id=${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};
```

### Successful Response

```json
[
  {
    "message_id": 5001,
    "conversation_id": 1001,
    "sender_id": 12345,
    "content": "Hi Sarah, are you available to babysit this Saturday?",
    "created_at": "2024-05-15T09:30:00Z",
    "is_read": true,
    "sender_name": "John Doe"
  },
  {
    "message_id": 5002,
    "conversation_id": 1001,
    "sender_id": 67890,
    "content": "Hi John, yes I'm available! What time do you need me?",
    "created_at": "2024-05-15T10:15:00Z",
    "is_read": true,
    "sender_name": "Sarah Smith"
  },
  {
    "message_id": 5003,
    "conversation_id": 1001,
    "sender_id": 12345,
    "content": "Great! From 6pm to 10pm if that works for you.",
    "created_at": "2024-05-15T11:00:00Z",
    "is_read": true,
    "sender_name": "John Doe"
  },
  {
    "message_id": 5004,
    "conversation_id": 1001,
    "sender_id": 67890,
    "content": "What time should I arrive tomorrow?",
    "created_at": "2024-05-15T14:35:00Z",
    "is_read": false,
    "sender_name": "Sarah Smith"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch messages"
}
```

## Send Message

### Endpoint: `/send`

**Method:** POST

**Description:** 
Sends a new message from one user to another. Creates a new conversation if one doesn't exist.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sender_id | number | Yes | The account ID of the message sender |
| recipient_id | number | Yes | The account ID of the message recipient |
| content | string | Yes | The content of the message |

### Example API Call

```javascript
const sendMessage = async () => {
  try {
    const response = await fetch('https://yourapi.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender_id: 12345,
        recipient_id: 67890,
        content: "Looking forward to Saturday. Please arrive at 5:45pm."
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
```

### Successful Response

```json
{
  "message_id": 5005,
  "conversation_id": 1001,
  "sender_id": 12345,
  "content": "Looking forward to Saturday. Please arrive at 5:45pm.",
  "created_at": "2024-05-16T09:30:00Z",
  "is_read": false
}
```

### Error Responses

```json
// Missing required fields
{
  "error": "Missing required fields"
}

// No verified relationship
{
  "error": "No verified relationship between users"
}

// Invalid user types
{
  "error": "Invalid user types"
}

// Database error
{
  "error": "Failed to send message"
}
```

## Get Available Recipients

### Endpoint: `/recipients/:account_id`

**Method:** GET

**Description:** 
Retrieves all available recipients (contacts) for a user to message. For parents, this retrieves verified babysitters; for babysitters, this retrieves verified parents.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| account_id | number | Yes | The account ID of the user to find recipients for |

### Example API Call

```javascript
const getAvailableRecipients = async (accountId) => {
  try {
    const response = await fetch(`https://yourapi.com/recipients/${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipients:', error);
  }
};
```

### Successful Response

For a parent account:
```json
[
  {
    "account_id": 67890,
    "name": "Sarah Smith",
    "email": "sarah.smith@example.com",
    "share_id": "share123"
  },
  {
    "account_id": 67891,
    "name": "Emma Johnson",
    "email": "emma.johnson@example.com",
    "share_id": "share124"
  }
]
```

For a babysitter account:
```json
[
  {
    "account_id": 12345,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "share_id": "share123"
  },
  {
    "account_id": 12346,
    "name": "Jane Wilson",
    "email": "jane.wilson@example.com",
    "share_id": "share125"
  }
]
```

### Error Responses

```json
// User not found
{
  "error": "User not found"
}

// Invalid account type
{
  "error": "Invalid account type"
}

// Database error
{
  "error": "Failed to fetch recipients"
}
```

## Mark Messages as Read

### Endpoint: `/read/:conversation_id`

**Method:** PUT

**Description:** 
Marks all messages in a conversation as read for a specific user.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| conversation_id | number | Yes | The ID of the conversation to mark as read |

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| account_id | number | Yes | The account ID of the user marking messages as read |

### Example API Call

```javascript
const markMessagesAsRead = async (conversationId, accountId) => {
  try {
    const response = await fetch(`https://yourapi.com/read/${conversationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_id: accountId
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};
```

### Successful Response

```json
{
  "success": true
}
```

### Error Responses

```json
// Database error
{
  "error": "Failed to mark messages as read"
}
```

## Get Unread Messages Count

### Endpoint: `/unread-count/:account_id`

**Method:** GET

**Description:** 
Retrieves the total count of unread messages across all conversations for a user.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| account_id | number | Yes | The account ID of the user to get unread count for |

### Example API Call

```javascript
const getUnreadMessagesCount = async (accountId) => {
  try {
    const response = await fetch(`https://yourapi.com/unread-count/${accountId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
  }
};
```

### Successful Response

```json
{
  "count": 3
}
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch unread count"
}
```# Photo Gallery

## Get Photos by Baby ID

### Endpoint: `/photo-gallery/baby/:babyId`

**Method:** GET

**Description:** 
Retrieves all photos associated with a specific baby, ordered by upload date (newest first).

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| babyId | number | Yes | The ID of the baby whose photos to retrieve |

### Example API Call

```javascript
const getPhotosByBabyId = async (babyId) => {
  try {
    const response = await fetch(`https://yourapi.com/photo-gallery/baby/${babyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
};
```

### Successful Response

```json
[
  {
    "photo_id": 1001,
    "baby_id": 54321,
    "parent_id": 12345,
    "photo_url": "/uploads/photos/photo-1620145789012-123456789.jpg",
    "caption": "First steps!",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "uploaded_at": "2024-05-15T14:35:00Z",
    "first_name": "Jane",
    "last_name": "Doe"
  },
  {
    "photo_id": 1002,
    "baby_id": 54321,
    "parent_id": 12345,
    "photo_url": "/uploads/photos/photo-1620134567890-987654321.jpg",
    "caption": "Playing at the park",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "uploaded_at": "2024-05-10T11:20:00Z",
    "first_name": "Jane",
    "last_name": "Doe"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch photos"
}
```

## Get Photos by Parent ID

### Endpoint: `/photo-gallery/parent/:parentId`

**Method:** GET

**Description:** 
Retrieves all photos uploaded by a specific parent, ordered by upload date (newest first).

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| parentId | number | Yes | The account ID of the parent whose photos to retrieve |

### Example API Call

```javascript
const getPhotosByParentId = async (parentId) => {
  try {
    const response = await fetch(`https://yourapi.com/photo-gallery/parent/${parentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
};
```

### Successful Response

```json
[
  {
    "photo_id": 1001,
    "baby_id": 54321,
    "parent_id": 12345,
    "photo_url": "/uploads/photos/photo-1620145789012-123456789.jpg",
    "caption": "First steps!",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "uploaded_at": "2024-05-15T14:35:00Z",
    "first_name": "Jane",
    "last_name": "Doe"
  },
  {
    "photo_id": 1003,
    "baby_id": 54322,
    "parent_id": 12345,
    "photo_url": "/uploads/photos/photo-1620156789012-135792468.jpg",
    "caption": "Bath time",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "uploaded_at": "2024-05-14T18:45:00Z",
    "first_name": "John",
    "last_name": "Doe Jr"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch photos"
}
```

## Get Photos by Babysitter ID

### Endpoint: `/photo-gallery/babysitter/:babysitterId`

**Method:** GET

**Description:** 
Retrieves all photos of babies associated with a specific babysitter (via verified babysitter shares), ordered by upload date (newest first).

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| babysitterId | number | Yes | The account ID of the babysitter whose associated babies' photos to retrieve |

### Example API Call

```javascript
const getPhotosByBabysitterId = async (babysitterId) => {
  try {
    const response = await fetch(`https://yourapi.com/photo-gallery/babysitter/${babysitterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching photos:', error);
  }
};
```

### Successful Response

```json
[
  {
    "photo_id": 1001,
    "baby_id": 54321,
    "parent_id": 12345,
    "photo_url": "/uploads/photos/photo-1620145789012-123456789.jpg",
    "caption": "First steps!",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "uploaded_at": "2024-05-15T14:35:00Z",
    "first_name": "Jane",
    "last_name": "Doe"
  },
  {
    "photo_id": 1002,
    "baby_id": 54321,
    "parent_id": 12345,
    "photo_url": "/uploads/photos/photo-1620134567890-987654321.jpg",
    "caption": "Playing at the park",
    "created_by_account_id": 12345,
    "created_by_first_name": "John",
    "created_by_last_name": "Doe",
    "uploaded_at": "2024-05-10T11:20:00Z",
    "first_name": "Jane",
    "last_name": "Doe"
  }
]
```

### Error Responses

```json
// Database error
{
  "error": "Failed to fetch photos"
}
```

## Upload Photo

### Endpoint: `/photo-gallery/upload`

**Method:** POST

**Description:** 
Uploads a new photo for a baby to the photo gallery. The photo file is stored on the server and a reference is saved in the database.

### Request Body Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| photo | file | Yes | The image file to upload (JPEG, JPG, PNG, GIF, or WEBP format, max 5MB) |
| baby_id | number | Yes | The ID of the baby this photo is of |
| parent_id | number | Yes | The account ID of the parent uploading the photo |
| caption | string | No | A caption for the photo |
| created_by_account_id | number | No | ID of the account that created the record |
| created_by_first_name | string | No | First name of the person who created the record |
| created_by_last_name | string | No | Last name of the person who created the record |

### Example API Call

```javascript
const uploadPhoto = async (formData) => {
  // formData should include: photo (file), baby_id, parent_id, caption, 
  // created_by_account_id, created_by_first_name, created_by_last_name
  try {
    const response = await fetch('https://yourapi.com/photo-gallery/upload', {
      method: 'POST',
      body: formData, // FormData object containing file and other fields
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading photo:', error);
  }
};
```

### Successful Response

```json
{
  "photo_id": 1004,
  "baby_id": 54321,
  "parent_id": 12345,
  "photo_url": "/uploads/photos/photo-1620167890123-246813579.jpg",
  "caption": "First birthday party",
  "created_by_account_id": 12345,
  "created_by_first_name": "John",
  "created_by_last_name": "Doe",
  "uploaded_at": "2024-05-20T15:30:00Z"
}
```

### Error Responses

```json
// No photo uploaded
{
  "error": "No photo file uploaded"
}

// Missing required fields
{
  "error": "Missing required fields"
}

// Invalid file type
{
  "error": "Only image files are allowed!"
}

// File too large
{
  "error": "File too large"
}

// Database error
{
  "error": "Failed to upload photo"
}
```

## Delete Photo

### Endpoint: `/photo-gallery/:photoId`

**Method:** DELETE

**Description:** 
Deletes a photo from the photo gallery, removing both the database record and the file from the server.

### URL Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| photoId | number | Yes | The ID of the photo to delete |

### Example API Call

```javascript
const deletePhoto = async (photoId) => {
  try {
    const response = await fetch(`https://yourapi.com/photo-gallery/${photoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
};
```

### Successful Response

```json
{
  "message": "Photo deleted successfully"
}
```

### Error Responses

```json
// Photo not found
{
  "error": "Photo not found"
}

// Database error
{
  "error": "Failed to delete photo"
}
```

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

<div align="center">

**© 2025 ParentPal Backend**

Built with Node.js, Express, and PostgreSQL

</div>
