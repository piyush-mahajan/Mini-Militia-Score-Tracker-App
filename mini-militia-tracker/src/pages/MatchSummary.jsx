import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { TrophyIcon, ChartBarIcon, ShareIcon } from '@heroicons/react/24/solid';
import config from '../config/config';

function MatchSummary() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/matches/${id}`);
      const matchData = response.data;
      // Sort players by kills in descending order
      matchData.players.sort((a, b) => b.kills - a.kills);
      setMatch(matchData);
    } catch (error) {
      console.error('Error fetching match:', error);
    }
  };

  if (!match) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const getMVP = () => match.players[0];
  const getKDRatio = (kills, deaths) => (kills / (deaths || 1)).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h2 className="text-3xl font-bold">{match.matchName}</h2>
          <div className="flex items-center mt-2 text-blue-100">
            <span className="mr-4">{match.mode}</span>
            <span>{new Date(match.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* MVP Section */}
        <div className="p-6 bg-blue-50">
          <div className="flex items-center">
            <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-blue-500">Match MVP</h3>
              <p className="text-gray-600">{getMVP().name} - {getMVP().kills} kills</p>
            </div>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-500">
            <ChartBarIcon className="h-6 w-6 mr-2 text-blue-500" />
            Final Scoreboard
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-black">  
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Player</th>
                  <th className="px-4 py-3 text-center">Kills</th>
                  <th className="px-4 py-3 text-center">Deaths</th>
                  <th className="px-4 py-3 text-center">Assists</th>
                  <th className="px-4 py-3 text-center">K/D</th>
                </tr>
              </thead>
              <tbody>
                {match.players.map((player, index) => (
                  <tr key={index} className={`border-t ${index === 0 ? 'bg-yellow-50 text-black' : ''}`}>
                    <td className="px-4 py-3 text-black">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-black">{player.name}</td>
                    <td className="px-4 py-3 text-center text-black">{player.kills}</td>
                    <td className="px-4 py-3 text-center text-black">{player.deaths}</td>
                    <td className="px-4 py-3 text-center text-black">{player.assists}</td>
                    <td className="px-4 py-3 text-center text-black">
                      {getKDRatio(player.kills, player.deaths)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scoreboard Image Section */}
        {match.scoreboardImage && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Final Scoreboard</h3>
            <div className="bg-slate-800 rounded-xl p-4">
              <img
                src={`${config.API_URL}/matches/${match._id}/scoreboard-image`}
                alt="Match Scoreboard"
                className="rounded-lg max-w-full mx-auto"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 bg-gray-50 flex justify-between items-center">
          <Link
            to="/history"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Match History
          </Link>
          <button
            onClick={() => {/* Implement share functionality */}}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default MatchSummary; 