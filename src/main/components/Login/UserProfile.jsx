
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { GameLogic } from '../../../../packages/shared/utils/gamelogic';

const UserProfile = () => {
  const [restoreLastRoute, setRestoreLastRoute] = useState(true); // default true
    const { isLoggedIn, setLoggedIn } = GameLogic();
    const { globalUser } = GameLogic();
    const { setStatusMessage } = GameLogic();
      const navigate = useNavigate();

      const handleSubmit = () => {

          navigate('/');
            setLoggedIn(false);
            setStatusMessage(`Logged out`);

    };


    return (
          <>
          <div className='row'>
            <h1>User profile.</h1>

              <p>Username: {globalUser.username}</p>
              <p>Password: ***********</p>
            {/*  Not working - not needed probably.
            <p>Restore last route: {restoreLastRoute ? "Enabled" : "Disabled"}</p>
            <Button variant="outline-primary" onClick={() => setRestoreLastRoute(!restoreLastRoute)}>
              Toggle Restore Last Route
            </Button> */}
            <br />
              <Link to={`http://blekkenhorst.ca`} target="_blank" rel="noopener noreferrer">blekkenhorst.ca</Link>
          </div>
          <div className='row'>
            <Button className="btn-save-add-itemn" onClick={handleSubmit}>
            Log Out
          </Button>
            </div>
          </>
    )
}

export default UserProfile
