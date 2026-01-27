import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { GameLogic } from "@utils/gamelogic";
import { useNavigate } from "react-router-dom";
import {
  dbHelpers,
  newGame,
  saveAsDefaultDatabase,
  handleJSONExport,
} from "@utils/db";
import { TimeLine } from "../lists/TimeLine";
import Dropdown from "react-bootstrap/Dropdown";
import { eventManager } from "@utils/events";
import { addConsoleEntry, addConsoleEntryHypertext, Console, EndSequence, makeConnection } from "@components/other/Console";

// replace back button?
// https://mtg-dev.tech/blog/building-a-custom-go-back-button-in-react-is-harder-than-you-think

const NavBar = () => {
  const { isAdmin, toggleAdmin } = GameLogic();
  const navigate = useNavigate();
  const {
    gameState,
    globalUser,
    isLoggedIn,
    setLoggedIn,
    setStatusMessage,
    updateGameState,
    setAdmin,
    resetGameVariables,
  } = GameLogic();


  const isElectron = eventManager.isElectron;

  const LogOut = async () => {
    if (
      await eventManager.showConfirm(
        "Logging out will delete your progress. Proceed anyway?",
      )
    ) {
      await newGame(gameState.defaultStartHash);

      navigate("/");
      setLoggedIn(false);
      setStatusMessage(`Logged out`);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const testio = async () => {
    // UpdateDBCount();
    // updateGameState("editAccess", !gameState.editAccess);
    // navigate("/test");

    //  updateGameState("consoleAvailable", true);
    // Console.printLostEntries();
// navigate(`/entry/91`);
  await delay(100);
    makeConnection(91, 96);



    console.log("testio done");
  };

    const testio2 = async () => {

        EndSequence(navigate, 91);

    console.log("testio2    done");
  };







  const restartGame = async () => {
    await newGame(gameState.defaultStartHash);
    setAdmin(false);

    // updateGameState("editAccess", false);
    // updateGameState("endgameSequence", false);
   resetGameVariables();
    navigate("/");
    console.log("restartGame");
  };

  const debugWindow = async () => {
    updateGameState("showDebug", !gameState.showDebug);
  };

  const FauxLogOut = async () => {
    await newGame(10);
    updateGameState("editAccess", false);
  };

  const SaveOut = async () => {
    console.log("should be?");

    if (isElectron)
      if (await eventManager.showConfirm("Overwrite?")) {
        saveAsDefaultDatabase();
      } else {
        console.log("canceled overwrite.");
      }
    else handleJSONExport("dexie-export-web.json");
  };

  return (
    <ul role="menubar" className="can-hover">
      <li role="menuitem" tabIndex="0" aria-haspopup="true">
        <Link
          variant="outline-primary"
          style={{ width: "25px", padding: "2px" }}
          // to=''
          // onClick={() => navigate(-1)}
          // onClick={() => navigate(localStorage.getItem('secondLastRoute'))}
          to={localStorage.getItem("secondLastRoute")}
        >
          {"<<"}
        </Link>
      </li>{" "} 
      <li role="menuitem" tabIndex="0" aria-haspopup="true">
        <Link to={!gameState.endgameSequence ? "/" : null} title="home-button">
          Home
        </Link>
      </li>{" "}
      <li role="menuitem" tabIndex="0" aria-haspopup="true">
        {" "}
        <Link to={!gameState.endgameSequence ? "/search" : null}>Search</Link>
      </li>{" "}
      <li
        role="menuitem"
        className={gameState.editAccess ? "attention" : ""}
        tabIndex="0"
        aria-haspopup="true"
      >
        <Link to={!gameState.endgameSequence ? "/player-add-entry" : null}>
          Add Entry
        </Link>
      </li>
      {/* )} */}
      <li role="menuitem" tabIndex="0" aria-haspopup="true">
        <Link to={!gameState.endgameSequence ? "/bookmarks" : null}>
          Bookmarks
        </Link>
      </li>
      <li role="menuitem" tabIndex="0" aria-haspopup="true">
        <Link to={!gameState.endgameSequence ? "/hashImport" : null}>
          Import
        </Link>
      </li>{" "}
       {gameState.connectionPanel && (
      <li role="menuitem" tabIndex="0" aria-haspopup="true">
        <Link to={!gameState.endgameSequence ? "/connections" : null}>
          Connections
        </Link>
      </li>)}{" "}
      {(isAdmin || !isElectron) && (
        <>
          <li role="menuitem" tabIndex="0" aria-haspopup="true">
            Admin Tools
            <ul role="menu">
              <li role="menuitem">
                <Link to="/media">Media List</Link>
              </li>
              <li role="menuitem">
                <Link to="/timeline">Timeline</Link>
              </li>
              <li role="menuitem">
                <Link className="dropdown-item" to="/import-export">
                  Database Actions
                </Link>
              </li>
              <li role="menuitem">
                <Link className="dropdown-item" to="/test">
                  Test
                </Link>
              </li>
            </ul>
          </li>
          {isElectron ? (
            <li role="menuitem" tabIndex="0" aria-haspopup="true">
              <Link onClick={SaveOut}>Dev Backup</Link>
            </li>
          ) : (
            <div>
              <li role="menuitem">
                <Link onClick={SaveOut}>Web Backup</Link>
              </li>
            </div>
          )}
        </>
      )}
      {(gameState.showDebug || isAdmin) && (
        <>
          <li>
            {" "}
            <button className="button-small top" onClick={restartGame}>
              restartGame
            </button>
          </li>

          <li>
            {" "}
            <button className="button-small" onClick={testio}>
              consoleA
            </button>
          </li>
                    <li>
            {" "}
            <button className="button-small" onClick={testio2}>
              End sequence
            </button>
          </li>
        </>
      )}
    </ul>
    //     </div>

    // </nav>
  );
};

export default NavBar;
