# ParentPal

<div align="center">

![ParentPal Logo](public/images/ParentPal.png)

### A comprehensive childcare management platform for parents and babysitters

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API Reference](#-api-reference)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [User Guide](#-user-guide)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

ParentPal is a modern, full-stack web application that helps parents and babysitters manage childcare responsibilities efficiently. Track your child's health, growth, sleep patterns, feeding schedules, and more while enabling seamless collaboration between caregivers.

### Why ParentPal?

- 🔐 **Secure** - Firebase authentication with role-based access control
- 👶 **Comprehensive** - Complete childcare tracking in one place
- 📊 **Insightful** - Visual analytics and detailed reports
- 🤝 **Collaborative** - Seamless parent-babysitter coordination
- 📱 **Responsive** - Works on any device
- 🚀 **Modern** - Built with latest web technologies

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👨‍👩‍👧 For Parents

- 👶 **Child Profile Management**
  - Multiple children support
  - Comprehensive profiles

- 📊 **Health & Development**
  - Growth tracking with charts
  - Sleep pattern analysis
  - Feeding logs
  - Medication management
  - Allergy tracking
  - Vaccination records

- 📝 **Daily Logging**
  - Observation notes
  - Behavioral tracking
  - Photo gallery

- 📈 **Reports & Analytics**
  - PDF export
  - Visual charts
  - Trend analysis

- 🤝 **Babysitter Coordination**
  - Share access securely
  - Assign tasks
  - Monitor activity

</td>
<td width="50%">

### 👶 For Babysitters

- 👀 **Access Shared Information**
  - View child profiles
  - Health records
  - Parent instructions

- ✅ **Task Management**
  - View assigned tasks
  - Mark as complete
  - Add notes

- 📝 **Activity Logging**
  - Record feedings
  - Log sleep times
  - Document observations
  - Track medications

- 🔔 **Stay Updated**
  - Task reminders
  - Parent notifications
  - Emergency contacts

</td>
</tr>
</table>

---

## 🛠 Technology Stack

### Frontend
```
React 18.3        │ UI Framework
React Router 6.23 │ Navigation
Vite 6.3         │ Build Tool
TailwindCSS 4.1  │ Styling
HeroUI 2.8       │ Components
Recharts 3.3     │ Charts
Axios 1.12       │ HTTP Client
Framer Motion    │ Animations
jsPDF 3.0        │ PDF Export
```

### Backend
```
Node.js          │ Runtime
Express 5.1      │ Web Framework
PostgreSQL       │ Database
Firebase Admin   │ Auth & Messaging
Node-cron        │ Scheduling
```

### Development
```
Jest             │ Testing Framework
React Testing    │ Component Testing
Cypress          │ E2E Testing
ESLint           │ Code Quality
Prettier         │ Formatting
TypeScript       │ Type Safety
```

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ParentPal.git
cd ParentPal

# 2. Install dependencies
npm install
cd backend && npm install && cd ..

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Start PostgreSQL database
# Make sure PostgreSQL is running

# 5. Run migrations
cd backend && npm run migrate && cd ..

# 6. Start the application
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
npm run dev

# 7. Open your browser
# Navigate to http://localhost:5173
```

---

## 📥 Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **PostgreSQL** 13+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Firebase Account** ([Sign up](https://firebase.google.com/))

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/ParentPal.git
cd ParentPal
```

### Step 2: Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Environment Configuration

#### Frontend Environment Variables

Create `.env` in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

#### Backend Environment Variables

Create `backend/.env`:

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=parentpal

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=your_client_email

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
```

### Step 4: Database Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE parentpal;
\q

# Run migrations
cd backend
npm run migrate
cd ..
```

### Step 5: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Enable **Cloud Messaging**
5. Download service account key
6. Add credentials to `backend/.env`

### Step 6: Start the Application

```bash
# Terminal 1 - Start backend server
cd backend
npm start
# Server runs on http://localhost:3000

# Terminal 2 - Start frontend dev server
npm run dev
# App runs on http://localhost:5173
```

### Step 7: Verify Installation

1. Open browser to `http://localhost:5173`
2. You should see the ParentPal login page
3. Create a test account
4. Verify database connectivity

---

## 📖 User Guide

### Getting Started

#### Creating Your Account

1. Navigate to ParentPal in your browser
2. Click **"Create account"**
3. Choose account type:
   - **Parent** - Manage your children's care
   - **Babysitter** - Access shared children
4. Fill in your information:
   - First Name
   - Last Name
   - Email Address
   - Password (min 6 characters)
5. Click **"Create Account"**
6. You'll be redirected to your dashboard

#### First Login

1. Enter your email and password
2. Click **"Log In"**
3. Complete your profile setup
4. Add your first child (Parents)

---

### For Parents

<details>
<summary><b>👶 Managing Children</b></summary>

#### Adding a Child

1. Go to **Dashboard**
2. Click **"Add Child"**
3. Enter information:
   - First Name
   - Last Name
   - Date of Birth
   - Gender
   - Profile Photo (optional)
4. Click **"Save"**

#### Switching Between Children

- Use the dropdown in the navigation bar
- All data automatically filters for selected child

</details>

<details>
<summary><b>📊 Growth Tracking</b></summary>

#### Recording Measurements

1. Navigate to **Growth Tracker**
2. Click **"Add Measurement"**
3. Enter:
   - Date
   - Height (inches or cm)
   - Weight (lbs or kg)
   - Notes (optional)
4. Click **"Save"**

#### Viewing Growth Charts

- Automatic chart generation
- View trends over time
- Compare against percentiles

**Best Practices:**
- Measure monthly for infants
- Same time of day for consistency
- Keep measurements accurate

</details>

<details>
<summary><b>🛌 Sleep Tracking</b></summary>

#### Logging Sleep Sessions

1. Go to **Sleep Analytics**
2. Click **"Add Sleep Session"**
3. Enter:
   - Date
   - Start Time
   - End Time
   - Quality (optional)
   - Notes
4. Click **"Save"**

#### Understanding Sleep Analytics

- Total sleep duration
- Average sleep per day
- Sleep pattern visualization
- Night vs. day sleep breakdown

</details>

<details>
<summary><b>🍼 Feeding Logs</b></summary>

#### Recording Feedings

1. Navigate to **Feeding Notes**
2. Click **"Add Feeding"**
3. Select type:
   - **Breastfeeding** - Left/Right/Both
   - **Bottle** - Amount in oz/ml
   - **Solid Food** - Description
4. Enter time and notes
5. Click **"Save"**

</details>

<details>
<summary><b>💊 Health Journal</b></summary>

#### Medications

1. Click **"Medications"** tab
2. Add medication details:
   - Name, Dosage, Frequency
   - Start/End dates
   - Doctor information
3. Set reminders
4. Mark doses as taken

#### Allergies

1. Click **"Allergies"** tab
2. Add allergen information:
   - Name, Severity
   - Reactions, Symptoms
   - Treatment plan

#### Vaccinations

1. Click **"Vaccinations"** tab
2. Record vaccine details:
   - Vaccine name, Date
   - Provider, Lot number
   - Next due date

#### Sick Days

1. Click **"Sick Days"** tab
2. Log illness details:
   - Symptoms, Temperature
   - Treatment given
   - Doctor visits

</details>

<details>
<summary><b>📝 Observations & Notes</b></summary>

#### Daily Observations

1. Go to **Observation Notes**
2. Click **"Add Observation"**
3. Document:
   - Activity or behavior
   - Mood and temperament
   - Milestones achieved
   - Concerns or questions
4. Add photos if relevant
5. Click **"Save"**

**Example Entries:**
- "First time standing unassisted!"
- "Ate full serving of vegetables"
- "Seemed tired before usual naptime"
- "Very playful and engaging today"

</details>

<details>
<summary><b>📸 Photo Gallery</b></summary>

#### Uploading Photos

1. Navigate to **Photo Gallery**
2. Click **"Upload"**
3. Select photos from device
4. Photos are automatically:
   - Date-stamped
   - Organized by child
   - Securely stored

#### Managing Photos

- View in grid or timeline
- Download originals
- Delete as needed

</details>

<details>
<summary><b>📈 Reports & Export</b></summary>

#### Generating Reports

1. Go to **Reports**
2. Select report type:
   - Growth Report
   - Sleep Analysis
   - Feeding Summary
   - Health Overview
   - Custom Report
3. Choose date range
4. Click **"Generate"**
5. View interactive charts
6. Export to PDF

**Use Cases:**
- Pediatrician appointments
- Insurance documentation
- Personal records
- Family sharing

</details>

<details>
<summary><b>🤝 Sharing with Babysitters</b></summary>

#### Inviting a Babysitter

1. Go to **Settings** → **Shared Accounts**
2. Click **"Invite Babysitter"**
3. Enter:
   - Babysitter's email
   - Select children to share
   - Set permissions:
     - View Only
     - View & Log
     - Full Access
4. Click **"Send Invitation"**

#### Managing Shared Access

- View active babysitters
- Change permissions anytime
- Revoke access
- View activity logs

</details>

<details>
<summary><b>✅ Task Management</b></summary>

#### Creating Tasks

1. Go to **Parent Assigned Tasks**
2. Click **"Create Task"**
3. Enter:
   - Task title
   - Detailed instructions
   - Assign to babysitter
   - Due date/time
   - Priority level
4. Click **"Assign"**

#### Example Tasks

- "Give 2ml medication at 3 PM"
- "Prepare 4oz bottle with formula"
- "30-minute outdoor play"
- "Bath time at 7 PM"
- "Read 2 bedtime stories"

</details>

<details>
<summary><b>⚙️ Settings</b></summary>

#### Personal Information

- Update name and email
- Change password
- Upload profile photo
- Update phone number

#### Notification Preferences

- Email notifications on/off
- Choose notification types:
  - Task reminders
  - Medication alerts
  - Babysitter updates
- Set quiet hours

#### Data Management

- Export all data (PDF/JSON/CSV)
- Delete specific records
- Remove account (permanent)

</details>

---

### For Babysitters

<details>
<summary><b>👀 Viewing Shared Children</b></summary>

#### Accessing Child Information

1. Dashboard shows all shared children
2. Click on a child's card to view:
   - Basic information
   - Health records
   - Medication schedules
   - Allergy information
   - Parent notes
   - Emergency contacts

</details>

<details>
<summary><b>✅ Managing Tasks</b></summary>

#### Viewing Tasks

Tasks are organized by:
- **Today's Tasks**
- **Upcoming**
- **Overdue**
- **Completed**

#### Completing Tasks

1. Click on task
2. Read instructions carefully
3. Perform the task
4. Click **"Mark Complete"**
5. Add notes about completion
6. Parent receives notification

</details>

<details>
<summary><b>📝 Logging Activities</b></summary>

#### Recording Care Activities

You can log:
- Feeding sessions
- Sleep times
- Diaper changes
- Observations
- Medications given (if authorized)

#### Process

1. Select child from dropdown
2. Navigate to appropriate section
3. Enter details accurately
4. Add relevant notes
5. Save entry
6. Parents can view your logs

</details>

<details>
<summary><b>⚠️ Best Practices</b></summary>

#### Do's ✅

- Log activities in real-time
- Read parent instructions thoroughly
- Note any unusual behavior
- Complete tasks on schedule
- Communicate through app
- Keep information confidential

#### Don'ts ❌

- Share login credentials
- Share child information externally
- Make medication decisions without approval
- Ignore allergy warnings
- Forget to mark tasks complete

</details>

---

## 🔌 API Reference

### Base URL

```
Development: http://localhost:3000/api
Production:  https://your-domain.com/api
```

### Authentication

All protected endpoints require Firebase ID token:

```http
Authorization: Bearer <firebase_id_token>
```

### Endpoints Overview

<details>
<summary><b>Authentication Endpoints</b></summary>

#### POST `/api/sign-in`

Sign in user and retrieve account data.

**Request:**
```json
{
  "idToken": "firebase_id_token_here"
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

</details>

<details>
<summary><b>Account Management</b></summary>

#### POST `/api/accounts`
Create new user account

#### GET `/api/user/:firebase_uid`
Get user profile

#### PUT `/api/user/:account_id`
Update user profile

</details>

<details>
<summary><b>Baby Management</b></summary>

#### GET `/api/babies/:parent_id`
Get all babies for a parent

#### POST `/api/babies`
Add new baby

#### PUT `/api/babies/:baby_id`
Update baby information

#### DELETE `/api/babies/:baby_id`
Delete baby record

</details>

<details>
<summary><b>Growth Tracking</b></summary>

#### GET `/api/growth?baby_id=1`
Get growth records

#### POST `/api/growth`
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

#### DELETE `/api/growth/:growth_id`
Delete growth record

</details>

<details>
<summary><b>Sleep Tracking</b></summary>

#### GET `/api/sleep?baby_id=1`
Get sleep records

#### POST `/api/sleep`
Add sleep record

#### DELETE `/api/sleep/:sleep_id`
Delete sleep record

</details>

<details>
<summary><b>Feeding Tracking</b></summary>

#### GET `/api/feeding?baby_id=1`
Get feeding records

#### POST `/api/feeding`
Add feeding record

#### DELETE `/api/feeding/:feeding_id`
Delete feeding record

</details>

<details>
<summary><b>Health Records</b></summary>

#### Medications
- GET `/api/meds?baby_id=1`
- POST `/api/meds`

#### Allergies
- GET `/api/allergies?baby_id=1`
- POST `/api/allergies`

#### Vaccinations
- GET `/api/vaccinations?baby_id=1`
- POST `/api/vaccinations`

#### Sick Days
- GET `/api/sickday?baby_id=1`
- POST `/api/sickday`

</details>

<details>
<summary><b>Babysitter Sharing</b></summary>

#### GET `/api/babysitter-sharing/children/:babysitter_id`
Get children shared with babysitter

#### POST `/api/babysitter-sharing`
Share child with babysitter

#### DELETE `/api/babysitter-sharing/:sharing_id`
Revoke babysitter access

</details>

<details>
<summary><b>Task Management</b></summary>

#### GET `/api/shared-tasks?assignee_id=456`
Get assigned tasks

#### POST `/api/shared-tasks`
Create task

#### PUT `/api/shared-tasks/:task_id`
Update task

#### DELETE `/api/shared-tasks/:task_id`
Delete task

</details>

### Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message",
  "details": "Additional information (optional)"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐
│   account   │
│  (parent)   │
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐
│    baby     │
└──────┬──────┘
       │ 1:N
       ├──────► growth
       ├──────► sleep
       ├──────► feeding
       ├──────► medication
       ├──────► allergy
       ├──────► vaccination
       └──────► observation

┌─────────────┐      ┌─────────────────────┐      ┌─────────────┐
│   account   │      │ babysitter_sharing  │      │   account   │
│  (parent)   │◄─────┤    (junction)       ├─────►│(babysitter) │
└─────────────┘ N:N  └─────────────────────┘ N:N  └─────────────┘
```

### Core Tables

<details>
<summary><b>account</b> - User accounts</summary>

| Column | Type | Description |
|--------|------|-------------|
| account_id | INT (PK) | Primary key |
| firebase_uid | VARCHAR | Firebase UID (unique) |
| account_type | ENUM | 'parent' or 'babysitter' |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| email_address | VARCHAR | Email (unique) |
| created_at | TIMESTAMP | Account creation date |

</details>

<details>
<summary><b>baby</b> - Child profiles</summary>

| Column | Type | Description |
|--------|------|-------------|
| baby_id | INT (PK) | Primary key |
| parent_id | INT (FK) | References account |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| birth_date | DATE | Date of birth |
| gender | ENUM | 'male', 'female', 'other' |
| created_at | TIMESTAMP | Profile creation date |

</details>

<details>
<summary><b>growth</b> - Growth measurements</summary>

| Column | Type | Description |
|--------|------|-------------|
| growth_id | INT (PK) | Primary key |
| baby_id | INT (FK) | References baby |
| date | DATE | Measurement date |
| height | DECIMAL | Height in inches |
| weight | DECIMAL | Weight in pounds |
| notes | TEXT | Optional notes |

</details>

<details>
<summary><b>sleep</b> - Sleep records</summary>

| Column | Type | Description |
|--------|------|-------------|
| sleep_id | INT (PK) | Primary key |
| baby_id | INT (FK) | References baby |
| date | DATE | Sleep date |
| start_time | TIME | Sleep start time |
| end_time | TIME | Sleep end time |
| duration | DECIMAL | Hours slept |
| notes | TEXT | Optional notes |

</details>

<details>
<summary><b>feeding</b> - Feeding logs</summary>

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

</details>

<details>
<summary><b>View all tables</b></summary>

Additional tables:
- `medication` - Medication records
- `allergy` - Allergy information
- `vaccination` - Vaccination records
- `observation` - Daily observations
- `babysitter_sharing` - Sharing relationships
- `shared_task` - Task assignments
- `notification_preference` - Notification settings
- `custom_notification` - Scheduled notifications

[See full schema in detailed documentation →](#)

</details>

---

## 💻 Development

### Project Structure

```
ParentPal/
├── public/              # Static assets
├── src/                 # Frontend source
│   ├── components/      # React components
│   │   ├── auth/       # Authentication
│   │   └── pages/      # Feature pages
│   ├── contexts/       # Context providers
│   ├── hooks/          # Custom hooks
│   ├── firebase/       # Firebase config
│   └── __tests__/      # Frontend tests
├── backend/            # Backend source
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── scheduler/     # Scheduled tasks
│   └── __tests__/     # Backend tests
├── .env               # Environment variables
└── README.md          # This file
```

### Code Style

#### Naming Conventions

```
Components:    PascalCase     ParentDashboard.jsx
Files:         kebab-case     use-baby-data.js
Variables:     camelCase      userData, isLoading
Constants:     UPPER_SNAKE    API_URL
CSS Classes:   kebab-case     .button-primary
```

#### Import Order

```javascript
// 1. External libraries
import React from 'react';
import { useState } from 'react';

// 2. Internal modules
import { useAuth } from '../contexts/AuthContext';

// 3. Components
import Button from '../components/Button';

// 4. Styles
import './styles.css';
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: add feature description"

# Push to remote
git push origin feature/feature-name

# Create pull request for review
```

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code restructure
test:     Add tests
chore:    Maintenance
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Specific test file
npm test -- signin.test.jsx

# With coverage
npm run test:coverage

# Backend tests
cd backend && npm test
```

### Test Coverage

**Current Status:**
- ✅ 155 passing tests
- 📊 ~24% code coverage
- 🎯 Target: 80%+ coverage

**Test Structure:**
```
src/__tests__/
├── components/
│   ├── auth/
│   │   └── signin.test.jsx
│   ├── protected-route.test.jsx
│   └── pages/
│       └── parent-dashboard.test.jsx
├── contexts/
│   ├── AuthContext.test.jsx
│   └── BabyContext.test.jsx
└── hooks/
    └── useBabyData.test.js
```

For detailed testing guide, see [TESTING_SUMMARY.md](./TESTING_SUMMARY.md)

---

## 🚀 Deployment

### Frontend (Firebase Hosting)

```bash
# Build production bundle
npm run build

# Deploy to Firebase
npm run firebase:deploy

# Preview before deploying
npm run firebase:serve
```

### Backend (Production)

#### Option 1: Heroku

```bash
heroku create parentpal-api
heroku config:set DB_HOST=your_host
# Set all environment variables
git push heroku main
```

#### Option 2: VPS (DigitalOcean/AWS)

```bash
# On server
git clone repo
npm install
pm2 start backend/server.js
nginx configuration
ssl certificate setup
```

### Environment Checklist

- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Firebase configuration updated
- [ ] CORS origins configured
- [ ] SSL certificate installed
- [ ] Monitoring enabled
- [ ] Backup strategy implemented

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><b>Firebase Authentication Errors</b></summary>

**Symptoms:**
- "Firebase: Error (auth/...)"
- Unable to sign in

**Solutions:**
1. Verify `.env` Firebase configuration
2. Check Firebase Console settings
3. Ensure Email/Password auth is enabled
4. Verify API keys are correct
5. Check browser console for details

</details>

<details>
<summary><b>API Connection Failed</b></summary>

**Symptoms:**
- "Network Error"
- API requests timeout

**Solutions:**
1. Verify backend server is running
2. Check `VITE_API_URL` in `.env`
3. Verify CORS settings
4. Check browser Network tab
5. Ensure correct ports (3000, 5173)

</details>

<details>
<summary><b>Database Connection Issues</b></summary>

**Symptoms:**
- "Connection refused"
- Database errors

**Solutions:**
1. Verify PostgreSQL is running
2. Check credentials in `backend/.env`
3. Ensure database exists
4. Test: `psql -U user -d parentpal`
5. Check firewall settings

</details>

<details>
<summary><b>Module Not Found</b></summary>

**Solutions:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
npm install
```

</details>

<details>
<summary><b>Build Errors</b></summary>

**Solutions:**
1. Check for TypeScript errors
2. Verify all imports
3. Clear build cache:
   ```bash
   rm -rf dist node_modules/.vite
   npm install
   ```
4. Review error messages

</details>

### Debug Mode

```javascript
// Frontend
localStorage.setItem('debug', 'parentpal:*');

// Backend
DEBUG=* npm start
```

### Getting Help

1. Check [Documentation](#-documentation)
2. Review [GitHub Issues](https://github.com/your-username/ParentPal/issues)
3. Contact: support@parentpal.com

---

## 🔒 Security

### Implemented Security Measures

- ✅ Firebase Authentication with secure tokens
- ✅ Role-based access control
- ✅ HTTPS in production
- ✅ Server-side input validation
- ✅ Parameterized database queries (SQL injection prevention)
- ✅ XSS prevention (React escapes by default)
- ✅ CSRF protection with SameSite cookies
- ✅ Password hashing (handled by Firebase)
- ✅ Environment variable protection
- ✅ CORS restricted origins

### Security Best Practices

- Regular dependency updates
- Security audits performed
- Rate limiting on API endpoints
- File upload validation
- Proper error handling (no info leakage)
- Regular backups
- Monitoring and logging

---

## 📊 Performance

### Optimization Strategies

**Frontend:**
- Code splitting and lazy loading
- Image optimization
- React.memo for expensive components
- Virtual scrolling for large lists

**Backend:**
- Database indexing
- Query optimization
- Connection pooling
- Caching strategy (Redis for future)
- Rate limiting

### Monitoring

- Frontend: Google Analytics, Sentry
- Backend: Application logs, metrics
- Uptime: Monitoring service
- Performance: Lighthouse scores

---

## 🗺 Roadmap

### Version 1.1 (Current)
- [x] Core features implemented
- [x] Testing framework
- [ ] Complete test coverage
- [ ] Performance optimization
- [ ] Enhanced error handling

### Version 2.0 (Planned)
- [ ] Mobile apps (iOS/Android)
- [ ] Real-time collaboration
- [ ] Video calling
- [ ] AI-powered insights
- [ ] Meal planning
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline mode

---

## 👥 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the code style guidelines
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Keep commits atomic and well-described

---

## 📝 License

**Private/Proprietary** - All rights reserved

This software is private and proprietary. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Contact & Support

<div align="center">

**Need Help?**

📧 Email: support@parentpal.com
🌐 Website: [https://parentpals.ca](https://parentpals.ca)
📖 Documentation: This README

---

### Quick Links

[Installation](#-installation) •
[User Guide](#-user-guide) •
[API Docs](#-api-reference) •
[Testing](./TESTING_SUMMARY.md) •
[Troubleshooting](#-troubleshooting)

---

**Made with ❤️ for parents and caregivers everywhere**

Version 1.0.0 | Last Updated: November 1, 2025

© 2025 ParentPal. All rights reserved.

</div>
