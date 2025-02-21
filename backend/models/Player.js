const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalMatches: { type: Number, default: 0 },
  totalKills: { type: Number, default: 0 },
  totalDeaths: { type: Number, default: 0 },
  totalAssists: { type: Number, default: 0 }
});

module.exports = mongoose.model('Player', playerSchema); 