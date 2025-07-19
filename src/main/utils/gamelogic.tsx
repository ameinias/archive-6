import React, { useState, useContext, createContext, ReactNode } from 'react';

// Create context for global game state
interface GameContextType {
  gameState: {
    score: number;
    isGameOver: boolean;
  };
  isAdmin: boolean;
  startGame: () => void;
  endGame: () => void;
  increaseScore: (points: number) => void;
  toggleAdmin: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component that wraps your app
export function GameProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setAdmin] = useState(false);
  const [gameState, setGameState] = useState({
    score: 0,
    isGameOver: false,
  });

  const startGame = () => {
    setGameState({
      score: 0,
      isGameOver: false,
    });
  };

  const endGame = () => {
    setGameState((prev) => ({ ...prev, isGameOver: true }));
  };

  const increaseScore = (points: number) => {
    setGameState((prev) => ({ ...prev, score: prev.score + points }));
  };

  const toggleAdmin = () => {
    setAdmin((prev) => !prev);
  };

  return (
    <GameContext.Provider value={{
      gameState,
      isAdmin,
      startGame,
      endGame,
      increaseScore,
      toggleAdmin
    }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook to use the game context
export function useGameLogic() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameLogic must be used within a GameProvider');
  }
  return context;
}
