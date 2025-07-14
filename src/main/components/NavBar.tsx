import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../utils/gamelogic';

const NavBar = () => {
  const { isAdmin, toggleAdmin } = GameLogic();


  return (
    // <div className="NavBar">
      <nav className="navbar fixed-top navbar-light bg-light">
  <div className="container-fluid">
      <Link to="/">
        <Button variant="outline-primary">Home</Button>
      </Link>{' '}
      |{' '}
      <Link to="/user-profile">
        <Button variant="outline-primary">User Profile</Button>
      </Link> |{' '}
      <Link to="/edit-item/new">
        <Button variant="outline-primary">New Entry</Button>
      </Link> |{' '}
      <Link to="/import-export">
        <Button variant="outline-primary">Admin</Button>
      </Link>
      <div>
        Logged in as: {isAdmin ? 'Admin' : 'User'}{' '}
        <Button variant="outline-secondary" onClick={toggleAdmin}>
          {isAdmin ? 'Switch' : 'Switch'}
        </Button>
      </div>
      </div>
</nav>

  );
};

export default NavBar;
