import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react'
import { db } from '@utils/db' // import the database
import { useLiveQuery } from 'dexie-react-hooks'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { GameLogic } from '@utils/gamelogic'
import * as FormAssets from '@components/parts/FormAssets'
import { researcherIDs } from '@utils/constants'
import * as EditableFields from '@components/parts/EditableFields'
import { FilterList, applyHexFilter } from '@components/parts/ListingComponent'

import {
  MediaCountCell,
  SubentryCountCell,
  AvailableCell
} from '@components/parts/Badges'
import { eventManager } from '@utils/events'

export function ListEditEntry () {
  // TODO: Clean these up. I think a lot of these aren't needed anymore.

  //#region     ---------------    CONST  ------------------ */

  const friends = useLiveQuery(() => db.friends.toArray())
  const subentries = useLiveQuery(() => db.subentries.toArray())
  const navigate = useNavigate()

  const { setStatusMessage, gameState, setColumn, setSort, updateGameState } =
    GameLogic()

  const [isLoading, setIsLoading] = useState(false)
  const [editingHex, setEditingHex] = useState(null)
  const [editingSubHex, setEditingSubHex] = useState(null)
  const [tempHexValue, setTempHexValue] = useState('')
  const [tempSubHexValue, setTempSubHexValue] = useState('')

  //#endregion

  //#region  ---------------    SORTING  ------------------ */

  const handleFilterChange = filter => {
    updateGameState('activeFilter', filter)
  }

  const filteredFriends = useLiveQuery(() => {
    const column = gameState?.sortColumn || 'title'
    const direction = gameState?.sortDirection || 'asc'

    return db.friends.toArray().then(items => {
      // Apply hex filter first - only the items that match the filter are shown
      let filtered = applyHexFilter(items, gameState?.activeFilter)

      console.log('type: entry, column:', column, 'direction:', direction)

      // Sort the filtered items
      filtered.sort((a, b) => {
        let aValue = a[column]
        let bValue = b[column]

        // Handle date columns specially
        // if (column === 'date' || column === 'displayDate') {
        //   aValue = aValue ? new Date(aValue).getTime() : 0
        //   bValue = bValue ? new Date(bValue).getTime() : 0
        // } else
          if (column === 'hexHash') {

          // Get lowest hex from item 'a'
          const hexesA = Array.isArray(a.hexHash) ? a.hexHash : [a.hexHash]
          const lowestA =
            hexesA.length > 0
              ? Math.min(...hexesA.filter(h => h != null))
              : Infinity

          // Get lowest hex from item 'b'
          const hexesB = Array.isArray(b.hexHash) ? b.hexHash : [b.hexHash]
          const lowestB =
            hexesB.length > 0
              ? Math.min(...hexesB.filter(h => h != null))
              : Infinity


          // Return comparison result
          return direction === 'asc' ? lowestA - lowestB : lowestB - lowestA
        } else if (typeof aValue === 'string') {
          // For string columns, use localeCompare
          return direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        // Numeric comparison for dates and numbers
        if (direction === 'asc') {
          return aValue - bValue
        } else {
          return bValue - aValue
        }
      })

      return filtered
    })
  }, [gameState?.sortColumn, gameState?.sortDirection, gameState?.activeFilter])

  const handleSort = column => {
    if (column === gameState?.sortColumn) {
      // Toggle direction
      const newDirection = gameState.sortDirection === 'asc' ? 'desc' : 'asc'
      setSort(newDirection)
    } else {
      // New column, reset to ascending
      setColumn(column)
      setSort('asc')
    }
  }

  //#endregion

  //#region  ---------------    Editing Hexes  ------------------ */

  const startEditingHex = (item, type) => {
    // Convert current hexHash to string for editing
    const currentValue = item.hexHash
      ? Array.isArray(item.hexHash)
        ? item.hexHash.join(', ')
        : item.hexHash.toString()
      : ''

    if (type === 'entry') {
      setTempHexValue(currentValue)
      setEditingHex(item.id)
    } else {
      setTempSubHexValue(currentValue)
      setEditingSubHex(item.id)
    }
  }

  const saveHexHash = async (itemId, type) => {
    try {
      // Convert comma-separated string back to array

      if (type === 'subentry') {
        const hexArray = tempSubHexValue
          .split(',')
          .map(hex => parseInt(hex.trim(), 10))
          .filter(num => !isNaN(num))

        await db.subentries.update(itemId, {
          hexHash: hexArray.length > 1 ? hexArray : hexArray[0] || null
        })
        setEditingSubHex(null)
        setTempSubHexValue('')
      } else {
        const hexArray = tempHexValue
          .split(',')
          .map(hex => parseInt(hex.trim(), 10))
          .filter(num => !isNaN(num))

        await db.friends.update(itemId, {
          hexHash: hexArray.length > 1 ? hexArray : hexArray[0] || null
        })
        setEditingHex(null)
        setTempHexValue('')
      }

      setStatusMessage(
        itemId + ' Hex hash ' + tempSubHexValue + ' updated successfully'
      )
    } catch (error) {
      console.error('Error updating hex hash:', error)
      setStatusMessage('Error updating hex hash')
    }
  }

  const cancelEditingHex = () => {
    setEditingHex(null)
    setEditingSubHex(null)
    setTempHexValue('')
    setTempHexValue('')
  }

  useEffect(() => {
    const handleNewGameStart = () => setIsLoading(true)
    const handleNewGameEnd = () => {
      setIsLoading(false)
      // Force component refresh after new game
      window.location.reload() // Simple but effective
    }

    window.addEventListener('newGameStart', handleNewGameStart)
    window.addEventListener('newGameEnd', handleNewGameEnd)

    return () => {
      window.removeEventListener('newGameStart', handleNewGameStart)
      window.removeEventListener('newGameEnd', handleNewGameEnd)
    }
  }, [])

  //#endregion

  //#region --------------------  Remove Entries
  const removeItem = async item => {
    if (
      await eventManager.showConfirm(
        `Are you sure you want to delete "${item.title}"?`
      )
    ) {
      db.friends.delete(item.id)
      setStatusMessage(`Entry ${item.title} successfully deleted.`)
    }
  }

  const removeSubentry = async item => {
    if (
      await eventManager.showConfirm(
        `Are you sure you want to delete "${item.title}"?`
      )
    ) {
      db.subentries.delete(item.id)
      setStatusMessage(`Removing subentry: ${item.title}`)
    }
  }

  //#endregion
  if (isLoading || !filteredFriends || !filteredFriends.length === 0) {
    return (
      <div className='List'>
        <h3>Please wait while database populates...</h3>
      </div>
    )
  }

  return (
    <>
                <div className='center'>
              <FilterList
                type='entry'
                onFilterChange={handleFilterChange}
                activeFilter={gameState?.activeFilter}
              />
              </div>
      {!filteredFriends || filteredFriends.length === 0 ? (
        <div className='List'>
          <table className='entryTable'>
            <tbody>
              <tr>
                <td colSpan={3}>
                  No Entries!
                  <br />
                  Hit <Link to='/import-export'>Admin</Link> / New Game to get
                  the starter database while work in progress.
                  <div className='div'>
                    <Link to='/edit-item/new'>
                      <Button className='btn-add-item'>New Entry</Button>
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className='List'>
            <div className='center'>
              <Link to='/entry/new'>
                <Button className='btn-add-item'>New Entry</Button>
              </Link>
            </div>
            <table className='searchResults'>
              <thead>
                <tr>
                  <th width='25px' title='active'>
                    🟢
                  </th>
                  <th onClick={() => handleSort('title')}>
                    Title{' '}
                    {gameState?.sortColumn === 'title' &&
                      (gameState?.sortDirection === 'asc' ? '▲' : '▼')}
                  </th>

                  <th width='80px' onClick={() => handleSort('displayDate')}>
                    Disp. Date{' '}
                    {gameState?.sortColumn === 'displayDate' &&
                      (gameState?.sortDirection === 'asc' ? '▲' : '▼')}
                  </th>

                  <th width='75px' onClick={() => handleSort('date')}>
                    Added{' '}
                    {gameState?.sortColumn === 'date' &&
                      (gameState?.sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th width='30px' onClick={() => handleSort('hexHash')}>
                    Hex{' '}
                    {gameState?.sortColumn === 'date' &&
                      (gameState?.sortDirection === 'asc' ? '▲' : '▼')}
                  </th>
                  <th width='25px' title='sub entries'>
                    Subs
                  </th>
                  <th width='25px' title='media attachments'>
                    🖼️
                  </th>

                  <th width='25px' title='trigger'>
                    ⚡
                  </th>
                  <th width='30px'>🗑️</th>
                </tr>
              </thead>
              <tbody>
                {filteredFriends.map(item => (
                  <tr key={item.id}>
                    <td data-label='currentlyavailable'>
                      <AvailableCell itemId={item.id} type='entry' />
                    </td>
                    <td data-label='name' title={item.description}>
                      {item.id}{' '}
                      <Link to={`/entry/${item.id}`}>
                        {item.fauxID} : {item.title}
                      </Link>
                    </td>
                    <td width='50px' data-label='displayDate'>
                      {/* {item.displayDate
                        ? new Date(item.displayDate).toLocaleDateString(
                            "en-US",
                            { month: "numeric", year: "numeric" },
                          )
                        : "No Date"} */}

                      <EditableFields.FormEditListText item={item} />
                    </td>
                    <td width='50px' data-label='date' title={item.devNotes}>
                      {item.date
                        ? new Date(item.date).toLocaleDateString('en-US')
                        : 'unknown'}
                    </td>
                    <td data-label='hex'>
                      {editingHex === item.id ? (
                        <div
                          style={{
                            display: 'flex',
                            gap: '5px',
                            alignItems: 'center',
                            width: '40px'
                          }}
                        >
                          <input
                            type='text'
                            name='hexedit'
                            title='hexedit'
                            value={tempHexValue}
                            onChange={e => setTempHexValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter')
                                saveHexHash(item.id, 'entry')
                              if (e.key === 'Escape') cancelEditingHex()
                            }}
                            placeholder='hexes'
                            style={{
                              flex: 1,
                              padding: '2px 5px',
                              width: '40px'
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => startEditingHex(item, 'entry')}
                          style={{
                            cursor: 'pointer',
                            padding: '5px',
                            borderRadius: '3px',
                            ':hover': { backgroundColor: '#f0f0f0' }
                          }}
                          title='Click to edit'
                        >
                          {item.hexHash
                            ? Array.isArray(item.hexHash)
                              ? item.hexHash.join(', ')
                              : item.hexHash.toString()
                            : 'None (click to add)'}
                        </div>
                      )}
                    </td>
                    <td data-label='subentries'>
                      <SubentryCountCell parentId={item.id} />
                    </td>
                    <td data-label='media'>
                      <MediaCountCell itemId={item.id} type='entry' />
                    </td>

                    <td data-label='trigger'>
                      {' '}
                      {item.triggerEvent != '' && item.triggerEvent != null && (
                        <a title={item.triggerEvent}>⚡</a>
                      )}
                    </td>

                    <td data-label='remove'>
                      {' '}
                      <button
                        className='remove-button-small'
                        aria-label='Close'
                        onClick={() => removeItem(item)}
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
