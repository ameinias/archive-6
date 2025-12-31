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
import NavBarWin from '@components/bars/NavBarWin';

import ImportExport from '@components/admin/ImportExport';
import HashImport from '@components/admin/HashImport';

//Entries
import StaticSingle from '@components/entries/StaticSingle';
import AddSubEntry from '@components/entries/AddSubEntry';
import  AddEntry from '@components/entries/EditEntry';
import  Entry from '@components/entries/Entry';

// Lists
import Search from '@components/search/Search';
import FileFullscreen from '@components/templates/FileFullScreen';
import Bookmarks from '@components/search/Bookmarks';
import Media from '@components/search/Media';
import  HexList  from '@components/search/HexList';
import  Logs  from '@components/search/Logs';
import  Connections  from '@components/search/Connections';
import { TimeLine } from '@components/lists/TimeLine';

//Tools
import { useLiveQuery } from 'dexie-react-hooks';
import { db, dbHelpers, newGame } from '@utils/db';
import { GameLogic } from '@utils/gamelogic';
import BadGateway from '@components/login/BadGateway';
import { eventManager } from '@utils/events';

import StatusBar from '@components/bars/StatusBar';

// Endgame pages
import { PlayerAddEntryForm } from '@components/other/PlayerEditPage';
import Conversation from '@components/other/Conversation';
import TestComp from '../testcomp';



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
    checkDBVersion();
  }, []);

  const checkDBVersion = async () => {
    //   dbHelpers.getDBVersion().then(async (version) => {
    //   console.log('Current DB Version:', version);
    //   const expectedVersion = dbHelpers.getExpectedDBVersion();
    //   if (version < expectedVersion) {
    //     console.log(`Database version ${version} is outdated. Expected version is ${expectedVersion}.`);
    //     // Here you can implement migration logic if needed
    //     await eventManager.showAlert(`Your database is outdated (version ${version}). Please start a new game to update to version ${expectedVersion}.`);
    //   } else {
    //     console.log('Database is up to date.');
    //   }
    // });
  };

  // this is also in AppNew.jsx - which is the correct place for it?
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

        <NavBar />
         {/* <NavBarWin /> */}
        <div className="content window-body has-space">
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
              <Route path="/entry/:id" element={<Entry />} />
 {/* admin tools -------------------            -------------------------*/}
              <Route path="/import-export" element={<ImportExport />} />
  {/* Lists   ------------------------------------------------------------ */}
              <Route path="/search" element={<Search />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/media" element={<Media />} />
              <Route path="/hex" element={<HexList />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/file-fullscreen/:id" element={<FileFullscreen />} />
              <Route path="/test" element={<TestComp />} />
              <Route path="/connections" element={<Connections />} />

              

{/* PlayerAdmin   ------------------------------------------------------------ */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user-profile" element={<UserProfile />} />
               <Route path="/hashimport" element={<HashImport />} />
               <Route path="/bad-gateway" element={<BadGateway />} />
               <Route path="/timeline" element={<TimeLine />} />
  {/* Endgame Pages   ------------------------------------------------------------ */}
              <Route path="/player-add-entry/" element={<PlayerAddEntryForm />} />
              <Route path="/convo/" element={<Conversation />} />
            </Routes>
          </div>
        </div>
         <StatusBar />
        </>

  );
}
