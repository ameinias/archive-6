import React, { DragEvent, useState, useEffect,useRef  } from "react";

import Button from "react-bootstrap/Button";
import { GameLogic } from "@utils/gamelogic";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import { useActionState } from "react";
import { eventManager } from "@utils/events";
import { MediaThumbnail } from "@components/parts/Media/MediaThumbnail.jsx";
import { MediaSelector } from "@components/parts/Media/MediaSelector.jsx";
import Webcam from 'react-webcam'

export function MediaUpload({ mediaFiles, fauxID="capture" }) {
  //#region ---------    HOOKS   -------- */
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

    const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    () => localStorage.getItem('lastUsedCameraId') || null
  )
  const [showCameraSelect, setShowCameraSelect] = useState(false)


  const { setStatusMessage, gameLogic, isAdmin } = GameLogic();

  //#endregion

  useEffect(() => {
    setFiles(mediaFiles || []);
  }, [mediaFiles]);

  //#region ---------    EVENT HANDLERS  -------- */
  // Define the event handlers
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsOver(false);

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    const mediaFiles = droppedFiles.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );
    setFiles(mediaFiles);
    setStatusMessage(
      `Files dropped: ${mediaFiles.map((file) => file.name).join(", ")}`,
    );
  };

  const handleGallerySelect = (selectedMediaIds) => {
    if (selectedMediaIds && selectedMediaIds.length > 0) {
      console.log("Selected media IDs:", selectedMediaIds);

      const updatedFiles = [...files, ...selectedMediaIds];
      setFiles(updatedFiles);

      if (mediaFiles) {
        mediaFiles.length = 0;
        mediaFiles.push(...updatedFiles);
      }

      setStatusMessage(
        `Selected ${selectedMediaIds.length} file(s) from gallery.`,
      );
    }
    setShowGalleryModal(false);
  };

  /*--- region WEBCAM STUFF ---*/
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
      `webcam-${fauxID}-${Date.now()}.png`,
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
          console.log('No saved ID, selecting default');
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

    const showCameraModal = () => {
    setShowCameraSelect(!showCameraSelect)
    console.log('showCameraModal hit ' + showCameraSelect)
  }

    const handleDeviceChange = (deviceId) => {
    setSelectedDeviceId(deviceId);
    localStorage.setItem('lastUsedCameraId', deviceId);
    console.log('Camera changed to device ID:', deviceId);
  }
  /*--- endregion ---*/

  const handleImport = async (file) => {
    try {
      if (!file) throw new Error(`Only files can be dropped here`);

      //console.log('handleimport hit'); // needed this to hit process media path?! never mind, stopped working.

      const maxSizeInMB = 500;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        throw new Error(`File size must be less than ${maxSizeInMB}MB`);
      }

      //  Save file and get media ID
      const mediaId = await processMediaToPath(file);
      const newFiles = [...(mediaFiles || []), mediaId];

      console.log("passed process media to path", mediaId);

      // return;

      setFiles(newFiles);
      if (mediaFiles) {
        mediaFiles.length = 0;
        mediaFiles.push(...newFiles);
      }

      console.log("File imported: ", file.name);
      setStatusMessage(`File imported: ${file.name}`);
    } catch (error) {
      console.error("Import error:", error);
      setStatusMessage(`Error importing file: ${error.message}`);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImport(file);
    }
  };

  //#endregion

  //#region ---------    ADD REMOVE MEDIA   -------- */

  const processMediaToPath = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      if (eventManager.isElectron) {
        // Save file to disk

        const result = await window.electronAPI.saveMediaFile(
          file.name,
          arrayBuffer,
        );

        if (!result.success) {
          throw new Error(result.error);
        } else {
          console.log("File saved to disk at:", result.path);
        }

        //  Store path in database
        const mediaId = await db.media.add({
          name: file.name,
          type: file.type,
          size: file.size,
          path: result.path, //  Store relative path
          uploadedAt: new Date(),
        });

        console.log("File saved with ID:", mediaId, "at path:", result.path);
        return mediaId; // Return the database ID
      } else {
        //  Web: Save to public/media folder or use a server endpoint
        // For now, store as blob (or implement server upload)
        const blob = new Blob([arrayBuffer], { type: file.type });

        const mediaId = await db.media.add({
          name: file.name,
          type: file.type,
          size: file.size,
          blob: blob, // Web still uses blobs
          uploadedAt: new Date(),
        });

        return mediaId;
      }
    } catch (error) {
      console.error("Error saving media:", error);
      throw error;
    }
  };

  const selectFromGallery = async () => {
    // select from gallery here!!
    setShowGalleryModal(true);
  };

    const captureAttachments = async () => {
    // select from gallery here!!
    setShowGalleryModal(true);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    // Update the parent's mediaFiles array
    if (mediaFiles) {
      mediaFiles.length = 0; // Clear existing
      mediaFiles.push(...newFiles); // Add remaining files
    }
  };

  //#endregion

  return (
    <div>
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
      {files.length === 0 ? (
        <div className="subentry-add-list">
          {isAdmin ? <>No Attachments.</> : <></>}
        </div>
      ) : (
        <div className="subentry-add-list">
          {files.map((file, index) => (
            <div className="media-thumbnail" key={index}>
              <MediaThumbnail
                key={index}
                fileRef={file}
                maxWidth={"700px"}
                onRemove={removeFile}
                isThumb={true}
              
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5px",
                }}
              >
                <Button
                  className="image-edit-button"
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

      <input
        type="file"
        accept="image/*,video/*, audio/*, application/pdf"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        id="fileInput"
      />

      <div className="button-row">
        <button
          className="btn-add-item"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          Import Attachments
        </button>
        <button className="btn-add-item" onClick={selectFromGallery}>
          Select Attachments
        </button>
                <button className="btn-add-item" onClick={capture}>
          Capture Attachments
        </button>
      </div>

      <MediaSelector
        show={showGalleryModal}
        onHide={() => setShowGalleryModal(false)}
        onSelect={handleGallerySelect}
        allowMultiple={true}
      />
    </div>
  );
}
