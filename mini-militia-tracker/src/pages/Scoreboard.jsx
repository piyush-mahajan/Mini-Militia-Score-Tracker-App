import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CloudArrowUpIcon, 
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

function ScoreInput({ value, onChange, className }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
      className={`score-input ${className}`}
      min="0"
    />
  );
}

function PlayerScore({ player, onUpdate, index }) {
  const [directKills, setDirectKills] = useState(player.kills);
  const [directDeaths, setDirectDeaths] = useState(player.deaths);
  const [directAssists, setDirectAssists] = useState(player.assists);

  const handleDirectUpdate = async () => {
    try {
      await onUpdate(index, {
        kills: directKills,
        deaths: directDeaths,
        assists: directAssists
      });
    } catch (error) {
      console.error('Error updating scores:', error);
    }
  };

  return (
    <tr className="border-b border-slate-700/50">
      <td className="p-3">
        <div className="player-name">
          <span className="game-name">{player.name}</span>
          {player.realName && (
            <span className="real-name">({player.realName})</span>
          )}
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <ScoreInput
            value={directKills}
            onChange={setDirectKills}
            className="bg-green-900/30 border-green-700/50"
          />
          <button
            onClick={() => onUpdate(index, { kills: player.kills + 1 })}
            className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            +1
          </button>
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <ScoreInput
            value={directDeaths}
            onChange={setDirectDeaths}
            className="bg-red-900/30 border-red-700/50"
          />
          <button
            onClick={() => onUpdate(index, { deaths: player.deaths + 1 })}
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            +1
          </button>
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <ScoreInput
            value={directAssists}
            onChange={setDirectAssists}
            className="bg-blue-900/30 border-blue-700/50"
          />
          <button
            onClick={() => onUpdate(index, { assists: player.assists + 1 })}
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            +1
          </button>
        </div>
      </td>
      <td className="p-3 text-center">
        {(player.kills / (player.deaths || 1)).toFixed(2)}
      </td>
      <td className="p-3 text-center">
        <button
          onClick={handleDirectUpdate}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Update
        </button>
      </td>
    </tr>
  );
}

function Scoreboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/matches/${id}`);
      setMatch(response.data);
    } catch (error) {
      console.error('Error fetching match:', error);
    }
  };

  const updatePlayerScores = async (playerIndex, scores) => {
    const updatedPlayers = [...match.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      ...scores
    };
    
    try {
      await axios.patch(`http://localhost:5000/api/matches/${id}/scores`, {
        players: updatedPlayers
      });
      setMatch(prev => ({ ...prev, players: updatedPlayers }));
    } catch (error) {
      console.error('Error updating scores:', error);
    }
  };

  const finishMatch = async () => {
    try {
      // Get the MVP based on kills
      const mvp = match.players.reduce((prev, current) => 
        (current.kills > prev.kills) ? current : prev
      );

      await axios.patch(`http://localhost:5000/api/matches/${id}/end`, {
        status: 'completed',
        winner: mvp.name,
        duration: Math.floor((Date.now() - new Date(match.date).getTime()) / 60000) // duration in minutes
      });

      navigate(`/summary/${id}`);
    } catch (error) {
      setError('Failed to end match. Please try again.');
      console.error('Error ending match:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Preview image
    setPreviewImage(URL.createObjectURL(file));
    setError('');

    const formData = new FormData();
    formData.append('scoreboard', file);

    try {
      setProcessing(true);
      const response = await axios.post(
        `http://localhost:5000/api/matches/${id}/process-scoreboard`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMatch(prev => ({
        ...prev,
        players: response.data.players
      }));
    } catch (error) {
      setError('Failed to process scoreboard image. Please try again.');
      console.error('Error processing scoreboard:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (!match) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{match.matchName}</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
          {match.mode}
        </span>
      </div>

      <div className="card overflow-x-auto">
        <table className="match-table">
          <thead>
            <tr>
              <th>Player</th>
              <th className="text-center">Kills</th>
              <th className="text-center">Deaths</th>
              <th className="text-center">Assists</th>
              <th className="text-center">K/D</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {match.players.map((player, index) => (
              <PlayerScore
                key={index}
                player={player}
                index={index}
                onUpdate={updatePlayerScores}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Upload Section */}
      <div className="mt-8 p-6 bg-slate-800 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 text-white">
          Upload Scoreboard Image
        </h3>
        
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-slate-600 hover:border-slate-500">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <CloudArrowUpIcon className="w-10 h-10 mb-3 text-slate-400" />
              <p className="mb-2 text-sm text-slate-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-500">
                PNG, JPG or JPEG (MAX. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={processing}
            />
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {previewImage && (
          <div className="mt-4 relative">
            <img
              src={previewImage}
              alt="Scoreboard preview"
              className="rounded-lg max-h-96 mx-auto"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {processing && (
          <div className="mt-4 flex items-center justify-center text-slate-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400 mr-2"></div>
            Processing scoreboard...
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={finishMatch}
          disabled={processing}
          className={`btn-primary flex items-center ${
            processing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          End Match
        </button>
      </div>
    </div>
  );
}

export default Scoreboard; 