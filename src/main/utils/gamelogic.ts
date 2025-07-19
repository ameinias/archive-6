import React, { useState} from 'react';

// Simple global state using module-level variables. This was pulled from Copilot, so may need a massage.
let globalIsAdmin = false;
let globalGameState = {
  score: 0,
  isGameOver: false,
};

// Array to store all update functions from components
const adminUpdateCallbacks: Array<(isAdmin: boolean) => void> = [];
const gameStateUpdateCallbacks: Array<(gameState: any) => void> = [];

export function GameLogic() {
  const [isAdmin, setAdmin] = useState(globalIsAdmin);
  const [gameState, setGameState] = useState(globalGameState);

  // Register this component's update functions
  React.useEffect(() => {
    adminUpdateCallbacks.push(setAdmin);
    gameStateUpdateCallbacks.push(setGameState);

    // Cleanup when component unmounts
    return () => {
      const adminIndex = adminUpdateCallbacks.indexOf(setAdmin);
      if (adminIndex > -1) adminUpdateCallbacks.splice(adminIndex, 1);

      const gameIndex = gameStateUpdateCallbacks.indexOf(setGameState);
      if (gameIndex > -1) gameStateUpdateCallbacks.splice(gameIndex, 1);
    };
  }, []);

  const startGame = () => {
    globalGameState = {
      score: 0,
      isGameOver: false,
    };
    // Update all components
    gameStateUpdateCallbacks.forEach(callback => callback(globalGameState));
  };

  const endGame = () => {
    globalGameState = { ...globalGameState, isGameOver: true };
    gameStateUpdateCallbacks.forEach(callback => callback(globalGameState));
  };

  const increaseScore = (points: number) => {
    globalGameState = { ...globalGameState, score: globalGameState.score + points };
    gameStateUpdateCallbacks.forEach(callback => callback(globalGameState));
  };

  const toggleAdmin = () => {
    globalIsAdmin = !globalIsAdmin;
    // Update all components that use this state
    adminUpdateCallbacks.forEach(callback => callback(globalIsAdmin));
  };

  return {
    gameState,
    isAdmin,
    startGame,
    endGame,
    increaseScore,
    toggleAdmin
  };
}
