import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/outline';
import config from '../config/config';

function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/matches`);
      setMatches(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setLoading(false);
    }
  };

  const filterMatches = () => {
    if (filter === 'all') return matches;
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (filter) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return matches;
    }
    
    return matches.filter(match => new Date(match.date) >= filterDate);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Match History</h2>
        <div className="flex gap-2">
          {['all', 'today', 'week', 'month'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filterMatches().map((match) => (
          <Link
            key={match._id}
            to={`/summary/${match._id}`}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {match.matchName}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                match.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {match.status}
              </span>
            </div>

            <div className="space-y-3 text-gray-600">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {new Date(match.date).toLocaleDateString()}
              </div>
              
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                {match.players.length} Players
              </div>

              <div className="flex items-center text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {match.mode}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <ArrowTopRightOnSquareIcon className="h-5 w-5 text-blue-600" />
            </div>
          </Link>
        ))}
      </div>

      {filterMatches().length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No matches found</p>
        </div>
      )}
    </div>
  );
}

export default MatchHistory; 