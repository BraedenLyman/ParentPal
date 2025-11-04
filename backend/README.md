# ParentPal Backend API Documentation

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

### REST API & Database Documentation

</div>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Database Configuration](#database-configuration)
- [API Endpoints](#api-endpoints)
  - [Authentication](#1-authentication-routes)
  - [Accounts](#2-accounts-routes)
  - [Babies](#3-babies-routes)
  - [User Management](#4-user-routes)
  - [Growth Tracking](#5-growth-tracking-routes)
  - [Sleep Tracking](#6-sleep-tracking-routes)
  - [Feeding Tracking](#7-feeding-tracking-routes)
  - [Medications](#8-medications-routes)
  - [Allergies](#9-allergies-routes)
  - [Vaccinations](#10-vaccinations-routes)
  - [Sick Days](#11-sick-day-tracking-routes)
  - [Observations](#12-observation-routes)
  - [Photo Gallery](#13-photo-gallery-routes)
  - [Babysitter Sharing](#14-babysitter-sharing-routes)
  - [Shared Tasks](#15-shared-tasks-routes)
- [Database Schema](#database-schema)
  - [Entity Relationships](#entity-relationships)
  - [Table Definitions](#table-definitions)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)

---

## Overview

The ParentPal backend is a RESTful API built with Node.js, Express, and PostgreSQL. It provides secure endpoints for managing childcare data, user authentication via Firebase, and collaboration features between parents and babysitters.

**Key Features:**
- Firebase Authentication integration
- Role-based access control (Parents & Babysitters)
- PostgreSQL database with relational data
- Email notifications via Nodemailer
- File upload handling with Multer
- Secure verification system for babysitter invitations

**Server Details:**
- **Port:** 5001
- **Base URL:** `http://localhost:5001/api`
- **Authentication:** Firebase ID Token (Bearer token in Authorization header)

---

## Database Configuration

### Connection Details

```javascript
{
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'parentpal_db',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  max: 20,                    // Maximum pool size
  idleTimeoutMillis: 30000    // 30 seconds idle timeout
}
```

### Database Type
**PostgreSQL 12+** with connection pooling via `pg` library.

---

## API Endpoints

### 1. Authentication Routes
**Base Path:** `/api/sign-in`

#### POST `/api/sign-in`
Authenticates user with Firebase and retrieves account data.

**Request:**
```json
{
  "idToken": "firebase-id-token-string"
}
```

**Response:**
```json
{
  "user": {
    "account_id": 1,
    "firebase_uid": "abc123...",
    "first_name": "John",
    "last_name": "Doe",
    "email_address": "john@example.com",
    "account_type": "parent",
    "birth_date": "1990-01-01",
    "gender": "Male"
  },
  "babyData": [
    {
      "baby_id": 1,
      "first_name": "Emma",
      "last_name": "Doe",
      "birth_date": "2022-05-15",
      "gender": "Female",
      "category": "infant"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid or expired Firebase token
- `404` - User not found
- `500` - Server error

---

### 2. Accounts Routes
**Base Path:** `/api/accounts`

#### POST `/api/accounts`
Creates a new parent or babysitter account.

**Request:**
```json
{
  "firebaseUid": "abc123...",
  "fName": "Jane",
  "lName": "Smith",
  "email": "jane@example.com",
  "accountType": "parent",
  "dob": "1985-03-20",
  "gender": "Female",
  "baby": {
    "bFName": "Oliver",
    "bLName": "Smith",
    "bDob": "2023-01-10",
    "bGender": "Male"
  }
}
```

**Response:**
```json
{
  "accountId": 2
}
```

**Notes:**
- `baby` object is optional
- `accountType` must be either `"parent"` or `"babysitter"`
- Creates baby record if `baby` object is provided

**Status Codes:**
- `201` - Account created
- `400` - Invalid request data
- `500` - Server error

---

### 3. Babies Routes
**Base Path:** `/api/babies`

#### GET `/api/babies/:accountId`
Retrieves all babies for a parent by account ID.

**URL Parameters:**
- `accountId` - Parent's account ID

**Response:**
```json
[
  {
    "baby_id": 1,
    "parent_id": 1,
    "first_name": "Emma",
    "last_name": "Doe",
    "birth_date": "2022-05-15",
    "gender": "Female",
    "category": "infant"
  }
]
```

#### GET `/api/babies?firebase_uid={uid}`
Retrieves the first baby for a parent by Firebase UID.

**Query Parameters:**
- `firebase_uid` - Parent's Firebase UID

**Response:**
```json
{
  "baby_id": 1,
  "parent_id": 1,
  "first_name": "Emma",
  "last_name": "Doe",
  "birth_date": "2022-05-15",
  "gender": "Female",
  "category": "infant"
}
```

#### POST `/api/babies`
Creates a new baby record.

**Request:**
```json
{
  "parent_id": 1,
  "first_name": "Liam",
  "last_name": "Doe",
  "birth_date": "2021-08-22",
  "gender": "Male",
  "category": "toddler"
}
```

**Response:**
```json
{
  "baby_id": 2,
  "parent_id": 1,
  "first_name": "Liam",
  "last_name": "Doe",
  "birth_date": "2021-08-22",
  "gender": "Male",
  "category": "toddler"
}
```

#### DELETE `/api/babies/:baby_id`
Deletes a baby and all associated records (cascading delete).

**URL Parameters:**
- `baby_id` - Baby's ID

**Response:**
```json
{
  "message": "Baby and all associated records deleted successfully",
  "deleted_baby_id": 2
}
```

**⚠️ Warning:** This permanently deletes all records including growth, sleep, feeding, medications, allergies, vaccinations, observations, sick days, and photos.

**Status Codes:**
- `200` - Successfully deleted
- `404` - Baby not found
- `500` - Server error

---

### 4. User Routes
**Base Path:** `/api/user`

#### DELETE `/api/user?firebase_uid={uid}`
Deletes user account and all associated data.

**Query Parameters:**
- `firebase_uid` - User's Firebase UID

**Response:**
```json
{
  "message": "Account and all associated data deleted successfully"
}
```

**⚠️ Warning:** Cascades to delete all babies and their records for parents.

**Status Codes:**
- `200` - Successfully deleted
- `404` - User not found
- `500` - Server error

---

### 5. Growth Tracking Routes
**Base Path:** `/api/growth`

#### GET `/api/growth?baby_id={id}`
Retrieves all growth records, optionally filtered by baby.

**Query Parameters:**
- `baby_id` (optional) - Filter by specific baby

**Response:**
```json
[
  {
    "growth_id": 1,
    "baby_id": 1,
    "weight": 18.5,
    "height": 30.2,
    "date": "2023-06-15"
  }
]
```

#### POST `/api/growth`
Creates a new growth measurement record.

**Request:**
```json
{
  "baby_id": 1,
  "weight": 19.2,
  "height": 31.0,
  "date": "2023-07-15"
}
```

**Response:**
```json
{
  "growth_id": 2,
  "baby_id": 1,
  "weight": 19.2,
  "height": 31.0,
  "date": "2023-07-15"
}
```

#### PUT `/api/growth/:id`
Updates a growth record.

**URL Parameters:**
- `id` - Growth record ID

**Request:**
```json
{
  "baby_id": 1,
  "weight": 19.5,
  "height": 31.2,
  "date": "2023-07-15"
}
```

**Response:**
```json
{
  "growth_id": 2,
  "baby_id": 1,
  "weight": 19.5,
  "height": 31.2,
  "date": "2023-07-15"
}
```

#### DELETE `/api/growth/:id`
Deletes a growth record.

**URL Parameters:**
- `id` - Growth record ID

**Response:**
```json
{
  "message": "Growth record deleted successfully",
  "growth_id": 2
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `404` - Record not found
- `500` - Server error

---

### 6. Sleep Tracking Routes
**Base Path:** `/api/sleep`

#### GET `/api/sleep?baby_id={id}`
Retrieves all sleep records, optionally filtered by baby.

**Query Parameters:**
- `baby_id` (optional) - Filter by specific baby

**Response:**
```json
[
  {
    "sleep_id": 1,
    "baby_id": 1,
    "sleep_duration": "2.5",
    "time_fell_asleep": "14:30:00",
    "date": "2023-07-15"
  }
]
```

#### POST `/api/sleep`
Creates a new sleep record.

**Request:**
```json
{
  "baby_id": 1,
  "sleep_duration": "3.0",
  "time_fell_asleep": "19:00:00",
  "date": "2023-07-15"
}
```

**Response:**
```json
{
  "sleep_id": 2,
  "baby_id": 1,
  "sleep_duration": "3.0",
  "time_fell_asleep": "19:00:00",
  "date": "2023-07-15"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `500` - Server error

---

### 7. Feeding Tracking Routes
**Base Path:** `/api/feeding`

#### GET `/api/feeding?baby_id={id}`
Retrieves all feeding records, optionally filtered by baby.

**Query Parameters:**
- `baby_id` (optional) - Filter by specific baby

**Response:**
```json
[
  {
    "feeding_id": 1,
    "baby_id": 1,
    "time_fed": "08:30:00",
    "date": "2023-07-15",
    "fed_from": "Bottle",
    "type_of_food": "Formula",
    "amount": "6 oz",
    "notes": "Finished entire bottle"
  }
]
```

#### POST `/api/feeding`
Creates a new feeding record.

**Request:**
```json
{
  "baby_id": 1,
  "time_fed": "12:00:00",
  "date": "2023-07-15",
  "fed_from": "Spoon",
  "type_of_food": "Mashed Banana",
  "amount": "1/2 cup",
  "notes": "Loved it!"
}
```

**Response:**
```json
{
  "feeding_id": 2,
  "baby_id": 1,
  "time_fed": "12:00:00",
  "date": "2023-07-15",
  "fed_from": "Spoon",
  "type_of_food": "Mashed Banana",
  "amount": "1/2 cup",
  "notes": "Loved it!"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `500` - Server error

---

### 8. Medications Routes
**Base Path:** `/api/meds`

#### GET `/api/meds?baby_id={id}`
Retrieves all medication records, optionally filtered by baby.

**Query Parameters:**
- `baby_id` (optional) - Filter by specific baby

**Response:**
```json
[
  {
    "med_id": 1,
    "baby_id": 1,
    "medication_name": "Tylenol",
    "time_taken": "10:00:00",
    "date": "2023-07-15",
    "dosage": "2.5 ml",
    "symptoms": "Fever - 101°F"
  }
]
```

#### POST `/api/meds`
Creates a new medication record.

**Request:**
```json
{
  "baby_id": 1,
  "medication_name": "Amoxicillin",
  "time_taken": "09:00:00",
  "date": "2023-07-16",
  "dosage": "5 ml",
  "symptoms": "Ear infection"
}
```

**Response:**
```json
{
  "med_id": 2,
  "baby_id": 1,
  "medication_name": "Amoxicillin",
  "time_taken": "09:00:00",
  "date": "2023-07-16",
  "dosage": "5 ml",
  "symptoms": "Ear infection"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `500` - Server error

---

### 9. Allergies Routes
**Base Path:** `/api/allergies`

#### GET `/api/allergies?baby_id={id}`
Retrieves all allergy records, optionally filtered by baby.

**Query Parameters:**
- `baby_id` (optional) - Filter by specific baby

**Response:**
```json
[
  {
    "allergy_id": 1,
    "baby_id": 1,
    "allergy_name": "Peanuts",
    "severity": "Severe",
    "epi_pen": true,
    "notes": "Anaphylaxis risk - keep EpiPen nearby"
  }
]
```

#### POST `/api/allergies`
Creates a new allergy record.

**Request:**
```json
{
  "baby_id": 1,
  "allergy_name": "Dairy",
  "severity": "Moderate",
  "epi_pen": false,
  "notes": "Causes digestive upset"
}
```

**Response:**
```json
{
  "allergy_id": 2,
  "baby_id": 1,
  "allergy_name": "Dairy",
  "severity": "Moderate",
  "epi_pen": false,
  "notes": "Causes digestive upset"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `500` - Server error

---

### 10. Vaccinations Routes
**Base Path:** `/api/vaccinations`

#### GET `/api/vaccinations?baby_id={id}`
Retrieves all vaccination records, optionally filtered by baby.

**Query Parameters:**
- `baby_id` (optional) - Filter by specific baby

**Response:**
```json
[
  {
    "vaccine_id": 1,
    "baby_id": 1,
    "vaccination_name": "MMR",
    "date_of_vaccine": "2023-05-15"
  }
]
```

#### POST `/api/vaccinations`
Creates a new vaccination record.

**Request:**
```json
{
  "baby_id": 1,
  "vaccination_name": "DTaP",
  "date_of_vaccine": "2023-07-15"
}
```

**Response:**
```json
{
  "vaccine_id": 2,
  "baby_id": 1,
  "vaccination_name": "DTaP",
  "date_of_vaccine": "2023-07-15"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `500` - Server error

---

### 11. Sick Day Tracking Routes
**Base Path:** `/api/sickday`

#### GET `/api/sickday?baby_id={id}`
Retrieves all sick day records, optionally filtered by baby.

**Query Parameters:**
- `baby_id` (optional) - Filter by specific baby

**Response:**
```json
[
  {
    "sick_id": 1,
    "baby_id": 1,
    "date": "2023-07-15",
    "meds_taken": "Tylenol 2.5ml at 10am",
    "temp": 101.5
  }
]
```

#### POST `/api/sickday`
Creates a new sick day record.

**Request:**
```json
{
  "baby_id": 1,
  "date": "2023-07-16",
  "meds_taken": "Ibuprofen 2ml at 2pm",
  "temp": 100.2
}
```

**Response:**
```json
{
  "sick_id": 2,
  "baby_id": 1,
  "date": "2023-07-16",
  "meds_taken": "Ibuprofen 2ml at 2pm",
  "temp": 100.2
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `500` - Server error

---

### 12. Observation Routes
**Base Path:** `/api/observation`

#### GET `/api/observation?baby_id={id}`
Retrieves all observation records, optionally filtered by baby.

**Query Parameters:**
- `baby_id` (optional) - Filter by specific baby

**Response:**
```json
[
  {
    "observation_id": 1,
    "baby_id": 1,
    "priority_level": "High",
    "notes": "First time rolling over independently!"
  }
]
```

#### POST `/api/observation`
Creates a new observation record.

**Request:**
```json
{
  "baby_id": 1,
  "priority_level": "Medium",
  "notes": "Said 'mama' for the first time"
}
```

**Response:**
```json
{
  "observation_id": 2,
  "baby_id": 1,
  "priority_level": "Medium",
  "notes": "Said 'mama' for the first time"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `500` - Server error

---

### 13. Photo Gallery Routes
**Base Path:** `/api/photo-gallery`

#### GET `/api/photo-gallery/baby/:babyId`
Retrieves all photos for a specific baby.

**URL Parameters:**
- `babyId` - Baby's ID

**Response:**
```json
[
  {
    "photo_id": 1,
    "baby_id": 1,
    "baby_name": "Emma Doe",
    "parent_id": 1,
    "photo_url": "/uploads/photos/1689456789-photo.jpg",
    "caption": "First birthday!",
    "uploaded_at": "2023-07-15T14:33:09.000Z"
  }
]
```

**Ordering:** Results ordered by `uploaded_at DESC`

#### GET `/api/photo-gallery/parent/:parentId`
Retrieves all photos uploaded by a parent.

**URL Parameters:**
- `parentId` - Parent's account ID

**Response:** Same format as above

#### GET `/api/photo-gallery/babysitter/:babysitterId`
Retrieves all photos accessible to a babysitter (from verified shares).

**URL Parameters:**
- `babysitterId` - Babysitter's account ID

**Response:** Same format as above

**Note:** Only includes photos from verified parent shares.

#### POST `/api/photo-gallery/upload`
Uploads a photo for a baby.

**Request (multipart/form-data):**
```
photo: [image file]
baby_id: 1
parent_id: 1
caption: "Playing at the park"
```

**File Requirements:**
- **Formats:** jpeg, jpg, png, gif, webp
- **Max Size:** 5MB
- **Storage:** `/backend/uploads/photos/`

**Response:**
```json
{
  "photo_id": 2,
  "baby_id": 1,
  "parent_id": 1,
  "photo_url": "/uploads/photos/1689456999-photo.jpg",
  "caption": "Playing at the park",
  "uploaded_at": "2023-07-15T14:36:39.000Z"
}
```

#### DELETE `/api/photo-gallery/:photoId`
Deletes a photo and removes the file from disk.

**URL Parameters:**
- `photoId` - Photo's ID

**Response:**
```json
{
  "message": "Photo deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Invalid file or missing data
- `404` - Photo not found
- `500` - Server error

---

### 14. Babysitter Sharing Routes
**Base Path:** `/api/babysitter-sharing`

#### POST `/api/babysitter-sharing/invite`
Sends an invitation email to a babysitter with a verification code.

**Request:**
```json
{
  "parent_id": 1,
  "babysitter_email": "sitter@example.com",
  "babysitter_name": "Alice Johnson"
}
```

**Email Sent:**
- Subject: "You've been invited to ParentPal!"
- Contains: 4-digit verification code
- Expires: 7 days from creation

**Response:**
```json
{
  "message": "Invitation sent successfully",
  "share_id": 1
}
```

#### POST `/api/babysitter-sharing/verify`
Verifies a babysitter's code and grants access.

**Request:**
```json
{
  "verification_code": "1234",
  "babysitter_id": 5
}
```

**Response:**
```json
{
  "message": "Verification successful"
}
```

**Validation:**
- Code must match
- Code must not be expired (< 7 days old)
- Code must not already be verified

#### GET `/api/babysitter-sharing/children/:babysitter_id`
Retrieves all children accessible to a babysitter.

**URL Parameters:**
- `babysitter_id` - Babysitter's account ID

**Response:**
```json
{
  "children": [
    {
      "baby_id": 1,
      "first_name": "Emma",
      "last_name": "Doe",
      "birth_date": "2022-05-15",
      "gender": "Female",
      "category": "infant",
      "parent_id": 1,
      "parent_name": "John Doe",
      "share_id": 1
    }
  ]
}
```

**Note:** Only returns children from verified shares.

#### GET `/api/babysitter-sharing/babysitters/:parent_id`
Retrieves all babysitters for a parent.

**URL Parameters:**
- `parent_id` - Parent's account ID

**Response:**
```json
{
  "babysitters": [
    {
      "share_id": 1,
      "babysitter_id": 5,
      "babysitter_name": "Alice Johnson",
      "babysitter_email": "alice@example.com",
      "is_verified": true,
      "created_at": "2023-07-10T10:00:00.000Z",
      "verified_at": "2023-07-10T15:30:00.000Z",
      "expires_at": "2023-07-17T10:00:00.000Z"
    },
    {
      "share_id": 2,
      "babysitter_id": null,
      "babysitter_name": "Bob Smith",
      "babysitter_email": "bob@example.com",
      "is_verified": false,
      "created_at": "2023-07-14T12:00:00.000Z",
      "verified_at": null,
      "expires_at": "2023-07-21T12:00:00.000Z"
    }
  ]
}
```

#### DELETE `/api/babysitter-sharing/remove/:share_id`
Removes a babysitter's access to parent's children.

**URL Parameters:**
- `share_id` - Share record ID

**Request:**
```json
{
  "parent_id": 1
}
```

**Response:**
```json
{
  "message": "Babysitter access removed successfully"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Invalid code or expired
- `404` - Not found
- `500` - Server error

---

### 15. Shared Tasks Routes
**Base Path:** `/api/shared-tasks`

#### GET `/api/shared-tasks/share/:shareId`
Retrieves all tasks for a specific babysitter share.

**URL Parameters:**
- `shareId` - Share record ID

**Response:**
```json
[
  {
    "task_id": 1,
    "share_id": 1,
    "parent_id": 1,
    "parent_name": "John Doe",
    "babysitter_id": 5,
    "babysitter_name": "Alice Johnson",
    "baby_id": 1,
    "baby_name": "Emma Doe",
    "task_title": "Give medication at 2 PM",
    "task_description": "Tylenol 2.5ml for fever",
    "due_date": "2023-07-15T14:00:00.000Z",
    "is_completed": false,
    "completed_at": null,
    "babysitter_notes": null,
    "created_at": "2023-07-14T10:00:00.000Z",
    "updated_at": "2023-07-14T10:00:00.000Z"
  }
]
```

**Ordering:** By `is_completed ASC, due_date ASC, created_at ASC`

#### GET `/api/shared-tasks/parent/:parentId`
Retrieves all tasks a parent assigned.

**URL Parameters:**
- `parentId` - Parent's account ID

**Response:**
```json
{
  "tasks": [
    {
      "task_id": 1,
      "task_title": "Give medication at 2 PM",
      "task_description": "Tylenol 2.5ml for fever",
      "due_date": "2023-07-15T14:00:00.000Z",
      "is_completed": false,
      "babysitter_name": "Alice Johnson",
      "baby_name": "Emma Doe"
    }
  ]
}
```

#### GET `/api/shared-tasks/babysitter/:babysitterId`
Retrieves all tasks assigned to a babysitter.

**URL Parameters:**
- `babysitterId` - Babysitter's account ID

**Response:**
```json
{
  "tasks": [
    {
      "task_id": 1,
      "task_title": "Give medication at 2 PM",
      "task_description": "Tylenol 2.5ml for fever",
      "due_date": "2023-07-15T14:00:00.000Z",
      "is_completed": false,
      "parent_name": "John Doe",
      "baby_name": "Emma Doe"
    }
  ]
}
```

#### POST `/api/shared-tasks`
Creates a new shared task.

**Request:**
```json
{
  "share_id": 1,
  "parent_id": 1,
  "babysitter_id": 5,
  "baby_id": 1,
  "task_title": "Read bedtime story",
  "task_description": "Choose from the blue bookshelf",
  "due_date": "2023-07-15T19:00:00"
}
```

**Response:**
```json
{
  "task_id": 2,
  "share_id": 1,
  "parent_id": 1,
  "babysitter_id": 5,
  "baby_id": 1,
  "task_title": "Read bedtime story",
  "task_description": "Choose from the blue bookshelf",
  "due_date": "2023-07-15T19:00:00.000Z",
  "is_completed": false,
  "completed_at": null,
  "babysitter_notes": null,
  "created_at": "2023-07-14T16:00:00.000Z",
  "updated_at": "2023-07-14T16:00:00.000Z"
}
```

#### PUT `/api/shared-tasks/:taskId`
Updates a task.

**URL Parameters:**
- `taskId` - Task ID

**Request:**
```json
{
  "share_id": 1,
  "babysitter_id": 5,
  "baby_id": 1,
  "task_title": "Read TWO bedtime stories",
  "task_description": "Choose from the blue bookshelf",
  "due_date": "2023-07-15T19:30:00"
}
```

**Response:**
```json
{
  "task_id": 2,
  "task_title": "Read TWO bedtime stories",
  "task_description": "Choose from the blue bookshelf",
  "due_date": "2023-07-15T19:30:00.000Z",
  "updated_at": "2023-07-14T17:00:00.000Z"
}
```

#### PATCH `/api/shared-tasks/:taskId/complete`
Marks a task as completed.

**URL Parameters:**
- `taskId` - Task ID

**Request:**
```json
{
  "babysitter_notes": "Read 'Goodnight Moon' and 'The Very Hungry Caterpillar'"
}
```

**Response:**
```json
{
  "task_id": 2,
  "is_completed": true,
  "completed_at": "2023-07-15T19:45:00.000Z",
  "babysitter_notes": "Read 'Goodnight Moon' and 'The Very Hungry Caterpillar'",
  "updated_at": "2023-07-15T19:45:00.000Z"
}
```

#### PATCH `/api/shared-tasks/:taskId/incomplete`
Marks a completed task as incomplete.

**URL Parameters:**
- `taskId` - Task ID

**Response:**
```json
{
  "task_id": 2,
  "is_completed": false,
  "completed_at": null,
  "updated_at": "2023-07-15T20:00:00.000Z"
}
```

#### DELETE `/api/shared-tasks/:taskId`
Deletes a shared task.

**URL Parameters:**
- `taskId` - Task ID

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `404` - Task not found
- `500` - Server error

---

## Database Schema

### Entity Relationships

```
┌─────────────────┐
│     account     │
│  (Parents &     │
│  Babysitters)   │
└────────┬────────┘
         │
         │ 1:N (parent)
         ▼
    ┌────────────┐
    │    baby    │
    └─────┬──────┘
          │
          │ 1:N
          ├──────► growth
          ├──────► sleep
          ├──────► feeding
          ├──────► medications
          ├──────► allergies
          ├──────► vaccinations
          ├──────► sick_day
          ├──────► observation
          └──────► photo_gallery

┌─────────────────┐
│     account     │
│    (Parent)     │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐
│ babysitter_shares│
└────────┬─────────┘
         │
         │ 1:N
         ▼
   ┌──────────────┐
   │ shared_tasks │
   └──────────────┘
```

### Table Definitions

---

#### Table: `account`
Stores user account information for parents and babysitters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `account_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `firebase_uid` | VARCHAR | UNIQUE, NOT NULL | Firebase authentication UID |
| `first_name` | VARCHAR | NOT NULL | User's first name |
| `last_name` | VARCHAR | NOT NULL | User's last name |
| `email_address` | VARCHAR | | User's email address |
| `account_type` | VARCHAR | NOT NULL | 'parent' or 'babysitter' |
| `birth_date` | DATE | | User's date of birth |
| `gender` | VARCHAR(7) | | User's gender (max 7 chars) |

**Indexes:**
- Primary key on `account_id`
- Unique index on `firebase_uid`

---

#### Table: `baby`
Stores information about babies/children.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `baby_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `parent_id` | INTEGER | FOREIGN KEY → account(account_id) | Reference to parent account |
| `first_name` | VARCHAR | NOT NULL | Baby's first name |
| `last_name` | VARCHAR | NOT NULL | Baby's last name |
| `birth_date` | DATE | | Baby's date of birth |
| `gender` | VARCHAR(7) | | Baby's gender (max 7 chars) |
| `category` | VARCHAR | | Baby category (e.g., infant, toddler) |

**Relationships:**
- Belongs to `account` (parent)
- Has many `growth`, `sleep`, `feeding`, etc.

**Cascade Delete:** Deleting a baby deletes all associated records

---

#### Table: `growth`
Tracks baby's physical growth measurements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `growth_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id) | Reference to baby |
| `weight` | NUMERIC | | Baby's weight (lbs or kg) |
| `height` | NUMERIC | | Baby's height (inches or cm) |
| `date` | DATE | NOT NULL | Date of measurement |

**Relationships:**
- Belongs to `baby`

---

#### Table: `sleep`
Tracks baby's sleep patterns.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `sleep_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id) | Reference to baby |
| `sleep_duration` | VARCHAR | | Duration of sleep (e.g., "2.5 hours") |
| `time_fell_asleep` | TIME | NOT NULL | Time baby fell asleep |
| `date` | DATE | NOT NULL | Date of sleep |

**Relationships:**
- Belongs to `baby`

---

#### Table: `feeding`
Tracks baby's feeding records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `feeding_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id) | Reference to baby |
| `time_fed` | TIME | NOT NULL | Time of feeding |
| `date` | DATE | NOT NULL | Date of feeding |
| `fed_from` | VARCHAR | NOT NULL | Source (e.g., Breast, Bottle, Spoon) |
| `type_of_food` | VARCHAR | NOT NULL | Type (e.g., Formula, Solid Food) |
| `amount` | VARCHAR | | Amount consumed |
| `notes` | TEXT | | Additional notes |

**Relationships:**
- Belongs to `baby`

---

#### Table: `medications`
Tracks medications given to the baby.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `med_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id) | Reference to baby |
| `medication_name` | VARCHAR | NOT NULL | Name of medication |
| `time_taken` | TIME | NOT NULL | Time medication was given |
| `date` | DATE | NOT NULL | Date medication was given |
| `dosage` | VARCHAR | NOT NULL | Dosage administered |
| `symptoms` | TEXT | NOT NULL | Symptoms being treated |

**Relationships:**
- Belongs to `baby`

---

#### Table: `allergies`
Records baby's allergies and sensitivities.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `allergy_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id) | Reference to baby |
| `allergy_name` | VARCHAR | NOT NULL | Name of allergen |
| `severity` | VARCHAR | NOT NULL | Severity (Mild, Moderate, Severe) |
| `epi_pen` | BOOLEAN | NOT NULL | Whether EpiPen is required |
| `notes` | TEXT | | Additional allergy notes |

**Relationships:**
- Belongs to `baby`

---

#### Table: `vaccinations`
Records baby's vaccinations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `vaccine_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id) | Reference to baby |
| `vaccination_name` | VARCHAR | | Name of vaccine (e.g., MMR, DTaP) |
| `date_of_vaccine` | DATE | NOT NULL | Date vaccine was administered |

**Relationships:**
- Belongs to `baby`

---

#### Table: `sick_day`
Tracks baby's sick days and illness records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `sick_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id) | Reference to baby |
| `date` | DATE | NOT NULL | Date of illness |
| `meds_taken` | TEXT | | Medications taken |
| `temp` | NUMERIC | | Temperature (in degrees F or C) |

**Relationships:**
- Belongs to `baby`

---

#### Table: `observation`
Stores parent observations and notes about the baby.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `observation_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id) | Reference to baby |
| `priority_level` | VARCHAR | NOT NULL | Priority (Low, Medium, High, Critical) |
| `notes` | TEXT | | Observation details |

**Relationships:**
- Belongs to `baby`

---

#### Table: `photo_gallery`
Stores metadata for baby photos.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `photo_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id) | Reference to baby |
| `parent_id` | INTEGER | FOREIGN KEY → account(account_id) | Reference to uploading parent |
| `photo_url` | VARCHAR | NOT NULL | URL/path to photo file |
| `caption` | TEXT | | Photo caption/description |
| `uploaded_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp of upload |

**Relationships:**
- Belongs to `baby`
- Belongs to `account` (parent)

**Note:** Actual photo files stored in `/backend/uploads/photos/`

---

#### Table: `babysitter_shares`
Manages babysitter access and sharing permissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `share_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `parent_id` | INTEGER | FOREIGN KEY → account(account_id) | Reference to parent |
| `babysitter_id` | INTEGER | FOREIGN KEY → account(account_id), NULL | Reference to babysitter (null until verified) |
| `babysitter_email` | VARCHAR | | Email of invited babysitter |
| `babysitter_name` | VARCHAR | | Name of babysitter |
| `verification_code` | VARCHAR | | 4-digit verification code |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Whether babysitter has verified |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Share creation timestamp |
| `verified_at` | TIMESTAMP | | Timestamp of verification |
| `expires_at` | TIMESTAMP | | Code expiration (7 days from creation) |

**Relationships:**
- Belongs to `account` (parent)
- Belongs to `account` (babysitter, optional)

**Verification Flow:**
1. Parent creates invitation → `babysitter_id` is NULL
2. Email sent with 4-digit code
3. Babysitter verifies → `babysitter_id` populated, `is_verified` = TRUE

---

#### Table: `shared_tasks`
Stores tasks assigned by parents to babysitters.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `task_id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `share_id` | INTEGER | FOREIGN KEY → babysitter_shares(share_id) | Reference to babysitter share |
| `parent_id` | INTEGER | FOREIGN KEY → account(account_id) | Reference to parent |
| `babysitter_id` | INTEGER | FOREIGN KEY → account(account_id), NULL | Reference to babysitter (nullable) |
| `baby_id` | INTEGER | FOREIGN KEY → baby(baby_id), NULL | Reference to baby (nullable) |
| `task_title` | VARCHAR | | Task title |
| `task_description` | TEXT | | Detailed task description |
| `due_date` | TIMESTAMP | | When task is due |
| `is_completed` | BOOLEAN | DEFAULT FALSE | Completion status |
| `completed_at` | TIMESTAMP | | Timestamp when completed |
| `babysitter_notes` | TEXT | | Notes from babysitter upon completion |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Task creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Task last update timestamp |

**Relationships:**
- Belongs to `babysitter_shares`
- Belongs to `account` (parent)
- Belongs to `account` (babysitter, optional)
- Belongs to `baby` (optional)

---

## Setup & Installation

### Prerequisites

- **Node.js**: v14 or higher
- **PostgreSQL**: v12 or higher
- **Firebase Admin SDK**: Service account credentials

### Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create PostgreSQL database**
   ```bash
   psql -U postgres
   CREATE DATABASE parentpal_db;
   ```

4. **Configure environment variables** (see below)

5. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5001`

---

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=parentpal_db

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Server Configuration (optional)
PORT=5001
```

### Firebase Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Use the downloaded JSON values for environment variables

### Email Setup (Gmail)

1. Enable 2-factor authentication on Gmail
2. Generate app-specific password
3. Use app password for `EMAIL_PASSWORD`

---

## Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Test Files Location

```
backend/__tests__/
└── routes/
    └── sign-in.test.js
```

### Testing Framework

- **Jest** - Testing framework
- **Supertest** - HTTP assertions
- **@faker-js/faker** - Mock data generation

---

## API Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message description"
}
```

### Common Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid data, missing required fields |
| 401 | Unauthorized | Invalid or missing Firebase token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database error, server crash |

---

## Security

### Authentication Flow

1. Client authenticates with Firebase
2. Client receives Firebase ID token
3. Client includes token in Authorization header: `Bearer {token}`
4. Backend verifies token with Firebase Admin SDK
5. Backend retrieves user from database using Firebase UID

### Protected Routes

All routes except `/api/test` require Firebase authentication.

### Data Access Control

- **Parents**: Can only access their own children's data
- **Babysitters**: Can only access children from verified shares
- **Tasks**: Only visible to assigned parent and babysitter

### Email Verification

- 4-digit random verification codes
- Codes expire after 7 days
- One-time use only

---

## File Storage

### Photo Uploads

- **Location**: `/backend/uploads/photos/`
- **Naming**: `{timestamp}-{originalname}`
- **Supported Formats**: jpeg, jpg, png, gif, webp
- **Max Size**: 5MB

### File Cleanup

Photos are automatically deleted from disk when deleted via API.

---

## Database Maintenance

### Cascading Deletes

**When a baby is deleted:**
- All growth records
- All sleep records
- All feeding records
- All medication records
- All allergy records
- All vaccination records
- All sick day records
- All observation records
- All photos (files and database records)

**When an account is deleted:**
- All babies owned by parent (if parent)
- All associated records cascade from babies

### Indexes

Recommended indexes for performance:
- `account.firebase_uid` (unique)
- `baby.parent_id`
- `babysitter_shares.parent_id`
- `babysitter_shares.babysitter_id`
- `shared_tasks.share_id`

---

## Development

### Project Structure

```
backend/
├── routes/              # API route handlers
│   ├── sign-in.js
│   ├── accounts.js
│   ├── babies.js
│   ├── growth.js
│   ├── sleep.js
│   ├── feeding.js
│   ├── meds.js
│   ├── allergies.js
│   ├── vaccinations.js
│   ├── sickday.js
│   ├── observation.js
│   ├── photo-gallery.js
│   ├── babysitter-sharing.js
│   ├── shared-tasks.js
│   └── user.js
├── uploads/             # File uploads
│   └── photos/          # Photo storage
├── __tests__/           # Test files
│   └── routes/
├── db.js                # Database connection pool
├── firebase-admin.js    # Firebase Admin SDK setup
├── server.js            # Express server setup
├── package.json
└── .env                 # Environment variables
```

### Adding New Routes

1. Create route file in `/routes/`
2. Import in `server.js`
3. Mount with `app.use('/api/path', routeHandler)`
4. Add tests in `__tests__/routes/`

---

<div align="center">

**ParentPal Backend API v1.0.0**

© 2025 ParentPal. All rights reserved.

For frontend documentation, see the main [README.md](../README.md)

</div>
