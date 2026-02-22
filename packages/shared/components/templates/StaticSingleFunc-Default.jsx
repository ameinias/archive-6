import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react'
import { db, dbHelpers } from '@utils/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { GameLogic } from '@utils/gamelogic'
import { Link } from 'react-router-dom'
import { StaticSubListItem } from '@components/parts/StaticSubListItem'
import { BookMarkCheck } from '@components/parts/Badges'
import { MediaDisplay } from '@components/parts/Media/MediaDisplay'
import { MediaThumbnail } from '@components/parts/Media/MediaThumbnail.jsx'
import DescriptionEntry from '@components/parts/DescriptionEntry'
import { MediaEntryDisplay } from '@components/parts/Media/MediaEntryDisplay'
import { SelectEntry } from '@components/parts/FormAssets'

export function StaticSingleDefault ({ itemID }) {
  const { id } = useParams() // get the id from the route
  const gameLogic = GameLogic()
  const { gameState, globalUser, isDemo } = GameLogic()

  // For the final animation
  const initialSeconds = 5 // Set the initial countdown time in seconds
  const [seconds, setSeconds] = useState(initialSeconds)

  const item = useLiveQuery(() => {
    const numericID = Number(itemID)
    // console.log('edit access: ' + gameLogic.gameState.editAccess)
    if (!itemID || isNaN(numericID) || numericID <= 0) {
      console.warn('Invalid itemID for database query:', itemID)
      return null
    }
    return db.friends.get(numericID)
  }, [itemID])

  const navigate = useNavigate()
  const [statusMessage, setStatusMessage] = useState('')

  const allFriends = useLiveQuery(() => db.friends.toArray(), [])

  // trying makeTrue-playerAddEntry for now
  useEffect(() => {
    const markAsRead = async () => {
      if (item && item.unread && item.available) {
        try {
          await db.friends.update(Number(id), { unread: false })
          // console.log(item.fauxID + " was unread, now marked as read");
        } catch (error) {
          console.error('Error marking as  read:', error)
        }
      }
    }

    markAsRead()
  }, [item, id])

  useEffect(() => {
    if (!item) return
    if(isDemo) return

    if (item.triggerEvent && item.unread) {
      //item.triggerEvent.length > 0
      gameLogic.triggerEvent(item.triggerEvent)
    }
  }, [item, id])

  useEffect(() => {
    if (!item) return
    if (gameLogic.gameState.endgameSequence) {
      // Exit condition for the timer
      if (seconds <= 0) {
        navigate(`/convo`)
        return
      } else {
        console.log('seconds remaining:', seconds)
      }

      // Set up the interval
      const intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1)
      }, 1000) // 1000 milliseconds = 1 second

      return () => clearInterval(intervalId)
    }
  }, [seconds, initialSeconds]) // Re-run effect if seconds or initialSeconds changes

  const getEntryTitle = entryId => {
    if (!allFriends) return entryId
    const entry = allFriends.find(f => f.id === Number(entryId))
    return entry?.fauxID || entryId
  }

  const subEntryOfParent =
    useLiveQuery(() => {
      const numericID = Number(itemID)
      if (!itemID || isNaN(numericID) || numericID <= 0) {
        return []
      }
      return db.subentries.where('parentId').equals(numericID).toArray()
    }, [itemID]) || []

  const handleRef = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'remove-value':
      case 'pop-value':
        if (actionMeta.removedValue.isFixed) {
          return
        }
        break
      case 'clear':
        // newValue = filteredFriends.filter((v) => v.isFixed);
        break
    }

    db.friends.update(Number(itemID), {
      entryRef: newValue
    })
  }

  if (item === undefined) {
    return <div>Loading...</div>
  }

  if (item === null) {
    return (
      <div>
        <h2>Item not found</h2>
        <p>The requested item {itemID} could not be found in the database.</p>
        <Button variant='primary' onClick={() => navigate('/')}>
          Back to List
        </Button>
      </div>
    )
  }

  if (item.available === false) {
    return (
      <div className='subentry-staticentry subEntry-not-available '>
        <div className='entry-header'>
          <div style={{}}>
            <BookMarkCheck itemID={item.id} type='entry' />
          </div>{' '}
          <div className='entry-title'>
            <span className='subIDSpan'>
              {' '}
              <h3>{item.fauxID} </h3>{' '}
            </span>
          </div>
        </div>
        <span>*****NOT AVAILABLE : DATA CORRUPTED*******</span>{' '}
               <div className="subentry-desc">
          {' '}
          {gameLogic.gameState.showDebug && (
            <>
              {item.devNotes}
<br></br>
              {item.hexHash
                ? Array.isArray(item.hexHash)
                  ? item.hexHash.join(', ')
                  : dbHelpers.getHexHashCodesFromIds(item.hexHash)
                : ''}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`List ${gameLogic.gameState.level > 0 ? 'haunted' : ''}`}>
      {/* <h1>Time Remaining: {seconds}s</h1> */}
      {/* {friend.map((item) => ( */}
      <div key={item.id}>
        <div className='entry-header'>
          {' '}
          <div style={{}}>
            <BookMarkCheck itemID={item.id} type='entry' />
          </div>
          <div className='entry-title'>
            <span className='parentIDSpan'>{item.fauxID}</span>
            <span className='parentTitleSpan'>{item.title}</span>
          </div>
        </div>
        <div id='Metadata' className="flex metadata-section">
          <div className='metadata-subentries metadata-subsection  col-4'>
            <div>
              <b>Category:</b> {item.category}{' '}
            </div>
            <div>
              <b>Circa:</b>{' '}
              {item.displayDate
                ? typeof item.displayDate === 'string'
                  ? item.displayDate
                  : new Date(item.displayDate).toLocaleDateString()
                : 'unknown'}
            </div>

            {subEntryOfParent
              .filter(item => item.subCategory.toLowerCase() === 'metadata')
              .map(item => (
                <div key={item.id}>
                  <StaticSubListItem
                    itemID={item.id}
                    parentID={item.parentId}
                    meta={true}
                  />
                </div>
              ))}

            {item.description && (
              <div className=' flex'>
                <DescriptionEntry string={item.description} />
              </div>
            )}
          </div>

          <MediaEntryDisplay itemID={item.id} type='entry' />
        </div>
        {item.entryRef &&
          Array.isArray(item.entryRef) &&
          item.entryRef.length != 0 && (
            <div className='subentry-add-list flex'>
              <h2>Related </h2>
              {item.entryRef.map((ref, index) => (
                <span className = "addedRef" key={index}>
                 <span className="col-10"> <Link
                    to={`/entry/${ref.originId}`}
                    title={
                      ref.available
                        ? `View entry ${ref.title}`
                        : 'NOT AVAILABLE'
                    }
                    className='mention-link'
                  >
                    {ref.fauxID}{' '}
                  </Link></span>
                  <span className="col-2">{ref.author}</span>
                </span>
              ))}
            </div>
          )}

          {/* TODO - update this to select author from dropdown before adding.  */}
           {gameLogic.gameState.connectionEdit && (
          <div>
            <SelectEntry
              value={item.entryRef}
              onChange={handleRef}
              filterAvailable={true}
              name='ref'
              includeSubentries={false}
              label='Add / Remove Connections'
              displayTrueID='false'
              author={gameLogic.globalUser.username}
            />
          </div>
)}{" "}


        {/* Show subentries if they exist */}
        {subEntryOfParent.filter(
          item => item.subCategory.toLowerCase() !== 'metadata'
        ).length != 0 && (
          <div id='subentries' className='subentry-add-list flex'>
            <h2>Logs </h2>
            {subEntryOfParent
              .filter(item => item.subCategory.toLowerCase() !== 'metadata')
              .map(item => (
                <div key={item.id}>
                  <StaticSubListItem
                    itemID={item.id}
                    parentID={item.parentId}
                  />
                </div>
              ))}
          </div>
        )}

      </div>
      {gameLogic.gameState.showDebug && <>{item.devNotes}</>}
    </div>
  )
}
