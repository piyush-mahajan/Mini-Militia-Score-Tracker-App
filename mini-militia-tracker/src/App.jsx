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

          {/* <footer className="fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-lg border-t border-slate-700 z-50 hidden md:flex">
            <div className="container mx-auto px-4">
              <div className="flex justify-around py-3">
                <span className="text-sm text-gray-300 sm:text-center">
                  © 2025 <a href="https://piyushmahajan.vercel.app/" className="hover:underline">Piyush Mahajan</a>. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center text-sm font-medium text-gray-300">
                  <li>
                    <a href="#" className="hover:underline mx-4">About</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline mx-4">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline mx-4">Licensing</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline mx-4">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
          </footer> */}
        </div>
      </MatchProvider>
    </Router>
  );
}

export default App;