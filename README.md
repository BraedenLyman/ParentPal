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
1. [Overview](#-overview)
2. [Features](#-features)
3. [User Manual](#-user-manual)
4. [Security](#-security)
5. [Support](#-support)

---

## 🧭 Overview
**ParentPal** is a comprehensive childcare management platform for parents and babysitters. It offers a user-friendly interface to track and manage daily tasks, monitor growth and sleep patterns, and access personalized health and wellness insights of your child.

### 🔗 Accessing ParentPal - [https://parentpal.com](https://parentpal.com)

### 🧰 Front-End Stack

```
Framework: React 18.3.1
Build Tool: Vite 6.3.5
Languages: JavaScript (JSX)
UI Components: Chakra UI, HeroUI, TailwindCSS 4.1.11
Routing: React Router DOM 6.23.0
API Communication: Axios 1.12.2
Animation: Framer Motion 11.18.2
Charts: Recharts 3.3.0
Hosting: Firebase Hosting
```  

---

## 🔑 Key Features 
- 🧑‍💻 **User Authentication:** Secure login and registration using JWT / Firebase Auth.  
- 📊 **Dashboard:** View and manage all tracked data in one place.  
- 🧠 **Smart Insights:** Visualize growth trends and analytics over time.
- 📝 **Records / History:** Review previously submitted data and make edits or deletions as needed.
- 📱 **Responsive Design:** Works seamlessly on mobile and desktop devices.

---

## 📘 User Manual (Parent User)

### Home Page
- Displays the key featured sections of the app, such as the log types, assigned tasks, and photo gallery.

- To view the history of a specific log type, click on the corresponding log card.
- To view the Assigned Tasks section, click on the Assigned Tasks card.
- To view the Photo Gallery section, click on the Photo Gallery card.

### Logs

#### Growth Records

##### Viewing Growth Records
1. Select the "Growth Tracker" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the growth records for the selected child.

##### Adding Growth Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the pgae to add a new record.
3. A modal will appear where you can then enter the details for growth.
  1. Enter the height (feet and inches).
  2. Enter the weight (pounds)
  3. Enter the date of the record.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the growth tracker page for that child the record was added to.


#### Sleep Records

##### Viewing Sleep Records
1. Select the "Sleep Analytics" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the sleep records for the selected child.

##### Adding Sleep Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the pgae to add a new record.
3. A modal will appear where you can then enter the details for sleep.
  1. Enter the sleep duration (hours).
  2. Enter the time rhe child fell asleep.
  3. Enter the date of the record.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the sleep analytics page for that child the record was added to.


#### Health Records

##### Medications

##### Viewing Medication Records
1. Select the "Health Journal" item from the first dropdown menu. 
2. Select the child from the second dropdown menu. (By default, the first child is selected)
3. Select Medications from the tab menu below the dropdown menus.

- This will display all the medication records for the selected child.

##### Adding Medication Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the page to add a new record.
3. A modal will appear where you can then enter the details for medication.
  1. Enter the medication name.
  2. Enter time taken
  3. Enter date of the record.
  4. Enter amount (fl oz).
  5. Enter Sickness/symptoms notes of how the child is feeling.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the health journal page under the medications tab for that child the record was added to.

##### Allergies

##### Viewing Allergy Records
1. Select the "Health Journal" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)
3. Select Allergies from the tab menu below the dropdown menus.

- This will display all the allergy records for the selected child.

##### Adding Allergy Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the page to add a new record.
3. A modal will appear where you can then enter the details for allergy.
  1. Enter the allergy name.
  2. Select severity from the dropdown menu (Low, Medium, High).
  3. Select epi-pen from the dropdown menu (Yes, No).
  4. Enter notes about the allergy.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the health journal page under the allergies tab for that child the record was added to.

##### Vaccinations

##### Viewing Vaccination Records
1. Select the "Health Journal" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)
3. Select Vaccinations from the tab menu below the dropdown menus.

- This will display all the vaccination records for the selected child.

##### Adding Vaccination Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the page to add a new record.
3. A modal will appear where you can then enter the details for vaccination.
  1. Enter the vaccine name.
  2. Enter date of the record.  
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the health journal page under the vaccinations tab for that child the record was added to.


#### Feeding Records

##### Viewing Feeding Records
1. Select the "Feeding Notes" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the feeding records for the selected child.

##### Adding Feeding Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the page to add a new record.
3. A modal will appear where you can then enter the details for feeding.
  1. Enter the feeding time.
  2. Enter the date of the record.
  3. Select Fed from from the dropdown menu (Bottle, Breast).
  4. Select type of food from the dropdown menu (Milk, Water, Juice).
  5. Enter the amount of food (fl oz).
  6. Enter Notes about the feeding.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the feeding notes page for that child the record was added to.


#### Observation Records

##### Viewing Observation Records
1. Select the "Observation Notes" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the observation records for the selected child.

##### Adding Observation Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the page to add a new record.
3. A modal will appear where you can then enter the details for observation.
  1. ENter priority level from the dropdown menu (Low, Medium, High).
  2. Enter Notes about the observation.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the observation notes page for that child the record was added to.


### Assigned Tasks

#### Viewing Tasks
1. Tasks will be displayed on the main page of the Assigned Tasks page. (If there is no shared account, the assignted tasks page will be empty and promt the user to add a shared account)

#### Adding Tasks
1. Click on the "+ Add Task" button in the center of the page at the top.
2. A modal will appear where you can then enter the details for the task.
  1. Enter the task title.
  2. Enter the task description (optional).
  3. Assign the task to a specific babysitter from the dropdown menu.
  4. Assign the task to a specific baby from the dropdown menu.
  5. Enter the due date (optional).
3. Click on the "Add Task" button to save the task, or click on the "Cancel" button to cancel adding the task.

- The task will be saved onced the "Add Task" button is clicked.
- The task will then be displayed on the assigned tasks page with all of the information entered. The shared account (selected babysitter) will recieve this task and will be able to view the information on their account and complete the task as required.

#### Editing Tasks
1. Click on the "Edit Task" icon on the far right of the task card.
2. A modal will appear where you can then edit the details for the task.
  1. Change the task title.
  2. Change the task description (optional).
  3. Chnage the assigned babysitter from the dropdown menu.
  4. Change the assigned baby from the dropdown menu.
  5. Change the due date (optional).
3. Click on the "Save Changed" button to save the changes, or click on the "Cancel" button to cancel editing the task.

- The changes will be saved onced the "Save Changed" button is clicked.
- The changes will then be displayed on the assigned tasks page with all of the information entered. The shared account (selected babysitter) will recieve the changes to the task and will be able to view the information on their account and complete the task as required.

#### Deleting Tasks
1. Click on the "Delete Task" icon on the far right of the task card.
2. A modal will appear where you can then confirm the deletion of the task.
3. Click on the "Delete" button to delete the task, or click on the "Cancel" button to cancel deleting the task.

- The task will be deleted onced the "Delete" button is clicked.
- The task will then be removed from the assigned tasks page. The deletetion will also be reflected on the shared account (selected babysitter) account.

#### Completed Tasks
1. Once a task is completed, the task will be marked as completed and show any notes entered by the assigned babysitter along with the date of the completion.

- The task will show as completed.


### Reports

#### Viewing Growth Reports
1. Select the "Growth Over Time" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the growth records for the selected child in a graph format.

#### Viewing Sleep Reports
1. Select the "Sleep Patterns" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the sleep records for the selected child in a graph format. 

#### Viewing Feeding Reports
1. Select the "Feeding Patterns" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the feeding records for the selected child in a graph format.


### Settings

### Personal Information
1. Select the "Personal Information" card in the settings page.

- The personal information page displays the user's email address, Your Little Ones (all the parents children) and a change password secction. 

#### Adding a Baby
1. Click on the "Add Baby" button in the "Your Little Ones" section.
2. A modal will appear where you can then enter the details for the baby.
  1. Enter the baby's first name.
  2. Enter the baby's last name.
  3. Enter the baby's date of birth.
  4. Enter the baby's gender (Male, Female, Other).
  5. Enter the baby's category (Baby, Toddler, Pre-Schooler, Grade-Scooler).
3. Click on the "Add Baby" button to save the baby, or click on the "Cancel" button to cancel adding the baby. 

- The baby will be saved onced the "Add Baby" button is clicked.
- The baby will then be displayed on the "Your Little Ones" section of the personal information page.
- The baby will then be able to be used for adding, editing, and deleting records.

#### Deleting a Baby
1. Click on the garbage can icon in the top right corner of each baby card.
2. A modal will appear where you can then confirm the deletion of the baby.
3. Click on the "Delete" button to delete the baby, or click on the "Cancel" button to cancel deleting the baby.

- The baby will be deleted onced the "Delete" button is clicked.
- The baby will then be removed from the "Your Little Ones" section of the personal information page.

#### Chnaging Password
1. Under the "Change Password" section, in the first text field, enter a new password. (Min 8 characters long, 1 upper case, 1 number and 1 special character)
2. In the second text field, confirm the new password by entering it again.
3. Click on the "Accept Changes" button to save the changes

- If successful, the user will see a success message, and the password will be updated. 
- If unsuccessful, the user will see an error message, and the password will not be updated.
- Once the password is updated, the user will be able to log in with the new password.

### Shared Accounts
1. Select the "Shared Accounts" card in the settings page.

- The shared accounts page displays all the shared babysitter accounts associated with the user.

#### Adding a Shared Account
1. Click on the "+ Add Babysitter" button at the top of the Shared Accounts page.
2. A modal will appear where you can then enter the details for the shared account.
  1. Enter the shared account's first name.
  2. Enter the shared account's email address.
3. Click on the "Send Share Link" button to send the shared account a link to join the app and share limited account data with them.

- The shared account will be saved onced the "Send Share Link" button is clicked.
- The shared account will then be displayed on the Shared Accounts page (Pending Status, until the shared account accepts the invitation).
- Once the shared account accepts the invitation, the status will change to "Accepted" and the shared account will be able to view the limited account data for that user's children.

#### Deleting a Shared Account
1. Click on the garbage can icon on the far right of the shared account card. (Wheather the status is "Pending" or "Accepted", it will delete the shared account).

- The shared account will be deleted onced the garbage can icon is clicked.
- The shared account will then be removed from the Shared Accounts page.

### Data Export
1. Select the "Data Export" card in the settings page.

- The data export page displays all the data that can be exported as a PDF file.

#### Exporting Data
1. Select the child from the dropdown menu whos data you'd like to export. (By default, the first child is selected)
2. Check off the checkboxes for the data you want to export and show in the PDF file.
3. Click on the "Generate PDF" button to export the data.

- The data will be exported onced the "Generate PDF" button is clicked.
- The data will then be displayed in a PDF file where the user can save it or download it.

### Delete Account
1. Select the "Delete" button in the settings page.
2. A modal will appear where you can then confirm the deletion of the account.
3. Click on the "Yes, Delete Account" button to delete the account, or click on the "Cancel" button to cancel deleting the account.

- The account will be deleted onced the "Yes, Delete Account" button is clicked.
- The account will then be removed from the app.    

### Log Out
1. Select the "Log Out" button in the settings page.

- The user will be automatically logged out onced the "Log Out" button is clicked.
- The user will then be redirected to the sign-in page.


### Photo Gallery
1. Select the "Photo Gallery" card from the Home page.

- The photo gallery page displays all the photos that the user has uploaded to the app.

#### Uploading Photos
1. Click on the "Upload Photo" button at the top of the Photo Gallery page.
2. A modal will appear where you can then enter the details for the photo you want to upload.
  1. Select the baby from the dropdown menu. (By default, the first baby is selected)
  2. Click on the "Browse" button to select the photo from your device.
  3. Once a photo is selected, a preview of the photo will appear in the modal.
  4. Enter a caption for the photo (optional).
3. Click on the "Upload" button to upload the photo, or click on the "Cancel" button to cancel uploading the photo.

- The photo will be uploaded onced the "Upload" button is clicked.
- The photo will then be displayed on the Photo Gallery page.

#### Deleting Photos
1. Click on the garbage can icon in the top right corner of each photo card.
2. A modal will appear where you can then confirm the deletion of the photo.
3. Click on the "Delete" button to delete the photo, or click on the "Cancel" button to cancel deleting the photo.

- The photo will be deleted onced the "Delete" button is clicked.
- The photo will then be removed from the Photo Gallery page.

---

## 📘 User Manual (Babysitter User)

### Home Page
- Until a parent account has sent a shared link to the babysitter, the babysitter will see a "No Access Yet" message.
- Once a parent account has sent a shared link to the babysitter, and the babysitter has accepted the invitation (By entering the valid 4 digit code), the babysitter will then see the key featured sections of the app, such as the log types, assigned tasks, and photo gallery.

- To view the history of a specific log type, click on the corresponding log card.
- To view the Assigned Tasks section, click on the Assigned Tasks card.
- To view the Photo Gallery section, click on the Photo Gallery card.

### Logs

#### Sleep Records

##### Viewing Sleep Records
1. Select the "Sleep Analytics" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the sleep records for the selected child.

##### Adding Sleep Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the pgae to add a new record.
3. A modal will appear where you can then enter the details for sleep.
  1. Enter the sleep duration (hours).
  2. Enter the time rhe child fell asleep.
  3. Enter the date of the record.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the sleep analytics page for that child the record was added to.


#### Health Records

##### Medications

##### Viewing Medication Records
1. Select the "Health Journal" item from the first dropdown menu. 
2. Select the child from the second dropdown menu. (By default, the first child is selected)
3. Select Medications from the tab menu below the dropdown menus.

- This will display all the medication records for the selected child.

##### Adding Medication Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the page to add a new record.
3. A modal will appear where you can then enter the details for medication.
  1. Enter the medication name.
  2. Enter time taken
  3. Enter date of the record.
  4. Enter amount (fl oz).
  5. Enter Sickness/symptoms notes of how the child is feeling.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the health journal page under the medications tab for that child the record was added to.


#### Feeding Records

##### Viewing Feeding Records
1. Select the "Feeding Notes" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the feeding records for the selected child.

##### Adding Feeding Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the page to add a new record.
3. A modal will appear where you can then enter the details for feeding.
  1. Enter the feeding time.
  2. Enter the date of the record.
  3. Select Fed from from the dropdown menu (Bottle, Breast).
  4. Select type of food from the dropdown menu (Milk, Water, Juice).
  5. Enter the amount of food (fl oz).
  6. Enter Notes about the feeding.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the feeding notes page for that child the record was added to.


#### Observation Records

##### Viewing Observation Records
1. Select the "Observation Notes" item from the first dropdown menu.
2. Select the child from the second dropdown menu. (By default, the first child is selected)

- This will display all the observation records for the selected child.

##### Adding Observation Records
1. Make sure the child you want to add the record to is selected from the second dropdown menu.
2. Click on the "Add" button in the bottom right corner of the page to add a new record.
3. A modal will appear where you can then enter the details for observation.
  1. ENter priority level from the dropdown menu (Low, Medium, High).
  2. Enter Notes about the observation.
4. Click on the "Add" button to save the record, or click on the "Cancel" button to cancel adding the record.

- The record will be saved onced the "Add" button is clicked.
- The record will then be displayed on the observation notes page for that child the record was added to.


### Assigned Tasks

#### Viewing Tasks
- Tasks will be displayed on the main page of the Assigned Tasks page. (If the parent account has not assigned any tasks for the babysitteer, the babysitter's Assgined Task page will be empty and display a "No Tasks Yet" message)

#### Completing Tasks
1. After a task has been assigned to a babysitter, the assigned tasks page will display the assigned task with any helpful information for completing the task in the Pending Tasks section.
2. Click on the Task card to complete the task.
3. The task card will expand and show a "Complete this task" section
4. Enter comments about the task completion in the text field. (Optional)
5. Click on the "Mark as Complete" button to complete the task.

- The task will be marked as complete onced the "Mark as Complete" button is clicked.
- The task will then be moved from the Pending Tasks section to the Completed Tasks section.
- The parent account will then recieve the compelted task with any comments entered.


### Settings

### Personal Information
1. Select the "Personal Information" card in the settings page.

- The personal information page displays the user's email address and a change password secction. 

#### Chnaging Password
1. Under the "Change Password" section, in the first text field, enter a new password. (Min 8 characters long, 1 upper case, 1 number and 1 special character)
2. In the second text field, confirm the new password by entering it again.
3. Click on the "Accept Changes" button to save the changes

- If successful, the user will see a success message, and the password will be updated. 
- If unsuccessful, the user will see an error message, and the password will not be updated.
- Once the password is updated, the user will be able to log in with the new password.

### Shared Accounts
1. Select the "Shared Accounts" card in the settings page.

- The shared accounts page displays a section to enter in the 4 digit share account access code, and a section that displays all of the parents and children the babysitter has approved access to.

#### Accessing Shared Accounts From Shared Link
1. Check your email inbox (sometimes in the spam folder) for a message from ParentPal that says "ParentPal - Babysitter Access Invitation".
2. Click on the email and you will see a 4 digit code with more details about the application and signing up if you haven't already.
3. Sign up as a babysitter account (If you haven't already), navigate to the Shared Account Card under Settings and enter the 4 digit code in the "Add Shared Account" section.
4. Click on the "verifiy Code" button to verify the code.
4. If successful, you will see a success message and the shared account will be added to your account. If unsuccessful, you will see an error message.

- The shared account will be added to your account once the "Verifiy Code" button is clicked.
- The shared accounts page will display all of the parents and children the babysitter has approved access to.

#### Viewing Shared Accounts
1. Select the "Shared Accounts" card in the settings page.
2. The shared accounts page displays all of the parents and children the babysitter has approved access to.

- If a parent revkokes a babysitter's access by deleting the shared account, the babysitter will then not be able to access the parent's children's data and any tasks they have assigned will be removed from the babysitter's account.

### Delete Account
1. Select the "Delete" button in the settings page.
2. A modal will appear where you can then confirm the deletion of the account.
3. Click on the "Yes, Delete Account" button to delete the account, or click on the "Cancel" button to cancel deleting the account.

- The account will be deleted onced the "Yes, Delete Account" button is clicked.
- The account will then be removed from the app.    

### Log Out
1. Select the "Log Out" button in the settings page.

- The user will be automatically logged out onced the "Log Out" button is clicked.
- The user will then be redirected to the sign-in page.


### Photo Gallery
1. Select the "Photo Gallery" card from the Home page.

- The photo gallery page displays all the photos that the parent account and babysitter account have uploaded to the app.

#### Uploading Photos
1. Click on the "Upload Photo" button at the top of the Photo Gallery page.
2. A modal will appear where you can then enter the details for the photo you want to upload.
  1. Select the baby from the dropdown menu. (By default, the first baby is selected)
  2. Click on the "Browse" button to select the photo from your device.
  3. Once a photo is selected, a preview of the photo will appear in the modal.
  4. Enter a caption for the photo (optional).
3. Click on the "Upload" button to upload the photo, or click on the "Cancel" button to cancel uploading the photo.

- The photo will be uploaded onced the "Upload" button is clicked.
- The photo will then be displayed on the Photo Gallery page for the parent account and babysitter account.

---

## 🔐 Security
Your data is protected with modern security practices, including:
- **JWT Authentication** for session handling.  
- **HTTPS/TLS Encryption** for all data transmission.  
- **Secure Storage** of user credentials.  
- **Input Validation** to prevent XSS and SQL injection.

### 🛡️ Security Badges
![Security](https://img.shields.io/badge/Secure%20Connection-HTTPS-brightgreen)
![Auth](https://img.shields.io/badge/Auth-JWT%20Protected-blue)
![Privacy](https://img.shields.io/badge/Data%20Privacy-GDPR%20Compliant-orange)

---

## 💬 Support
### Frequently Asked Questions

**Q1: How do I reset my password?**  
A: Navigate to the login page and click “Forgot Password.” Follow the email link to reset it.

**Q2: Is my data stored securely?**  
A: Yes, all data is encrypted and securely stored in the database.

**Q3: Can I access the app on mobile?**  
A: Absolutely! The app is fully responsive and optimized for mobile browsers.
---

© 2025 ParentPal. All rights reserved.
