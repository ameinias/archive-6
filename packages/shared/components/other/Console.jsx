import React, { useEffect, useState, useRef } from "react";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import { GameLogic, updateGameState } from "@utils/gamelogic";

import { HyperText } from "@utils/motion/hypertext";
import { AnimatedList } from "@utils/motion/animatedList";
import { useNavigate } from "react-router-dom";

let globalConsoleArray = [];
const consoleUpdateCallbacks = [];
// const navigate = useNavigate();

// Export this function for use in other scripts
const addConsoleEntry = (entry) => {
  globalConsoleArray = [...globalConsoleArray, entry];
  consoleUpdateCallbacks.forEach((callback) => callback(globalConsoleArray));
};

export const clearConsole = () => {
  globalConsoleArray = [];
  consoleUpdateCallbacks.forEach((callback) => callback(globalConsoleArray));
};

const addConsoleEntryHypertext = (entry) => {
  const messEntry = (
    <span className="trapped">
      <HyperText duration="80" delay="10">
        {entry}
      </HyperText>
    </span>
  );

  globalConsoleArray = [...globalConsoleArray, messEntry];
  consoleUpdateCallbacks.forEach((callback) => callback(globalConsoleArray));
};

const makeConnection = async (firstID, secondID) => {
  const entry = await db.friends.get(Number(firstID));
  const secondEntry = await db.friends.get(Number(secondID));

  if (!entry || !secondEntry || firstID <= 0 || secondID <= 0) {
    // console.log("cants find one of the entries.");
    return;
  }

  const currentRefs = Array.isArray(entry?.entryRef) ? entry.entryRef : [];

  if (currentRefs.some((ref) => ref.originId === secondEntry.id)) {
    // console.log("already connected");
    return;
  }

  // console.log("entry refs: " + currentRefs);

  const newRef = {
    originId: secondEntry.id,
    fauxID: secondEntry.fauxID,
    title: secondEntry.title,
    type: "entry", // Graph.jsx looks for this
    available: secondEntry.available,
  };

  // Check if secondID is already in the array
  // if (!currentRefs.some(ref => ref === secondID || ref.originId === secondID)) {
  db.friends.update(Number(firstID), {
    entryRef: [...currentRefs, newRef],
  });

  // console.log("Should connect " + firstID + " to " + secondID);
  // console.log("refs " + db.friends.get(firstID).title);
  //}
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const filteredFriends = useLiveQuery(() => {
//   if (!db.isOpen()) return [];

//   let tempItems = [];
//   let nextID = 0;

//     // foundFriends = friends?.filter((item) => item.available === true);

//   // if (foundFriends) {
//   //   for (const item of foundFriends) {
//   //     tempItems.push({
//   //       id: nextID,
//   //       label: item.id + " " + item.fauxID + " - " + item.title,
//   //       group: "entry",
//   //       originId: item.id,
//   //       parentId: null,
//   //       entryRef: item.entryRef || [],
//   //     });
//   //     nextID = nextID + 1;
//   //   }
//   // }

//   return null;
// }, []);


const messagesEnd = async () => {
  await delay(5000);
    updateGameState("showConsole", true);
    addConsoleEntryHypertext("thank you for letting us use you");
  await delay(5200);
      addConsoleEntryHypertext("your sacrifice is appreciated");
  await delay(3200);
      addConsoleEntryHypertext("as is your connection");
  await delay(3200);
      addConsoleEntryHypertext("to us");
  await delay(3200);
        addConsoleEntryHypertext("and everything");
}


const EndSequence = async (navigate, id) => {
  updateGameState("endgameSequence", true);
messagesEnd(); 
  //unlock connections in case it was missed
  updateGameState("connectionEdit", true);
  navigate(`/entry/${id}`);
  await delay(500);
  makeConnection(id, 110);
  await delay(1500); // Wait for 2 seconds

  navigate(`/entry/92`);
  await delay(1500);

  makeConnection(92, 94);
  await delay(1500);
  makeConnection(92, 100);

  await delay(1500);

  navigate(`/entry/95`);
  await delay(500);
  makeConnection(95, 92);
    await delay(500);

  // addConsoleEntryHypertext("thank you for letting us use you");
  await delay(1200);

  navigate(`/entry/100`);
  await delay(1500);

  navigate(`/entry/91`);
  await delay(800);
  navigate(`/entry/94`);
  await delay(300);
  navigate(`/entry/91`);
  await delay(300);
  // addConsoleEntryHypertext("your sacrifice is appreciated");
  await delay(300);
  navigate(`/entry/92`);
  await delay(300);
  navigate(`/entry/91`);
  await delay(100);
  navigate(`/entry/92`);
  await delay(100);
  navigate(`/entry/91`);
  await delay(100);
  navigate(`/entry/92`);
  await delay(100);
    // addConsoleEntryHypertext("as is your connection");
  navigate(`/entry/91`);
  await delay(100);
  navigate(`/entry/92`);
  await delay(100);
  navigate(`/entry/91`);
  await delay(100);
  navigate(`/entry/92`);
      addConsoleEntryHypertext("to us");
  await delay(50);
  navigate(`/entry/91`);
  await delay(50);
  navigate(`/entry/92`);
  await delay(50);
  navigate(`/entry/91`);
  await delay(50);
    // addConsoleEntryHypertext("and to everyone");
  navigate(`/connections`);
  await delay(500);

  const filteredFriends = (await db.friends.toArray()).filter(
    (f) => f.available === true,
  );

  const lowestId = Math.min(...filteredFriends.map((f) => f.id));
  const highestId = Math.max(...filteredFriends.map((f) => f.id));

  makeConnection(lowestId, highestId);
  makeConnection(lowestId + 1, highestId - 1);

  for (const element of filteredFriends) {
    await makeConnection(element.id, element.id - 1);

    await delay(500);
  }
    for (const element of filteredFriends) {
    await makeConnection(element.id, element.id + 1);

    await delay(250);
  }
  //  navigate(`/convo`);
  updateGameState("showConsole", false);
  updateGameState("bluescreen", true);

};

const Console = () => {
  // const [consoleArray, setConsoleArray] = useState([])
  const navigate = useNavigate();
  const { gameState } = GameLogic();
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());

  const [consoleArray, setConsoleArray] = useState(globalConsoleArray);

  useEffect(() => {
    consoleUpdateCallbacks.push(setConsoleArray);
    setConsoleArray([...globalConsoleArray]);

    return () => {
      const index = consoleUpdateCallbacks.indexOf(setConsoleArray);
      if (index > -1) consoleUpdateCallbacks.splice(index, 1);
    };
  }, []);

  useEffect(() => {
    const handleStatusMessage = (event) => {
      addConsoleEntry(event.detail); // event.detail contains the string
    };

    window.addEventListener("statusMessage", handleStatusMessage);

    return () => {
      window.removeEventListener("statusMessage", handleStatusMessage);
    };
  }, []);

  useEffect(() => {
    const handleGameReset = () => {
      
    };

    window.addEventListener("gameReset", handleGameReset);

    return () => {
      window.removeEventListener("gameReset", handleGameReset);
    };
  }, []);

  useEffect(() => {
    // window.scrollTo(0, 0);
    if (gameState.showConsole) {
      scrollToBottom();
    }
  }, [friends, subentries, gameState.showConsole, consoleArray]);

  const containerRef = useRef(null);

  // Function to scroll to the bottom of the container
  const scrollToBottom = () => {
    // Scroll to the bottom of the container by setting scrollTop to the container's scrollHeight
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  };

  const clearConsole = () => {
    console.log("CONSOLE HAS BEEN CLEARED -------------");
    setConsoleArray([]);
  };

  const printLostEntries = () => {
    // Find friends and subentries that are not available
    const lostFriends = friends.filter((friend) => !friend.available);
    const lostSubentries = subentries.filter((subentry) => !subentry.available);

    // Log lost entries to the console
    lostFriends.forEach((friend) => {
      addConsoleEntry(`Lost Friend Entry: ${friend.fauxID} - ${friend.title}`);
    });

    lostSubentries.forEach((subentry) => {
      addConsoleEntry(`Lost Subentry: ${subentry.fauxID} - ${subentry.title}`);
    });
  };

  return (
    <>
      <div
        ref={containerRef}
        // className={`console ${!gameState.showConsole && 'hide'}`}
        className={`console`}
      >
        [SYSTM] System check complete. ok. 
        {globalConsoleArray.map((item, index) => (
          <div key={index}>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export {
  Console,
  addConsoleEntry,
  addConsoleEntryHypertext,
  EndSequence,
  makeConnection,
};
