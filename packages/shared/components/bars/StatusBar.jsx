import React from 'react'
import { GameLogic } from '@utils/gamelogic'
import { eventManager } from '@utils/events'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import UserInfoButtons from '@components/parts/UserInfoButtons'

const StatusBar = () => {
  const {
    isAdmin,
    toggleAdmin,
    globalStatus,
    setStatusMessage,
    isLoggedIn,
    gameState,
    updateGameState
  } = GameLogic()
  const isElectron = eventManager.isElectron

  const debugWindow = async () => {
    updateGameState('showDebug', !gameState.showDebug)
  }

    const consoleChange = async () => {
    updateGameState('showConsole', !gameState.showConsole)

  }

  return (
    // <nav className="navbar navbar-blendfsf sdf asd navbar-fixed-bottom">
    <nav>
      <div className='status-bar'>
        <div className='status-bar-field col'>
          {' '}
                    {/* {isAdmin && ( */}
            <button  onClick={debugWindow}>
              DBI
            </button>
        {/* )} */}
          {gameState.consoleAvailable && (
            <button  onClick={consoleChange} className="console-button clear-button-style">
              ⛔
            </button>
          )} 
        </div>
        {/* <div className='status-bar-field col-8'> */}
          {/* {(globalStatus != "") && (status ||  ${globalStatus} )} */}
          <div className='status-bar-field col-8'>
            {(globalStatus !== '' && 'status || ', globalStatus)}
          </div>
        {/* </div>{' '} */}
        <div className='status-bar-field'>
          <UserInfoButtons />
        </div>
      </div>
    </nav>
  )
}

export default StatusBar
