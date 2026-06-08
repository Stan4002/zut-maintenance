# ZUT Maintenance Reporter Backend

Complete Express.js + PostgreSQL backend for the university maintenance reporting system.

## Setup

The application will automatically create the required folder structure on first run:
- **db/** - Database configuration
- **routes/** - API route handlers  
- **middleware/** - Authentication middleware
- **uploads/** - Uploaded image storage

## Installation

All dependencies are already installed:
```bash
npm install
```

## Environment Variables

Configure `.env` with your database credentials:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/zut_maintenance
JWT_SECRET=your_secret_key_here
```

## Database Schema

You need to create these tables in PostgreSQL:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_path VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Status updates table
CREATE TABLE status_updates (
  id SERIAL PRIMARY KEY,
  report_id INT NOT NULL REFERENCES reports(id),
  admin_id INT NOT NULL REFERENCES users(id),
  note TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_status_updates_report_id ON status_updates(report_id);
```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register new user
  - Body: `{ name, email, password, role: 'student' | 'admin' }`
  - Returns: `{ message: 'Registered successfully' }`

- **POST /api/auth/login** - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user: { id, name, email, role } }`

### Reports

- **POST /api/reports** - Create new report (requires auth)
  - Body: `multipart/form-data { title, description, location, category, image }`
  - Returns: Created report object
  
- **GET /api/reports/mine** - Get user's reports (requires auth)
  - Returns: Array of reports where user_id matches
  
- **GET /api/reports** - Get all reports (requires admin)
  - Query params: `?status=Pending&category=Electrical`
  - Returns: Array of reports with user details
  
- **PATCH /api/reports/:id/status** - Update report status (requires admin)
  - Body: `{ status, note }`
  - Returns: `{ message: 'Status updated' }`
  
- **GET /api/reports/:id** - Get single report (requires auth)
  - Returns: Report object with status updates
  - Note: Students can only access their own reports; admins can access any

## Running the Server

```bash
node index.js
```

The server will:
1. Automatically create the required folder structure
2. Load environment variables from `.env`
3. Start Express server on PORT 5000
4. Be ready to accept API requests

## Features

✅ JWT-based authentication with 7-day expiration
✅ Role-based access control (student/admin)
✅ Password hashing with bcryptjs
✅ File upload support with multer
✅ PostgreSQL database integration
✅ Comprehensive error handling
✅ CORS enabled for cross-origin requests
✅ Static file serving for uploads

## Security Notes

- Never expose the JWT_SECRET in version control
- Always use HTTPS in production
- Keep PostgreSQL credentials secure
- Validate and sanitize all user inputs
- Never return passwords in API responses
- Use parameterized queries to prevent SQL injection (already implemented)

## Development

The backend is fully implemented with:
- No ORM - Raw SQL queries using pg package
- Async/await with try/catch error handling
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Middleware for authentication and authorization
- Request logging for database queries
