import { Router } from 'express';

const router = Router();

// Game management routes - simple versions for testing
router.post('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Create game endpoint working',
    data: { 
      id: 'test-game-id',
      name: req.body.name || 'Test Game',
      code: 'ABC123',
      maxPlayers: req.body.maxPlayers || 10
    }
  });
});

router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'List games endpoint working',
    data: [
      { id: 'game-1', name: 'Test Game 1', code: 'ABC123', status: 'waiting', currentPlayers: 2, maxPlayers: 10 },
      { id: 'game-2', name: 'Test Game 2', code: 'XYZ789', status: 'waiting', currentPlayers: 5, maxPlayers: 8 }
    ],
    pagination: {
      limit: parseInt(req.query.limit as string) || 20,
      offset: parseInt(req.query.offset as string) || 0
    }
  });
});

router.get('/:id', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Get game details endpoint working',
    data: {
      id: req.params.id,
      name: 'Test Game',
      code: 'ABC123',
      status: 'waiting',
      currentPlayers: 3,
      maxPlayers: 10,
      players: [
        { userId: 'user-1', username: 'Player1', isHost: true, isAlive: true },
        { userId: 'user-2', username: 'Player2', isHost: false, isAlive: true },
        { userId: 'user-3', username: 'Player3', isHost: false, isAlive: true }
      ]
    }
  });
});

router.post('/:id/join', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Join game endpoint working',
    data: { gameId: req.params.id, joined: true }
  });
});

router.post('/join/:code', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Join by code endpoint working',
    data: { code: req.params.code, joined: true }
  });
});

router.delete('/:id/leave', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Leave game endpoint working',
    data: { gameId: req.params.id, left: true }
  });
});

router.post('/:id/start', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Start game endpoint working',
    data: { gameId: req.params.id, started: true }
  });
});

export default router;