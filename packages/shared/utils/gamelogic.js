import React, {
  useState,
  useEffect
} from "react";
import {
  eventManager
} from "@utils/events";

//#region -------- gloabal
// Simple global state using module-level variables. This was pulled from Copilot, so may need a massage.
let globalIsAdmin = (() => {
  try {
    return localStorage.getItem("isAdmin") === "true";
  } catch (error) {
    // Fallback for SSR or environments without localStorage
    console.warn("localStorage not available:", error);
    return false;
  }
})();

let globalIsLoggedIn = (() => {
  try {
    return localStorage.getItem("isLoggedIn") === "true";
  } catch (error) {
    // Fallback for SSR or environments without localStorage
    console.warn("localStorage not available:", error);
    return false;
  }
})();

let globalGameState = {
  defaultStartHash: 10, //   Game with start with this hash on new game or logout
  score: 0,
  isGameOver: false,
  level: 0,
  lastRoute: "/",
  editAccess: false,
  sortColumn: "title",
  sortDirection: "asc",
  cheatCode: true, // to eventually put an "unlock" button on locked entries
  //playerAddEntry: false,
  subEntryFrontPage: "entries",
  activeFilter: "all",
  endgameSequence: false,
  showDebug: false,
  endGameTimer: false
};
let globalStatus = "";

let globalRemoveText = "remove";
let globalUser = (() => {
  try {
    const savedUser = localStorage.getItem("globalUser");
    return savedUser ?
      JSON.parse(savedUser) : {
        username: "playerName",
        password: "password",
        firstname: "firstname",
        lastname: "lastname",
      };
  } catch (error) {
    // Fallback for SSR or environments without localStorage
    console.warn("localStorage not available:", error);
    return {
      username: "admin",
      password: "password",
      firstname: "firstname",
      lastname: "lastname",
    };
  }
})();
let globalAdminUser = {
  username: "admin",
  password: "password",
  firstname: "firstname",
  lastname: "lastname",
};

// Array to store all update functions from components
const adminUpdateCallbacks = [];
const loggedInUpdateCallbacks = [];
const gameStateUpdateCallbacks = [];
const gameStatusUpdateCallbacks = [];
const removeTextUpdateCallbacks = [];
const userUpdateCallbacks = [];
const adminUserUpdateCallbacks = [];

// Expose a module-level API for non-React callers (e.g., db.js)
export const updateGameState = (variableName, state) => {
  if (!Object.prototype.hasOwnProperty.call(globalGameState, variableName)) {
    console.warn(`Game state does not have property: ${variableName}`);
    return;
  }
  globalGameState = {
    ...globalGameState,
    [variableName]: state
  };
  console.log(`Updated property: ${variableName}`);
  gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
};



