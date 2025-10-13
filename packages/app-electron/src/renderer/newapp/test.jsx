
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
// import React from 'react';
// import NewAppInterface from '@electron/renderer/newapp/AppNew';
// import OldAppInterface from './oldapp/AppOld';

// import NavBar from '../main/components/bars/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { db, dbHelpers, newGame } from '@utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { GameLogic } from '@utils/gamelogic';
// import NavBar from '../../../../shared/components/bars/NavBar';

// import RouterPath from '../../main/components/Router';

// import Login from '../../main/components/Login/Login';
// // import Register from '../../main/components/Login/Register';
// import StatusBar from '../../main/components/bars/StatusBar';

export default function Test() {


// const appVersion = process.env.APP_VERSION || 'newapp';

return (
  <div>
    {/* <NavBar /> */}

    Test text la la 

    will this week working? 
    {/* {appVersion === 'newapp' ? <NewAppInterface /> : <OldAppInterface />} */}
  </div>
);
}
