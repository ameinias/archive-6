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
  const { globalUser } =
    GameLogic();


  const importHash = async () => {
    const trimmedHash = hashValue.trim();  // Local variable

    const hexHashID = dbHelpers.getIdsFromHexHashes(trimmedHash)  // Use trimmedHash

    if (badHashes.includes(hashValue)) {
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


      return item.hexHash === hexHashID
    })


          const foundParentsOfSubItems = foundSubItems?.filter(item => {
      return parseInt(item.parentID) === hexHashID
    })

    for (const subItem of foundSubItems) {
      const parentID = subItem.parentId

        // Check if parentID is valid before querying
  if (!parentID || isNaN(Number(parentID))) {
    console.warn(`Invalid parentID for subitem ${subItem.id}:`, subItem.parentId);
    continue; // Skip this item
  }
  
  const parentItem = await db.friends.get(Number(parentID))
  if (parentItem && parentItem.available) {
    await db.friends.update(Number(parentID), {
      unread: true
    })
  }


    }


    // in foundsubitems, collect parentIDs, then set unread for those parents too





    foundItems.map(item => {
      db.friends.update(item.id, {
        available: true,
        modEditDate: new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19),
        modEdit: 'migrated',
        lastEditedBy: globalUser.username
      })
    })

    foundSubItems.map(item => {
      db.subentries.update(item.id, {
        available: true,
        modEditDate: new Date()
          .toISOString()
          .replace('T', ' ')
          .substring(0, 19),
        modEdit: 'migrated',
        lastEditedBy: globalUser.username
      })
    })


    //     foundParentsOfSubItems.map(item => {
    //   db.subentries.update(item.id, {
    //     available: true,
    //   })
    // })

    const message = `Hash: ${hashValue} | ${dbHelpers.getIdsFromHexHashes(
      hashValue
    )} | Entries unlocked: ${foundItems.length} | Subentries unlocked: ${
      foundSubItems.length
    }`

    //  const result = await findByHashAndUnLock(hashValue);
    //   console.log(result);
    eventManager.showAlert(message)

    
    // document.getElementById("hashinput").reset();

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
        <h2>Import</h2>
        <div className="instructions ">
        <p>Migrate corrupted entries to the new database by entering hexhashes here.</p>
        <p>Your coordinator or administrator will have provided these hexes either as a print out or a spreadsheet.  </p>
        </div>
        {/*// ------ Title  ------*/}
        <div className="row">
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
</div>
      <br />

      <Logs />
      <div className='invisibleInk'>
        ff887d1e66aac9cec2dbce8790a07576 <br />
        ssd5f9b259a21092a89659aa16a9913737 <br />
        c888008f79798950760159f80f485fbf <br />
        ss1145cafae869ca2fbe4bf8ac92ecb62b <br />
      </div>
    </div>
  )
}

export default HashImport
