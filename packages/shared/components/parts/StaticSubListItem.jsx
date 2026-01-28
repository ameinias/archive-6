import React, {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  useRef
} from 'react'
import { db, dbHelpers, importHash } from '@utils/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { GameLogic } from '@utils/gamelogic'
import { Link } from 'react-router-dom'
import { MediaDisplay } from './Media/MediaDisplay'
import { researcherIDs } from '@utils/constants'
import { MediaThumbnail } from '@components/parts/Media/MediaThumbnail.jsx'
import { BookMarkCheck } from '@components/parts/Badges'
import DescriptionEntry from './DescriptionEntry'
import { safeRender, safeDate } from '@utils/helper'

export function StaticSubListItem ({ itemID, parentID, meta = false }) {
  const { id } = useParams() // get the id from the route
  const gameState = GameLogic()
  const gameLogic = GameLogic()
  const navigate = useNavigate()
  const [statusMessage, setStatusMessage] = useState('')
  const [freshUnread, setFreshUnread] = useState(true)
  const itemRef = useRef(null)
  const [template, useTemplate] = useState('default')

  const item = useLiveQuery(async () => {
    if (!itemID) return null
    return await db.subentries.get(Number(itemID))
  }, [itemID])

  useEffect(() => {
    // Mark as read when user navigates away
    return () => {
      if (!item || !item.available || !item.unread) return

      // console.log(item.fauxID + ' marking as read on unmount')
      db.subentries.update(Number(itemID), { unread: false })

      CheckConditions(item)
    }
  }, [item, itemID]) // Runs cleanup when component unmounts

  useEffect(() => {
    if (!item) return

    if (item.triggerEvent && item.unread && item.available) {
      //item.triggerEvent.length > 0
      gameLogic.triggerEvent(item.triggerEvent)
    }
  }, [item, id])

  async function unlockHex (hexes) {
    try {
      // do stuff
      importHash(hexes)
    } catch (error) {
      console.error("can't unlockhex:", error)
    }
  }

  if (!item) {
    return <div>Loading...</div>
  }

  // eventually these might switch to entirely different returns, but for now
  // they'll just change css attributes
  const CheckConditions = item => {
    if (item.template && item.template.length > 0) {
      useTemplate(item.template)

      if (item.template === 'trapped' && item.unread && item.available) {
        db.subentries.update(Number(itemID), {
          displayDate: new Date().toLocaleString()
        })
        console.log('trapped subentry accessed,   date set to now')
      }
    }
  }

  if (item.available === false) {
    return (
      <div
        ref={itemRef}
        className='subentry-staticentry subEntry-not-available'
      >
        <div className='entry-header'>
          <div style={{}}>
            <BookMarkCheck itemID={item.id} type='subentry' />
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

  if (meta) {
    return (
      <span className={item.unread ? 'unread-display' : ''}>
        <strong>{item.title}:</strong>{' '}
        {!item.available ? (
          <span className='unavailablemeta'>
            '----- DATA UNAVAILABLE -----'
          </span>
        ) : (
          item.description
        )}{' '}
        <br />
      </span>
    )
  }

  return (
    <div
      ref={itemRef}
      className={`subentry-staticentry ${
        gameState.gameState.level > 0 ? 'haunted' : ''
      } ${item.unread ? 'unread-display' : 'dickie'}`}
    >
      <div className='subentry-item'>
        {/* <div > */}
        <div width='80%' key={item.id}>
          <div className='entry-header'>
            <div style={{}}>
              <BookMarkCheck itemID={item.id} type='sub' />
            </div>
            <div className='entry-title'>
              <span className='subID'>{item.fauxID}</span>
              <span className='subTitle'>{item.title}</span>
            </div>
          </div>
        </div>
        <div className='subentry-desc' style={{ whiteSpace: 'pre-wrap' }}>
          <DescriptionEntry
            string={item.description}
            className={item.template}
          />
          {item.mediaSub?.map((file, index) => (
            <div key={index}>
              <MediaThumbnail key={index} fileRef={file} maxWidth={'700px'} />
            </div>
          ))}

          <span className='image-subinfo subinfo '>
            <span className='right-text'>
              <div>{safeDate(item.displayDate)}</div> |{' '}
              {item.lastEditedBy !== null && item.lastEditedBy !== undefined
                ? researcherIDs.find(
                    researcher => researcher.id === parseInt(item.lastEditedBy)
                  )?.name || 'Unknown'
                : 'Unknown User'}
            </span>
          </span>
          {gameLogic.gameState.showDebug && <>{item.devNotes}</>}
        </div>
      </div>
    </div>
  ) // return
}
