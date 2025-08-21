import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../utils/gamelogic';
import { useNavigate } from 'react-router-dom';
import { dbHelpers, newGameWithWarning } from '../../utils/db';
import Dropdown from 'react-bootstrap/Dropdown';



const NavBar = () => {
  const { isAdmin, toggleAdmin } = GameLogic();
    const navigate = useNavigate();
    const CallNewGame = newGameWithWarning;



const resizeWindow = () => {

  if (!window){
    console.error("electronAPI is not defined on window");
    return;
  }
  if (window.electronAPI?.resizeToDefault) {
    window.electronAPI.resizeToDefault();
    console.log("i tried to resize");
  } else{
console.log("i failed to resize, can't fine window.electronAPI");
  }

};





  return (
    // <div className="NavBar">
    //     <nav className="navbar fixed-top navbar-light bg-light">
    // <div className="container-fluid">
    <nav className="navbar navbar-blend navbar-fixed-top">
      <div className="mainNavButtons">

        <Button variant="outline-primary" style={{ width: '25px', padding:'2px' }} onClick={() => navigate(-1)}>
          {'<<'}
        </Button>{' '}

        <Link to="/">
          <Button variant="outline-primary">Home</Button>
        </Link>{' '}
         <Link to="/search">
          <Button variant="outline-primary">Search</Button>
        </Link>{' '}


                <Link to="/bookmarks">
          <Button variant="outline-primary">Bookmarks</Button>
        </Link>
                    <Link to="/hashimport">
              <Button variant="outline-primary">Import</Button>
            </Link>{' '}
        {isAdmin && (
          <>
          {/* <Link to="/media/">
              <Button variant="outline-primary">Media</Button>
            </Link>{' '}
            {' '} */}

 <Dropdown>
      <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" >
        Admin Tools
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item className="dropdown-item" onClick={() => navigate('/media/')}>Media List</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="dropdown-item" onClick={() => navigate('/import-export')}>Database Actions</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

          </>
        )}
        </div>
        <div>
         <div className='login-info'> Logged in as:         <Link to="/user-profile">
          
        {isAdmin ? 'Admin' : 'User'}</Link>{' '}
          <Button
            variant="outline-secondary"
            onClick={toggleAdmin}
            title="eventually this will be a log in at the beginning of the game, displayed like this for testing."
          >
            {isAdmin ? 'Switch' : 'Switch'}
          </Button> {''}
                    <Button title="Resize Window" variant="outline-secondary" onClick={resizeWindow}>
    [ ]
  </Button>{' '}
           </div>
        </div>


    </nav>
  );
};

export default NavBar;
