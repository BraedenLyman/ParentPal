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

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [User Manual (Parent)](#user-manual-parent-user)
- [User Manual (Babysitter)](#user-manual-babysitter-user)

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

<details>
<summary><h3>Home Page</h3></summary>

#### Log Section
**Viewing Logs**
1. Click on the corrisponding log card to view, add, edit and delete log records for that log type

#### Assigned Tasks Section
1. Click on the assigned task card to view, add, edit and delete assigned tasks for a shared babysitter account

#### Photo Gallery Section
1. Click on the photo gallery card to view, add and delete photos

</details>

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
</br>(Note: The selected Health Record type (From the navigation bar) will be the type of Health Record that you are adding)

1. Click the **"Add"** button (bottom right)
2. Enter the corresponding health record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the selected type of Health Records list for that child

**Filtering Health Records**
</br>(Note: The selected Health Record type (From the navigation bar) will be the type of Health Record that you are filtering)

1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of the selected Health Record type will be filtered accordingly

**Editing Health Records**
</br> (Note: The selected Health Record type (From the navigation bar) will be the type of Health Record that you are editing)

1. Click the **Edit** icon (The pencial icon on the health record card)
2. A modal will appear with the current health record details
3. Update the details as needed
4. Click **"Save"** to save changes or **"Cancel"** to cancel

**Deleting Health Records**
</br>(Note: The selected Health Record type (From the navigation bar) will be the type of Health Record that you are deleting)

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

**Viewing Tasks**
1. All tasks will be displayed on the main tasks page showing the task title, assigned baby and assigned babysitter.

**Adding Tasks**
1. Click **"+ Add Task"**
2. Enter the required corresponding task details (along with optional details if applicable)
3. Click **"Add Task"** to save or **"Cancel"** to cancel

**Editing Tasks**
1. Click the **Edit** icon (The pencial icon on the task card)
2. Update the details as needed
3. Click **"Save Changes"** to save changes or **"Cancel"** to cancel

**Deleting Tasks**
1. Click the **Delete** icon (The trash icon on the task card)
2. A modal will appear with a delete task confirmation
3. Click **"Delete"** to delete the task or **"Cancel"** to cancel

</details>

<details>
<summary><h3>Messages</h3></summary>

(Note: In order to view messages, you must have a shared account set up with a babysitter)

**Unread Messages**
1. There will be a red circle badge in the top right corner of the messages navigation tab (At the bottom of the applicaton) with a number indicating the number of unread messages
2. The unread messages will be in a bolded font and have a green circle bage indicating the number of unread messages in the corrisponding conversation with a babysitter
2. Once you have read the messages, the badges will disappear

**Viewing Conversations**
1. All conversations will be displayed on the main messages page (As conversation cards) showing the babysitter's name, the most recent message and the date/time of the most recent message.

**Viewing Conversation Messages**
1. Click the conversation card to view the messages for that conversation
2. A page will appear with a history of all messages from that conversation with the most recent message at the bottom
3. As a parent, your messages are in a green text bubble, while the babysitter's messages are in a white text bubble
4. You will see the time of each message underneath the message bubbles

**Sending Messages**
1. Type your message in the text box at the bottom of the page in the corresponding conversation with the babysitter
2. Click **"Send"** to send the message
3. The message will be sent to the babysitter and will appear in the conversation with the babysitter

</details>

<details>
<summary><h3>Reports</h3></summary>

**Viewing Growth Reports**
1. Select "Growth Reports" from the first dropdown
2. Select one of your children from the second dropdown (if you have more than one child)
3. Two graphs will appear, one for height and one for weight over time showing the growth data for that child

**Viewing Sleep Patterns**
1. Select "Sleep Patterns" from the first dropdown
2. Select one of your children from the second dropdown (if you have more than one child)
3. A graph will appear showing the amount of hours slept per day for that child
4. It will also show the average sleep duration for that child

**Viewing Feeding Patterns**
1. Select "Feeding Patterns" from the first dropdown
2. Select one of your children from the second dropdown (if you have more than one child)
3. A graph will appear showing the amount (fl oz) of food consumed per day for that child
4. When clicking on the bar in the graph, it will show the Food type, amount, and what it was fed from

</details>

<details>
<summary><h3>Settings</h3></summary>

#### Personal Information

**Viewing Personal Information**
1. Click on the Personal Information card and it will bring you to the Personal Information page
2. You can view your email address, all children assigned to your account, and change your password

**Adding a Child**
1. Under the "Your Little Ones" section, click on the "+ Add Baby" button
2. A modal will appear where you can enter all the details for your new child
3. Entet the corrisponding details
4. Click **"Add Baby"** to save or **"Cancel"** to cancel
5. The new child will be added to your account and you will see the child card under the "Your Little Ones" section

**Deleting a Child**
1. Click on the garage icon (Top right corner) of the child card
2. A modal will appear with a delete child confirmation
3. Click **"Delete"** to delete the child or **"Cancel"** to cancel

**Changing Password**
1. In the first text input, enter a new password (min 8 chars, 1 uppercase, 1 number, 1 special char)
2. In the second text input, confirm the new password
3. Click **"Accept Changes"** button to save the new password
4. If the password is successful a success message will appear below the text inputs, otherwise an error message will appear


#### Shared Accounts

**Viewing Shared Accounts**
1. Click on the Shared Accounts card and it will bring you to the Shared Accounts page
2. Every shared account will be listed with the account name (the name entered when adding the shared account), their email address, and when they were verified
3. If a babysitter has not yet been verified, they will be listed as "Pending Verification"

**Adding a Shared Account**
1.On the Shared Accounts page, click on the "+ Add Babysitter" button
2. A modal will appear where you can enter all the details for your new shared account
3. Enter the corrisponding details
4. Click **"Send Share Link"** to send the shared account link to the corrisponding email address entered in step 3 or **"Cancel"** to cancel
5. This will send an email to the corrisponding email address with a link to the shared account
6. Once the babysitter has received the emailed link, they will be able to create an account (if not already created) and verify the shared account via a 4-digit code

**Deleting a Shared Account**
1. Click on the garage icon in the shared account card
2. This will delete the shared account and all associated data imediately


#### Data Export

**Choosing Data to Export**
1. Select the child from the dropdown (if you have more than one child)
2. Under the "Select Data to Export" section, check off the information you'd like to include in the exported data
3. Click **"Generate PDF"** to download the exported data as a PDF
4. This will download a PDF file with all the data you've selected

**Viewing PDF**
1. Find where the PDF file is saved on your device
2. Open the PDF file
3. The PDF will contain the child's name, date of birth, gender, the date the report was generated and all the data you've selected to export in a table format

#### Deleting Account & Logging Out

**Deleting Account**
1. In the settings tab, click the red **"Delete Account"** button
2. A modal will appear with a delete account confirmation
3. Click **"Yes, Delete Account"** to delete the account or **"Cancel"** to cancel
4. Your account will be deleted and all associated data will be permanently deleted
5. You will then be redirected to the login page

**Log Out**
1. In the settings tab, click the blue **"Log Out"** button
2. This will log you our of the application and redirect you to the login page

</details>

<details>
<summary><h3> Photo Gallery</h3></summary>

**Viewing Photos**
1. From the main dashboard, click the **"Photo Gallery"** card under the "Photo Gallery" section
2. The photo gallery page will appear with a grid of photos that have been uploaded by a parent account (your account) or a verified shared babysitter account

**Uploading Photos**
1. Click the **"Upload Photo"** button
2. A modal will appear where you can enter all the details for uploading a new photo
3. Enter in the corrisponding details
4. Click **"Upload"** to save or **"Cancel"** to cancel
5. The new photo will be uploaded to the photo gallery and will appear in the grid of photos with which baby the photo is associated with, and who uploaded it

**Deleting Photos**
1. Click on the garage icon in the photo gallery card
2. A modal will appear with a delete photo confirmation
3. Click **"Delete"** to delete the photo or **"Cancel"** to cancel
4. The photo will be deleted from the photo gallery and all associated data will be permanently deleted

</details>

<br/>

---

## User Manual (Babysitter User)

###  Home Page

<details>
<summary><h3>Home Page</h3></summary>
(Note: The homepage will not show any data until a parent account has shared access with your account (The babysitter account) and you have verified the shared account)

#### Log Section
**Viewing Logs**
1. Click on the corrisponding log card to view and add log records for that log type

#### Assigned Tasks Section
1. Click on the assigned task card to view, add comments, and complete assigned tasks the parent has assigned to you (The babysitter)

#### Photo Gallery Section
1. Click on the photo gallery card to view and add photos

</details>

<details>
<summary><h3>Logs</h3></summary>

#### Sleep Analytics
**Viewing sleep Records**
1. Select "Sleep Analytics" from the first dropdown
2. Select one of the parent's children from the second dropdown (if there are more than one child)
3. A list of all sleep records for that child will then appear

**Adding Sleep Records**
1. Click the **"Add"** button (bottom right)
2. Enter the corresponding sleep record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the list of sleep records for that child with the babysitters initials on the card (To inform the parent this record was added by the babysitter)

**Filtering Sleep Records**
1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of sleep records will be filtered accordingly


#### Health Journal
**Viewing Health Records**
1. Select "Health Journal" from the first dropdown
2. Select one of the parent's children from the second dropdown (if there are more than one child)
3. A list of all medication health records for that child will then appear

**Adding Health Records**
1. Click the **"Add"** button (bottom right)
2. Enter the corresponding health record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the list of medication health records for that child with the babysitters initials on the card (To inform the parent this record was added by the babysitter)

**Filtering Health Records**
1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of the medication health records will be filtered accordingly


#### Feeding Notes
**Viewing feeding Records**
1. Select "Feeding Notes" from the first dropdown
2. Select one of the parent's children from the second dropdown (if there are more than one child)
3. A list of all feeding records for that child will then appear with the babysitters initials on the card (To inform the parent this record was added by the babysitter)

**Adding Feeding Records**
1. Click the **"Add"** button (bottom right)
2. Enter the corresponding feeding record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the list of feeding records for that child with the babysitters initials on the card (To inform the parent this record was added by the babysitter)

**Filtering Feeding Records**
1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of feeding records will be filtered accordingly


#### Observation Notes
**Viewing Observation Records**
1. Select "Observation Notes" from the first dropdown
2. Select one of the parent's children from the second dropdown (if there are more than one child)
3. A list of all observation records for that child will then appear

**Adding Observation Records**
1. Click the **"Add"** button (bottom right)
2. Enterr the corresponding observation record details
3. Click **"Add"** to save or **"Cancel"** to cancel
4. The new record will be saved to the list of observation records for that child with the babysitters initials on the card (To inform the parent this record was added by the babysitter)

**Filtering Observation Records**
1. Click the **Filter** icon (top right)
2. Select a filter option
3. The list of observation records will be filtered accordingly

</details>

<details>
<summary><h3>Assigned Tasks</h3></summary>

**Viewing Tasks**
1. All tasks will be displayed on the main tasks page showing the task title, pending or completed status, assigned baby and which parent assigned the task

**Completing Tasks**
1. Once a task is completed, click on the task card
2. The task card will expand and you can add completion notes (optional) or click **"Mark Complete"** to mark the task as completed or **"Cancel"** to cancel
3. This will update the task status to completed and save the completion notes (if any)
4. The information will be sent to the parent account for them to see the completed task (and optional completion notes)
</details>

<details>
<summary><h3>Messages</h3></summary>

(Note: In order to view messages, a parent account must set up a shared account with you (A babysitter account))

**Unread Messages**
1. There will be a red circle badge in the top right corner of the messages navigation tab (At the bottom of the applicaton) with a number indicating the number of unread messages
2. The unread messages will be in a bolded font and have a green circle bage indicating the number of unread messages in the corrisponding conversation with a parent
2. Once you have read the messages, the badges will disappear

**Viewing Conversations**
1. All conversations will be displayed on the main messages page (As conversation cards) showing the parent's name, the most recent message and the date/time of the most recent message.

**Viewing Conversation Messages**
1. Click the conversation card to view the messages for that conversation
2. A page will appear with a history of all messages from that conversation with the most recent message at the bottom
3. As a babysitter, your messages are in a green text bubble, while the parent's messages are in a white text bubble
4. You will see the time of each message underneath the message bubbles

**Sending Messages**
1. Type your message in the text box at the bottom of the page in the corresponding conversation with the parent
2. Click **"Send"** to send the message
3. The message will be sent to the parent and will appear in the conversation with the parent

</details>

<details>
<summary><h3>Settings</h3></summary>

#### Personal Information

**Viewing Personal Information**
1. Click on the Personal Information card and it will bring you to the Personal Information page
2. You can view your email address and change your password

**Changing Password**
1. In the first text input, enter a new password (min 8 chars, 1 uppercase, 1 number, 1 special char)
2. In the second text input, confirm the new password
3. Click **"Accept Changes"** button to save the new password
4. If the password is successful a success message will appear below the text inputs, otherwise an error message will appear


#### Shared Accounts

**Viewing Shared Accounts**
1. Click on the Shared Accounts card and it will bring you to the Shared Accounts page
2. Every shared account will be listed with the parents name and associated children that you (A babysitter account) have access to

**Verifying a Shared Account**
1. You should receive an email from ParentPal from the parent account that is requesting to share access with you to their childrens infromation
2. The email should contain information about how to create an account (if not already created) along with a 4-digit verification code
3. Once you have created an account (Or if you already have one) in the application, naviagte to the settings tab, then shared accounts, and you will see a section called "Add New Shared Account"
4. Enter the 4 digit verfication code in the corrisponding input boxes and click **"Verify Code"**
5. If successful, you will see a success message and the account will be added to your shared accounts list or an error message will appear

#### Deleting Account & Logging Out

**Delete Account**
1. In the settings tab, click on the red **"Delete Account"** button
2. A modal will appear with a delete account confirmation
3. Click **"Yes, Delete Account"** to delete the account or **"Cancel"** to cancel
4. Your account will be deleted and all associated data will be permanently deleted
5. You will then be redirected to the login page

**Log Out**
1. In the settings tab, click the blue **"Log Out"** button
2. This will log you our of the application and redirect you to the login page

</details>

<details>
<summary><h3> Photo Gallery</h3></summary>

#### Viewing Photos
1. From the main dashboard, click the **"Photo Gallery"** card under the "Photo Gallery" section
2. The photo gallery page will appear with a grid of photos that have been uploaded by a parent account or a verified shared babysitter account (Your account)

#### Uploading Photos
1. Click the **"Upload Photo"** button
2. A modal will appear where you can enter all the details for uploading a new photo
3. Enter in the corrisponding details
4. Click **"Upload"** to save or **"Cancel"** to cancel
5. The new photo will be uploaded to the photo gallery and will appear in the grid of photos with which baby the photo is associated with, and who uploaded it

</details>

<br/>

---

<div align="center">

![Security](https://img.shields.io/badge/Secure%20Connection-HTTPS%2FTLS-brightgreen?style=for-the-badge)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Firebase-blue?style=for-the-badge)
![Privacy](https://img.shields.io/badge/Data%20Privacy-Protected-orange?style=for-the-badge)

</div>

<br/>

<div align="center">

---

**© 2025 ParentPal. All rights reserved.**

Built with love for parents and babysitters everywhere

</div>
