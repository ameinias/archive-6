import React, { useState, useEffect } from "react";
import { GameLogic } from "@utils/gamelogic";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";

export function DebugPanel({ itemID }) {
  const { gameState } = GameLogic();
  const friends = useLiveQuery(() => db.friends.toArray());

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
            showConsole:{" "}
            {gameState.showConsole ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
          </p>
          <p>
            consoleAvailable:{" "}
            {gameState.consoleAvailable ? (
              <span className="bugHi">true</span>
            ) : (
              "false"
            )}
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
