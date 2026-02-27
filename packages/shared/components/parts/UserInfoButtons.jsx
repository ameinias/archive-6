import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { GameLogic } from '@utils/gamelogic'
import { useNavigate } from 'react-router-dom'
import {
  dbHelpers,
  newGame,
  newGameWithWarning,
  exportTelemetrisToAppData
} from '@utils/db'
import Dropdown from 'react-bootstrap/Dropdown'
import { eventManager } from '@utils/events'
import ImportExport from '@components/admin/ImportExport'

const UserInfoButtons = () => {
  const { isAdmin, toggleAdmin } = GameLogic()
  const navigate = useNavigate()
  const CallNewGame = newGameWithWarning
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

  const isElectron = eventManager.isElectron

  const LogOut2 = async () => {}

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
    <div>
      {isElectron && (
        <div>
          <div className='login-info'>
            {isDemo ? (
              <div>
                <span>
                  {' '}
                  Logged in as: <Link to='/user-profile'>guestuser</Link>
                </span>
              </div>
            ) : (
              <div>
                <span>
                  {' '}
                  Logged in as:
                  <Link to='/user-profile'>
                    {isAdmin ? 'Admin' : `${globalUser.username}`}
                  </Link>
                </span>{' '}
                <button
                  className={gameState.showDebug || isAdmin ? ('btn-logout-debug') : 'hide'}
                  onClick={LogOut}
                  title='This will delete your progress!'
                >
                 End Session
                </button>{' '}

              </div>
            )}
                              {/* <button
                    className='btn-logout-debug'
                    onClick={LogOut}
                    title='This will delete your progress!'
                  >
                    End Session
                  </button> */}
                          {/* {gameState.showDebug && (
                  <button
                    className='btn-logout-debug'
                    onClick={LogOut}
                    title='This will delete your progress!'
                  >
                    End Session
                  </button>
                )}
                                  <button
                    className='btn-logout-debug'
                    onClick={LogOut}
                    title='This will delete your progress!'
                  >
                    End Session
                  </button> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserInfoButtons
