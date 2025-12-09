import React from 'react';
import { eventManager } from '@utils/events'
import Button from 'react-bootstrap/Button';

export default function Conversation() {



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
{/* npx shadcn@latest add @magicui/terminal */}

  </div>
);
}
