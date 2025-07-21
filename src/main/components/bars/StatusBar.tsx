import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../utils/gamelogic';

const StatusBar = () => {
  const { isAdmin, toggleAdmin, globalStatus, setStatusMessage } = GameLogic();


  return (
        <nav className="navbar navbar-blend navbar-fixed-bottom">
        <div className="nav">
    <div className="statusbar"> { globalStatus }  </div>
    </div>
    </nav>
  );
};

export default StatusBar;
