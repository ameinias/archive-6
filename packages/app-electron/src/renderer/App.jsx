
import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import React from 'react';
import NewAppInterface from '@electron/renderer/newapp/AppNew';
import Test from '@electron/renderer/newapp/test';
// import OldAppInterface from './oldapp/AppOld';

// import NavBar from '../main/components/bars/NavBar';


export default function App() {


// const appVersion = process.env.APP_VERSION || 'newapp';

return (
  <div>
    <NewAppInterface />
  </div>
);
}
