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

const NavBarWeb = () => {
  const { isAdmin, toggleAdmin } = GameLogic();
  const navigate = useNavigate();
  // const CallNewGame = newGameWithWarning
  // const { globalUser, isLoggedIn, setLoggedIn, setStatusMessage } = GameLogic();
  const {
    gameState,
    globalUser,
    isLoggedIn,
    setLoggedIn,
    setStatusMessage,
    updateGameState,
    setAdmin,
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

  const testio = async () => {
    // UpdateDBCount();
    updateGameState("editAccess", !gameState.editAccess);
    console.log("testio done");
  };

  const restartGame = async () => {
    await newGame(gameState.defaultStartHash);
    setAdmin(false);

    updateGameState("editAccess", false);
    updateGameState("endgameSequence", false);
    console.log("restartGame");
  };

    const toggleAdminLocal = async () => {
    //       const currentAdmin = localStorage.getItem('isAdmin') === 'true';
    //   const newAdmin = !currentAdmin;
    //   localStorage.setItem('isAdmin', newAdmin.toString());
    //   window.location.reload(); // Force React to re-read the value


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

      <li role="menuitem" tabIndex="0" aria-haspopup="true">
        <Link to={!gameState.endgameSequence ? "/hashImport" : null}>
          Import
        </Link>
      </li>{" "}

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
              {/* <li role='menuitem'>
                <Link to='/hex'>Hex List</Link>
              </li> */}
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


              <li role="menuitem">
                <Link onClick={SaveOut}>Web Backup</Link>
              </li>



          {/* <li role='menuitem'>
                <Link to='/convo'>Convo</Link>
              </li> */}
        </>
      )}
      {/* <li role="menuitem" tabIndex="0" aria-haspopup="true">
                <Link  onClick={FauxLogOut }>FauxLogOut</Link></li> */}


          <li>
            {" "}
            <button className="button-small top" onClick={restartGame}>
              restartGame
            </button>
          </li>






                <li>
            {" "}
            <button className="button-small" onClick={toggleAdmin}>
             {(isAdmin) ? ( 'Admin'):('User')}
            </button>
          </li>


    </ul>
    //     </div>

    // </nav>
  );
};

export default NavBarWeb;
