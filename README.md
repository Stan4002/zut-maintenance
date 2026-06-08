# ZUT Maintenance Reporter

A full-stack web application developed for the Zambia University of Technology (ZUT) 
that allows students and staff to report maintenance issues on campus, and enables 
administrators to track and resolve them.

## Built With
- **Frontend:** React.js, React Router, Axios, Vite
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **File Uploads:** Multer

## Features
- User registration and login with role-based access (Student / Admin)
- Students can submit maintenance reports with photo attachments
- Students can view and delete their own pending reports
- Admins can view all reports, filter by status and category, and update report status
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Backend Setup
```bash
cd zut-maintenance-backend
npm install
# Update .env with your PostgreSQL credentials
node index.js
```

### Frontend Setup
```bash
cd zut-maintenance-frontend
npm install
npm run dev
```

### Default Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Student | student@zut.ac.zm | password123 |
| Admin | admin@zut.ac.zm | password123 |

## Database Setup
Run the SQL in `zut-maintenance-backend/db/schema.sql` in PostgreSQL to create the required tables.

## Developer
Stanley Mapalo Kapeta — 2300704
Zambia University of Technology
Full-Stack Web Development — Final Project 2026
