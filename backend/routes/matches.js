const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const multer = require('multer');
const { processScoreboardImage } = require('../services/ocrService');

// Configure multer for image upload
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all matches with optional filters
router.get('/', async (req, res) => {
  try {
    const { limit, mode, status } = req.query;
    let query = {};
    
    if (mode) query.mode = mode;
    if (status) query.status = status;
    
    const matches = await Match.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit) || 0);
      
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get match statistics
router.get('/stats', async (req, res) => {
  try {
    const totalMatches = await Match.countDocuments();
    const matches = await Match.find();
    
    const stats = matches.reduce((acc, match) => {
      acc.totalPlayers += match.players.length;
      acc.totalKills += match.players.reduce((sum, p) => sum + p.kills, 0);
      return acc;
    }, { totalPlayers: 0, totalKills: 0 });

    res.json({
      totalMatches,
      totalPlayers: stats.totalPlayers,
      avgKills: totalMatches ? stats.totalKills / totalMatches : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new match
router.post('/', async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update match scores
router.patch('/:id/scores', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    match.players = req.body.players;
    if (req.body.status) match.status = req.body.status;
    if (req.body.winner) match.winner = req.body.winner;
    
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// End match
router.patch('/:id/end', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    match.status = 'completed';
    match.duration = req.body.duration;
    match.winner = req.body.winner;
    
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Process scoreboard image and update match
router.post('/:id/process-scoreboard', upload.single('scoreboard'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Store the image
    match.scoreboardImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    // Process the image and get player scores
    const processedScores = await processScoreboardImage(req.file.buffer);

    // Validate and update player scores
    const updatedPlayers = match.players.map(player => {
      const scoreData = processedScores.find(
        score => score.name.toLowerCase().includes(player.name.toLowerCase()) ||
                player.name.toLowerCase().includes(score.name.toLowerCase())
      );
      
      if (scoreData) {
        return {
          ...player.toObject(),
          kills: scoreData.kills,
          deaths: scoreData.deaths,
          score: scoreData.score
        };
      }
      return player;
    });

    match.players = updatedPlayers;
    await match.save();

    res.json({ 
      message: 'Scoreboard processed successfully',
      players: updatedPlayers,
      imageUrl: `/api/matches/${match._id}/scoreboard-image`
    });
  } catch (error) {
    console.error('Scoreboard processing error:', error);
    res.status(500).json({ message: 'Error processing scoreboard' });
  }
});

// Add endpoint to retrieve scoreboard image
router.get('/:id/scoreboard-image', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match || !match.scoreboardImage) {
      return res.status(404).json({ message: 'Scoreboard image not found' });
    }

    res.set('Content-Type', match.scoreboardImage.contentType);
    res.send(match.scoreboardImage.data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving scoreboard image' });
  }
});

module.exports = router; 