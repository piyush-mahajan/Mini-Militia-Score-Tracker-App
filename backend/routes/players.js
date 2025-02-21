const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Create new player
router.post('/', async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get player stats
router.get('/:id/stats', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    res.json(player);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router; 