import React from 'react';
import { eventManager } from '@utils/events'
import Button from 'react-bootstrap/Button';

export default function TestComp() {

        const  LogOut = async () => {
            if (await eventManager.showConfirm('Logging out will delete your progress. Proceed anyway?')) {
              await newGame();
  
              navigate('/');
              setLoggedIn(false);
              setStatusMessage(`Logged out`);
            }
          }

// const appVersion = process.env.APP_VERSION || 'newapp';

return (
  <div>
    This is a test component.
      <Button
            variant="outline-secondary"
            onClick={LogOut}
            title="This will delete your progress!"
          >
            Log Out
          </Button> {' '}
  </div>
);
}
