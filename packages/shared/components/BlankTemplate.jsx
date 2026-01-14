import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { GameLogic } from "@utils/gamelogic";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";

const ComponentName = () => {
  // UseState hooks here
  const [isLoading, setIsLoading] = useState(false);
  const gameLogic = GameLogic();
  const friends = useLiveQuery(() => db.friends.toArray());

    //#region ---------    REGION   -------- */ 

  //#endregion


  return (
    <div>
      Content
    </div>
  );
};

export default ComponentName;
