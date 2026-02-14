import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Example protected route
router.get('/', verifyToken, (req, res) => {
  res.json({
    message: 'Users list',
    user: req.user,
    data: []
  });
});

router.get('/:id', verifyToken, (req, res) => {
  res.json({
    id: req.params.id,
    name: 'Example User',
    email: 'user@example.com'
  });
});

export default router;
