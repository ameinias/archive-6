import { MemoryRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import icon from '../../assets/icon.svg';
import './App.css';
import Home from '../main/components/Home';
import UserProfile from '../main/components/UserProfile';
import NavBar from '../main/components/bars/NavBar';
import StatusBar from '../main/components/bars/StatusBar';
import AddEntry from '../main/components/Friends/AddEntry';
import ImportExport from '../main/components/ImportExport';
import ShowSingle from '../main/components/Friends/ShowSingle';
import AddSubEntry from '../main/components/Friends/AddSubEntry';

// Component to track and restore route on hot reload
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Save current route to localStorage whenever it changes
    localStorage.setItem('lastRoute', location.pathname);
  }, [location.pathname]);

  return null;
}

export default function App() {
  // Get the initial route synchronously before render
  const getInitialRoute = () => {
    const restoreLastRoute = localStorage.getItem('restoreLastRoute') !== 'false';
    console.log('Restore last route setting:', restoreLastRoute);

    if (restoreLastRoute) {
      const lastRoute = localStorage.getItem('lastRoute');
      console.log('Last route from localStorage:', lastRoute);

      if (lastRoute) {
        const validRoutes = ['/', '/user-profile', '/import-export'];
        const isDynamicRoute = lastRoute.startsWith('/edit-item/') || lastRoute.startsWith('/entry/');

        if (validRoutes.includes(lastRoute) || isDynamicRoute) {
          console.log('Using last route:', lastRoute);
          return lastRoute;
        } else {
          console.log('Invalid route, using default');
        }
      } else {
        console.log('No last route found, using default');
      }
    }
    return '/'; // Default route
  };

  const initialRoute = getInitialRoute();

  return (
    <Router initialEntries={[initialRoute]}>
      <RouteTracker />
      <div>
      <NavBar />
      <div className="content">
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/edit-item/:id" element={<AddEntry />} />
          <Route path="/add-subitem/:parentID" element={<AddSubEntry />} />
          <Route path="/edit-subitem/:parentID/:itemID" element={<AddSubEntry />} />
          <Route path="/import-export" element={<ImportExport />} />
          <Route path="/entry/:id" element={<ShowSingle />} />
        </Routes>
      </div>
      </div>
      <StatusBar />
      </div>
    </Router>
  );
}
