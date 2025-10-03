import React from 'react';
import { GameLogic } from '../../utils/gamelogic';

const StatusBar = () => {
  const { isAdmin, toggleAdmin, globalStatus, setStatusMessage, isLoggedIn } = GameLogic();


  return (
        <nav className="navbar navbar-blend navbar-fixed-bottom">
        <div className="nav">
    <div className="statusbar"> { globalStatus }  </div>
    </div>
    </nav>
  );
};

export default StatusBar;
