import { Router } from 'express';

const router = Router();

// Simple test routes without middleware
router.post('/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Registration endpoint working',
    body: req.body 
  });
});

router.post('/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Login endpoint working',
    body: req.body 
  });
});

router.get('/login', (req, res) => {
  res.status(405).json({ 
    success: false, 
    error: 'Method Not Allowed. Use POST method for login',
    correctUsage: 'POST /api/auth/login with JSON body: {"email": "...", "password": "..."}'
  });
});

export default router;