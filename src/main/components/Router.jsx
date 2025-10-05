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


import Home from './Home';
import UserProfile from './Login/UserProfile';
import Register from './Login/Register';
import Login from './Login/Login';
import NavBar from './bars/NavBar';

import ImportExport from './Admin/ImportExport';
import HashImport from './Admin/HashImport';

//Entries
import StaticSingle from './Routes/StaticSingle';
import AddSubEntry from './Routes/AddSubEntry';
import  AddEntry from './Routes/EditEntry';

// Lists
import Search from './Search/Search';
import FileFullscreen from './Templates/FileFullScreen';
import Bookmarks from './Search/Bookmarks';
import Media from './Search/Media';
import  HexList  from './Search/HexList';
import  Logs  from './Search/Logs';

//Tools
import { useLiveQuery } from 'dexie-react-hooks';
import { db, dbHelpers, newGame } from '../utils/db';
import { GameLogic } from '../utils/gamelogic';

 

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

    // Initial Route now happens in AppNew.jsx


  return (
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

   {/* Entries ---------------------------------------------------------- */}
              <Route path="/edit-item/:id" element={<AddEntry />} />
              <Route path="/add-subitem/:parentID" element={<AddSubEntry />} />
              <Route
                path="/edit-subitem/:parentID/:itemID"
                element={<AddSubEntry />}
              />
              <Route path="/entry/:id" element={<StaticSingle />} />
 {/* admin tools -------------------            -------------------------*/}
              <Route path="/import-export" element={<ImportExport />} />

  {/* Lists   ------------------------------------------------------------ */}
              <Route path="/search" element={<Search />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/media" element={<Media />} />
              <Route path="/hex" element={<HexList />} />
              <Route path="/logs" element={<Logs />} />

              <Route path="/file-fullscreen/:id" element={<FileFullscreen />} />
              {/* <Route path="/test" element={<DescriptionEntry />} /> */}

{/* PlayerAdmin   ------------------------------------------------------------ */}
              {/* <Route path="/register" element={<Register />} /> */}
              <Route path="/login" element={<Login />} />
              <Route path="/user-profile" element={<UserProfile />} />
               <Route path="/hashimport" element={<HashImport />} />
            </Routes>
          </div>
        </div>
        </>
        )}
        </>
  );
}
