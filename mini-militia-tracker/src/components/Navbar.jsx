import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  TrophyIcon, 
  ClockIcon, 
  PlayIcon 
} from '@heroicons/react/24/outline';

function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/setup', icon: PlayIcon, label: 'New Match' },
    { path: '/history', icon: ClockIcon, label: 'History' },
    { path: '/leaderboard', icon: TrophyIcon, label: 'Leaderboard' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-lg border-t border-slate-700 md:top-0 md:bottom-auto z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around md:justify-start md:space-x-8 py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-3 py-2 rounded-lg transition-colors
                ${location.pathname === item.path 
                  ? 'text-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200'}`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs md:text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 