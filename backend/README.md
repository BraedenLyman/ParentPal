# ParentPal Backend API Documentation

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

### REST API & Database Documentation

</div>

---

## 📑 Table of Contents
1. [Overview](#-overview)
2. [APIs](#-apis)
   - [Authentication](#authentication-apis)
   - [Application](#application-apis)
3. [Security](#-security)
4. [Developer Notes](#-developer-notes)

---

## 🧭 Overview
The **backend** powers the application’s data and authentication systems. It’s built with a focus on performance, scalability, and security.

### 🧱 Database Structure
**Database Type:** PostgreSQL

#### Example Schema:
**Users Table**
| Column | Type | Description |
|---------|------|-------------|
| id | INT / UUID | Unique identifier |
| name | VARCHAR | User’s full name |
| email | VARCHAR | Unique email address |
| password_hash | TEXT | Encrypted password |
| created_at | TIMESTAMP | Account creation date |

**Records Table**
| Column | Type | Description |
|---------|------|-------------|
| id | INT / UUID | Record ID |
| user_id | FK | Linked to Users table |
| metric | VARCHAR | Measurement or data point |
| value | FLOAT | Recorded value |
| timestamp | TIMESTAMP | Date and time of record |

**Relationships:**
- `Users (1) ——> (∞) Records`
- `Each user` can have multiple `records`, linked by `user_id`.

### 🧰 Back-End Stack
- **Language:** Node.js / Python / Java / Go  
- **Framework:** Express.js / FastAPI / Spring Boot / NestJS  
- **Database:** PostgreSQL / MongoDB / MySQL  
- **ORM / ODM:** Prisma / Sequelize / Mongoose  
- **Authentication:** JWT / OAuth 2.0 / Firebase Auth  
- **Hosting:** Render / AWS / Railway / Heroku  

---

## 🔌 APIs

### 🧩 Authentication APIs
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/register` | POST | Registers a new user |
| `/api/auth/login` | POST | Authenticates user and returns JWT token |
| `/api/auth/logout` | POST | Ends user session |
| `/api/auth/refresh` | POST | Refreshes JWT token before expiry |

**Details:**
- Tokens expire after X hours.  
- Passwords hashed with bcrypt.  
- All routes protected with middleware.  

---

### ⚙️ Application APIs

#### 👤 User Management
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/users/:id` | GET | Retrieves user data |
| `/api/users/:id` | PUT | Updates user profile |
| `/api/users/:id` | DELETE | Deletes user account |

#### 📈 Growth Tracker / Records
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/records` | GET | Fetch all user records |
| `/api/records` | POST | Add new record |
| `/api/records/:id` | PUT | Update existing record |
| `/api/records/:id` | DELETE | Remove record |

#### 📊 Analytics
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/analytics/summary` | GET | Returns summarized user stats |
| `/api/analytics/trends` | GET | Returns trend data over time |

---

## 🔐 Security
- All endpoints require **JWT-based authentication**.  
- **CORS policies** enforced to prevent unauthorized API access.  
- **Rate limiting** applied to prevent abuse.  
- **Data validation** on all inputs.

---

## 🧠 Developer Notes
- Use `.env` for storing environment variables.  
- Run database migrations using:  
  ```bash
  npx prisma migrate deploy
