# Invoice Management System

> IFQ636 Software Lifecycle Management Assignment Project

[![CI Pipeline Status](https://github.com/coolekul29/grocery-delivery-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/coolekul29/grocery-delivery-platform/actions)

[![CI Pipeline Status](https://github.com/harshanet/invoice-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/harshanet/invoice-management-system/actions)

---

# 1. Project Overview

The Invoice Management System is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The system allows customers to browse grocery products, search and filter products, add items to a shopping cart, place orders, and manage their accounts. Administrators can manage products, upload product images, and update customer orders through a dedicated administration dashboard.

The project was developed as part of IFQ636 Software Lifecycle Management and demonstrates software engineering practices including requirements analysis, UI/UX design, version control, CI/CD automation, cloud deployment, and project management.

---

# 2. Features

## Customer Features

- Register a new account
- Login and logout securely
- Browse grocery products
- Search products by name
- Filter products by category
- Add products to cart
- Remove products from cart
- Place orders
- View order confirmation
- Update user profile

## Admin Features

- Add new products
- Upload product images
- Edit product details
- Delete products
- View customer orders
- Update order status
- Delete orders

---

# 3. Technology Stack

## Frontend

- React.js
- React Router
- Bootstrap 5
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Multer (Image Upload)

## DevOps and Tools

- GitHub
- GitHub Actions
- AWS EC2 Ubuntu
- PM2
- Jira
- Figma
- Postman

---

# 4. System Architecture

- React Frontend
- Express REST API
- MongoDB Atlas

---

# 5. Git Branching Strategy

- Feature Branch
- Develop Branch
- Release Branch
- Master Branch

---

# 6. CI/CD Pipeline

GitHub Actions is used to automate build validation and deployment.

### Deployment Flow

- Feature
- Develop
- Release
- Master
- GitHub Actions
- AWS EC2 Deployment
- PM2 Restart

### Pipeline Activities

- Install dependencies
- Run automated validation
- Build React frontend
- Deploy latest code to AWS EC2
- Restart backend service
- Restart frontend service
- Save PM2 process configuration

---

# 7. Local Setup

## 1. Clone the Repository

git clone https://github.com/coolekul29/grocery-delivery-platform.git 

cd grocery-delivery-platform

## 2. Install Dependencies

npm install

npm install --prefix backend

npm install --prefix frontend

## 3. Configure Environment Variables

### Backend (.env)

PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

### Frontend (.env)

REACT_APP_API_URL=http://localhost:5001/api

## 4. Run the Application

### Start Backend

npm start --prefix backend

### Start Frontend

npm start --prefix frontend

---

# 8. Public Project URL

### Live Application

http://YOUR-EC2-PUBLIC-IP/products

Replace the URL above with your deployed AWS EC2 public IP address.

---

# 9. Test Login Details

## Admin Account

Email : test4@test.com.au
Password : test4test123

## Customer Account

Email : test5@test.com.au
Password : test5test123

---

# 10. Deployment

The application is deployed using:

- AWS EC2 Ubuntu Server
- MongoDB Atlas
- GitHub Actions
- GitHub Self-Hosted Runner
- PM2 Process Manager

PM2 is configured to automatically restart application services when the EC2 instance is restarted.

---

# 11. Project Structure

invoice-management-system

    - backend
        - config
        - controllers
        - middleware
        - models
        - routes
        - uploads
    - frontend
        - public
        - src
        - build
    - .github
        - workflows
    - README.md

---

# 12. Testing

The following testing activities were completed:

- User Authentication Testing
- Product CRUD Testing
- Product Image Upload Testing
- Shopping Cart Testing
- Order Management Testing
- API Testing using Postman
- GitHub Actions Pipeline Testing
- AWS Deployment Testing

---

# 13. Project Artefacts

This project includes:

- Requirements Analysis
- SysML Diagrams
- Jira Project Board
- User Stories
- Figma UI/UX Prototype
- GitHub Repository
- CI/CD Pipeline
- AWS Cloud Deployment

---

# 14. Author

**Harsha Joshi**

Master of Information Technology (Software Development)

Queensland University of Technology (QUT)

IFQ636 Software Lifecycle Management

2026
