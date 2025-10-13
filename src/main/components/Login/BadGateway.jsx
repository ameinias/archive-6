
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { GameLogic } from '../../../../packages/shared/utils/gamelogic';

const BadGateway = () => {
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
          <div className='row bad-gateway'>
           BAD GATEWAY
            </div>
          </>
    )
}

export default BadGateway
