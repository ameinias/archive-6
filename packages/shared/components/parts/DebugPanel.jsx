import React, { useState, useEffect } from "react";
import { GameLogic } from "@utils/gamelogic";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";

export const DebugPanel = () => {
  const { gameState, updateGameState, isDemo } = GameLogic();
  const friends = useLiveQuery(() => db.friends.toArray());


useEffect(() => {
  const handleToggleDebug = () => {
    updateGameState('showDebug', !gameState.showDebug);
  };

  window.addEventListener('toggleDebug', handleToggleDebug);

  return () => {
    window.removeEventListener('toggleDebug', handleToggleDebug);
  };
}, [gameState.showDebug, updateGameState]);


  const toggleConsole = (value) => {
    console.log("toggle: ", value);
    if (value === "consoleAvailable")
      updateGameState("consoleAvailable", !gameState.consoleAvailable);
    if (value === "showConsole")
      updateGameState("showConsole", !gameState.showConsole);
    if (value === "connectionPanel")
      updateGameState("connectionPanel", !gameState.connectionPanel);
    if (value === "connectionEdit")
      updateGameState("connectionEdit", !gameState.connectionEdit);
        if (value === "editAccess")
      updateGameState("editAccess", !gameState.editAccess);


  };

  return (
    <div>
      {gameState.showDebug && (
        <div className="debugInfo">
          <p>
            <Link onClick={() => toggleConsole("editAccess")}>editAccess:</Link>
            {gameState.editAccess ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
          <p>activeFilter: {gameState.activeFilter} </p>
          <p>
            endgameSequence:{" "}
            {gameState.endgameSequence ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
          <p>
            showDebug:{" "}
            {gameState.showDebug ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
          <p>
            <Link onClick={() => toggleConsole("showConsole")}>
              show Console:
            </Link>{" "}{" "}
            {gameState.showConsole ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
          <p>
           <Link onClick={() => toggleConsole("consoleAvailable")}> consoleAvailable</Link>:{" "}
            {gameState.consoleAvailable ? (
              <span className="bugHi">true</span>
            ) : (
              <span>false</span>
            )}
          </p>
          <p>
            <Link onClick={() => toggleConsole("connectionPanel")}>connectionPanel</Link>:{" "}
            {gameState.connectionPanel ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
          <p>
            <Link onClick={() => toggleConsole("connectionEdit")}>connectionEdit</Link>:{" "}
            {gameState.connectionEdit ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
          <p>
            consoleWasRevealed:{" "}
            {gameState.consoleWasRevealed ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
          <p>
            bluescreen:{" "}
            {gameState.bluescreen ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>

                    <p>
            demo:{" "}
            {isDemo ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
        </div>
      )}
    </div>
  );
};

// export default DebugPanel;
