# Learning Resource Library

A full-stack web application for browsing, managing, and bookmarking learning resources. Built with React, Node.js, Express, and MongoDB.

## Features

- Browse and search learning resources by keyword, category, and difficulty
- View detailed resource information
- Bookmark resources to revisit later
- Admin panel to create, edit, and delete resources and categories

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT

## Prerequisites

- Node.js v18+
- MongoDB

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Booleanruntime/Learning-Resource-Library.git
cd Learning-Resource-Library
```

### 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

### 3. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Run the app

In separate terminals:

```bash
# Backend (from /backend)
npm start

# Frontend (from /frontend)
npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5001`.

## Test Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@example.com | password123 |
| User  | user@example.com | password123 |

## Project Links

- **Live app:** TBD
- **JIRA board:** TBD
