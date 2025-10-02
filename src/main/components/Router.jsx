import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

// import DescriptionEntry from './Components/DescriptionEntry';

import  AddEntry from './Routes/EditEntry';
import Home from './Home';
import UserProfile from './Login/UserProfile';
import Register from './Login/Register';
import Login from './Login/Login';
import NavBar from './bars/NavBar';

import ImportExport from './Admin/ImportExport';
import StaticSingle from './Routes/StaticSingle';
import AddSubEntry from './Routes/AddSubEntry';
// import StyleTest from 'Style';
import Search from './Search/Search';
import FileFullscreen from './Templates/FileFullScreen';
import Bookmarks from './Search/Bookmarks';
import Media from './Search/Media';
import HashImport from './Admin/HashImport';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, dbHelpers, newGame } from '../utils/db';
import { GameLogic } from '../utils/gamelogic';

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

export default function RouterPath() {
  const { isAdmin, setAdmin } = GameLogic();
  const [dbKey, setDbKey] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
const { isLoggedIn, setLoggedIn } = GameLogic();

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
          '/register'
        ];
        const isDynamicRoute =
          lastRoute.startsWith('/edit-item/') ||
          lastRoute.startsWith('/entry/') ||
          lastRoute.startsWith('/single-item/') ||
          lastRoute.startsWith('/edit-subitem/') ||
          lastRoute.startsWith('/add-subitem/') ||
          // || lastRoute.startsWith('/add-subitem/')
          lastRoute.startsWith('/file-fullscreen/');

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
    // <Router initialEntries={[initialRoute]}>
    //   <RouteTracker />
<>
{!isLoggedIn ? (
          <Login />
        ) : (
        <>
        <NavBar />
        <div className="content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/edit-item/:id" element={<AddEntry />} />
              <Route path="/add-subitem/:parentID" element={<AddSubEntry />} />
              <Route
                path="/edit-subitem/:parentID/:itemID"
                element={<AddSubEntry />}
              />
              <Route path="/import-export" element={<ImportExport />} />
              <Route path="/entry/:id" element={<StaticSingle />} />
              {/* <Route path="/style" element={<StyleTest />} /> */}
              <Route path="/search" element={<Search />} />
              <Route
                path="/file-fullscreen/:fileID"
                element={<FileFullscreen />}
              />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/media" element={<Media />} />
              <Route path="/hashimport" element={<HashImport />} />
              <Route path="/file-fullscreen/:id" element={<FileFullscreen />} />
              {/* <Route path="/test" element={<DescriptionEntry />} /> */}


              {/* <Route path="/register" element={<Register />} /> */}
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
        </>
        )}
        </>
  );
}
