import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { useNavigate } from 'react-router-dom';
import { dbHelpers, newGame, newGameWithWarning } from '@utils/db';
import Dropdown from 'react-bootstrap/Dropdown';
import { eventManager } from '@utils/events';


const NavBar = () => {
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
    // <div className="NavBar">
    //     <nav className="navbar fixed-top navbar-light bg-light">
    // <div className="container-fluid">
    // <nav className="navbar navbar-blend navbar-fixed-top">
    //   <div className="mainNavButtons">
    <ul role="menubar" className="can-hover">
         <li role="menuitem" tabindex="0" aria-haspopup="true"><Link variant="outline-primary" style={{ width: '25px', padding:'2px' }} to="" onClick={() => navigate(-1)}>
          {'<<'}
        </Link></li>{' '}
        <li role="menuitem" tabindex="0" aria-haspopup="true"><Link to="/" title="home-button">
          Home</Link></li>{' '}
         <li role="menuitem" tabindex="0" aria-haspopup="true"> <Link to="/search">
          Search</Link></li>{' '}
        <li role="menuitem" tabindex="0" aria-haspopup="true">
                <Link to="/bookmarks">Bookmarks</Link></li>
        <li role="menuitem" tabindex="0" aria-haspopup="true">
                  <Link to="/hashimport">Import</Link></li>{' '}
        {(isAdmin || !isElectron) && (
          <>

<li role="menuitem" tabindex="0" aria-haspopup="true">
        Admin Tools
      <ul role="menu">
         <li role="menuitem"><Link to='/media'>Media List</Link></li>
        <li role="menuitem"><Link to='/hex'>Hex List</Link></li>
        <li role="menuitem"><Link className="dropdown-item" to='/import-export'>Database Actions</Link></li>
        </ul>
        </li>

          </>
        )}
        </ul>
    //     </div>




    // </nav>
  );
};

export default NavBar;
