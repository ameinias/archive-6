import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { useNavigate } from 'react-router-dom';
import { dbHelpers, newGame, newGameWithWarning, exportTelemetrisToAppData } from '@utils/db';
import Dropdown from 'react-bootstrap/Dropdown';
import { eventManager } from '@utils/events';


const UserInfoButtons = () => {
  const { isAdmin, toggleAdmin } = GameLogic();
    const navigate = useNavigate();
    const CallNewGame = newGameWithWarning;
    const { globalUser, isLoggedIn, setLoggedIn, setStatusMessage,updateGameState, gameState } = GameLogic();

      const isElectron = eventManager.isElectron;


      const  LogOut = async () => {
          if (await eventManager.showConfirm('Logging out will delete your progress. Proceed anyway?')) {
            await newGame(gameState.defaultStartHash);

            updateGameState("editAccess", false);
            console.log("restart with hash" + gameState.defaultStartHash);

            exportTelemetrisToAppData(globalUser.username);

            navigate('/');
            setLoggedIn(false);
            setStatusMessage(`Logged out`);
          }

    };






  return (
<div>

        {isElectron &&
        <div>
         <div className='login-info'><span> Logged in as:
          <Link to="/user-profile">

        {isAdmin ? 'Admin' : `${globalUser.username}`}</Link></span>{' '}
          <button

            onClick={LogOut}
            title="This will delete your progress!"
          >
            {isAdmin ? 'Log Out' : 'Log Out '}
          </button> {' '}
           </div>
        </div>
}
</div>

  );
};

export default UserInfoButtons;
