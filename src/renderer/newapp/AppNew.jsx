import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { db, dbHelpers, newGame } from '../../main/utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { GameLogic } from '../../main/utils/gamelogic';

import RouterPath from '../../main/components/Router';

import Login from '../../main/components/Login/Login';
import StatusBar from '../../main/components/bars/StatusBar';

// import { ImportExport } from 'ImportExport';

// Component to track and restore route on hot reload
function RouteTracker() {
  const location = useLocation();
  const friends = useLiveQuery(() => db.friends.toArray());

  useEffect(() => {
    // Save current route to localStorage whenever it changes
    localStorage.setItem('lastRoute', location.pathname);
  }, [location.pathname]);

  return null;
}

export default function App() {
  const { isAdmin, setAdmin } = GameLogic();
  const { isLoggedIn, setLoggedIn } = GameLogic();
  const [dbKey, setDbKey] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);


  useEffect(() => {
    checkNewGame();
  }, []);

  const checkNewGame = async () => {
    const isEmpty = await dbHelpers.isEmpty();
    if (isEmpty) {
      console.log('Database is empty, loading initial data...');
      const fileContents = await window.electronAPI.readAssetFile(
        'assets/databases/dexie-import.json',
      );

      dbHelpers.importFromBlob(
        new Blob([fileContents], { type: 'application/json' }),
      );
      console.log('Initial data loaded successfully.');
      setDbKey((prev) => prev + 1);
      console.log('Database key updated:', dbKey);
    }
  };

      const handleNewGame = async () => {
      await newGame(); // Your newGame function
      setDbKey((prev) => prev + 1);
    };

  // Get the initial route synchronously before render
  const getInitialRoute = () => {
    const restoreLastRoute =
      localStorage.getItem('restoreLastRoute') !== 'false';

    if (restoreLastRoute) {
      const lastRoute = localStorage.getItem('lastRoute');
      //console.log('Last route from localStorage:', lastRoute);

      if (lastRoute) {
        const validRoutes = [
          '/',
          '/user-profile',
          '/file-fullscreen/:fileID',
          '/import-export',
          'search',
          '/style',
          '/edit-item/new',
          '/edit-item/:id',
          '/add-subitem/:parentID',
          '/edit-subitem/:parentID/:itemID',
          '/bookmarks',
          '/entry/:id',
          '/hashimport',
                    '/login',
          '/register',
          '/media',
          '/hex',
          '/logs',
        ];
        const isDynamicRoute =
          lastRoute.startsWith('/edit-item/') ||
          lastRoute.startsWith('/entry/') ||
          lastRoute.startsWith('/single-item/') ||
          lastRoute.startsWith('/edit-subitem/') ||
          lastRoute.startsWith('/add-subitem/') ||
          // || lastRoute.startsWith('/add-subitem/')
          lastRoute.startsWith('/file-fullscreen/');
          lastRoute.startsWith('/hex/');
          lastRoute.startsWith('/media/');
          lastRoute.startsWith('/logs/');

        if (validRoutes.includes(lastRoute) || isDynamicRoute) {
          //  console.log('Using last route:', lastRoute);
          return lastRoute;
        } else {
          console.log('Invalid route, using default');
        }
      } else {
        console.log('No last route found, using default');
      }
    }
    return '/'; // Default route.  A comment
  };

  const initialRoute = getInitialRoute();

  return (
<>
    <Router initialEntries={[initialRoute]}>
      <div className="wrapper" key={dbKey}>

      <RouteTracker />


{!isLoggedIn ? (

          <Login />
        ) : (
          <RouterPath />
        )}
        <StatusBar />
      </div>

</Router>
</>
  );
}
