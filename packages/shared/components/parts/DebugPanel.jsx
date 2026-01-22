import React, { useState, useEffect } from "react";
import { GameLogic } from "@utils/gamelogic";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";

export function DebugPanel({ itemID }) {
  const { gameState,updateGameState } = GameLogic();
  const friends = useLiveQuery(() => db.friends.toArray());


const updateGameStatesss = (value) => {

  if (value === "consoleAvailable")
    updateGameState({ consoleAvailable: !gameState.consoleAvailable });
}


  return (
    <div>
      {gameState.showDebug && (
        <div className="debugInfo">
          <p>
            editAccess:{" "}
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
              <span className="bugHi" onClick={toggleVariable(endgameSequence)}>true</span>
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
            showConsole:{" "}
            {gameState.showConsole ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
          <p>
            consoleAvailable:{" "}
            {/* <button onClick={updateGameStatesss("consoleAvailable")}>
            */}
             {gameState.consoleAvailable ? (
              <span className="bugHi">true</span>
            ) : (
              <span >false</span>
            )}
             {/* </button> */}

          </p>
                    <p>
            connectionPanel:{" "}
            {gameState.connectionPanel ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
                    <p>
            connectionEdit:{" "}
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
        </div>
      )}
    </div>
  );
}

// export default DebugPanel;
