import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Search from "@components/search/Search";
import { ListEditEntry } from "@components/lists/ListEditEntry";
import { GameLogic } from "@utils/gamelogic";
import { StaticList } from "@components/lists/StaticList";
import { eventManager } from "@utils/events";
import { MobileEntryList } from "@components/lists/MobileEntries";
import { ListEditSubEntries } from "@components/lists/ListEditSubEntries";

const Home = () => {
  const { isAdmin, toggleAdmin } = GameLogic();
  const isElectron = eventManager.isElectron;
  const [showTab, setShowTab] = useState("entries");
    const { gameState, updateGameState } = GameLogic();


  // subEntryFrontPage: false,  gameState.subEntryFrontPage

    useEffect(() => {
      const handleNewGameStart = () => setIsLoading(true);
      const handleNewGameEnd = () => {
        setIsLoading(false);
        // Force component refresh after new game
        window.location.reload(); // Simple but effective
      };
  
      window.addEventListener("newGameStart", handleNewGameStart);
      window.addEventListener("newGameEnd", handleNewGameEnd);
  
      return () => {
        window.removeEventListener("newGameStart", handleNewGameStart);
        window.removeEventListener("newGameEnd", handleNewGameEnd);
      };
    }, []);



  if (!isAdmin) {
    return (
      <div>
        <StaticList />
      </div>
    );
  }

  const switchTab = () => {
    if (gameState.subEntryFrontPage === "entries") updateGameState("subEntryFrontPage", "subEntries");
    else updateGameState("subEntryFrontPage", "entries");
  };

  return (
    <div>
      {isElectron ? (
        <div>
          {gameState.subEntryFrontPage === "entries" ? (
            <div className="div">
              <div className="center" style={{  marginBottom: "10px" }}>
                {" "}
                <span style={{ fontWeight: 800, textDecoration: "underline" }}>
                  Entries  
                </span>{" "}
                |{" "}
                <span onClick={switchTab} style={{ cursor: "pointer", color: "blue" }}>
                  Subentries
                </span>{" "}
              </div>

              <ListEditEntry />
            </div>
          ) : (
            <div className="div">
              <div className="center" style={{ marginBottom: "10px" }}>
                {" "}
                <span onClick={switchTab} style={{ cursor: "pointer", color: "blue" }}>
                  Entries
                </span>{" "}
                |{" "}
                <span style={{ fontWeight: 800, textDecoration: "underline" }}>
                  Subentries
                </span>{" "}
              </div>
              <ListEditSubEntries />
            </div>
          )}
        </div>
      ) : (
        <MobileEntryList />
      )}
    </div>
  );
};

export default Home;
