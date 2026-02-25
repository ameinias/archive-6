import React, { useState, useEffect } from 'react'
import { db, dbHelpers } from '@utils/db' // import the database
import Button from 'react-bootstrap/Button'
import {
  categories,
  subCategories,
  researcherIDs,
  entryTemplate,
  hexHashes,
  editType
} from '@utils/constants'
import { Form, useNavigate } from 'react-router-dom'
import { GameLogic } from '@utils/gamelogic'
import { ListSubEntriesOnEntries } from '@components/lists/ListSubEntriesOnEntries'
import { MediaUpload } from '@components/parts/Media/MediaUpload'
import * as FormAssets from '@components/parts/FormAssets'
import { eventManager } from '@utils/events'
import { useToggle } from '@hooks/hooks'
import { UpdateFauxIDAndReorderSubs } from '@hooks/dbHooks'
import { useLiveQuery } from 'dexie-react-hooks'
import Webcam from 'react-webcam'
import { MediaThumbnail } from '@components/parts/Media/MediaThumbnail.jsx'
import { EndSequence } from '@components/other/Console'
import { array } from 'badwords-list'

// default variables - update as needed

const defaultFauxIDStart = 'YOU-A-'
const defaultHex = 51

const defaultFormValue = {
  fauxID: 'MX0000',
  title: 'New Entry',
  description: '',
  category: 'Object',
  date: new Date(), // real date i added things
  available: false,
  media: [],
  template: 'default',
  bookmark: false,
  hexHash: defaultHex,
  devNotes: '',
  modEditDate: '2008-07-21', // date modified in database
  modEdit: 'added',
  displayDate: new Date().toISOString().split('T')[0],
  lastEditedBy: researcherIDs[0] || 0,
  triggerEvent: ''
}

