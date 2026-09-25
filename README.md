# Galaxy Hotel Management System

A modern hotel booking and operations platform built for internship practice and real-world business use. This project demonstrates a complete end-to-end workflow for managing room inventory, customer records, reservations, and administrative operations in a hotel environment.

## Project Overview

The system is designed to streamline hotel operations by providing:
- A user-friendly customer-facing booking experience
- A role-based admin dashboard for hotel staff
- Secure authentication and session handling
- Room category and room management
- Reservation workflows including create, edit, and cancellation operations
- Reporting and customer management features

This project is suitable for an internship report because it showcases practical software engineering skills including full-stack development, database modeling, API design, UI/UX work, and deployment-ready configuration.

## Business Problem

Hotels often manage bookings, room availability, customer details, and financial records through fragmented manual processes. This leads to delays, inaccuracies, poor tracking, and inefficient customer service. The goal of this project is to centralize these operations in one digital system.

## Objectives

- Build a responsive hotel booking application
- Manage customer and staff access with role-based authorization
- Simplify room and booking management
- Provide a clean dashboard for hotel administration
- Deliver a professional, production-like web application experience

## Core Features

### Customer Experience
- Browse hotel rooms and room categories
- View luxury accommodation options
- Book a room through a guided flow
- Review hotel amenities and contact information

### Administrative Features
- Dashboard overview for operational management
- Manage users and admin profiles
- Add, edit, and delete room categories
- Manage customer records and bookings
- Track booking status and check-in/check-out flows

### Security and Access
- Secure login and session handling
- Role-based permissions for admin and staff actions
- Protected pages and dashboard routes

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Flowbite React
- Redux Toolkit
- Framer Motion

### Backend
- Node.js
- Express.js
- Sequelize ORM
- SQLite for local development
- MySQL-ready production configuration

### Other Tools
- Firebase for profile image uploads
- Docker support
- Git and GitHub for project version control

## Project Structure

```text
Hotel-Booking-Management-System/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
├── docker-compose.yml
├── README.md
└── package.json
```

## Installation and Setup

### Prerequisites
- Node.js 18 or later
- npm or yarn
- SQLite for local development

### 1. Clone the repository

```bash
git clone <repository-url>
cd Hotel-Booking-Management-System
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment

Copy the example environment file and update values if needed.

```bash
cd backend
cp .env.example .env
```

For local development, the app is already configured to run with SQLite and a development secret key. Adjust values if you are switching to MySQL or production settings.

### 5. Run the application

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open the app in your browser:

```text
http://localhost:5173
```

## Database Overview

The application uses a relational model with entities including:
- Users
- Roles and access permissions
- Rooms
- Room categories
- Customers
- Bookings
- Check-in and check-out records
- Payments
- Audit logs
- Feedback

## Role-Based Access

The project includes separated responsibilities for:
- Admin
- Manager
- Receptionist

This makes the system more realistic for enterprise hotel operations and demonstrates proper access control patterns.

## Internship Report Value

This project highlights the following skills often expected in software engineering internships:
- Full-stack web development
- Database design and integration
- REST API creation
- Frontend architecture with reusable components
- Authentication and authorization
- Responsive UI design
- Deployment readiness and environment configuration

## Suggested Future Enhancements

- Real-time room availability updates
- Payment gateway integration
- Email and SMS notifications
- Advanced analytics dashboard
- Multi-language support
- Mobile-first optimizations
- Cloud deployment with Azure or AWS

## License

This project is intended for educational and internship demonstration purposes.

## Conclusion

The Galaxy Hotel Management System is a complete and practical web application that demonstrates professional software development for a hotel business domain. It is structured to be both usable and presentation-ready for academic and internship reporting.
