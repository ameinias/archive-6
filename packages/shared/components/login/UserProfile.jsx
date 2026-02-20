
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { GameLogic } from '@utils/gamelogic';

const UserProfile = () => {
  const [restoreLastRoute, setRestoreLastRoute] = useState(true); // default true
    const { isLoggedIn, setLoggedIn } = GameLogic();
    const { globalUser, isDemo } = GameLogic();
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
            <h2>User profile</h2>

{isDemo ? (<div><p> Logged in as: guestuser</p>

</div>) :(<div><div>

              <p>Username: {globalUser.username}</p>
              <p>Password: ***********</p>
            <br />
      </div>
          <div className='row'>
            <Link className="btn-save-add-itemn" onClick={handleSubmit}>
            Log Out
          </Link>
            </div>
            </div>)}
            <div className='rev-infobox'>
<p>Thank you for visiting the archive. We are currently seeking volunteers to help with the archive revitalization project. </p>

<p>If you would like to volunteer, please visit <Link to={`http://blekkenhorst.ca/bleed`} target="_blank" rel="noopener noreferrer">archive revitalization project website</Link>.</p>
</div>
            </div>
          </>
    )
}

export default UserProfile
