import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import Home from './Home';
import UserProfile from '@components/login/UserProfile';
import Register from '@components/login/Register';
import Login from '@components/login/Login';
import NavBar from '@components/bars/NavBar';

import ImportExport from '@components/admin/ImportExport';
import HashImport from '@components/admin/HashImport';

//Entries
import StaticSingle from '@components/entries/StaticSingle';
import AddSubEntry from '@components/entries/AddSubEntry';
import  AddEntry from '@components/entries/EditEntry';

// Lists
import Search from '@components/search/Search';
import FileFullscreen from '@components/templates/FileFullScreen';
import Bookmarks from '@components/search/Bookmarks';
import Media from '@components/search/Media';
import  HexList  from '@components/search/HexList';
import  Logs  from '@components/search/Logs';

//Tools
import { useLiveQuery } from 'dexie-react-hooks';
import { db, dbHelpers, newGame } from '@utils/db';
import { GameLogic } from '@utils/gamelogic';
import BadGateway from '@components/login/BadGateway';
import { eventManager } from '@utils/events';



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
      const fileContents = await eventManager.readAssetFile(
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
      await newGame(); //  newGame in db
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
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user-profile" element={<UserProfile />} />
               <Route path="/hashimport" element={<HashImport />} />
               <Route path="/bad-gateway" element={<BadGateway />} />
            </Routes>
          </div>
        </div>
        </>
        )}
        </>
  );
}
