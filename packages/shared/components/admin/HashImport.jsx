import { GameLogic } from '@utils/gamelogic'
import Dexie from 'dexie'
import { db, dbHelpers } from '@utils/db'
import { Button } from 'react-bootstrap'
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import Logs from '@components/search/Logs'
import { badHashes } from '@utils/constants'
import { useNavigate } from 'react-router-dom'
import { eventManager } from '@utils/events'

function HashImport () {
  const [hashValue, setHashVal] = React.useState('')
  const friends = useLiveQuery(() => db.friends.toArray())
  const subentries = useLiveQuery(() => db.subentries.toArray())
  const navigate = useNavigate()



  const importHash = async () => {
    const hexHashID = dbHelpers.getIdsFromHexHashes(hashValue)

    if (badHashes.includes(hexHashID)) {
      navigate('/bad-gateway')
      return
    }

    console.log(hashValue, '  ===================== ', hexHashID)

    const foundItems = friends?.filter(item => {
      if (Array.isArray(item.hexHash)) {
        return item.hexHash.includes(hexHashID)
      }
      return parseInt(item.hexHash) === hexHashID
    })

    const foundSubItems = subentries?.filter(item => {
      if (Array.isArray(item.hexHash)) {
        return item.hexHash.includes(hexHashID)
      }

      if (item.hexHash === hexHashID) {
        console.log('found subitem with hex: ', item.title)
      } else {
        console.log(
          'not found subitem with hex: ',
          item.title,
          item.hexHash,
          hexHashID
        )
      }

      return item.hexHash === hexHashID
    })

    foundItems.map(item => {
      db.friends.update(item.id, {
        available: true,
        modEditDate: new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19),
        modEdit: 'migrated'
      })
    })

    foundSubItems.map(item => {
      db.subentries.update(item.id, {
        available: true,
        modEditDate: new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19),
        modEdit: 'migrated'
      })
    })

    const message = `Hash: ${hashValue} | ${dbHelpers.getIdsFromHexHashes(
      hashValue
    )} | Entries unlocked: ${foundItems.length} | Subentries unlocked: ${
      foundSubItems.length
    }`

    //  const result = await findByHashAndUnLock(hashValue);
    //   console.log(result);
    eventManager.showAlert(message)
    // setHashVal(''); // Clear input field after import
    //  hashInput = '';
  }

  const handleChange = e => {
    setHashVal(e.target.value)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      importHash()
    }
  }

  return (
    <div className='hashImport-div'>
      <div className='row'>
        {' '}
        <h3>Migrate</h3>
        {/*// ------ Title  ------*/}
        <div className='formLabel col-2'>hexHash:</div>
        <input
          className='form-control col'
          type='text'
          name='hashinput'
          // value={formValues.title}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      </div>
      <div className='row'>
        <Button className='btn-save-add-item' onClick={importHash}>
          Import Hash
        </Button>
      </div>

      <br />

      <Logs />
      <div className='invisibleInk'>
        ff887d1e66aac9cec2dbce8790a07576 <br />
        aeoh-3q484-da232 <br />
        ooo5-6jdsA-GH7aa <br />
        iaeF-33pqJ-ef09H <br />
      </div>
    </div>
  )
}

export default HashImport
