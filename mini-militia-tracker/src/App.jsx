import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { MatchProvider } from './context/MatchContext';
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import MatchSetup from './pages/MatchSetup';
import MatchHistory from './pages/MatchHistory';
import Scoreboard from './pages/Scoreboard';
import MatchSummary from './pages/MatchSummary';

function App() {
  return (
    <Router>
      <MatchProvider>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <main className="container mx-auto px-4 py-8 pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/setup" element={<MatchSetup />} />
              <Route path="/match/:id" element={<Scoreboard />} />
              <Route path="/summary/:id" element={<MatchSummary />} />
              <Route path="/history" element={<MatchHistory />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </MatchProvider>
    </Router>
  );
}

export default App; 