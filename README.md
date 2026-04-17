# User Management System

A full-stack User Management System built using the MERN stack. The application supports authentication, role-based access control, and admin-level user management.

---

## Live Links

* Frontend: https://user-management-system-by-nazish.netlify.app/
* Backend: https://user-management-system-oxwf.onrender.com/
* GitHub: https://github.com/nazish-parvez/User-Management-System

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Secure password hashing

### User

* View profile
* Update own name
* Protected routes

### Admin

* View all users
* Search users
* Pagination
* Edit user details
* Soft delete users (mark as inactive)
* Role-based access control

---

## Tech Stack

### Frontend

* React
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* JWT
* bcrypt

---

## Project Structure

### Backend

```
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 └── server.js
```

### Frontend

```
frontend/
 ├── src/
 │    ├── components/
 │    ├── pages/
 │    ├── utils/
 │    └── App.jsx
```

---

## Installation

### Clone the repository

```
git clone https://github.com/nazish-parvez/User-Management-System.git
cd User-Management-System
```

---

### Backend setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Run backend:

```
npm run dev
```

---

### Frontend setup

```
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Users

* GET /api/users/me
* PUT /api/users/me
* GET /api/users (admin only)
* PUT /api/users/:id (admin only)
* DELETE /api/users/:id (admin only)

---

## Key Concepts

* JWT Authentication
* Role-Based Access Control
* Protected Routes
* REST API Design
* Pagination and Search
* Soft Delete

---

## Future Improvements

* Add user avatars
* Improve UI/UX
* Add global state management
* Restore deleted users feature

---

## Author

S Nazish Parvez
