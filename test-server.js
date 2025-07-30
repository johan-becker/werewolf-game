const express = require('express');

const app = express();
app.use(express.json());

// Test auth routes
app.post('/api/auth/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test registration endpoint working',
    body: req.body 
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test login endpoint working',
    body: req.body 
  });
});

// Test game routes
app.get('/api/games', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test games list endpoint working',
    data: []
  });
});

app.post('/api/games', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Test create game endpoint working',
    body: req.body 
  });
});

app.listen(3002, () => {
  console.log('Test server running on port 3002');
});