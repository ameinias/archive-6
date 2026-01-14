import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { GameLogic } from "@utils/gamelogic";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";

const DebugOverlay = () => {
  // UseState hooks here
  const [isLoading, setIsLoading] = useState(false);
  const gameLogic = GameLogic();
  const friends = useLiveQuery(() => db.friends.toArray());

    //#region ---------    REGION   -------- */ 

  //#endregion


  return (
    <div>
            {gameState.showDebug && (
        <div className='debugInfo'>
          <p>
            editAccess:{' '}
            {gameState.editAccess ? (
              <span className='bugHi'>true</span>
            ) : (
              'false'
            )}
          </p>
          <p>activeFilter: {gameState.activeFilter} </p>
          <p>
            endgameSequence:{' '}
            {gameState.endgameSequence ? (
              <span className='bugHi'>true</span>
            ) : (
              'false'
            )}
          </p>
          <p>showDebug: {gameState.showDebug ? (<span className='bugHi'>true</span>) : 'false'}</p>
        </div>
      )}
    </div>
  );
};

export default DebugOverlay;
