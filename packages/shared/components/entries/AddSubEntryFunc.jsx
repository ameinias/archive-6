import React, { useState, useEffect } from 'react'
import { db } from '@utils/db' // import the database
import Button from 'react-bootstrap/Button'
import {
  categories,
  subCategories,
  researcherIDs,
  entryTemplate,
  hexHashes,
  metaData,
  editType
} from '@utils/constants'
import { useNavigate } from 'react-router-dom'
import { GameLogic } from '@utils/gamelogic'

import { useLiveQuery } from 'dexie-react-hooks'
import * as FormAssets from '@components/parts/FormAssets'
import { MediaUploadSub } from '@components/parts/Media/MediaUploadSub'
import { eventManager } from '@utils/events'
import { useToggle } from '@hooks/hooks'
import * as EditableFields from '@components/parts/EditableFields'
import { safeRender, safeDate, ensureArray } from '@utils/helper';
import {SelectEntry} from "@components/parts/FormAssets";

// onFinishEdit calls back to ListSubEntries to close the toggle
export function AddSubEntryForm ({
  itemID,
  parentID,
  isCollapsed = true,
  onFinishEdit
}) {
  //#region    ---------------    CONST  ------------------ */

  const [title, setName] = useState('')
  const [isNewEntry, setNewEntry] = useState(false)
  const [parentFauxID, setparentFauxID] = useState('')
  const [isFormValid, setFormValid] = useState(true)
  const [isIDValid, setIDValid] = useState(true)
  const [isMeta, setMeta] = useState(false)
  const [collapsed, setCollapsed] = useState(true)

  // Custom hooks
  const [toggleMetaData, setToggleMetaData] = useToggle(false)
  const [toggleAdminSection, setToggleAdminSection] = useToggle(false)

  const { setStatusMessage } = GameLogic()
  const { isAdmin, toggleAdmin } = GameLogic()
  const navigate = useNavigate()

  const [animateSub, setAnimateSub] = useState(false)

  // I don't know why this isn't working for subentries. Doesn't matter for now.
  const triggerAnimation = () => {
    console.log('animation before:   ' + animateSub)
    setAnimateSub(true)
    console.log('animation:   ' + animateSub)
    setTimeout(() => {
      setAnimateSub(false) // Reset after animation
    }, 1000) // Match duration of the animation
  }

  let savedID = 0
  const defaultHex = 10

  const defaultFormValue = {
    fauxID: 'tempID',
    parentFauxID: 'tempID',
    // subID: 1,
    title: '',
    description: '',
    parentId: Number(parentID) || 0,
    date: new Date(), // real date i added things
    available: false, // Default to false
    mediaSub: [],
    subCategory: subCategories[0],
    template: 'default',
    bookmark: false,
    hexHash: [defaultHex],
    devNotes: '',
    modEditDate: '2008-07-21', // date modified in database
    modEdit: 'added',
    displayDate: '1970-01-01', // date added to archive
    lastEditedBy: researcherIDs[0] || 0,
    triggerEvent: '',
    unread:true
  }

  const [formValues, setFormValue] = useState(defaultFormValue)

  //#endregion

  //#region  ------------  Generate entry functions --------*/
  // Create async function to generate new ID
  async function generateNewID () {
    if (!parentID) return 'NEW-001'

    try {
      const parent = await db.friends.get(Number(parentID))
      const parentFauxID = parent?.fauxID || ''
      setparentFauxID(parentFauxID)

      const lengthOfSiblings = await db.subentries
        .where('parentId')
        .equals(Number(parentID))
        .toArray()

      function findLowestGap (siblings) {
        // Extract numbers after the '-' from fauxIDs
        const existingNumbers = siblings
          .map(sibling => {
            const fauxID = sibling.fauxID || ''
            const parts = fauxID.split('-')
            if (parts.length >= 2) {
              const number = parseInt(parts[1])
              return isNaN(number) ? null : number
            }
            return null
          })
          .filter(num => num !== null) // Remove null values
          .sort((a, b) => a - b) // Sort ascending

        console.log('Existing numbers:', existingNumbers)

        // If no existing numbers, start at 1
        if (existingNumbers.length === 0) {
          return 1
        }

        // Check for gap starting from 1
        for (let i = 1; i <= existingNumbers.length + 1; i++) {
          if (!existingNumbers.includes(i)) {
            return i // Found the first missing number
          }
        }

        // If no gaps found, return next number in sequence
        return Math.max(...existingNumbers) + 1
      }

      const nextNumber = findLowestGap(lengthOfSiblings)
      console.log('Next available number:', nextNumber)

      return `${parentFauxID || 'PARENT'}-${nextNumber || 1}`
    } catch (error) {
      console.error('Error generating ID:', error)
      return 'ERROR-001'
    }
  }



  async function returnParentFauxID () {
    const parent = await db.friends.get(Number(parentID))
    const parentFauxID = parent?.fauxID || ''
    setparentFauxID(parentFauxID)

    return parentFauxID
  }

  async function returnParentDate () {
    const parent = await db.friends.get(Number(parentID))
    const parentDate = parent?.displayDate || ''


    return parentDate
  }

    async function returnParentHexHash () {
    const parent = await db.friends.get(Number(parentID))
    const parentHash = ensureArray(parent?.hexHash || defaultHex)
    

    return parentHash
  }


  async function generateNewIDwhat () {}

  //#endregion

  //#region------------  I don't remember what this is --------*/
  // Manage state and input field

  const setIDValidWithMessage = (isValid, message) => {
    setIDValid(isValid)
    setFormValid(isValid)
    if (message) setStatusMessage(message)
    if (!message && isValid) setStatusMessage('') // Clear on success
  }

  //#endregion

  //#region ---------------  Default Form Value --------*/

  const FormToEntry = () => {
    let hexHashValue = formValues.hexHash

    // convert array of strings to numbers
    if (Array.isArray(hexHashValue)) {
      hexHashValue = hexHashValue
        .map(h => parseInt(h, 10))
        .filter(n => !isNaN(n))

      // save int as itself
      if (hexHashValue.length === 1) {
        hexHashValue = hexHashValue[0]
      }
    } else if (typeof hexHashValue === 'string') {
      hexHashValue = parseInt(hexHashValue, 10)
    }

    returnParentFauxID()

    return {
      title: formValues.title,
      parentFauxID: parentFauxID, //4, // returnParentFauxID(),
      // subID: returnSubID(),
      fauxID: formValues.fauxID,
      hexHash: hexHashValue,
      description: formValues.description,
      date: formValues.date, // real date i added things
      parentId: formValues.parentId,
      mediaSub: formValues.mediaSub,
      subCategory: formValues.subCategory,
      available: formValues.available,
      template: formValues.template,
      bookmark: formValues.bookmark,
      devNotes: formValues.devNotes,
      modEditDate: formValues.modEditDate, // date modified in database
      modEdit: formValues.modEdit,
      displayDate: formValues.displayDate, // date added to archive
      lastEditedBy: parseInt(formValues.lastEditedBy, 10),
      triggerEvent: formValues.triggerEvent,
      unread: formValues.unread
    }
  }

  //#endregion

  //#region    ---------------    UseEffect   ------------------ */
  // Generate the fauxID when component mounts or parentID changes
  useEffect(() => {
    async function setupNewEntry () {
      if (isNewEntry && parentID) {
        const newFauxID = await generateNewID()
        const parentDate = await returnParentDate()
        const parentHexHash = await returnParentHexHash()
        console.log("trying to borrow parent hash " + parentHexHash)

        setFormValue(prev => ({
          ...prev,
          fauxID: newFauxID,
          displayDate: parentDate,
          hexHash: parentHexHash
        }))
        returnParentFauxID()
      }
    }

    setupNewEntry()
  }, [isNewEntry, parentID])

  // Initialize form values - if an ID came through, get that. If not, default empty.
  useEffect(() => {
    async function fetchData () {
      setCollapsed(isCollapsed)

      if (!itemID || itemID === 'new') {
        setFormValue(defaultFormValue)
        setNewEntry(true)
        console.log('Fetching data. Is new entry: ', isNewEntry)
        return
      }

      const entry = await db.subentries.get(Number(itemID))
      if (entry) {
        setFormValue({
          fauxID: entry.fauxID,
          parentFauxID: entry.parentFauxID,
          // subID: entry.subID,
          title: entry.title,
          description: entry.description || '',
          subCategory: entry.subCategory,
          parentId: entry.parentId,
          date: entry.date || new Date(), // actual date i wrote it
          available: entry.available || false,
          mediaSub: entry.mediaSub || [],
          template: entry.template || 'default',
          bookmark: entry.bookmark || false,
          researcherID: entry.researcherID,
          hexHash: Array.isArray(entry.hexHash)
            ? entry.hexHash // Keep the IDs as-is
            : [entry.hexHash] || [1],
          devNotes: entry.devNotes || '',
          modEditDate: entry.modEditDate || '2008-07-21', // date modified in database
          modEdit: entry.modEdit,
          displayDate: entry.displayDate || '1970-01-01', // date added to archive
          lastEditedBy: entry.lastEditedBy,
          triggerEvent: entry.triggerEvent || '',
          unread:entry.unread
        })
        savedID = entry.id
        setNewEntry(false)

        // console.log(
        //   itemID + " Fetched entry:",
        //   entry.fauxID,
        //   " and ",
        //   formValues.fauxID,
        // );
        // setStatusMessage(
        //   "Fetched entry:" +
        //     entry.fauxID +
        //     " and ID:" +
        //     entry.id +
        //     " and " +
        //     savedID,
        // );
      } else {
        setFormValue(defaultFormValue)
        console.log('No Fetched entry, creating new')
        setNewEntry(true)
      }

      // console.log("is new entry: ", isNewEntry);
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemID])

  //#endregion

  //#region    ---------------    ENTRY FUNCTIONS  ------------------ */

  async function returnToParent () {
    try {
      navigate(`/entry/${parentID}/`)
    } catch (error) {
      console.error('Error navigating to parent:', error)
    }
  }

  // Save the entry to the database.
  async function updateSubEntry () {
    try {
      const title = formValues.title || 'Untitled'
      if (!title) {
        setStatusMessage('Title is required')
        return
      }

      let idNumber = Number(itemID)
      if (isNaN(idNumber)) {
        setStatusMessage(savedID + 'is not a number')
        return
      }

      db.subentries.update(idNumber, FormToEntry()).then(function (updated) {
        if (updated)
          setStatusMessage(idNumber + ' was updated to ' + formValues.title)
        else setStatusMessage('Nothing was updated - no key:' + idNumber)
      })
      setStatusMessage(`Entry ${title} successfully updated.`)
      FinishEdit()

      // setFormValue(defaultFormValue);
      //navigate('/'); // <-- Go to Home
    } catch (error) {
      setStatusMessage(`Failed to edit ${title} : ${error}`)
      return
    }
  }

  async function addSubEntry () {
    try {
      const title = formValues.title || 'Untitled'
      if (!title) {
        setStatusMessage('Title is required')
        return
      }

      // Ensure we have a valid parent ID
      const parentIdCast = parentID ? Number(parentID) : Number(itemID)
      if (isNaN(parentIdCast)) {
        setStatusMessage('Invalid parent ID for subentry')
        return
      }

      const id = await db.subentries.add(FormToEntry())
      FinishEdit()

      setStatusMessage(
        `Subentry ${title} successfully added to parent ${parentIdCast}. Got id ${id}`
      )
      setFormValue(defaultFormValue)
    } catch (error) {
      setStatusMessage(`Failed to add subentry ${title}: ${error}`)
    }
  }

  async function revertEntry () {
    const entry = await db.subentries.get(Number(itemID))

    setFormValue({
      fauxID: entry.fauxID,
      parentFauxID: entry.parentFauxID,
      // subID: entry.subID,
      title: entry.title,
      description: entry.description || '',
      subCategory: entry.subCategory,
      parentId: entry.parentId,
      date: entry.date || new Date(),
      available: entry.available || false,
      mediaSub: entry.mediaSub || [],
      template: entry.template || 'default',
      bookmark: entry.bookmark || false,
      researcherID: entry.researcherID,
      hexHash: Array.isArray(entry.hexHash)
        ? entry.hexHash // Keep the IDs as-is
        : [entry.hexHash] || [1],
      devNotes: entry.devNotes || '',
      modEditDate: entry.modEditDate || '2008-07-21',
      modEdit: entry.modEdit,
      displayDate: entry.displayDate || '1970-01-01',
      lastEditedBy: entry.lastEditedBy,
      triggerEvent: entry.triggerEvent || '',
      unread:entry.unread
    })
  }
  async function FinishEdit () {
    triggerAnimation()
    setCollapsed(true)

    if (onFinishEdit) {
      onFinishEdit()
    }
  }

  async function removeCurrentEntry () {
    if (
      await eventManager.showConfirm(
        `Are you sure you want to delete "${formValues.title}"?`
      )
    ) {
      try {
        const id = Number(itemID)
        if (isNaN(id)) {
          setStatusMessage('Invalid ID: ' + itemID)
          return
        }
        navigate(`/entry/${parentID}/`) // Go back to parent
        await db.subentries.delete(id)
        setStatusMessage(`Entry ${formValues.title} successfully deleted.`)
      } catch (error) {
        setStatusMessage(`Failed to delete ${formValues.title}: ${error}`)
      }
    }
  }
  //#endregion

  //#region    ---------- media entry display ------------------ */
  const ListMediaEntriesLength =
    useLiveQuery(async () => {
      if (!itemID || itemID === 'new' || isNaN(Number(itemID))) {
        return []
      }

      const entry = await db.subentries.get(Number(itemID))
      const mediaFiles = entry?.mediaSub || []
      return mediaFiles
    }, [itemID]) || []

  //#endregion

  //#region    ---------------    HANDLERS  ------------------ */
  // Manage state and input field
  const handleChange = e => {
    const { name, value } = e.target
    setFormValue({
      ...formValues,
      [name]: value
    })
  }

      const handleRef = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = filteredFriends.filter((v) => v.isFixed);
        break;
    }

    // setSelected(newValue);

        setFormValue({
      ...formValues,
      entryRef: newValue,
    });

  };

  const handleCatChange = e => {
    const { name, value } = e.target
    setFormValue({
      ...formValues,
      [name]: value
    })

    if (value === 'MetaData') {
      setMeta(true)
    } else {
      setMeta(false)
    }
  }

  const handleIDChange = e => {
    const { name, value } = e.target
    // Ensure the ID starts with 'MX' and is followed by numbers
    if (!/^MX\d+$/.test(value)) {
      setIDValidWithMessage(
        false,
        `ID ${value} must start with "MX" followed by numbers.`
      )
      return
    }
    //check if the ID is unique
    db.subentries
      .where('fauxID')
      .equals(value)
      .count()
      .then(count => {
        if (count > 0) {
          //setStatusMessage(`ID ${value} already exists. Please choose a different ID.`);
          setIDValidWithMessage(false, `ID ${value} already exists.`)
        } else {
          setIDValidWithMessage(true)
        }
        setFormValue({
          ...formValues,
          [name]: value
        })
      })
  }

  const handleCheckboxChange = e => {
    const { name, checked } = e.target
    setFormValue({
      ...formValues,
      [name]: checked
    })
  }

  const handleArrayChange = e => {
    const { name, options } = e.target
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value)

    setFormValue({
      ...formValues,
      [name]: selectedValues
    })
  }

  //#endregion

  if (collapsed) {
    return (
      <div title='Toggle Button'>
        <button
          title='add or remove'
          variant={collapsed ? 'remove-item' : 'btn-add-item'}
          className='button-small'
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '▷' : '▽'}
        </button>{' '}
        {formValues.fauxID} : {formValues.title}
        <span className='subentry-meta right'>
          {safeDate(formValues.displayDate)}
            {/* ? typeof formValues.displayDate === 'string'
              ? formValues.displayDate
              : new Date(formValues.displayDate).toLocaleDateString()
            : 'No date'} */}
          {/* <EditableFields.FormEditListDate item={formValues} /> */}
          {'   '} | {'   '}
          {formValues.lastEditedBy !== null
            ? researcherIDs.find(
                researcher =>
                  researcher.id === parseInt(formValues.lastEditedBy)
              )?.devName || 'Unknown'
            : 'Unknown User'}
        </span>
      </div>
    )
  }
  return (
    <div className='SubEntry'>
      <div id='blink' className={` ${animateSub ? 'blink-save' : ''}`}></div>
      {/* {isNewEntry ? <h2>Add New Sub Entry</h2> : <h2>Edit Sub Entry</h2>} */}
      <div title='ID and title' className='row'>
        <div title='Toggle Button' className='button-row col-1'>
          <button
            title='add or remove'
            variant={collapsed ? 'remove-item' : 'btn-add-item'}
            className='button-small'
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '▷' : '▽'}
          </button>
        </div>
        <div className='col-3'>
          {' '}
          {/*// ------ ID  ------*/}
          {/* <div className="formLabel">ID:</div> */}
          {isNewEntry || isAdmin ? (
            <input
              className='form-control'
              type='text'
              name='fauxID'
              placeholder='ID'
              value={formValues.fauxID}
              onChange={handleIDChange}
            />
          ) : (
            <input
              className='form-control-disabled'
              type='text'
              name='fauxID'
              placeholder='ID'
              value={formValues.fauxID}
              onChange={handleChange}
              // readOnly
            />
          )}
        </div>
        <div className='col'>
          {' '}
          {isMeta ? (
            <div className='adminOnly'>
              <FormAssets.FormDropDown
                name='title'
                label='Metadata:'
                multiple={false}
                formValue={formValues.title}
                readOnly={false}
                onChange={handleChange}
                options={metaData.map((sub, i) => (
                  <option key={i} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              />
            </div>
          ) : (
            <>
              <FormAssets.FormTextBox
                label=''
                name='title'
                formValue={formValues.title}
                readOnly={false}
                onChange={handleChange}
              />
            </>
          )}
        </div>
      </div>

      <div title='metadata'>
        <div className='button-row div-dash'>
          <button onClick={setToggleMetaData} className='toggle-button '>
            Metadata
          </button>
        </div>

        {toggleMetaData && (
          <div title=' Metadata'>
            <div title='types' className='row'>
              <div className='col-3'>
                {' '}
                {/*// ------ Category  ------*/}
                <div className='formLabel'>Type:</div>
                <select
                  className='form-control form-control-dropdown'
                  multiple={false}
                  value={formValues.subCategory}
                  onChange={handleCatChange}
                  name='subCategory'
                >
                  {subCategories.map((sub, i) => (
                    <option key={i} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>{' '}
              </div>
            </div>

            <div title='dates' className='row'>
              <div className='col'>
                <FormAssets.FormDate
                  label='Last Modified'
                  name='modEditDate'
                  formValue={formValues.modEditDate}
                  onChange={handleChange}
                />
              </div>
              <div className='col'>
                <FormAssets.FormTextBox
                  label='Creation Date'
                  name='displayDate'
                  formValue={formValues.displayDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div title='edits' className='row'>
              <div title='mod edit' className='col'>
                <FormAssets.FormDropDown
                  label='Edit Type'
                  name='modEdit'
                  formValue={formValues.modEdit}
                  onChange={handleChange}
                  options={editType.map((sub, i) => (
                    <option key={i} value={sub}>
                      {sub}
                    </option>
                  ))}
                />
              </div>
              <div title='last edit' className='col'>
                <FormAssets.FormDropDown
                  label='Last Edit By'
                  name='lastEditedBy'
                  formValue={formValues.lastEditedBy}
                  onChange={handleChange}
                  options={researcherIDs.map((sub, i) => (
                    <option key={i} value={sub.id}>
                      {sub.devName}
                    </option>
                  ))}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div title='descrioptn' className='row'>
        {' '}
        {/*// ------ Description  ------*/}
        <textarea
          rows={4}
          className='form-control'
          type='textarea'
          name='description'
          placeholder='Description'
          value={formValues.description}
          onChange={handleChange}
        />
      </div>

      <div title='media' className='row'>
        {' '}
        {/*// ------ Media Upload  ------*/}
        <MediaUploadSub mediaSubFiles={formValues.mediaSub} />
      </div>

      <div className='row'>
        <SelectEntry 
        value={formValues.entryRef}
        onChange={handleRef} 
        filterAvailable = {false}
        name="ref"
        includeSubentries = {false}
        label = "related entries"
        />
      </div>

      <div title='admin'>
        <div className='button-row div-dash'>
          <button onClick={setToggleAdminSection} className='toggle-button'>
            {' '}
            Admin
          </button>
        </div>

        {toggleAdminSection && (
          <div className='row adminOnly'>
                   <div className='row'>
            <div className='col'>
              {' '}
              {/*// ------ available  ------*/}
              <label className='formLabel'>available</label>
              <input
                type='checkbox'
                className='formLabel'
                checked={formValues.available}
                onChange={handleCheckboxChange}
                name='available'
              />
            </div>

                        <div className='col'>
              {' '}
              {/*// ------ unread  ------*/}
              <label className='formLabel'>unread</label>
              <input
                type='checkbox'
                className='formLabel'
                checked={formValues.unread}
                onChange={handleCheckboxChange}
                name='unread'
              />
            </div>
            </div>

            <div className='row'>
              {' '}
              {/*// ------ bookmark  ------*/}
              <label className='formLabel'>bookmark</label>
              <input
                type='checkbox'
                className='formLabel'
                checked={formValues.bookmark}
                onChange={handleCheckboxChange}
                name='bookmark'
              />
            </div>
            <div className='row'>
              <FormAssets.FormTextBox
                label='parentId:'
                name='parentId'
                formValue={formValues.parentId}
                readOnly={false}
                onChange={handleChange}
              />
            </div>

            <div className='row'>
              <FormAssets.FormHexes
                name='hexHash'
                label=''
                multiple={true}
                formValue={formValues.hexHash}
                readOnly={false}
                onChange={handleArrayChange}
                options={hexHashes.map((sub, i) => (
                  <option key={i} value={sub.id}>
                    {sub.id} {sub.name} ({sub.hexHashcode})
                  </option>
                ))}
              />
            </div>

            <div className='row'>
              <div className='col-1 formLabel'>Template:</div>
              <select
                className='form-control form-control-dropdown col'
                multiple={false}
                value={formValues.template}
                onChange={handleChange}
                name='template'
              >
                {entryTemplate.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>{' '}
            </div>

            <div className='row'>
              <div className='formLabel'>Dev Notes:</div>
              <textarea
                rows={3}
                className='form-control'
                name='devNotes'
                value={formValues.devNotes}
                onChange={handleChange}
              />
            </div>

            <div className='row'>
              <div className='formLabel'>Triggers:</div>
              <span className="instruct-span">Comma seperated strings. function-parameter format.</span>
              <textarea
                rows={3}
                className='form-control'
                name='triggerEvent'
                value={formValues.triggerEvent}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>

      <div className='save-buttons'>
        {' '}
        {/*// ------ Save Buttons  ------*/}
        {isNewEntry ? (
          <>
            <button
              className='btn-add-item btn-taller'
              onClick={addSubEntry}
              disabled={!isFormValid}
            >
              Add
            </button>
          </>
        ) : (
          <>
            <button
              className='btn-save-add-item btn-taller'
              onClick={updateSubEntry}
              disabled={!isFormValid}
            >
              Save
            </button>
            <button
              className='remove-button  btn-taller'
              onClick={revertEntry}
              disabled={!isFormValid}
            >
              Revert
            </button>
            <button
              // className="remove-button"
              onClick={removeCurrentEntry}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  )
}
