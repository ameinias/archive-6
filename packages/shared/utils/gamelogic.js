import React, {
  useState,
  useEffect
} from "react";
import {
  eventManager
} from "@utils/events";
import { clearConsole, addConsoleEntry } from "@components/other/Console";
import { consoleTaunts } from "./constants";
import { dbHelpers } from "./db";

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

let globalIsDemo = (() => {
  try {
    return localStorage.getItem("isDemo") === "true";
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

let isToggleAdminListenerRegistered = false;
let isToggleDemoListenerRegistered = false;

let globalGameState = {
  defaultStartHash: 30, //   Game with start with this hash on new game or logout
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
  endGameTimer: false,
  consoleAvailable: false,
  showConsole: false,
  connectionPanel: false,
  connectionEdit: false,
  consoleWasRevealed: false,
  bluescreen: false,
  tauntIndex:0
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
const demoUpdateCallbacks = [];
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
    [variableName]: state,
  };
  // console.log(`Updated property: ${variableName}`);
  gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
};

export function GameLogic() {
  const [isAdmin, setAdmin] = useState(globalIsAdmin);
  const [isDemo, setDemo] = useState(globalIsDemo);
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
    console.log("should toggle admin " + globalIsAdmin);
  };

  
  const toggleDemo = () => {
    globalIsDemo = !globalIsDemo;
    // Update all components that use this state
    localStorage.setItem("isDemo", JSON.stringify(globalIsDemo));
    demoUpdateCallbacks.forEach((callback) => callback(globalIsDemo));
    console.log("should toggle demo " + globalIsDemo);
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
    demoUpdateCallbacks.push(setDemo);



    const handleToggleAdmin = () => {
      toggleAdmin();
    };

        const handleToggleDemo = () => {
      toggleDemo();
    };

    //  Works in both environments
// Only register once globally
if (!isToggleAdminListenerRegistered) {
  window.addEventListener("toggle-admin", handleToggleAdmin);
  isToggleAdminListenerRegistered = true;
}

if (!isToggleDemoListenerRegistered) {
  window.addEventListener("toggle-demo", handleToggleDemo);
  isToggleDemoListenerRegistered = true;
}

    // Cleanup when component unmounts
    return () => {
      const adminIndex = adminUpdateCallbacks.indexOf(setAdmin);
      if (adminIndex > -1) adminUpdateCallbacks.splice(adminIndex, 1);

        const demoIndex = demoUpdateCallbacks.indexOf(setDemo);
      if (demoIndex > -1) demoUpdateCallbacks.splice(demoIndex, 1);

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

      // eventManager.removeListener("toggle-admin", handleToggleAdmin);
window.removeEventListener("toggle-admin", handleToggleAdmin);
window.removeEventListener("toggle-demo", handleToggleDemo);

// isToggleAdminListenerRegistered = false;

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
      endgameSequence: false,
      showConsole: false,
      consoleAvailable: false,
      connectionPanel: false,
      connectionEdit: false,
      consoleWasRevealed: false,
      bluescreen: false,
      tauntIndex: 0
    };
    // Update all components
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
  };

  const endGame = () => {
    globalGameState = {
      ...globalGameState,
      isGameOver: true,
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

    window.dispatchEvent(new CustomEvent('statusMessage', {
  detail:  thestatus
}));

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
      sortColumn: column,
    };
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
  };

  const setSort = (sort) => {
    globalGameState = {
      ...globalGameState,
      sortDirection: sort,
    };
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
  };

  const setCheatCode = (sort) => {
    globalGameState = {
      ...globalGameState,
      cheatCode: sort,
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

    const setDemoState = (demoState) => {
    globalIsDemo = demoState;
    // Update localStorage and all components
    localStorage.setItem("isDemo", JSON.stringify(globalIsDemo));
    adminUpdateCallbacks.forEach((callback) => callback(globalIsDemo));
  };


  const triggerRegistry = {
    // 'makeTrue-playerAddEntry': () => updateGameState('playerAddEntry', true),
    // 'makeFalse-playerAddEntry': () => updateGameState('playerAddEntry', false),
    "enable-editAccess": () => updateGameState("editAccess", true),
    "disable-editAccess": () => updateGameState("editAccess", false),
    "enable-endgameSequence": () => updateGameState("endgameSequence", true),
    "disable-endgameSequence": () => updateGameState("endgameSequence", false),
    showDebug: () => updateGameState("showDebug", true),
    hideDebug: () => updateGameState("showDebug", false),
    endGameTimer: () => updateGameState("endGameTimer", true),
    endGameTimerReset: () => updateGameState("endGameTimer", false),
    endGameTimerReset: () => updateGameState("endGameTimer", false),
    "enable-consoleAvailable": () => {
      revealConsole();
    },
    "disable-consoleAvailable": () => updateGameState("consoleAvailable", false),
    "enable-connectionPanel": () => updateGameState("connectionPanel", true),
    "enable-showConsole": () => updateGameState("showConsole", true),
    "disable-showConsole": () => updateGameState("showConsole", false),
    "disable-connectionPanel": () => updateGameState("connectionPanel", false),
    "enable-connectionEdit": () => updateGameState("connectionEdit", true),
    "disable-connectionEdit": () => updateGameState("connectionEdit", false),

        "enable-bluescreen": () => updateGameState("bluescreen", true),
    "disable-bluescreen": () => updateGameState("bluescreen", false),
    "consoleTaunt": () => triggerConsoleTaunt()

    // Add more triggers as needed
  };

  const revealConsole = () => {
    setStatusMessage("[SYSTM] CONSOLE AVAILABLE")
    setStatusMessage("[????] Can any□□��□□□ �ar □�?")
    updateGameState("consoleAvailable", true);
    if (!gameState.consoleWasRevealed) {
      updateGameState("consoleWasRevealed", true);
      updateGameState("showConsole", true);
    }
  }

// EMHAN - fix on xray page
// give me a new artifact - keep this as it is.
// change display date on new entry to todays date
// navigate is not a function?



  const triggerConsoleTaunt = () => {


     gameState.tauntIndex++;

     if(consoleTaunts[gameState.tauntIndex] != null && consoleTaunts[gameState.tauntIndex].name != null) {
    setStatusMessage(consoleTaunts[gameState.tauntIndex].name)

    const message = 'taunt ' + gameState.tauntIndex + ": " + consoleTaunts[gameState.tauntIndex].name + " at " + location.pathname;
    console.log(message);
    dbHelpers.addEvent(message);
     } else {console.log("can't find taunt.");}
  }


  const processTrigger = (eventName) => {
    const handler = triggerRegistry[eventName];
    if (handler) {
      // console.log(`Executing trigger: ${eventName}`);
      handler();
    } else {
      console.warn(`Unknown trigger: ${eventName}`);
      addConsoleEntry(eventName);

    }
  };

  const triggerEvent = (eventName = "") => {
    if (!eventName) return;

    if (eventName.includes("consolelog:")) {
      const consoleString = eventName.split(":")[1];
      console.log("console: " + consoleString);
    }

    const events = eventName.includes(",") ?
      eventName.split(",").map((e) => e.trim()) : [eventName];

    events.forEach(processTrigger);
  };

  const resetGameVariables = () => {

    clearConsole();

    globalGameState = {
      ...globalGameState,
      editAccess: false,
      endgameSequence: false,
      endGameTimer: false,
      consoleAvailable: false,
      showConsole: false,
      connectionPanel: false,
      connectionEdit: false,
      consoleWasRevealed: false,
      bluescreen: false,
      tauntIndex: 0
    };
    // Update all components
    gameStateUpdateCallbacks.forEach((callback) => callback(globalGameState));
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
    triggerEvent,
    resetGameVariables,
    isDemo, toggleDemo, setDemo: setDemoState
  };
}
