# Cafe Order Management System

A point-of-sale and kitchen workflow system for a small cafe. Staff take orders at the counter and track them through preparation; managers configure the menu and oversee operations.

Built for IFQ636 Assignment 1.

## Features

- **Menu management** (manager only): create, edit, and toggle availability of menu items across categories like Coffee, Food, and Pastry.
- **Order management** (staff and manager): place orders against menu items, track them through pending -> preparing -> ready -> completed.
- **Role-based access:** staff and manager roles with distinct permissions.

## Tech stack

- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (run locally via Docker Compose)
- **Auth:** JWT-based authentication

## Local setup

### Prerequisites

- Node.js 20+ (LTS)
- Docker Desktop

### Steps

1. Clone the repository.

2. Start MongoDB:

   ```bash
   docker compose up -d
   ```

3. Backend (in a new terminal):

   ```bash
   cd backend
   npm install
   cp .env.example .env   # then edit MONGO_URI if needed
   npm run dev
   ```

4. Frontend (in a new terminal):

   ```bash
   cd frontend
   npm install
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Project links

- **JIRA board:** _TBD_
- **Figma design:** _TBD_
- **Public URL (EC2):** _TBD_
- **Demo credentials:** _TBD_

## Roadmap

See JIRA for current sprint. Planned epics:

- Menu Management
- Order Management

## License

This project is submitted as coursework for IFQ636 and is not intended for production use.