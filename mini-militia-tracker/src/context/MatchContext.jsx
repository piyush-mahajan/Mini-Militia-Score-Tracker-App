import { createContext, useContext, useState } from 'react';

const MatchContext = createContext();

export function MatchProvider({ children }) {
  const [currentMatch, setCurrentMatch] = useState(null);
  const [matchTimer, setMatchTimer] = useState(0);

  const updatePlayerScore = (playerId, field, value) => {
    setCurrentMatch(prev => {
      const players = prev.players.map(player => {
        if (player._id === playerId) {
          return { ...player, [field]: player[field] + value };
        }
        return player;
      });
      return { ...prev, players };
    });
  };

  const startMatch = (match) => {
    setCurrentMatch(match);
    setMatchTimer(0);
  };

  const endMatch = () => {
    setCurrentMatch(null);
    setMatchTimer(0);
  };

  return (
    <MatchContext.Provider value={{
      currentMatch,
      matchTimer,
      setMatchTimer,
      startMatch,
      endMatch,
      updatePlayerScore
    }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  return useContext(MatchContext);
} 