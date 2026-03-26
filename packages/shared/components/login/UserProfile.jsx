
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { GameLogic } from '@utils/gamelogic';
import { eventManager } from '@utils/events'
import {
  dbHelpers,
  newGame,
  newGameWithWarning,
  exportTelemetrisToAppData
} from '@utils/db'

const UserProfile = () => {
  const [restoreLastRoute, setRestoreLastRoute] = useState(true); // default true
    // const { isLoggedIn, setLoggedIn } = GameLogic();
    // const { globalUser, isDemo } = GameLogic();
    // const { setStatusMessage } = GameLogic();
      const {
    globalUser,
    isLoggedIn,
    setLoggedIn,
    setStatusMessage,
    updateGameState,
    gameState,
    resetGameVariables,
    isDemo,
    isDebug
  } = GameLogic()

      const navigate = useNavigate();

      const handleSubmit = () => {

          navigate('/');
            setLoggedIn(false);
            setStatusMessage(`Logged out`);

    };

      const LogOut = async () => {
    if (
      await eventManager.showConfirm(
        'Logging out will delete your progress. Proceed anyway?'
      )
    ) {
      if (
        await eventManager.showConfirm(
          'Export telemetry data to app data folder?'
        )
      ) {
        exportTelemetrisToAppData(globalUser.username)
      }

      navigate('/')
      setLoggedIn(false)
      setStatusMessage(`Logged out`)
    }
    await newGame(gameState.defaultStartHash)

    resetGameVariables()

    // updateGameState("editAccess", false);
    // updateGameState("endgameSequence", false);
    console.log('restart with hash' + gameState.defaultStartHash)
  }


    return (
          <>
          <div className='row'>
            <h2>User profile</h2>

{isDemo ? (<div><p> Logged in as: guestuser</p>

</div>) :(<div><div>

              <p>Username: {globalUser.username}</p>
              <p>Password: ***********</p>
            <br />
      </div>
          <div className='row'>
            <Link className="btn-save-add-itemn" onClick={LogOut}>
            Log Out
          </Link>
            </div>
            </div>)}
            <div className='rev-infobox'>
<p>Thank you for visiting the archive. We are currently seeking volunteers to help with the archive revitalization project. </p>

<p>If you would like to volunteer, please visit <Link to={`http://blekkenhorst.ca/bleed`} target="_blank" rel="noopener noreferrer">archive revitalization project website</Link>.</p>
</div>
            </div>
          </>
    )
}

export default UserProfile
