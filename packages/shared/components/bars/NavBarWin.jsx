import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { useNavigate } from 'react-router-dom';
import { dbHelpers, newGame, newGameWithWarning } from '@utils/db';
import Dropdown from 'react-bootstrap/Dropdown';
import { eventManager } from '@utils/events';


const NavBarWin = () => {
  const { isAdmin, toggleAdmin } = GameLogic();
    const navigate = useNavigate();
    const CallNewGame = newGameWithWarning;
    const { globalUser, isLoggedIn, setLoggedIn, setStatusMessage } = GameLogic();

      const isElectron = eventManager.isElectron;


      const  LogOut = async () => {
          if (await eventManager.showConfirm('Logging out will delete your progress. Proceed anyway?')) {
            await newGame();

            navigate('/');
            setLoggedIn(false);
            setStatusMessage(`Logged out`);
          }

    };






  return (
    <div>
          <nav className="navbar navbar-blend navbar-fixed-top">
      <div className="mainNavButtons">
<ul role="menubar" className="can-hover">
  <li role="menuitem" tabindex="0" aria-haspopup="true">View</li>
  <li role="menuitem" tabindex="0" aria-haspopup="true">
    Sort by
    <ul role="menu">
      <li role="menuitem"><a href="#menu">Name</a></li>
      <li role="menuitem"><a href="#menu">Size</a></li>
      <li role="menuitem"><a href="#menu">Item type</a></li>
      <li role="menuitem"><a href="#menu">Date modified</a></li>
    </ul>
  </li>
</ul>
        </div>




    </nav>
</div>
  );
};

export default NavBarWin;
