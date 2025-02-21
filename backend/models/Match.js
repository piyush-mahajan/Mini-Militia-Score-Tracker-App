const mongoose = require('mongoose');

const playerScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  realName: { type: String },
  kills: { type: Number, default: 0 },
  deaths: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  headshots: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  killStreak: { type: Number, default: 0 },
  bestKillStreak: { type: Number, default: 0 }
});

const matchSchema = new mongoose.Schema({
  matchName: { type: String, required: true },
  mode: { 
    type: String, 
    required: true,
    enum: ['deathmatch', 'teamdeath', 'ctf']
  },
  map: { type: String },
  duration: { type: Number }, // in minutes
  date: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active' 
  },
  players: [playerScoreSchema],
  teams: [{
    name: String,
    score: Number,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
  }],
  winner: {
    type: String, // player name or team name
    default: null
  },
  highlights: [{
    type: String,
    player: String,
    description: String,
    timestamp: Date
  }],
  scoreboardImage: {
    data: Buffer,
    contentType: String
  }
});

// Calculate K/D ratio
matchSchema.methods.getPlayerKD = function(playerName) {
  const player = this.players.find(p => p.name === playerName);
  if (!player) return 0;
  return player.kills / (player.deaths || 1);
};

// Get match MVP
matchSchema.methods.getMVP = function() {
  return this.players.reduce((mvp, player) => {
    const score = player.kills * 100 + player.assists * 50 - player.deaths * 30;
    return score > mvp.score ? { name: player.name, score } : mvp;
  }, { name: '', score: -Infinity });
};

module.exports = mongoose.model('Match', matchSchema); 