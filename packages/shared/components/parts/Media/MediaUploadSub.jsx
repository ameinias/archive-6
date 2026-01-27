import { DragEvent, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { GameLogic } from "@utils/gamelogic";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import { useActionState } from "react";
import { eventManager } from "@utils/events";
import { MediaThumbnail } from "@components/parts/Media/MediaThumbnail.jsx";
import { MediaSelector } from "@components/parts/Media/MediaSelector.jsx";

export function MediaUploadSub({ mediaSubFiles }) {
  const [isOver, setIsOver] = useState(false);
  const [subFiles, setSubFiles] = useState([]);
  const { setStatusMessage } = GameLogic();
  const gameLogic = GameLogic();

  const [showGalleryModal, setShowGalleryModal] = useState(false);

  useEffect(() => {
    setSubFiles(mediaSubFiles || []);
  }, [mediaSubFiles]);

  // Define the event handlers
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsOver(false);
  };

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

  const handleGallerySelect = (selectedMediaIds) => {
    if (selectedMediaIds && selectedMediaIds.length > 0) {
      console.log("Selected media IDs:", selectedMediaIds);

      const updatedFiles = [...subFiles, ...selectedMediaIds];
      setSubFiles(updatedFiles);

      if (mediaSubFiles) {
        mediaSubFiles.length = 0;
        mediaSubFiles.push(...updatedFiles);
      }

      setStatusMessage(
        `Selected ${selectedMediaIds.length} file(s) from gallery.`,
      );
    }
    setShowGalleryModal(false);
  };

  const handleImport = async (subFiles) => {
    try {
      if (!subFiles) throw new Error(`Only files can be dropped here`);

      const maxSizeInMB = 100;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (subFiles.size > maxSizeInBytes) {
        throw new Error(`File size must be less than ${maxSizeInMB}MB`);
      }

      const mediaId = await processMediaToPath(subFiles);

      const newSubFiles = [...(mediaSubFiles || []), mediaId];
      setSubFiles(newSubFiles);

      // Update the parent's mediaSubFiles array
      if (mediaSubFiles) {
        mediaSubFiles.length = 0;
        mediaSubFiles.push(...newSubFiles);
      }

      console.log("File imported: ", subFiles.name);
      console.log("Total files: ", newSubFiles.length);
      setStatusMessage(`File imported: ${subFiles.name}`);
    } catch (error) {
      console.error("Import error:", error);
      setStatusMessage(`Error importing file: ${error.message}`);
      return;
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImport(file);
      console.log("File input changed, file selected:", file.name);
    }
  };
  const removeFile = (index) => {
    const newSubFiles = subFiles.filter((_, i) => i !== index);
    setSubFiles(newSubFiles);
    // Update the parent's mediaSubFiles array
    if (mediaSubFiles) {
      mediaSubFiles.length = 0; // Clear existing
      mediaSubFiles.push(...newSubFiles); // Add remaining files
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsOver(false);

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    const mediaSubFiles = droppedFiles.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );
    setSubFiles(mediaSubFiles);
    setStatusMessage(
      `Files dropped: ${mediaSubFiles.map((file) => file.name).join(", ")}`,
    );
  };

  return (
    <div>
      {subFiles.length === 0 ? (
        <div className="subentry-add-list">
          {gameLogic.isAdmin ? <>No Attachments.</> : <></>}
        </div>
      ) : (
        <div className="subentry-add-list">
          {subFiles.map((subFiles, index) => (
            <div className="media-thumbnail" key={index}>
              <MediaThumbnail
                key={index}
                fileRef={subFiles}
                maxWidth={"700px"}
                onRemove={removeFile}
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
        id="fileInputSub"
      />

      <div className="button-row">
        <button
          className="btn-add-item"
          onClick={() => document.getElementById("fileInputSub")?.click()}
        >
          Import Attachments 
        </button>
        <button className="btn-add-item" onClick={selectFromGallery}>
          Select Attachments
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