export function GameLogic() {
  const [isAdmin, setAdmin] = useState(globalIsAdmin);
  const [isLoggedIn, setLoggedIn] = useState(globalIsLoggedIn);
  const [gameState, setGameState] = useState(globalGameState);
  const [status, setStatus] = useState(globalStatus);
  const [removeText, setRemoveText] = useState(globalRemoveText);

  const [user, setUser] = useState(globalUser);
  const [adminUser, setAdminUser] = useState(globalAdminUser);

  const statusTimeOut = 15000; // 5 seconds

  const toggleAdmin = () => {
    globalIsAdmin = !globalIsAdmin;
    // Update all components that use this state
    localStorage.setItem("isAdmin", JSON.stringify(globalIsAdmin));
    adminUpdateCallbacks.forEach((callback) => callback(globalIsAdmin));
  };

  // Register  update functions - so they can work globally in other scripts.
  useEffect(() => {
    adminUpdateCallbacks.push(setAdmin);
    gameStateUpdateCallbacks.push(setGameState);
    gameStatusUpdateCallbacks.push(setStatus);
    removeTextUpdateCallbacks.push(setRemoveText);
    loggedInUpdateCallbacks.push(setLoggedIn);
    userUpdateCallbacks.push(setUser);
    adminUserUpdateCallbacks.push(setAdminUser);

    const handleToggleAdmin = () => {
      toggleAdmin();
    };

    //  Works in both environments
    eventManager.on("toggle-admin", handleToggleAdmin);

    // Cleanup when component unmounts
    return () => {
      const adminIndex = adminUpdateCallbacks.indexOf(setAdmin);
      if (adminIndex > -1) adminUpdateCallbacks.splice(adminIndex, 1);

      const gameIndex = gameStateUpdateCallbacks.indexOf(setGameState);
      if (gameIndex > -1) gameStateUpdateCallbacks.splice(gameIndex, 1);

      const statusIndex = gameStatusUpdateCallbacks.indexOf(setStatus);
      if (statusIndex > -1) gameStatusUpdateCallbacks.splice(statusIndex, 1);

      const removeTextIndex = removeTextUpdateCallbacks.indexOf(setRemoveText);
      if (removeTextIndex > -1)
        removeTextUpdateCallbacks.splice(removeTextIndex, 1);

      const loggedInIndex = loggedInUpdateCallbacks.indexOf(setLoggedIn);
      if (loggedInIndex > -1) loggedInUpdateCallbacks.splice(loggedInIndex, 1);

      const userIndex = userUpdateCallbacks.indexOf(setUser);
      if (userIndex > -1) userUpdateCallbacks.splice(userIndex, 1);

      const adminUserIndex = adminUserUpdateCallbacks.indexOf(setAdminUser);
      if (adminUserIndex > -1)
        adminUserUpdateCallbacks.splice(adminUserIndex, 1);

      eventManager.removeListener("toggle-admin", handleToggleAdmin);
    };
  }, []);

  const startGame = () => {
    globalGameState = {
      score: 0,
      isGameOver: false,
      level: 0,
       lastRoute: "/",
      editAccess: false,
      cheatCode: true,
      endgameSequence: false
    };
    // Update all components
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
  };

  const endGame = () => {
    globalGameState = {
      ...globalGameState,
      isGameOver: true
    };
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
  };

  const increaseScore = (points) => {
    globalGameState = {
      ...globalGameState,
      score: globalGameState.score + points,
    };
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
  };

  const setLoggedInState = (loggedIn) => {
    globalIsLoggedIn = loggedIn;
    // Update localStorage and all components
    localStorage.setItem("isLoggedIn", JSON.stringify(globalIsLoggedIn));
    loggedInUpdateCallbacks.forEach((callback) => callback(globalIsLoggedIn));
  };

  const setStatusMessage = (thestatus) => {
    // This function can be used to set a status message in the footer.
    globalStatus = thestatus;
    console.log(`${globalStatus}`);
    setStatus(globalStatus);
    gameStatusUpdateCallbacks.forEach((callback) => callback(globalStatus));

    // Clear status after 3 seconds (statusTimeOut)
    setTimeout(() => {
      globalStatus = "";
      setStatus("");
      gameStatusUpdateCallbacks.forEach((callback) => callback(""));
    }, statusTimeOut);
  };

  const setColumn = (column) => {
    globalGameState = {
      ...globalGameState,
      sortColumn: column
    };
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
  };

  const setSort = (sort) => {
    globalGameState = {
      ...globalGameState,
      sortDirection: sort
    };
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
  };

  const setCheatCode = (sort) => {
    globalGameState = {
      ...globalGameState,
      cheatCode: sort
    };
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
  };

  // updateGameState is provided via module export for use outside React components

  const setPlayerUsername = (username) => {
    globalUser.username = username;
    localStorage.setItem("globalUser", JSON.stringify(globalUser));
    userUpdateCallbacks.forEach((callback) => callback(globalUser));
    console.log(`Player username set to: ${username}`);
  };

  const setPlayerPassword = (password) => {
    globalUser.password = password;
    localStorage.setItem("globalUser", JSON.stringify(globalUser));
    userUpdateCallbacks.forEach((callback) => callback(globalUser));
    console.log(`Player password set to: ${password}`);
  };

  const setAdminState = (adminState) => {
    globalIsAdmin = adminState;
    // Update localStorage and all components
    localStorage.setItem("isAdmin", JSON.stringify(globalIsAdmin));
    adminUpdateCallbacks.forEach((callback) => callback(globalIsAdmin));
  };

  // At module level (outside GameLogic component) get by
  const triggerRegistry = {
   // 'makeTrue-playerAddEntry': () => updateGameState('playerAddEntry', true),
  // 'makeFalse-playerAddEntry': () => updateGameState('playerAddEntry', false),
    'enable-editAccess': () => updateGameState('editAccess', true),
    'disable-editAccess': () => updateGameState('editAccess', false),
    'enable-endgameSequence': () => updateGameState('endgameSequence', true),
    'disable-endgameSequence': () => updateGameState('endgameSequence', false),
    'showDebug': () => updateGameState('showDebug', true),
    'hideDebug': () => updateGameState('showDebug', false),
    'endGameTimer': () => updateGameState('endGameTimer', true),
    'endGameTimerReset': () => updateGameState('endGameTimer', false),

    // Add more triggers as needed
  };

  const processTrigger = (eventName) => {
    const handler = triggerRegistry[eventName];
    if (handler) {
      // console.log(`Executing trigger: ${eventName}`);
      handler();
    } else {
      console.warn(`Unknown trigger: ${eventName}`);
    }
  };

  const triggerEvent = (eventName = "") => {
    if (!eventName) return;

    const events = eventName.includes(',')
      ? eventName.split(',').map(e => e.trim())
      : [eventName];

    events.forEach(processTrigger);
  };

  return {
    gameState,
    isAdmin,
    startGame,
    endGame,
    increaseScore,
    toggleAdmin,
    setAdmin: setAdminState,
    globalStatus,
    setStatusMessage,
    removeText,
    globalUser,
    globalAdminUser,
    isLoggedIn,
    setLoggedIn: setLoggedInState,
    setPlayerUsername,
    setPlayerPassword,
    setColumn,
    setSort,
    setCheatCode,
    updateGameState,
    triggerEvent
  };
}
