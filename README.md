# ParentPal - Complete User Manual & Technical Documentation

<div align="center">

![ParentPal Logo](public/images/ParentPal.png)

**A comprehensive childcare management platform for parents and babysitters**

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

[Features](#features) " [Installation](#installation) " [User Guide](#user-guide) " [API Documentation](#api-documentation) " [Development](#development)

</div>

---

## =� Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Installation & Setup](#installation--setup)
5. [User Guide](#user-guide)
   - [For Parents](#for-parents)
   - [For Babysitters](#for-babysitters)
6. [Feature Documentation](#feature-documentation)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Development Guide](#development-guide)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## < Overview

**ParentPal** is a modern, full-stack web application designed to help parents and babysitters manage childcare responsibilities efficiently. The platform provides comprehensive tracking for baby's health, growth, sleep patterns, feeding schedules, and more, while enabling seamless collaboration between parents and babysitters.

### Key Highlights

- = **Secure Authentication** - Firebase-based authentication with role-based access
- =v **Child Management** - Support for multiple children per account
- =� **Health Tracking** - Growth, sleep, feeding, medications, and vaccinations
- =� **Notes & Observations** - Detailed daily logs and observations
- = **Smart Notifications** - Customizable reminders and alerts
- > **Account Sharing** - Parents can share access with babysitters
- =� **Photo Gallery** - Store and organize baby photos
- =� **Reports & Analytics** - Visual insights into child development
- =� **Responsive Design** - Works on desktop, tablet, and mobile

---

## ( Features

### For Parents

#### =v Child Profile Management
- Add and manage multiple children
- Store essential information (name, date of birth, gender)
- View consolidated dashboard for all children

#### =� Growth & Development Tracking
- **Growth Tracker**: Record height and weight measurements
- **Milestone Tracking**: Document developmental milestones
- **Visual Charts**: View growth trends over time

#### =� Sleep Analytics
- Log sleep sessions with start/end times
- Track total sleep duration
- View sleep patterns and statistics
- Notes section for sleep behavior

#### <| Feeding Management
- Record feeding times and amounts
- Track breastfeeding, bottle feeding, and solid foods
- Monitor feeding patterns
- Set feeding reminders

#### =� Health Journal
- **Medications**: Track prescribed medications and dosages
- **Allergies**: Maintain allergy records
- **Vaccinations**: Keep vaccination history up-to-date
- **Sick Days**: Log illness symptoms and treatments

#### =� Daily Observations
- Document daily activities
- Note behavioral observations
- Track mood and temperament
- Share observations with babysitters

#### =� Photo Gallery
- Upload and organize photos
- Date-stamped memories
- Share with family members

#### =� Reports & Data Export
- Generate comprehensive reports
- Export data to PDF
- View charts and analytics
- Track trends over time

#### � Settings & Preferences
- Manage personal information
- Set notification preferences
- Share account access with babysitters
- Export or delete data

#### > Babysitter Management
- Invite babysitters via email
- Grant/revoke access to specific children
- View babysitter activity logs
- Assign tasks to babysitters

### For Babysitters

#### =@ View Shared Children
- Access profiles of children shared with you
- View all health and care information
- See parent notes and instructions

####  Task Management
- View assigned tasks from parents
- Mark tasks as complete
- Add notes to completed tasks

#### =� Log Care Activities
- Record feeding sessions
- Log sleep times
- Document observations
- Track medications given

#### = Receive Notifications
- Get reminders for scheduled tasks
- Receive updates from parents
- Emergency contact information

---

## =� Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **React Router** | 6.23.0 | Navigation and routing |
| **Vite** | 6.3.5 | Build tool and dev server |
| **HeroUI** | 2.8.3 | Component library |
| **Tailwind CSS** | 4.1.11 | Styling framework |
| **Axios** | 1.12.2 | HTTP client |
| **Recharts** | 3.3.0 | Data visualization |
| **Framer Motion** | 11.18.2 | Animations |
| **jsPDF** | 3.0.3 | PDF generation |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | Runtime environment |
| **Express** | 5.1.0 | Web framework |
| **PostgreSQL** | - | Database (via mysql2 driver) |
| **Firebase Admin** | 13.5.0 | Authentication & messaging |
| **CORS** | 2.8.5 | Cross-origin requests |
| **Node-cron** | - | Scheduled tasks |

### Development & Testing

| Technology | Purpose |
|------------|---------|
| **Jest** | Unit testing framework |
| **React Testing Library** | Component testing |
| **Cypress** | E2E testing |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **TypeScript** | Type checking |

---

## =� Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Firebase** account (for authentication)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ParentPal.git
cd ParentPal
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Configuration

#### Frontend (.env)

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

#### Backend (backend/.env)

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=parentpal

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Email Service (for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail

# Optional: Firebase Storage
FIREBASE_STORAGE_BUCKET=your_bucket_name
```

### 4. Database Setup

#### Create Database

```sql
CREATE DATABASE parentpal;
```

#### Run Migrations

```bash
cd backend
npm run migrate
# or manually run SQL scripts from backend/migrations/
```

#### Database Schema Overview

The database includes tables for:
- `account` - User accounts (parents and babysitters)
- `baby` - Child profiles
- `growth` - Growth measurements
- `sleep` - Sleep records
- `feeding` - Feeding logs
- `medication` - Medication records
- `allergy` - Allergy information
- `vaccination` - Vaccination records
- `observation` - Daily observations
- `babysitter_sharing` - Account sharing relationships
- `shared_task` - Task assignments
- `notification_preference` - User notification settings
- `custom_notification` - Scheduled notifications

### 5. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Enable Cloud Messaging (for notifications)
4. Download service account key and add to backend
5. Configure authorized domains

### 6. Start the Application

#### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
# App runs on http://localhost:5173
```

#### Production Build

```bash
# Build frontend
npm run build

# Serve production build
npm run preview
```

### 7. Verify Installation

1. Open browser to `http://localhost:5173`
2. You should see the ParentPal login page
3. Create a test account to verify database connectivity
4. Check browser console and terminal for any errors

---

## =� User Guide

### Getting Started

#### Creating an Account

1. **Navigate to Sign Up**
   - Open ParentPal in your browser
   - Click "Create account" on the login page

2. **Choose Account Type**
   - Select "Parent" or "Babysitter"
   - Click "Continue"

3. **Enter Your Information**
   - First Name
   - Last Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password

4. **Complete Registration**
   - Click "Create Account"
   - Verify your email (if required)
   - You'll be redirected to your dashboard

#### Logging In

1. Enter your email and password
2. Click "Log In"
3. You'll be directed to your role-specific dashboard

#### Forgot Password

1. Click "Forgot Password?" on login page
2. Enter your email address
3. Check your email for reset link
4. Follow link to create new password

---

## =h
=i
=g
=f For Parents

### Dashboard Overview

After logging in, parents see their **Parent Dashboard** with:

- **Quick Stats**: Number of children, recent activities
- **Feature Cards**: Quick access to all features
- **Recent Updates**: Latest entries across all logs
- **Notifications**: Pending tasks and reminders

### Managing Children

#### Adding a Child

1. Navigate to **Dashboard**
2. Click **"Add Child"** or **Settings � Manage Children**
3. Enter child information:
   - First Name
   - Last Name
   - Date of Birth
   - Gender
   - Optional: Photo
4. Click **"Save"**

#### Selecting Active Child

- Use the **child selector** dropdown in the navigation bar
- All logs and entries will be filtered for the selected child
- Switch between children at any time

### Using Features

#### =� Growth Tracker

**Purpose:** Monitor your child's physical development

**How to Use:**

1. Navigate to **Growth Tracker** from dashboard
2. Click **"Add"** button
3. Enter measurement:
   - Date of measurement
   - Height (in inches or cm)
   - Weight (in lbs or kg)
   - Optional: Notes
4. Click **"Save"**
5. View measurements in chronological list
6. See growth chart visualization

**Tips:**
- Record measurements monthly for infants
- Use same time of day for consistency
- Consult with pediatrician about growth percentiles

#### =� Sleep Analytics

**Purpose:** Track and analyze sleep patterns

**How to Use:**

1. Navigate to **Sleep Analytics**
2. Click **"Add Sleep Session"**
3. Enter details:
   - Date
   - Start Time
   - End Time (or mark "Currently Sleeping")
   - Sleep Quality (optional)
   - Notes (e.g., "Woke up crying")
4. Click **"Save"**
5. View sleep statistics:
   - Total sleep time
   - Average sleep duration
   - Sleep patterns chart

**Tips:**
- Log naps and nighttime sleep separately
- Note any disruptions or wake-ups
- Look for patterns over weeks

#### <| Feeding Notes

**Purpose:** Record and track feeding schedule

**How to Use:**

1. Navigate to **Feeding Notes**
2. Click **"Add Feeding"**
3. Select feeding type:
   - **Breastfeeding**: Left/Right/Both
   - **Bottle**: Amount in oz/ml
   - **Solid Food**: Type and amount
4. Enter:
   - Date and Time
   - Duration or Amount
   - Notes
5. Click **"Save"**
6. View feeding history and patterns

**Tips:**
- Track immediately to avoid forgetting
- Note baby's appetite and reactions
- Share with pediatrician for consultations

#### =� Health Journal

**Purpose:** Comprehensive health record management

**Features:**

##### Medications
1. Click **"Medications"** tab
2. Click **"Add Medication"**
3. Enter:
   - Medication Name
   - Dosage
   - Frequency
   - Start Date
   - End Date (optional)
   - Prescribing Doctor
   - Notes
4. Set reminders if needed
5. Mark doses as "Taken"

##### Allergies
1. Click **"Allergies"** tab
2. Click **"Add Allergy"**
3. Enter:
   - Allergen Name
   - Severity (Mild/Moderate/Severe)
   - Reaction Symptoms
   - Diagnosed Date
   - Treatment
4. Mark as **Active** or **Resolved**

##### Vaccinations
1. Click **"Vaccinations"** tab
2. Click **"Add Vaccination"**
3. Enter:
   - Vaccine Name
   - Date Administered
   - Healthcare Provider
   - Lot Number
   - Next Due Date
   - Reactions (if any)
4. Upload vaccine card (optional)

##### Sick Days
1. Click **"Sick Days"** tab
2. Click **"Log Sick Day"**
3. Enter:
   - Date
   - Symptoms
   - Temperature
   - Treatment Given
   - Doctor Visit (Y/N)
   - Notes
4. Track recovery progress

**Tips:**
- Keep Health Journal updated for emergencies
- Share with babysitters for medication timing
- Bring to pediatrician appointments

#### =� Observation Notes

**Purpose:** Document daily activities and behaviors

**How to Use:**

1. Navigate to **Observation Notes**
2. Click **"Add Observation"**
3. Enter:
   - Date and Time
   - Activity/Behavior
   - Context
   - Child's Mood
   - Detailed Notes
4. Add photos if relevant
5. Click **"Save"**

**Examples:**
- "First time rolling over!"
- "Tried peas today - made funny face"
- "Seemed fussy before nap"
- "Played with blocks for 20 minutes"

**Tips:**
- Document milestones and firsts
- Note patterns in behavior
- Share with babysitters for consistency

#### =� Photo Gallery

**Purpose:** Store and organize memories

**How to Use:**

1. Navigate to **Photo Gallery**
2. Click **"Upload Photos"**
3. Select photos from device
4. Photos are automatically:
   - Date-stamped
   - Organized by child
   - Backed up securely
5. View in grid or timeline view
6. Download or share photos

**Tips:**
- Upload regularly to track growth visually
- Add captions to photos
- Create albums for special events

#### =� Reports

**Purpose:** Generate comprehensive care reports

**How to Use:**

1. Navigate to **Reports**
2. Select report type:
   - **Growth Report**: Height/weight trends
   - **Sleep Report**: Sleep patterns analysis
   - **Feeding Report**: Feeding statistics
   - **Health Summary**: Complete health overview
   - **Custom Report**: Select specific data
3. Choose date range
4. Click **"Generate Report"**
5. View interactive charts
6. Export to PDF

**Use Cases:**
- Pediatrician appointments
- Sharing with family
- Personal records
- Insurance documentation

#### > Sharing with Babysitters

**Purpose:** Grant babysitters access to child information

**How to Share:**

1. Navigate to **Settings � Shared Accounts**
2. Click **"Invite Babysitter"**
3. Enter:
   - Babysitter's Email
   - Select Child(ren) to share
   - Set permissions:
     - View Only
     - View & Log
     - Full Access
4. Click **"Send Invitation"**
5. Babysitter receives email invitation
6. Once accepted, they can:
   - View shared child profiles
   - Log activities (if permitted)
   - See health information
   - Receive assigned tasks

**Managing Access:**
- View active shared accounts
- Revoke access anytime
- Change permissions
- View activity log

####  Assigning Tasks

**Purpose:** Create task lists for babysitters

**How to Assign Tasks:**

1. Navigate to **Parent Assigned Tasks**
2. Click **"Create Task"**
3. Enter:
   - Task Title (e.g., "Give lunch at noon")
   - Description/Instructions
   - Assign to Babysitter
   - Due Date/Time
   - Priority (High/Medium/Low)
   - Repeat (Daily/Weekly/Once)
4. Click **"Assign"**
5. Babysitter receives notification
6. Track task completion

**Example Tasks:**
- "Give medication at 3 PM"
- "Prepare bottle with 4 oz formula"
- "Take to playground"
- "Bath time at 7 PM"
- "Read bedtime story"

### Settings

#### Personal Information

1. Navigate to **Settings � Personal Information**
2. Update:
   - Name
   - Email
   - Phone Number
   - Profile Photo
   - Password
3. Click **"Save Changes"**

#### Notification Preferences

1. Navigate to **Settings � Notifications**
2. Configure:
   - Email Notifications (On/Off)
   - Push Notifications (On/Off)
   - Notification Types:
     - Task Reminders
     - Medication Reminders
     - Babysitter Updates
     - Growth Milestones
3. Set quiet hours
4. Click **"Save"**

#### Data Export

1. Navigate to **Settings � Data Export**
2. Select data to export:
   - All Data
   - Specific Category
   - Date Range
3. Choose format:
   - PDF Report
   - JSON Data
   - CSV Spreadsheet
4. Click **"Export"**
5. Download file

#### Account Management

- **Change Password**: Settings � Security
- **Delete Account**: Settings � Account � Delete
  - Warning: This permanently deletes all data
  - Confirmation required
  - Shared data is removed from babysitters' access

---

## =v For Babysitters

### Dashboard Overview

Babysitters see the **Babysitter Dashboard** with:

- **Shared Children**: Profiles of children shared with you
- **Assigned Tasks**: Tasks from parents
- **Recent Logs**: Your recent activity entries
- **Quick Actions**: Fast access to logging features

### Viewing Shared Children

1. Dashboard shows all children shared with you
2. Click on a child's card to view:
   - Basic Information
   - Health Records (allergies, medications)
   - Feeding Schedule
   - Sleep Schedule
   - Parent Notes and Instructions
   - Emergency Contacts

### Managing Tasks

#### Viewing Assigned Tasks

1. Navigate to **Assigned Tasks**
2. See tasks organized by:
   - **Today's Tasks**
   - **Upcoming**
   - **Overdue**
   - **Completed**
3. Each task shows:
   - Title and description
   - Due date/time
   - Priority
   - Instructions from parent

#### Completing Tasks

1. Click on a task
2. Read instructions carefully
3. Perform the task
4. Click **"Mark as Complete"**
5. Optionally add notes:
   - What you did
   - Any issues
   - Child's reaction
6. Parent receives notification

### Logging Activities

#### Recording Feeding

1. Select child from dropdown
2. Navigate to **Feeding Notes**
3. Click **"Add Feeding"**
4. Enter details as instructed by parent
5. Click **"Save"**
6. Entry appears in child's log
7. Parent can view your entry

#### Recording Sleep

1. Navigate to **Sleep Analytics**
2. Click **"Add Sleep Session"**
3. Enter sleep times
4. Add any relevant notes
5. Click **"Save"**

#### Adding Observations

1. Navigate to **Observation Notes**
2. Click **"Add Observation"**
3. Document:
   - Activities
   - Behavior
   - Mood
   - Any concerns
4. Click **"Save"**
5. Parents can see your observations

### Best Practices for Babysitters

 **Do:**
- Log activities in real-time
- Read parent instructions carefully
- Note any unusual behavior
- Complete assigned tasks on time
- Communicate through the app
- Keep health information confidential

L **Don't:**
- Share login credentials
- Share child information outside app
- Make decisions about medications without parent approval
- Ignore allergy information
- Forget to mark tasks complete

### Emergency Situations

1. **Medical Emergency**:
   - Call 911 first
   - Then contact parent
   - Reference allergy/medication info in app

2. **Parent Contact**:
   - Phone number in child profile
   - Emergency contacts listed
   - Use in-app messaging if available

---

## =' Feature Documentation

### Authentication System

**Technology:** Firebase Authentication

**Features:**
- Email/Password authentication
- Password reset via email
- Secure token-based sessions
- Role-based access control (Parent/Babysitter)

**Protected Routes:**
- All dashboard and feature routes require authentication
- Automatic redirect to login if session expires
- Token refresh for long sessions

### State Management

**Global State:**
- `AuthContext`: User authentication state
- `BabyContext`: Selected baby and baby list
- Firebase user state

**Local State:**
- Component-specific state with React hooks
- Form state management
- Modal and UI state

### Data Flow

```
User Action � Frontend Component � API Request � Backend Route �
Database Query � Response � State Update � UI Re-render
```

### File Upload System

**Supported:**
- Photo uploads for gallery
- Vaccine card images
- Profile photos

**Storage:**
- Backend `/uploads` directory
- File size limits enforced
- Image optimization

### Notification System

**Types:**
1. **Email Notifications**
   - Account invitations
   - Password reset
   - Task assignments
   - Scheduled reminders

2. **In-App Notifications** (Future)
   - Real-time updates
   - Task reminders
   - Activity alerts

3. **Push Notifications** (Future)
   - Mobile app notifications
   - Browser push notifications

**Scheduler:**
- Node-cron for scheduled tasks
- Medication reminders
- Task due date alerts
- Custom scheduled notifications

---

## = API Documentation

### Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Authentication

Most endpoints require authentication via Firebase ID token:

```http
Authorization: Bearer <firebase_id_token>
```

### API Endpoints

#### Authentication

##### POST `/api/sign-in`
Sign in user and retrieve account data

**Request:**
```json
{
  "idToken": "firebase_id_token"
}
```

**Response:**
```json
{
  "user": {
    "account_id": "123",
    "firebase_uid": "abc...",
    "account_type": "parent",
    "first_name": "John",
    "last_name": "Doe",
    "email_address": "john@example.com"
  },
  "babyData": [
    {
      "baby_id": "1",
      "first_name": "Emma",
      "last_name": "Doe",
      "birth_date": "2023-01-15",
      "gender": "female"
    }
  ]
}
```

#### Account Management

##### POST `/api/accounts`
Create new user account

**Request:**
```json
{
  "firebase_uid": "abc...",
  "account_type": "parent",
  "first_name": "John",
  "last_name": "Doe",
  "email_address": "john@example.com"
}
```

##### GET `/api/user/:firebase_uid`
Get user profile

##### PUT `/api/user/:account_id`
Update user profile

#### Baby Management

##### GET `/api/babies/:parent_id`
Get all babies for a parent

##### POST `/api/babies`
Add new baby

**Request:**
```json
{
  "parent_id": "123",
  "first_name": "Emma",
  "last_name": "Doe",
  "birth_date": "2023-01-15",
  "gender": "female"
}
```

##### PUT `/api/babies/:baby_id`
Update baby information

##### DELETE `/api/babies/:baby_id`
Delete baby record

#### Growth Tracking

##### GET `/api/growth?baby_id=1`
Get growth records for baby

##### POST `/api/growth`
Add growth record

**Request:**
```json
{
  "baby_id": "1",
  "date": "2024-01-15",
  "height": 30.5,
  "weight": 15.2,
  "notes": "Regular checkup"
}
```

##### DELETE `/api/growth/:growth_id`
Delete growth record

#### Sleep Tracking

##### GET `/api/sleep?baby_id=1`
Get sleep records

##### POST `/api/sleep`
Add sleep record

**Request:**
```json
{
  "baby_id": "1",
  "date": "2024-01-15",
  "start_time": "20:00",
  "end_time": "06:00",
  "duration": 10,
  "notes": "Slept through the night"
}
```

##### DELETE `/api/sleep/:sleep_id`
Delete sleep record

#### Feeding Tracking

##### GET `/api/feeding?baby_id=1`
Get feeding records

##### POST `/api/feeding`
Add feeding record

**Request:**
```json
{
  "baby_id": "1",
  "date": "2024-01-15",
  "time": "10:30",
  "type": "bottle",
  "amount": 4,
  "unit": "oz",
  "notes": "Fed well"
}
```

##### DELETE `/api/feeding/:feeding_id`
Delete feeding record

#### Health Records

##### GET `/api/meds?baby_id=1`
Get medication records

##### POST `/api/meds`
Add medication

##### GET `/api/allergies?baby_id=1`
Get allergies

##### POST `/api/allergies`
Add allergy

##### GET `/api/vaccinations?baby_id=1`
Get vaccinations

##### POST `/api/vaccinations`
Add vaccination

##### GET `/api/sickday?baby_id=1`
Get sick day records

##### POST `/api/sickday`
Log sick day

#### Observations

##### GET `/api/observation?baby_id=1`
Get observations

##### POST `/api/observation`
Add observation

**Request:**
```json
{
  "baby_id": "1",
  "date": "2024-01-15",
  "time": "14:30",
  "activity": "playing",
  "notes": "Very active and happy today",
  "mood": "happy"
}
```

##### DELETE `/api/observation/:observation_id`
Delete observation

#### Babysitter Sharing

##### GET `/api/babysitter-sharing/children/:babysitter_id`
Get children shared with babysitter

##### POST `/api/babysitter-sharing`
Share child with babysitter

**Request:**
```json
{
  "parent_id": "123",
  "babysitter_email": "sitter@example.com",
  "baby_id": "1",
  "permissions": "view_and_log"
}
```

##### DELETE `/api/babysitter-sharing/:sharing_id`
Revoke babysitter access

#### Task Management

##### GET `/api/shared-tasks?assignee_id=456`
Get assigned tasks

##### POST `/api/shared-tasks`
Create task

**Request:**
```json
{
  "parent_id": "123",
  "assignee_id": "456",
  "baby_id": "1",
  "title": "Give medication",
  "description": "2ml at 3 PM",
  "due_date": "2024-01-15",
  "due_time": "15:00",
  "priority": "high"
}
```

##### PUT `/api/shared-tasks/:task_id`
Update task (mark complete, etc.)

##### DELETE `/api/shared-tasks/:task_id`
Delete task

#### Photo Gallery

##### GET `/api/photo-gallery?baby_id=1`
Get photos

##### POST `/api/photo-gallery`
Upload photo (multipart/form-data)

##### DELETE `/api/photo-gallery/:photo_id`
Delete photo

#### Notifications

##### GET `/api/notification-preferences/:account_id`
Get notification settings

##### PUT `/api/notification-preferences/:account_id`
Update notification settings

##### POST `/api/send-notification`
Send custom notification

### Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message",
  "details": "Additional information (optional)"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## =� Database Schema

### Tables Overview

#### `account`
User accounts (parents and babysitters)

| Column | Type | Description |
|--------|------|-------------|
| account_id | INT (PK) | Primary key |
| firebase_uid | VARCHAR | Firebase auth UID |
| account_type | ENUM | 'parent' or 'babysitter' |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| email_address | VARCHAR | Email (unique) |
| created_at | TIMESTAMP | Creation date |

#### `baby`
Child profiles

| Column | Type | Description |
|--------|------|-------------|
| baby_id | INT (PK) | Primary key |
| parent_id | INT (FK) | References account |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| birth_date | DATE | Date of birth |
| gender | ENUM | 'male', 'female', 'other' |
| created_at | TIMESTAMP | Creation date |

#### `growth`
Growth measurements

| Column | Type | Description |
|--------|------|-------------|
| growth_id | INT (PK) | Primary key |
| baby_id | INT (FK) | References baby |
| date | DATE | Measurement date |
| height | DECIMAL | Height in inches |
| weight | DECIMAL | Weight in pounds |
| notes | TEXT | Optional notes |

#### `sleep`
Sleep records

| Column | Type | Description |
|--------|------|-------------|
| sleep_id | INT (PK) | Primary key |
| baby_id | INT (FK) | References baby |
| date | DATE | Sleep date |
| start_time | TIME | Sleep start |
| end_time | TIME | Sleep end |
| duration | DECIMAL | Hours slept |
| notes | TEXT | Optional notes |

#### `feeding`
Feeding logs

| Column | Type | Description |
|--------|------|-------------|
| feeding_id | INT (PK) | Primary key |
| baby_id | INT (FK) | References baby |
| date | DATE | Feeding date |
| time | TIME | Feeding time |
| type | ENUM | 'breast', 'bottle', 'solid' |
| amount | DECIMAL | Amount (if applicable) |
| unit | VARCHAR | 'oz', 'ml', etc. |
| notes | TEXT | Optional notes |

#### `medication`
Medication records

| Column | Type | Description |
|--------|------|-------------|
| medication_id | INT (PK) | Primary key |
| baby_id | INT (FK) | References baby |
| medication_name | VARCHAR | Med name |
| dosage | VARCHAR | Dosage info |
| frequency | VARCHAR | How often |
| start_date | DATE | Start date |
| end_date | DATE | End date (optional) |
| prescribing_doctor | VARCHAR | Doctor name |
| notes | TEXT | Additional info |

#### `allergy`
Allergy information

| Column | Type | Description |
|--------|------|-------------|
| allergy_id | INT (PK) | Primary key |
| baby_id | INT (FK) | References baby |
| allergen | VARCHAR | Allergen name |
| severity | ENUM | 'mild', 'moderate', 'severe' |
| reaction | TEXT | Symptoms |
| diagnosed_date | DATE | When diagnosed |
| status | ENUM | 'active', 'resolved' |

#### `vaccination`
Vaccination records

| Column | Type | Description |
|--------|------|-------------|
| vaccination_id | INT (PK) | Primary key |
| baby_id | INT (FK) | References baby |
| vaccine_name | VARCHAR | Vaccine name |
| date_administered | DATE | When given |
| healthcare_provider | VARCHAR | Provider |
| lot_number | VARCHAR | Lot # |
| next_due_date | DATE | Next dose |
| reactions | TEXT | Side effects |

#### `observation`
Daily observations

| Column | Type | Description |
|--------|------|-------------|
| observation_id | INT (PK) | Primary key |
| baby_id | INT (FK) | References baby |
| date | DATE | Observation date |
| time | TIME | Time of day |
| activity | VARCHAR | Activity type |
| mood | VARCHAR | Child's mood |
| notes | TEXT | Detailed notes |
| logged_by | INT (FK) | References account |

#### `babysitter_sharing`
Account sharing relationships

| Column | Type | Description |
|--------|------|-------------|
| sharing_id | INT (PK) | Primary key |
| parent_id | INT (FK) | References account (parent) |
| babysitter_id | INT (FK) | References account (babysitter) |
| baby_id | INT (FK) | References baby |
| permissions | VARCHAR | Access level |
| created_at | TIMESTAMP | Share date |

#### `shared_task`
Task assignments

| Column | Type | Description |
|--------|------|-------------|
| task_id | INT (PK) | Primary key |
| parent_id | INT (FK) | Task creator |
| assignee_id | INT (FK) | Assigned to |
| baby_id | INT (FK) | Related baby |
| title | VARCHAR | Task title |
| description | TEXT | Task details |
| due_date | DATE | Due date |
| due_time | TIME | Due time |
| priority | ENUM | 'low', 'medium', 'high' |
| status | ENUM | 'pending', 'completed' |
| completed_at | TIMESTAMP | Completion time |
| completed_notes | TEXT | Notes on completion |

### Database Relationships

```
account (parent)
    � (1:N)
baby
    � (1:N)
   growth
   sleep
   feeding
   medication
   allergy
   vaccination
   observation

account (parent) �� account (babysitter)
        � (N:N)
   babysitter_sharing
        �
      baby

account (parent) � shared_task � account (babysitter)
```

---

## =� Development Guide

### Project Structure

```
ParentPal/
   public/                  # Static assets
      images/             # Images and logos
   src/                    # Frontend source code
      components/         # React components
         auth/          # Authentication components
            sign-in/
            register/
         pages/         # Feature pages
             dashboard/
             growth/
             sleep/
             health/
             notes/
             photo-gallery/
             reports/
             settings/
      contexts/          # React Context providers
         AuthContext.jsx
         BabyContext.jsx
      hooks/             # Custom React hooks
         useBabyData.js
      firebase/          # Firebase configuration
         firebaseAuth.js
         firebaseMessaging.js
      config/            # Configuration files
         api.js
      styles/            # CSS files
         globals.css
         design-system.css
      __tests__/         # Test files
      App.jsx            # Main app component
      main.jsx           # Entry point
   backend/               # Backend source code
      routes/           # API route handlers
         accounts.js
         sign-in.js
         babies.js
         growth.js
         sleep.js
         feeding.js
         meds.js
         allergies.js
         vaccinations.js
         observation.js
         babysitter-sharing.js
         shared-tasks.js
         photo-gallery.js
         ...
      services/         # Business logic services
         emailService.js
         notificationService.js
      scheduler/        # Scheduled tasks
         notificationScheduler.js
      __tests__/        # Backend tests
      server.js         # Express server
      db.js            # Database connection
      firebase-admin.js # Firebase Admin SDK
   .env                  # Environment variables
   package.json          # Dependencies
   vite.config.js       # Vite configuration
   jest.config.js       # Jest configuration
   tailwind.config.js   # Tailwind configuration
   TESTING_SUMMARY.md   # Testing documentation
   README.md            # This file
```

### Code Style Guidelines

#### JavaScript/React

```javascript
// Use functional components with hooks
function MyComponent() {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return <div>Content</div>;
}

// Use descriptive names
const handleSubmit = () => { };
const isLoading = false;
const userData = {};

// Destructure props
function Component({ title, onClose }) {
  return <div>{title}</div>;
}
```

#### Naming Conventions

- **Components**: PascalCase (`ParentDashboard.jsx`)
- **Files**: kebab-case (`use-baby-data.js`)
- **Variables**: camelCase (`userData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **CSS Classes**: kebab-case (`.button-primary`)

#### Import Order

```javascript
// 1. External libraries
import React from 'react';
import { useState } from 'react';

// 2. Internal modules
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

// 3. Components
import Button from '../components/Button';

// 4. Styles
import './styles.css';
```

### Adding New Features

#### Frontend Feature

1. **Create Component**
   ```bash
   src/components/pages/new-feature/NewFeature.jsx
   ```

2. **Add Route**
   ```javascript
   // In App.jsx
   <Route
     path="/new-feature"
     element={
       <ProtectedRoute>
         <NewFeature />
       </ProtectedRoute>
     }
   />
   ```

3. **Add Navigation**
   ```javascript
   // In appropriate dashboard or navbar
   <Link to="/new-feature">New Feature</Link>
   ```

4. **Create Tests**
   ```bash
   src/__tests__/components/pages/new-feature.test.jsx
   ```

#### Backend Endpoint

1. **Create Route File**
   ```javascript
   // backend/routes/new-feature.js
   const express = require('express');
   const router = express.Router();
   const pool = require('../db');

   router.get('/', async (req, res) => {
     // Implementation
   });

   module.exports = router;
   ```

2. **Register Route**
   ```javascript
   // In backend/server.js
   const newFeatureRouter = require('./routes/new-feature');
   app.use('/api/new-feature', newFeatureRouter);
   ```

3. **Add Database Table** (if needed)
   ```sql
   -- Create migration file
   CREATE TABLE new_feature (
     id INT PRIMARY KEY AUTO_INCREMENT,
     -- columns
   );
   ```

4. **Create Tests**
   ```javascript
   // backend/__tests__/routes/new-feature.test.js
   ```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push origin feature/new-feature-name

# Create pull request
# After review and approval, merge to main
```

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug description
docs: Update documentation
style: Format code
refactor: Refactor component
test: Add tests
chore: Update dependencies
```

---

## >� Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- signin.test.jsx

# Run with coverage
npm run test:coverage

# Run backend tests
cd backend
npm test
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Key user flows
- **E2E Tests**: Critical paths

### Writing Tests

See [TESTING_SUMMARY.md](./TESTING_SUMMARY.md) for:
- Testing patterns
- Test templates
- Best practices
- Coverage reports

### Current Test Status

- **155 passing tests**
- **~24% code coverage**
- See detailed breakdown in TESTING_SUMMARY.md

---

## =� Deployment

### Frontend Deployment (Firebase Hosting)

```bash
# Build production bundle
npm run build

# Deploy to Firebase
npm run firebase:deploy

# Preview before deploying
npm run firebase:serve
```

### Backend Deployment

#### Option 1: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create parentpal-api

# Set environment variables
heroku config:set DB_HOST=your_db_host
heroku config:set DB_PASSWORD=your_db_password
# ... set all env vars

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Option 2: DigitalOcean/AWS

1. Set up server (Ubuntu recommended)
2. Install Node.js and PostgreSQL
3. Clone repository
4. Install dependencies
5. Configure environment variables
6. Set up process manager (PM2)
7. Configure nginx as reverse proxy
8. Set up SSL certificate (Let's Encrypt)

#### Database Migration

```bash
# Backup production database
pg_dump -U username dbname > backup.sql

# Run migrations
npm run migrate

# Verify
psql -U username -d dbname -c "SELECT * FROM schema_version;"
```

### Environment Variables for Production

Ensure all production environment variables are set:

- Database credentials
- Firebase admin credentials
- Email service credentials
- API URLs
- Allowed origins for CORS

### Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Firebase configuration updated
- [ ] CORS origins configured
- [ ] SSL certificate installed
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security audit performed

---

## = Troubleshooting

### Common Issues

#### "Firebase: Error (auth/...)"

**Problem**: Firebase authentication errors

**Solutions:**
- Check Firebase configuration in `.env`
- Verify Firebase project settings
- Ensure email/password auth is enabled
- Check browser console for specific error
- Verify API keys are correct

#### "Network Error" / API Not Responding

**Problem**: Frontend can't connect to backend

**Solutions:**
- Verify backend server is running
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend
- Check network tab in browser DevTools
- Ensure ports 3000 (backend) and 5173 (frontend) are open

#### Database Connection Failed

**Problem**: Backend can't connect to database

**Solutions:**
- Verify database is running
- Check database credentials in `.env`
- Ensure database exists
- Test connection: `psql -U username -d dbname`
- Check firewall settings

#### "Module not found"

**Problem**: Missing dependencies

**Solutions:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or clear npm cache
npm cache clean --force
npm install
```

#### Tests Failing

**Problem**: Test suite has errors

**Solutions:**
- Clear Jest cache: `npm test -- --clearCache`
- Check mock configurations
- Verify test environment variables
- See TESTING_SUMMARY.md for patterns

#### Build Errors

**Problem**: `npm run build` fails

**Solutions:**
- Check for TypeScript errors
- Verify all imports are correct
- Clear build cache: `rm -rf dist node_modules/.vite`
- Check for circular dependencies
- Review error messages in terminal

### Debug Mode

Enable debug logging:

```javascript
// Frontend
localStorage.setItem('debug', 'parentpal:*');

// Backend
DEBUG=* npm start
```

### Getting Help

1. **Check Documentation**: README.md and TESTING_SUMMARY.md
2. **Review Issues**: Check GitHub issues
3. **Contact Support**: [your-email@example.com]
4. **Community**: [Discord/Slack link if applicable]

---

## =� Performance Optimization

### Frontend Performance

- **Code Splitting**: Routes are lazy-loaded
- **Image Optimization**: Compress images before upload
- **Memoization**: Use React.memo for expensive components
- **Virtual Scrolling**: For large lists (react-window)
- **Bundle Analysis**: `npm run build -- --analyze`

### Backend Performance

- **Database Indexing**: Add indexes to frequently queried columns
- **Query Optimization**: Use EXPLAIN ANALYZE
- **Connection Pooling**: PostgreSQL connection pool
- **Caching**: Implement Redis for frequently accessed data
- **Rate Limiting**: Prevent API abuse

### Monitoring

- **Frontend**: Google Analytics, Sentry
- **Backend**: Application logs, database metrics
- **Uptime**: UptimeRobot or similar
- **Performance**: Lighthouse scores

---

## = Security

### Best Practices Implemented

-  **Authentication**: Firebase Auth with secure tokens
-  **Authorization**: Role-based access control
-  **HTTPS**: SSL certificates in production
-  **Input Validation**: Server-side validation
-  **SQL Injection Prevention**: Parameterized queries
-  **XSS Prevention**: React escapes by default
-  **CSRF Protection**: SameSite cookies
-  **Password Security**: Firebase handles hashing
-  **Environment Variables**: Sensitive data not in code
-  **CORS**: Restricted origins

### Security Checklist

- [ ] All API endpoints validate input
- [ ] Database queries use parameterized statements
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced in production
- [ ] Security headers configured
- [ ] Dependencies regularly updated
- [ ] Security audit performed
- [ ] Rate limiting implemented
- [ ] File upload validation
- [ ] Proper error messages (no info leakage)

---

## =� License

**Private/Proprietary** - All rights reserved

This software is private and proprietary. Unauthorized copying, distribution, or use is strictly prohibited.

---

## =e Contributors

- **Braeden Lyman** - Lead Developer

---

## =� Support

For support, questions, or feedback:

- **Email**: support@parentpal.com
- **Website**: https://parentpals.ca
- **Documentation**: This README.md file

---

## =� Roadmap

### Version 2.0 (Planned)

- [ ] Mobile apps (iOS/Android)
- [ ] Real-time collaboration
- [ ] Video calling with babysitters
- [ ] AI-powered insights
- [ ] Meal planning
- [ ] Immunization reminders
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline mode
- [ ] Export to pediatrician portal

### Version 1.1 (In Progress)

- [x] Basic features implemented
- [x] Testing framework
- [ ] Complete test coverage
- [ ] Performance optimization
- [ ] Enhanced error handling
- [ ] Improved UI/UX

---

## =O Acknowledgments

- **React Team** - For the amazing framework
- **Firebase** - For authentication and hosting
- **HeroUI** - For beautiful components
- **PostgreSQL** - For reliable database
- **All Contributors** - For testing and feedback

---

## =� Additional Resources

### External Documentation

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Documentation](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Internal Documentation

- [TESTING_SUMMARY.md](./TESTING_SUMMARY.md) - Complete testing guide
- API documentation (above in this file)
- Database schema (above in this file)

---

## <� Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start frontend dev server
cd backend && npm start  # Start backend server

# Testing
npm test                 # Run tests
npm run test:coverage    # Coverage report

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment
npm run firebase:deploy  # Deploy frontend
```

### Important URLs

- **Frontend (Dev)**: http://localhost:5173
- **Backend (Dev)**: http://localhost:3000
- **Frontend (Prod)**: https://parent-pal-86b9a.web.app
- **Backend (Prod)**: https://your-api-domain.com

### Key Files

- `src/App.jsx` - Main app component and routes
- `src/main.jsx` - Application entry point
- `backend/server.js` - Express server setup
- `backend/db.js` - Database configuration
- `.env` - Environment variables (not in git)

---

<div align="center">

**Made with d for parents and caregivers everywhere**

Version 1.0.0 | Last Updated: October 31, 2025

</div>
