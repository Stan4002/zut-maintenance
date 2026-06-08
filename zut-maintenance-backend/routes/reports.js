const express = require('express');
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
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

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
    let sqlQuery = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM reports r
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
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
      `SELECT r.*, u.name as user_name, u.email as user_email
       FROM reports r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = $1`,
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
      `SELECT su.*, u.name as admin_name
       FROM status_updates su
       JOIN users u ON su.admin_id = u.id
       WHERE su.report_id = $1
       ORDER BY su.updated_at DESC`,
      [id]
    );

    report.status_updates = statusUpdatesResult.rows;

    return res.status(200).json(report);
  } catch (error) {
    console.error('Get report error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;