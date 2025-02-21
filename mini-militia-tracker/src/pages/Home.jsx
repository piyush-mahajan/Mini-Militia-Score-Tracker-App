import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  TrophyIcon, 
  PlayIcon, 
  ChartBarIcon,
  ClockIcon 
} from '@heroicons/react/24/solid';

function Home() {
  const [recentMatches, setRecentMatches] = useState([]);
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalPlayers: 0,
    avgKills: 0
  });

  useEffect(() => {
    fetchRecentMatches();
    fetchStats();
  }, []);

  const fetchRecentMatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/matches?limit=3');
      setRecentMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/matches/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Mini Militia Score Tracker
        </h1>
        <p className="text-xl text-slate-400">
          Track your games, analyze performance, and become the ultimate warrior
        </p>
        <Link
          to="/setup"
          className="inline-block btn-primary"
        >
          <PlayIcon className="h-5 w-5 inline mr-2" />
          Start New Match
        </Link>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{stats.totalMatches}</p>
              <p className="stat-label">Total Matches</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{stats.totalPlayers}</p>
              <p className="stat-label">Active Players</p>
            </div>
            <TrophyIcon className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-value">{stats.avgKills.toFixed(1)}</p>
              <p className="stat-label">Avg. Kills/Match</p>
            </div>
            <ClockIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </section>

      {/* Recent Matches */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-indigo-400" />
          Recent Matches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentMatches.map((match) => (
            <Link
              key={match._id}
              to={`/summary/${match._id}`}
              className="card hover:bg-slate-700/50 transition-colors"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{match.matchName}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">
                    {match.mode}
                  </span>
                  <span className="text-slate-400">
                    {new Date(match.date).toLocaleDateString()}
                  </span>
                </div>
                {match.winner && (
                  <div className="text-sm text-indigo-400">
                    Winner: {match.winner}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/history" className="btn-secondary">
            View All Matches
          </Link>
        </div>
        
      </section>
    </div>
  );
}

export default Home; 