export function PlayerAddEntryForm ({}) {
  //#region ---------    HOOKS   -------- */
  const [formValues, setFormValue] = useState(defaultFormValue)
  const [title, setName] = useState('')
  const [status, setStatus] = useState('')
  const [isNewEntry, setNewEntry] = useState(false)
  const [isFormValid, setFormValid] = useState(true)
  const [isIDValid, setIDValid] = useState(true)
  const [dbKey, setDbKey] = useState(0)
  const [animate, setAnimate] = useState(false)

  const assignHex = () => {
    let hex

    if (isDemo) {
      return [54, 55]
    } else {
      return defaultHex
    }
  }

  const triggerAnimation = () => {
    setAnimate(true)
    setTimeout(() => {
      setAnimate(false) // Reset after animation
    }, 1000) // Match duration of the animation
  }

  // Custom hooks
  const [toggleMetaData, setToggleMetaData] = useToggle(false)
  const [toggleAdminSection, setToggleAdminSection] = useToggle(false)

  // import functions
  const {
    setStatusMessage,
    isAdmin,
    toggleAdmin,
    globalUser,
    gameState,
    updateGameState,
    isDemo
  } = GameLogic()
  const navigate = useNavigate()
  const [imgSrc, setImageSrc] = useState(null)
  const [files, setFiles] = useState([])
  const [mediaFiles, setMediaFiles] = useState([])
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)
  const [showCameraSelect, setShowCameraSelect] = useState(false)
  const blockedTerms = array

  // const WebcamComponent = () => <Webcam />;
  // YOU-A-389

  const webcamRef = React.useRef(null)

  const capture = React.useCallback(async () => {
    const screenshot = webcamRef.current.getScreenshot()

    if (!screenshot) {
      console.error('No screenshot  captured')
      return
    }

    // Convert base64 data URL to File object
    const response = await fetch(screenshot)
    const blob = await response.blob()
    const file = new File(
      [blob],
      `webcam-${globalUser.username}-${Date.now()}.png`,
      {
        type: 'image/png'
      }
    )

    // Now pass the File object to handleImport (this will update formValues.media with the ID)
    await handleImport(file)
  }, [webcamRef])

  // Enumerate video devices on mount
  useEffect(() => {
    const getDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = deviceList.filter(
          device => device.kind === 'videoinput'
        )
        setDevices(videoDevices)
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId)
        }
      } catch (error) {
        console.error('Error enumerating devices:', error)
      }
    }
    getDevices()
  }, [])

  const videoConstraints = {
    width: 720,
    height: 650,
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
  }

  const handleImport = async file => {
    try {
      if (!file) throw new Error(`Only files can be dropped here`)

      //console.log('handleimport hit'); // needed this to hit process media path?! never mind, stopped working.

      const maxSizeInMB = 500
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024
      if (file.size > maxSizeInBytes) {
        throw new Error(`File size must be less than ${maxSizeInMB}MB`)
      }

      //  Save file and get media ID
      const mediaId = await processMediaToPath(file)

      console.log('passed process media to path', mediaId)

      // Update both files state (for display) and formValues.media (for database)
      setFiles(prev => [...prev, mediaId])
      setFormValue(prevValues => ({
        ...prevValues,
        media: [...prevValues.media, mediaId]
      }))

      // setImageSrc(newFiles);

      console.log('File imported: ', file.name)
      setStatusMessage(`File imported: ${file.name}`)
    } catch (error) {
      console.error('Import error:', error)
      setStatusMessage(`Error importing file: ${error.message}`)
    }
  }

  const processMediaToPath = async file => {
    try {
      const arrayBuffer = await file.arrayBuffer()

      if (eventManager.isElectron) {
        // Save file to disk

        const result = await window.electronAPI.saveMediaFile(
          file.name,
          arrayBuffer
        )

        if (!result.success) {
          throw new Error(result.error)
        } else {
          console.log('File saved to disk at:', result.path)
        }

        //  Store path in database
        const mediaId = await db.media.add({
          name: file.name,
          type: file.type,
          size: file.size,
          path: result.path, //  Store relative path
          uploadedAt: new Date()
        })

        console.log('File saved with ID:', mediaId, 'at path:', result.path)
        return mediaId // Return the database ID
      } else {
        //  Web: Save to public/media folder or use a server endpoint
        // For now, store as blob (or implement server upload)
        const blob = new Blob([arrayBuffer], { type: file.type })

        const mediaId = await db.media.add({
          name: file.name,
          type: file.type,
          size: file.size,
          blob: blob, // Web still uses blobs
          uploadedAt: new Date()
        })

        return mediaId
      }
    } catch (error) {
      console.error('Error saving media:', error)
      throw error
    }
  }

  const removeFile = index => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    // Update the parent's mediaFiles array
    if (mediaFiles) {
      mediaFiles.length = 0 // Clear existing
      mediaFiles.push(...newFiles) // Add remaining files
    }
  }

  // other const
  let savedID = 0

  //#endregion

  // On mount, restore if exists
  useEffect(() => {
    async function fetchData () {
      // if (!itemID || itemID === "new") {
      const newID = await generateNewID()
      setFormValue({
        ...defaultFormValue,
        fauxID: newID
      })
      setNewEntry(true)
      return
    }

    fetchData()
    // starting a feature to save a draft. I dont htink it's worth the trouble.
    //   const saved = localStorage.getItem('playerFormDraft')
    //   if (saved) {
    //     setFormValue(JSON.parse(saved))
    //   } else {
    // fetchData()

    //   }
  }, [])

  // useEffect(() => {
  //   async function fetchData () {
  //     // if (!itemID || itemID === "new") {
  //     const newID = await generateNewID()
  //     setFormValue({
  //       ...defaultFormValue,
  //       fauxID: newID
  //     })
  //     setNewEntry(true)
  //     return
  //   }

  //   fetchData()
  // }, [dbKey])

  //#region ---------------    CREATE ENTRY  ------------- */
  const FormToEntry = () => {
    //toLocaleDateString()
    return {
      title: formValues.title,
      fauxID: formValues.fauxID,
      hexHash: assignHex(),
      description: formValues.description,
      category: 'Object',
      date: new Date(), // real date i added things
      available: true,
      media: formValues.media,
      template: formValues.template,
      bookmark: false,
      devNotes: 'player addition ',
      modEditDate: formValues.modEditDate,
      modEdit: globalUser.username,
      displayDate: formValues.displayDate,
      available: !formValues.available
      // lastEditedBy: parseInt(formValues.lastEditedBy, 10),
      //  triggerEvent: endGameTimer,
    }
  }

  const generateNewID = async () => {
    try {
      const items = await db.friends.toArray()
      const existingIDs = items.map(item => item.fauxID)
      let theID
      if (!isDemo) theID = 'DM-'
      else theID = globalUser.userName

      const numericIDs = existingIDs
        .filter(id => id.startsWith(defaultFauxIDStart))
        .map(id => parseInt(id.replace(defaultFauxIDStart, '')))
        .filter(num => !isNaN(num))

      const highestID = numericIDs.length > 0 ? Math.max(...numericIDs) : 999
      let newID = Math.max(highestID + 1, 1000)

      while (existingIDs.includes(defaultFauxIDStart + newID)) {
        newID++
      }

      // setStatusMessage(`Generated new ID: ${defaultFauxIDStart}${newID}`)
      const randomID = Math.floor(Math.random() * 900) + 100
      return defaultFauxIDStart + randomID
    } catch (error) {
      console.error('Error generating ID:', error)
      const randomID = Math.floor(Math.random() * 900) + 100
      return defaultFauxIDStart + randomID
    }
  }

  //#endregion

  //#region   -------   ADD EDIT ENTRY FUNCTIONS  ---------- */

  async function clearEntry () {
    const newID = await generateNewID()
    setFiles([])
    setFormValue({
      ...defaultFormValue,
      fauxID: newID
    })
    setNewEntry(true)
  }

  // Add the entry to the database
  async function addEntry () {
    try {
      const title = formValues.title || 'Untitled'
      if (!title) {
        setStatusMessage('Title is required')
        return
      }

      if (formValues.media.length === 0) {
        eventManager.showAlert('Artifact requires media documentation.')
        return
      }

      const id = await db.friends.add(FormToEntry())

      let medialistTitles = " media: ";

    for (const mediaId of formValues.media) {
  const mediaItem = await db.media.get(mediaId);
  medialistTitles = medialistTitles + ", " + mediaItem.name;
}


      dbHelpers.addEvent(
        formValues.fauxID +
          ' title: ' +
          formValues.title +
          ' desc: ' +
          formValues.description +
          medialistTitles,
        'player entry'
      )

      setStatusMessage(
        `Entry ${title} successfully added. Saved attachments: ${formValues.media.length}`
      )
      loadConfirmEffect()

      console.log(`Added entry with ID ${id} and title ${title}`)

      if (!isDemo) {
        EndSequence(navigate, id, globalUser.username)
      } else {
        navigate(`/entry/${id}`)
      }

      // setFormValue(defaultFormValue);  // Reset to defaults
    } catch (error) {
      setStatusMessage(`Failed to add ${title}: ${error}`)
    }
  }

  async function loadConfirmEffect () {
    // Do something that makes it clear the item is saved
    triggerAnimation()
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

        await db.friends.delete(id)
        setStatusMessage(`Entry ${formValues.title} successfully deleted.`)
        navigate('/') // Go back to home
      } catch (error) {
        setStatusMessage(`Failed to delete ${formValues.title}: ${error}`)
      }
    }
  }

  //#endregion

  //#region ---------------    HANDLERS  ------------------ */
  const handleCheckboxChange = e => {
    const { name, checked } = e.target
    setFormValue({
      ...formValues,
      [name]: checked
    })
  }

  // Manage state and input field
  const handleChange = e => {
    let { name, value } = e.target

    let badword = ''

    // Check for blocked words using word boundaries
    const containsBlocked = blockedTerms.some(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi')
      const found = regex.test(value)
      if (found) badword = term
      return found
    })

    if (containsBlocked) {
      // Remove all instances of the bad word with word boundaries
      const regex = new RegExp(`\\b${badword}\\b`, 'gi')
      value = value.replace(regex, '')

      setStatusMessage(
        `${name} contained unacceptable language. it has been removed`
      )
    }

    const updated = { ...formValues, [name]: value }
    setFormValue(updated)
    localStorage.setItem('playerFormDraft', JSON.stringify(updated))
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

  // Manage state and input field
  const handleIDChange = e => {
    const { name, value } = e.target
    //check if the ID is unique
    db.friends
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

  const setIDValidWithMessage = (isValid, message) => {
    setIDValid(isValid)
    setFormValid(isValid)
    if (message) setStatusMessage(message)
    if (!message && isValid) setStatusMessage('') // Clear on success
  }

  const checkExistingID = async id => {
    const count = await db.friends.where('fauxID').equals(id).count()
    return count > 0
  }

  const showCameraModal = () => {
    setShowCameraSelect(!showCameraSelect)
    console.log('showCameraModal hit ' + showCameraSelect)
  }

  //#endregion

  //*    ----------------    RETURN  -------------- */
  return (
    <div className='Single'>
      <div id='blink' className={` ${animate ? 'blink-save' : ''}`}></div>
      {/* {isNewEntry ? <h2>Add New Entry</h2> : <h2>Edit Entry</h2>} */}

      {/* {status} {isFormValid ? 'Form is valid' : 'Form is invalid'} */}

      {gameState.editAccess || isDemo ? (
        <div title='entry title' className='row'>
          <div className='col-3'>
            <input
              className={`form-control match col`}
              type='text'
              name='fauxID'
              placeholder='ID'
              value={formValues.fauxID}
              onChange={handleIDChange}
              // readOnly={!isNewEntry && !isAdmin}
            />
          </div>
          <div className='col'>
            <FormAssets.FormTextBox
              label=''
              className={`form-control match col-6`}
              name='title'
              formValue={formValues.title}
              readOnly={false}
              onChange={handleChange}
            />
          </div>
        </div>
      ) : (
        <div title='No Edit Access' className='row'>
          <h2>No edit access.</h2>
          <div className='col-4'>
            <input
              className={`form-control match col`}
              type='text'
              name='fauxID'
              placeholder='ID'
              value={formValues.fauxID}
              onChange={handleIDChange}
              disabled={true}
            />
          </div>
          <div className='col'>
            <FormAssets.FormTextBox
              label=''
              name='title'
              formValue={formValues.title}
              className={`form-control match col-6`}
              onChange={handleChange}
              disabled={true}
            />
          </div>
        </div>
      )}
      <div className='cameraChangeParent'>
        {/* <div><button onClick={showCameraModal} className='clear-button-style btn-sm'>📷</button></div>
  {showCameraSelect && (

      <div>        {devices.length > 1 && (
          <div className='row' style={{ marginBottom: '10px' }}>
            <label htmlFor='camera-select'>Select Camera: </label>
            <select
              id='camera-select'
              className='form-control'
              value={selectedDeviceId || ''}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${devices.indexOf(device) + 1}`}
                </option>
              ))}
            </select>
          </div>
        )} </div>)} */}
      </div>
      <div className='row'>
        {' '}
        {/*// ------ Media   ------*/}
        {/* 640 x 480 */}
        <div className='row filter-buttons'>
          <Webcam
            audio={false}
            height={360}
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            width={640}
            videoConstraints={videoConstraints}
          />
        </div>
        {gameState.editAccess || isDemo ? (
          <div className='row center'>
            <button
              onClick={capture}
              disabled={false}
              className='capture-button btn-save-add-item button '
            >
              capture artifact
            </button>
          </div>
        ) : (
          <div className='row center'>
            <button
              onClick={capture}
              disabled={true}
              className='capture-button btn-save-add-item button '
            >
              Capture Artifact
            </button>
          </div>
        )}
      </div>
      {files.length === 0 ? (
        <></>
      ) : (
        <div className='subentry-add-list'>
          {files.map((file, index) => (
            <div className='media-thumbnail' key={index}>
              <MediaThumbnail
                key={index}
                fileRef={file}
                maxWidth={'700px'}
                onRemove={removeFile}
                isThumb={true}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '5px'
                }}
              >
                <Button
                  className='image-edit-button'
                  onClick={() => removeFile(index)}
                >
                  x
                </Button>
                {/*
              Adding a rename button is not a good use of my time right now.
              <Button
                className="image-edit-button"
                onClick={() => renameFile(index)}

              >
                rename
              </Button> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {(gameState.editAccess || isDemo) && (
        <>
          <div className='row'>
            <div className='col-5'>
              <FormAssets.FormTextBox
                label='Intake Date'
                name='displayDate'
                className='form-control match'
                formValue={formValues.displayDate.toString()}
                onChange={handleChange}
              />
            </div>
            <div className='col'>
              {' '}
              {/*// ------ available  ------*/}
              <input
                type='checkbox'
                className='formLabel'
                checked={formValues.available}
                onChange={handleCheckboxChange}
                name='available'
              />
              <label className='subFormLabel'>exclude from search</label>
            </div>
            <div className='col-1 cameraIcon'>
              <button
                onClick={showCameraModal}
                className='clear-button-style btn-sm'
              >
                📷
              </button>
            </div>
            {showCameraSelect && (
              <div className='cameraChangeParent'>
                {' '}
                {devices.length > 1 && (
                  <div className='row' style={{ marginBottom: '10px' }}>
                    <label htmlFor='camera-select'>Select Camera: </label>
                    <select
                      id='camera-select'
                      className='form-control'
                      value={selectedDeviceId || ''}
                      onChange={e => setSelectedDeviceId(e.target.value)}
                    >
                      {devices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label ||
                            `Camera ${devices.indexOf(device) + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}{' '}
              </div>
            )}
          </div>

          <div title='Description' className='row'>
            {' '}
            {/*// ------ Description  ------*/}
            <textarea
              rows={4}
              className='form-control '
              name='description'
              placeholder='Describe your artifact, and how you feel it is relevant to the collection.'
              value={formValues.description}
              onChange={handleChange}
            />
          </div>
          <div className='save-buttons'>
            <button
              className='btn-save-add-item'
              onClick={addEntry}
              disabled={!isFormValid}
            >
              Add
            </button>
            <button
              className='btn-save-add-item'
              onClick={clearEntry}
              disabled={!isFormValid}
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  )
}
