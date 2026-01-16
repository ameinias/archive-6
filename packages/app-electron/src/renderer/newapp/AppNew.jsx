import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@shared/App.css'

import { db, dbHelpers, newGame } from '@utils/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { GameLogic } from '@utils/gamelogic'

import RouterPath from '@components/routes/Router'
import TestComp from '@components/testcomp'

import Login from '@components/login/Login'
// import Register from '../../main/components/Login/Register';
import StatusBar from '@components/bars/StatusBar'
import { eventManager } from '@utils/events'

// import { ImportExport } from 'ImportExport';

// Component to track and restore route on hot reload
function RouteTracker () {
  const location = useLocation()
  const friends = useLiveQuery(() => db.friends.toArray())

  useEffect(() => {
    // Save current route to localStorage whenever it changes
    localStorage.setItem('secondLastRoute', localStorage.getItem('lastRoute'))
    localStorage.setItem('lastRoute', location.pathname)

    dbHelpers.addEvent("visited: " + location.pathname, "navigation");


  }, [location.pathname])

  return null
}

export default function App () {
  const { isAdmin, setAdmin, gameState } = GameLogic()
  const { isLoggedIn, setLoggedIn } = GameLogic()
  const [dbKey, setDbKey] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isCursorHidden, setIsCursorHidden] = useState(false)

  useEffect(() => {
    checkNewGame()
  }, [])

  // I don't know if this works as intended
  const checkNewGame = async () => {
    const isEmpty = await dbHelpers.isEmpty()
    if (isEmpty) {
      console.log('Database is empty, loading initial data...')
      const fileContents = await eventManager.readAssetFile(
        'assets/databases/dexie-import.json'
      )

      dbHelpers.importFromBlob(
        new Blob([fileContents], { type: 'application/json' })
      )
      console.log('Initial data loaded successfully.')
      setDbKey(prev => prev + 1)
      console.log('Database key updated:', dbKey)
    }
  }

  // this kind of works but I don't think this is the best way to do it
  //#region -------------  hide cursor in endgame sequence --------------
  useEffect(() => {
    if (isCursorHidden) {
      document.body.style.cursor = 'none'
    } else {
      // Revert to default cursor
      document.body.style.cursor = 'auto'
    }

    // Cleanup function to ensure the cursor is restored when the component unmounts
    // return () => {
    //   document.body.style.cursor = 'auto';
    // };
  }, [isCursorHidden])

  const toggleCursor = () => {
    setIsCursorHidden(!isCursorHidden)
  }

  //#endregion -------------

  const handleNewGame = async () => {
    await newGame()
    setDbKey(prev => prev + 1)
  }

  // Get the initial route synchronously before render
  const getInitialRoute = () => {
    const restoreLastRoute =
      localStorage.getItem('restoreLastRoute') !== 'false'

    if (restoreLastRoute) {
      const lastRoute = localStorage.getItem('lastRoute')
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
          '/convo',
          '/player-add-entry',
          '/timeline',
          '/test',
          '/connections'
        ]
        const isDynamicRoute =
          lastRoute.startsWith('/edit-item/') ||
          lastRoute.startsWith('/entry/') ||
          lastRoute.startsWith('/single-item/') ||
          lastRoute.startsWith('/edit-subitem/') ||
          lastRoute.startsWith('/add-subitem/') ||
          // || lastRoute.startsWith('/add-subitem/')
          lastRoute.startsWith('/file-fullscreen/')
        lastRoute.startsWith('/hex/')
        lastRoute.startsWith('/media/')
        lastRoute.startsWith('/logs/')
        lastRoute.startsWith('/timeline/')
        lastRoute.startsWith('/test/')
        lastRoute.startsWith('/connections/')

        if (validRoutes.includes(lastRoute) || isDynamicRoute) {
          //  console.log('Using last route:', lastRoute);
          return lastRoute
        } else {
          console.log('Invalid route, using default')
        }
      } else {
        console.log('No last route found, using default')
      }
    }
    return '/' // Default route.  A comment
  }

  const initialRoute = getInitialRoute()

  // from https://css-tricks.com/simulating-mouse-movement/
  // https://medium.com/@jaredloson/custom-javascript-cursor-in-react-d7ffefb2db38

  return (
    <>
      <div className={gameState.endgameSequence ? 'lockScreen' : ''}></div>



      <Router initialEntries={[initialRoute]}>
        <div className='wrapper' key={dbKey}>
          <RouteTracker />
          {!isLoggedIn ? <Login /> : <RouterPath />}
        </div>
      </Router>
    </>
  )
}
