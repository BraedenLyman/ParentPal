# ParentPal

<div align="center">

![ParentPal Logo](public/images/ParentPal.png)

### A comprehensive childcare management platform for parents and babysitters

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
  - [For Parents](#for-parents)
  - [For Babysitters](#for-babysitters)
- [Getting Started](#-getting-started)
  - [Account Setup](#account-setup)
- [User Guide](#-user-guide)
  - [Parent Dashboard](#parent-dashboard)
  - [Managing Children](#managing-children)
  - [Health Journal](#health-journal)
  - [Growth Tracker](#growth-tracker)
  - [Sleep Analytics](#sleep-analytics)
  - [Feeding Notes](#feeding-notes)
  - [Observation Notes](#observation-notes)
  - [Photo Gallery](#photo-gallery)
  - [Sharing with Babysitters](#sharing-with-babysitters)
  - [Task Management](#task-management)
- [Babysitter Guide](#-babysitter-guide)
  - [Getting Started](#getting-started-as-a-babysitter)
  - [Viewing Children](#viewing-children)
  - [Managing Tasks](#managing-tasks)
  - [Viewing Records](#viewing-records)
- [Technical Details](#-technical-details)
- [Support](#-support)

---

## 🌟 Overview

ParentPal is a modern, full-stack web application designed to simplify childcare management for parents and babysitters. Keep track of your child's health, growth, sleep patterns, feeding schedules, and more—all in one secure, easy-to-use platform. Enable seamless collaboration between parents and caregivers to ensure the best care for your children.

### Why ParentPal?

- 🔐 **Secure** - Firebase authentication with role-based access control
- 👶 **Comprehensive** - Complete childcare tracking in one place
- 📊 **Insightful** - Visual analytics and detailed reports
- 🤝 **Collaborative** - Seamless parent-babysitter coordination
- 📱 **Responsive** - Works on any device
- 🚀 **Modern** - Built with latest web technologies

---

## ✨ Features

### For Parents

#### Health Management
- **Medications Tracking** - Record all medications with dosage, time, and symptoms
- **Allergy Records** - Maintain a comprehensive list of allergies with severity levels and EpiPen requirements
- **Vaccination Schedule** - Track all vaccinations and immunization dates
- **Sick Day Logs** - Monitor illness symptoms, temperature, and treatments

#### Growth & Development
- **Growth Tracker** - Record height and weight measurements over time
- **Visual Analytics** - View growth trends with interactive charts
- **Milestone Tracking** - Monitor developmental progress

#### Daily Care
- **Sleep Analytics** - Track sleep patterns, duration, and bedtimes
- **Feeding Notes** - Log feeding times, types, amounts, and notes
- **Observation Journal** - Record important observations with priority levels
- **Photo Gallery** - Store and organize your child's photos

#### Collaboration
- **Babysitter Sharing** - Securely share child information with trusted caregivers
- **Task Management** - Assign and track tasks for babysitters
- **Real-time Updates** - Stay informed about your child's care

### For Babysitters

- **Child Access** - View information for all children you care for
- **Task Management** - See assigned tasks and mark them complete
- **Health Information** - Access allergies, medications, and important health details
- **Record Viewing** - Review feeding, sleep, and care schedules
- **Photo Sharing** - View photos shared by parents
- **Secure Verification** - Email-based verification system for account safety

---

## 🚀 Getting Started

### Account Setup

#### For Parents

1. **Navigate to the sign-up page**
   - Click "Sign Up" on the homepage

2. **Fill in your information**
   - First Name
   - Last Name
   - Email Address
   - Password (min 6 characters)
   - Date of Birth
   - Gender (optional)
   - Select "Parent" as account type

3. **Add your first child (optional during signup)**
   - Child's First Name
   - Child's Last Name
   - Date of Birth
   - Gender

4. **Complete registration**
   - Click "Create Account"
   - You'll be automatically signed in and redirected to your dashboard

#### For Babysitters

1. **Wait for an invitation**
   - Parents will send you an invitation via email

2. **Create your account**
   - Click "Sign Up" on the homepage
   - Fill in your information
   - Select "Babysitter" as account type
   - Complete registration

3. **Verify your invitation**
   - Check your email for the 4-digit verification code
   - Navigate to "Account Complete" page
   - Enter the verification code
   - You'll now have access to the shared children

---

## 📖 User Guide

### Parent Dashboard

After signing in as a parent, you'll see your main dashboard with:

- **Navigation Bar** - Access all features from the top menu
- **Baby Selection** - Switch between multiple children if you have more than one
- **Quick Actions** - Shortcuts to common tasks
- **Recent Activity** - View latest entries and updates

#### Navigation Menu Options:
- **Health Journal** - Manage medications, allergies, vaccinations, and sick days
- **Growth Tracker** - Record and visualize growth measurements
- **Sleep Analytics** - Track sleep patterns and duration
- **Feeding Notes** - Log feeding times and details
- **Observation Notes** - Record important observations
- **Photo Gallery** - Upload and view photos
- **Manage Babies** - Add or remove children
- **Share with Babysitter** - Invite and manage babysitter access

---

### Managing Children

#### Adding a New Child

1. Click **"Manage Babies"** in the navigation menu
2. Click **"Add New Baby"**
3. Fill in the required information:
   - First Name
   - Last Name
   - Date of Birth
   - Gender
   - Category (optional classification)
4. Click **"Add Baby"**

#### Switching Between Children

- Use the baby selector dropdown in the navigation bar
- All records will automatically filter to the selected child

#### Removing a Child

⚠️ **Warning**: This action permanently deletes all records associated with the child.

1. Navigate to **"Manage Babies"**
2. Find the child you want to remove
3. Click **"Delete"** button
4. Confirm the deletion
5. All associated records (health, growth, sleep, feeding, photos, etc.) will be permanently deleted

---

### Health Journal

The Health Journal is your central hub for tracking all health-related information.

#### Managing Medications

**To Add a Medication:**
1. Navigate to **Health Journal**
2. Scroll to the **Medications** section
3. Click **"Add Medication"**
4. Fill in the details:
   - Medication Name
   - Time Taken
   - Date
   - Dosage
   - Symptoms being treated
5. Click **"Submit"**

**View Medications:**
- All medications are displayed in a table
- Sorted by date (newest first)
- Shows medication name, time, date, dosage, and symptoms

#### Managing Allergies

**To Add an Allergy:**
1. In the Health Journal, find the **Allergies** section
2. Click **"Add Allergy"**
3. Enter the information:
   - Allergy Name (e.g., "Peanuts", "Dairy")
   - Severity (Mild, Moderate, Severe)
   - EpiPen Required (Yes/No)
   - Additional Notes
4. Click **"Submit"**

**View Allergies:**
- Critical information for caregivers
- Color-coded by severity
- EpiPen indicator clearly displayed

#### Managing Vaccinations

**To Add a Vaccination:**
1. In the Health Journal, find the **Vaccinations** section
2. Click **"Add Vaccination"**
3. Enter:
   - Vaccination Name (e.g., "MMR", "DTaP")
   - Date Administered
4. Click **"Submit"**

**View Vaccination History:**
- Complete immunization record
- Sorted chronologically
- Easy to share with healthcare providers

#### Recording Sick Days

**To Log a Sick Day:**
1. In the Health Journal, find the **Sick Days** section
2. Click **"Add Sick Day"**
3. Record:
   - Date of Illness
   - Medications Taken
   - Temperature (if applicable)
4. Click **"Submit"**

**View Sick Day History:**
- Track illness patterns
- Monitor recovery progress
- Useful for doctor visits

---

### Growth Tracker

Monitor your child's physical development over time with visual analytics.

#### Recording Growth Measurements

1. Click **"Growth Tracker"** in the navigation
2. Click **"Add New Measurement"**
3. Enter the data:
   - Weight (in lbs or kg)
   - Height (in inches or cm)
   - Date of Measurement
4. Click **"Add Measurement"**

#### Viewing Growth Charts

- **Weight Chart** - Visual graph of weight over time
- **Height Chart** - Visual graph of height over time
- **Growth Table** - Detailed list of all measurements
- **Trends** - Identify growth patterns and milestones

#### Editing Measurements

1. Find the measurement in the table
2. Click **"Edit"**
3. Update the values
4. Click **"Save"**

#### Deleting Measurements

1. Find the measurement in the table
2. Click **"Delete"**
3. Confirm deletion

---

### Sleep Analytics

Track and analyze your child's sleep patterns for better rest.

#### Logging Sleep Records

1. Navigate to **"Sleep Analytics"**
2. Click **"Add Sleep Record"**
3. Enter the information:
   - Time Fell Asleep
   - Sleep Duration (hours and minutes)
   - Date
4. Click **"Submit"**

#### Viewing Sleep Patterns

- **Sleep Chart** - Visual representation of sleep duration over time
- **Sleep Table** - Detailed list of all sleep records
- **Statistics** - Average sleep duration, trends, and patterns

**Insights You Can Gain:**
- Identify consistent bedtime routines
- Track sleep duration changes
- Monitor sleep quality improvements
- Share patterns with pediatricians

---

### Feeding Notes

Keep detailed records of all feedings to track nutrition and eating patterns.

#### Adding a Feeding Record

1. Go to **"Feeding Notes"**
2. Click **"Add Feeding Record"**
3. Complete the form:
   - Time Fed
   - Date
   - Fed From (Breast, Bottle, Spoon, etc.)
   - Type of Food (Formula, Breast Milk, Solid Food, etc.)
   - Amount (optional, e.g., "4 oz", "1 cup")
   - Notes (optional, e.g., "refused vegetables")
4. Click **"Submit"**

#### Viewing Feeding History

- **Feeding Table** - Complete feeding log
- **Filter Options** - View by date range
- **Sort Options** - Organize by time, date, or food type

**Use Cases:**
- Track feeding schedules
- Monitor food introduction for babies
- Identify food preferences or aversions
- Share feeding patterns with caregivers

---

### Observation Notes

Record important observations about your child's behavior, development, and milestones.

#### Creating an Observation

1. Navigate to **"Observation Notes"**
2. Click **"Add Observation"**
3. Fill in the details:
   - Priority Level (Low, Medium, High, Critical)
   - Detailed Notes (unlimited text)
   - Date (automatically recorded)
4. Click **"Submit"**

#### Viewing Observations

- **Priority Color Coding**:
  - 🟢 Low - General observations
  - 🟡 Medium - Notable behaviors
  - 🟠 High - Important developments
  - 🔴 Critical - Urgent matters

- **Sorting**: Filter by priority or date
- **Searching**: Find specific observations quickly

**Example Observations:**
- "First time rolling over independently"
- "New word: 'mama'"
- "Reluctant to eat breakfast"
- "Excellent sharing behavior at playgroup"

---

### Photo Gallery

Store and organize precious memories of your child.

#### Uploading Photos

1. Click **"Photo Gallery"** in the navigation
2. Click **"Upload Photo"**
3. Select or drag-and-drop a photo
   - Supported formats: JPEG, PNG, GIF, WebP
   - Max file size: 5MB
4. Add a caption (optional)
5. Select the child (if you have multiple)
6. Click **"Upload"**

#### Viewing Photos

- **Grid View** - Thumbnail gallery of all photos
- **Photo Details** - Click any photo to view full size
- **Captions** - Read descriptions below each photo
- **Date Info** - See when each photo was uploaded

#### Managing Photos

**Delete a Photo:**
1. Click on the photo
2. Click **"Delete"** button
3. Confirm deletion
4. Photo is permanently removed from storage

**Download Photos:**
- Right-click any photo
- Select "Save Image As"
- Choose your download location

---

### Sharing with Babysitters

Enable secure collaboration with your child's caregivers.

#### Inviting a Babysitter

1. Navigate to **"Share with Babysitter"**
2. Click **"Invite Babysitter"**
3. Enter their information:
   - Babysitter's Email Address
   - Babysitter's Full Name
4. Click **"Send Invitation"**

**What Happens Next:**
- Babysitter receives an email with a 4-digit verification code
- Code expires in 7 days
- Babysitter creates their account (if they haven't already)
- Babysitter enters the code to verify and gain access

#### Managing Babysitter Access

**View All Babysitters:**
- See who has access to your children
- View verification status (Pending or Verified)
- Check invitation dates

**Remove Babysitter Access:**
1. Find the babysitter in the list
2. Click **"Remove Access"**
3. Confirm removal
4. Babysitter immediately loses access to your children's information

#### What Babysitters Can See

✅ **Babysitters Have Access To:**
- Child's basic information (name, age)
- Health records (allergies, medications, vaccinations)
- Feeding schedules and notes
- Sleep patterns
- Observation notes
- Photos you've uploaded
- Assigned tasks

❌ **Babysitters Cannot:**
- Edit or delete records
- Add or remove children
- Invite other babysitters
- Access your account information
- See other parents' children

---

### Task Management

Assign and track tasks for your babysitters to ensure nothing is missed.

#### Creating a Task

1. Navigate to **"Share with Babysitter"**
2. Find the babysitter or go to **"Manage Tasks"**
3. Click **"Create Task"**
4. Fill in the task details:
   - Task Title (e.g., "Give medication at 2 PM")
   - Task Description (detailed instructions)
   - Select Child (optional, for child-specific tasks)
   - Due Date & Time
5. Click **"Create Task"**

#### Viewing Tasks

**For Parents:**
- See all tasks you've assigned
- Filter by babysitter or child
- View completion status
- See babysitter notes when tasks are completed

**Task Status Indicators:**
- ⏳ Pending - Not yet completed
- ✅ Completed - Finished by babysitter
- 🔴 Overdue - Past due date

#### Managing Tasks

**Edit a Task:**
1. Find the task in the list
2. Click **"Edit"**
3. Update information
4. Click **"Save"**

**Delete a Task:**
1. Find the task
2. Click **"Delete"**
3. Confirm deletion

**View Completion Details:**
- When task was completed
- Babysitter notes (if any)
- Related child information

---

## 👶 Babysitter Guide

### Getting Started as a Babysitter

#### Step 1: Receive Invitation

Parents will send you an invitation email containing:
- A 4-digit verification code
- Instructions for account setup
- Code expiration date (7 days from sending)

#### Step 2: Create Your Account

1. Go to ParentPal website
2. Click **"Sign Up"**
3. Enter your information:
   - First Name
   - Last Name
   - Email (must match the invited email)
   - Password
   - Date of Birth
   - Gender (optional)
   - Select **"Babysitter"** as account type
4. Click **"Create Account"**

#### Step 3: Verify Your Access

1. After creating your account, you'll be redirected to **"Account Complete"** page
2. Enter the 4-digit verification code from your email
3. Click **"Verify"**
4. You now have access to the children you'll be caring for

⚠️ **Important**: Verification codes expire after 7 days. If your code expires, ask the parent to send a new invitation.

---

### Viewing Children

#### Your Dashboard

After signing in, your dashboard displays:
- All children you have access to
- Quick access to each child's information
- Pending tasks assigned to you
- Recent activity

#### Accessing Child Information

1. Click on a child's card or name
2. View available tabs:
   - **Health** - Allergies, medications, vaccinations
   - **Feeding** - Feeding schedules and notes
   - **Sleep** - Sleep patterns and schedules
   - **Photos** - Shared photos
   - **Notes** - Parent observations

#### Important Health Information

**Always Check:**
- 🚨 **Allergies** - Review severity and EpiPen requirements
- 💊 **Medications** - Check dosage and timing
- 🩹 **Recent Sick Days** - Be aware of ongoing illnesses

---

### Managing Tasks

#### Viewing Your Tasks

1. Navigate to **"My Tasks"** or view them on your dashboard
2. See all tasks assigned to you
3. Filter by:
   - Completion status (Pending/Completed)
   - Child
   - Due date

#### Completing a Task

1. Find the task in your list
2. Review the task details
3. Once completed, click **"Mark Complete"**
4. Optionally add notes about the completion:
   - "Medication given at 2:15 PM, no side effects"
   - "Read three books before naptime"
   - "Ate all vegetables at lunch"
5. Click **"Submit"**

**The parent will be able to see:**
- When you completed the task
- Your notes about the completion
- Task completion timestamp

#### Task Notifications

- Overdue tasks are highlighted in red
- Tasks due today are shown at the top
- Completed tasks show completion timestamp

---

### Viewing Records

As a babysitter, you can view (but not edit) various records to understand the child's routine.

#### Health Records

**View:**
- Complete allergy list with severity levels
- Current medications and dosing schedules
- Vaccination history
- Recent sick days and symptoms

**Use This Information To:**
- Ensure child safety
- Follow medication schedules
- Be aware of emergency procedures

#### Feeding Records

**View:**
- Recent feeding times and amounts
- Food preferences and restrictions
- Typical feeding schedule

**Use This Information To:**
- Maintain consistent feeding routines
- Know what foods to prepare
- Avoid allergenic foods

#### Sleep Records

**View:**
- Typical bedtimes and wake times
- Average sleep duration
- Sleep patterns and routines

**Use This Information To:**
- Follow established sleep schedules
- Maintain bedtime routines
- Ensure adequate rest

#### Photos

**View:**
- All photos shared by parents
- Photo captions and context
- Recent memorable moments

---

## 🔧 Technical Details

### Technology Stack

**Frontend:**
- React 18.3
- React Router v6
- HeroUI (NextUI) Component Library
- Recharts for data visualization
- Axios for API requests
- Vite build tool

**Backend:**
- Node.js with Express
- PostgreSQL database
- Firebase Admin SDK for authentication
- Nodemailer for email functionality
- Multer for file uploads

**Authentication:**
- Firebase Authentication
- JWT token verification
- Role-based access control

### System Requirements

- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **Internet**: Stable internet connection
- **Screen**: Responsive design works on mobile, tablet, and desktop

### Data Security

- 🔐 All data encrypted in transit (HTTPS)
- 🔑 Secure authentication via Firebase
- 👤 Role-based access control
- 🗄️ Regular database backups
- 🔒 Password hashing and security
- ✉️ Email verification for babysitter invitations

### Privacy

- Your data is never shared without your explicit permission
- Only invited babysitters can access your children's information
- You control who has access and can revoke it anytime
- Photos are stored securely and only accessible to authorized users

---

## 📞 Support

### Frequently Asked Questions

**Q: How do I reset my password?**
A: Use the "Forgot Password" link on the sign-in page. Follow the email instructions to reset your password.

**Q: Can I add multiple children?**
A: Yes! Use the "Manage Babies" section to add as many children as needed.

**Q: What if my babysitter doesn't receive the invitation email?**
A: Check their spam folder first. If still not found, you can resend the invitation from the "Share with Babysitter" page.

**Q: Can babysitters edit my child's records?**
A: No, babysitters have read-only access to records. Only parents can add, edit, or delete information.

**Q: How long does a verification code last?**
A: Verification codes expire after 7 days. If expired, request a new invitation.

**Q: Can I share my child with multiple babysitters?**
A: Yes! You can invite as many babysitters as you need.

**Q: What happens if I delete a child's profile?**
A: All records associated with that child (health, growth, photos, etc.) are permanently deleted. This action cannot be undone.

**Q: Is my data backed up?**
A: Yes, the database is backed up regularly. However, deleted data cannot be recovered.

---

### Getting Help

If you encounter issues or have questions:

1. **Check the User Guide** - Most common questions are answered above
2. **Review Error Messages** - Error messages often contain helpful information
3. **Contact Support** - Reach out for technical assistance

---

## 🎯 Best Practices

### For Parents

✅ **Do:**
- Keep allergy information up-to-date
- Record medications promptly
- Add detailed task instructions for babysitters
- Regularly update growth measurements
- Back up important photos externally
- Review completed tasks and babysitter notes

❌ **Don't:**
- Share your password with anyone
- Leave verification codes unprotected
- Forget to remove former babysitters' access

### For Babysitters

✅ **Do:**
- Review child's health information before each visit
- Check tasks daily
- Add detailed completion notes
- Report any concerns to parents immediately
- Keep your verification code secure

❌ **Don't:**
- Share access with others
- Use the same password across multiple sites
- Ignore allergy warnings or medication schedules

---

<div align="center">

## 💝 Made with Love

**ParentPal - Supporting parents and caregivers in raising happy, healthy children**

© 2025 ParentPal. All rights reserved.

**Version 1.0.0**

</div>
