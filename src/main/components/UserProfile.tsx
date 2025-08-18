
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [restoreLastRoute, setRestoreLastRoute] = useState(true); // default true


    return (
          <>
            <h1>User profile.</h1>
            <span>Who are you? </span>
            {/*  Not working - not needed probably.
            <p>Restore last route: {restoreLastRoute ? "Enabled" : "Disabled"}</p>
            <Button variant="outline-primary" onClick={() => setRestoreLastRoute(!restoreLastRoute)}>
              Toggle Restore Last Route
            </Button> */}
            <br />
              <Link to={`http://blekkenhorst.ca`} target="_blank" rel="noopener noreferrer">blekkenhorst.ca</Link>
          </>
    )

}

export default UserProfile
