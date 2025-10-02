
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import NewAppInterface from './newapp/AppNew';
// import OldAppInterface from './oldapp/AppOld';

// import NavBar from '../main/components/bars/NavBar';


export default function App() {


// const appVersion = process.env.APP_VERSION || 'newapp';

return (
  <div>
    {/* <NavBar /> */}
    <div>If you can see this, i've upgraded from typescript ok.</div>
    <NewAppInterface />
    {/* {appVersion === 'newapp' ? <NewAppInterface /> : <OldAppInterface />} */}
  </div>
);
}
