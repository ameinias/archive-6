
// import 'bootstrap/dist/css/bootstrap.min.css';
import './terminal.css';
import React from 'react';
import NewAppInterface from '@electron/renderer/newapp/AppNew';
import Test from '@electron/renderer/newapp/test';
// import OldAppInterface from './oldapp/AppOld';

// import NavBar from '../main/components/bars/NavBar';


export default function App() {


// const appVersion = process.env.APP_VERSION || 'newapp';

return (
  <div>
    {/* <NavBar /> */}
    {/* <NewAppInterface /> */}
    I am a fake terminal!!
    {/* {appVersion === 'newapp' ? <NewAppInterface /> : <OldAppInterface />} */}
  </div>
);
}
