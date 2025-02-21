import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  UserPlusIcon, 
  XMarkIcon,
  PlayCircleIcon 
} from '@heroicons/react/24/outline';

function MatchSetup() {
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState({
    matchName: '',
    mode: 'deathmatch',
    map: '',
    players: []
  });
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const addPlayer = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      if (matchData.players.length >= 8) {
        setError('Maximum 8 players allowed');
        return;
      }
      if (matchData.players.find(p => p.name === playerName.trim())) {
        setError('Player name already exists');
        return;
      }
      setMatchData(prev => ({
        ...prev,
        players: [...prev.players, { 
          name: playerName.trim(), 
          kills: 0, 
          deaths: 0, 
          assists: 0,
          headshots: 0,
          accuracy: 0,
          killStreak: 0,
          bestKillStreak: 0
        }]
      }));
      setPlayerName('');
      setError('');
    }
  };

  const removePlayer = (index) => {
    setMatchData(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (matchData.players.length < 2) {
      setError('Minimum 2 players required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/matches', {
        ...matchData,
        status: 'active',
        date: new Date(),
        duration: 0
      });
      navigate(`/match/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating match');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Setup New Match</h1>
        <p className="text-slate-400 mt-2">Configure your match settings and add players</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-6">
          {/* Match Details */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Match Name
            </label>
            <input
              type="text"
              value={matchData.matchName}
              onChange={(e) => setMatchData(prev => ({ ...prev, matchName: e.target.value }))}
              className="input-field w-full"
              placeholder="Enter match name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Game Mode
              </label>
              <select
                value={matchData.mode}
                onChange={(e) => setMatchData(prev => ({ ...prev, mode: e.target.value }))}
                className="input-field w-full"
              >
                <option value="deathmatch">Deathmatch</option>
                <option value="teamdeath">Team Deathmatch</option>
                <option value="ctf">Capture The Flag</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Map
              </label>
              <input
                type="text"
                value={matchData.map}
                onChange={(e) => setMatchData(prev => ({ ...prev, map: e.target.value }))}
                className="input-field w-full"
                placeholder="Enter map name"
              />
            </div>
          </div>
        </div>

        {/* Players Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Add Players
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="input-field flex-1"
              placeholder="Enter player name"
            />
            <button
              onClick={addPlayer}
              type="button"
              className="btn-secondary"
            >
              Add
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="space-y-2">
            {matchData.players.map((player, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <span className="text-slate-200">{player.name}</span>
                <button
                  type="button"
                  onClick={() => removePlayer(index)}
                  className="text-slate-400 hover:text-red-400"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={matchData.players.length < 2}
          className="btn-primary w-full flex items-center justify-center"
        >
          <PlayCircleIcon className="h-5 w-5 mr-2" />
          Start Match
        </button>
      </form>
    </div>
  );
}

export default MatchSetup; 