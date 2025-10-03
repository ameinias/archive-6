
import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import React from 'react';
import NewAppInterface from './newapp/AppNew';
// import OldAppInterface from './oldapp/AppOld';

// import NavBar from '../main/components/bars/NavBar';


export default function App() {


// const appVersion = process.env.APP_VERSION || 'newapp';

return (
  <div>
    {/* <NavBar /> */}
    <NewAppInterface />
    {/* {appVersion === 'newapp' ? <NewAppInterface /> : <OldAppInterface />} */}
  </div>
);
}
