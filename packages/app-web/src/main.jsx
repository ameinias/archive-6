
import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import React from 'react';
import TestComp from '@shared/components/testcomp';
import ReactDOM from 'react-dom/client'
// import App from './App';
import FakeApp from './FakeApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FakeApp />
  </React.StrictMode>,
)