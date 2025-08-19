import React, { useState} from 'react';

// Simple global state using module-level variables. This was pulled from Copilot, so may need a massage.
let globalIsAdmin = (() => {
  try {
    return localStorage.getItem('isAdmin') === 'true';
  } catch (error) {
    // Fallback for SSR or environments without localStorage
    console.warn('localStorage not available:', error);
    return false;
  }
})();
let globalGameState = {
  score: 0,
  isGameOver: false,
  level: 0,
  lastRoute: '/'
};
let globalStatus = '';
let globalRemoveText = 'remove';


// Array to store all update functions from components
const adminUpdateCallbacks: Array<(isAdmin: boolean) => void> = [];
const gameStateUpdateCallbacks: Array<(gameState: any) => void> = [];
const gameStatusUpdateCallbacks: Array<(status: string) => void> = [];
const removeTextUpdateCallbacks: Array<(removeText: string) => void> = [];


export function GameLogic() {
  const [isAdmin, setAdmin] = useState(globalIsAdmin);
  const [gameState, setGameState] = useState(globalGameState);
  const [status, setStatus] = useState(globalStatus);
  const [removeText, setRemoveText] = useState(globalRemoveText);
  const statusTimeOut = 5000; // 5 seconds

  // Register  update functions - so they can work globally in other scripts.
  React.useEffect(() => {

    adminUpdateCallbacks.push(setAdmin);
    gameStateUpdateCallbacks.push(setGameState);
    gameStatusUpdateCallbacks.push(setStatus);
    removeTextUpdateCallbacks.push(setRemoveText);

    // Cleanup when component unmounts
    return () => {
      const adminIndex = adminUpdateCallbacks.indexOf(setAdmin);
      if (adminIndex > -1) adminUpdateCallbacks.splice(adminIndex, 1);

      const gameIndex = gameStateUpdateCallbacks.indexOf(setGameState);
      if (gameIndex > -1) gameStateUpdateCallbacks.splice(gameIndex, 1);

       const statusIndex = gameStatusUpdateCallbacks.indexOf(setStatus);
      if (statusIndex > -1) gameStatusUpdateCallbacks.splice(statusIndex, 1);

      const removeTextIndex = removeTextUpdateCallbacks.indexOf(setRemoveText);
      if (removeTextIndex > -1) removeTextUpdateCallbacks.splice(removeTextIndex, 1);
    };
  }, []);

  const startGame = () => {
    globalGameState = {
      score: 0,
      isGameOver: false,
      level: 0,
      lastRoute: '/'
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
    localStorage.setItem('isAdmin', JSON.stringify(globalIsAdmin));
    adminUpdateCallbacks.forEach(callback => callback(globalIsAdmin));
  };

  const setStatusMessage = (thestatus: string) => {
    // This function can be used to set a status message in the footer.
    globalStatus = "status: " + thestatus;
    console.log(`${globalStatus}`);
    setStatus(globalStatus);
    gameStatusUpdateCallbacks.forEach(callback => callback(globalStatus));

    // Clear status after 3 seconds
  setTimeout(() => {
    globalStatus = '';
    setStatus('');
    gameStatusUpdateCallbacks.forEach(callback => callback(''));
  }, statusTimeOut);



  };

  return {
    gameState,
    isAdmin,
    startGame,
    endGame,
    increaseScore,
    toggleAdmin,
    setAdmin,
    globalStatus,
    setStatusMessage,
    removeText,
   };
}
