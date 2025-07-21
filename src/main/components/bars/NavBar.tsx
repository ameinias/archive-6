import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../utils/gamelogic';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { isAdmin, toggleAdmin } = GameLogic();
    const navigate = useNavigate();

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
          <Button variant="outline-primary">Searchh</Button>
        </Link>{' '}
        
        <Link to="/user-profile">
          <Button variant="outline-primary">User Profile</Button>
        </Link>
        {isAdmin && (
          <>
            {' '}
            <Link to="/edit-item/new">
              <Button variant="outline-primary">New Entry</Button>
            </Link>{' '}
            
            <Link to="/import-export">
              <Button variant="outline-primary">Admin</Button>
            </Link>{' '}
          </>
        )}
        </div>
        <div>
         <div className='login-info'> Logged in as: {isAdmin ? 'Admin' : 'User'}{' '}
          <Button
            variant="outline-secondary"
            onClick={toggleAdmin}
            title="eventually this will be a log in at the beginning of the game, displayed like this for testing."
          >
            {isAdmin ? 'Switch' : 'Switch'}
          </Button>
           </div>
        </div>


    </nav>
  );
};

export default NavBar;
