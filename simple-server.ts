import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Registration endpoint working',
    data: req.body 
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Login endpoint working',
    data: req.body 
  });
});

// Game endpoints
app.get('/api/games', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Games list endpoint working',
    data: []
  });
});

app.post('/api/games', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Create game endpoint working',
    data: req.body 
  });
});

app.get('/api/games/:id', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Get game endpoint working',
    data: { id: req.params.id }
  });
});

app.post('/api/games/:id/join', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Join game endpoint working',
    data: { id: req.params.id }
  });
});

app.post('/api/games/join/:code', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Join by code endpoint working',
    data: { code: req.params.code }
  });
});

app.delete('/api/games/:id/leave', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Leave game endpoint working',
    data: { id: req.params.id }
  });
});

app.post('/api/games/:id/start', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Start game endpoint working',
    data: { id: req.params.id }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});

export default app;