const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const dirs = ['db', 'routes', 'middleware', 'uploads'];

try {
  dirs.forEach(dir => {
    const dirPath = path.join(baseDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  });

  // Now create all the necessary files
  
  // db/index.js
  const dbContent = `const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
};

module.exports = { query, pool };`;
  
  const dbPath = path.join(baseDir, 'db', 'index.js');
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, dbContent);
    console.log(`Created file: ${dbPath}`);
  }

  // middleware/auth.js
  const authMiddlewareContent = `const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { verifyToken, requireAdmin };`;
  
  const authMiddlewarePath = path.join(baseDir, 'middleware', 'auth.js');
  if (!fs.existsSync(authMiddlewarePath)) {
    fs.writeFileSync(authMiddlewarePath, authMiddlewareContent);
    console.log(`Created file: ${authMiddlewarePath}`);
  }

  // routes/auth.js
  const authRoutesContent = `const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db/index.js');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const result = await query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const result = await query('SELECT id, name, email, role, password FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;`;
  
  const authRoutesPath = path.join(baseDir, 'routes', 'auth.js');
  if (!fs.existsSync(authRoutesPath)) {
    fs.writeFileSync(authRoutesPath, authRoutesContent);
    console.log(`Created file: ${authRoutesPath}`);
  }

  // routes/reports.js
  const reportsRoutesContent = `const express = require('express');
const multer = require('multer');
const path = require('path');
const { query } = require('../db/index.js');
const { verifyToken, requireAdmin } = require('../middleware/auth.js');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage, fileFilter: (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
}});

// POST /api/reports - protected (verifyToken)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, category } = req.body;
    const imagePath = req.file ? \`/uploads/\${req.file.filename}\` : null;

    if (!title || !description || !location || !category) {
      return res.status(400).json({ message: 'Title, description, location, and category are required' });
    }

    const result = await query(
      'INSERT INTO reports (user_id, title, description, location, category, image_path, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, title, description, location, category, imagePath, 'Pending']
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create report error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/reports/mine - protected (verifyToken)
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get my reports error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/reports - protected (verifyToken + requireAdmin)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status, category } = req.query;
    let sqlQuery = \`
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM reports r
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    \`;
    const params = [];

    if (status) {
      sqlQuery += ' AND r.status = $' + (params.length + 1);
      params.push(status);
    }

    if (category) {
      sqlQuery += ' AND r.category = $' + (params.length + 1);
      params.push(category);
    }

    sqlQuery += ' ORDER BY r.created_at DESC';

    const result = await query(sqlQuery, params);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get all reports error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/reports/:id/status - protected (verifyToken + requireAdmin)
router.patch('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Update report status
    await query(
      'UPDATE reports SET status = $1 WHERE id = $2',
      [status, id]
    );

    // Insert status update record
    if (note) {
      await query(
        'INSERT INTO status_updates (report_id, admin_id, note) VALUES ($1, $2, $3)',
        [id, req.user.id, note]
      );
    }

    return res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/reports/:id - protected (verifyToken)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get report
    const reportResult = await query(
      \`SELECT r.*, u.name as user_name, u.email as user_email
       FROM reports r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = $1\`,
      [id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = reportResult.rows[0];

    // Check authorization: students can only see their own reports
    if (req.user.role !== 'admin' && report.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get status updates
    const statusUpdatesResult = await query(
      \`SELECT su.*, u.name as admin_name
       FROM status_updates su
       JOIN users u ON su.admin_id = u.id
       WHERE su.report_id = $1
       ORDER BY su.updated_at DESC\`,
      [id]
    );

    report.status_updates = statusUpdatesResult.rows;

    return res.status(200).json(report);
  } catch (error) {
    console.error('Get report error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;`;
  
  const reportsRoutesPath = path.join(baseDir, 'routes', 'reports.js');
  if (!fs.existsSync(reportsRoutesPath)) {
    fs.writeFileSync(reportsRoutesPath, reportsRoutesContent);
    console.log(`Created file: ${reportsRoutesPath}`);
  }

} catch (error) {
  console.error('Failed to setup files:', error);
}
