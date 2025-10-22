import React from 'react';
import { GameLogic } from '@utils/gamelogic';
import { eventManager } from '@utils/events';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import UserInfoButtons from '@components/parts/UserInfoButtons';

const StatusBar = () => {
  const { isAdmin, toggleAdmin, globalStatus, setStatusMessage, isLoggedIn } = GameLogic();
      const isElectron = eventManager.isElectron

  return (
        // <nav className="navbar navbar-blend navbar-fixed-bottom">
            <nav>
        <div className="status-bar">
    <div className="status-bar-field col-8">|| { globalStatus }  </div> <div className="status-bar-field"><UserInfoButtons />
</div>
    </div>
    </nav>
  );
};

export default StatusBar;
