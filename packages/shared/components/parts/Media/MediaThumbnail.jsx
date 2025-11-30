import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { db } from "@utils/db";
import { eventManager } from "@utils/events";
import { Link } from "react-router-dom";
import { Icon } from "../Badges";
import audioIcon from "@assets/icons/audio.png";
import videoIcon from "@assets/icons/film.png";
import pdfIcon from "@assets/icons/docs.png";

export const MediaThumbnail = ({
  fileRef,
  onRemove,
  maxHeight,
  hasData = true,
  isThumb = false,
}) => {
  const [mediaDataUrl, setMediaDataUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(true);

  const [iconUrl, setIconUrl] = useState(null);

  useEffect(() => {
    const loadMedia = async () => {
      if (!fileRef || !db) return;

      try {
        setLoading(true);
        const mediaFile = await db.media.get(fileRef);

        if (!mediaFile) {
          console.error("Media file not found:", fileRef);
          setLoading(false);
          return;
        }

        setFileName(mediaFile.name);
        setFileSize(mediaFile.size || 0);
        setFileType(mediaFile.type || "");

        const okFileSize = mediaFile.size < 5 * 1024 * 1024;

        setFileName(mediaFile.name);

        // bigger files use safe-path
        if (mediaFile.path && eventManager.isElectron) {
          const isLargeFile =
            mediaFile.type?.startsWith("video/") ||
            mediaFile.type === "application/pdf" ||
            (mediaFile.size && mediaFile.size > 5 * 1024 * 1024); // > 5MB

          if (isLargeFile) {
            // Use direct file path
            const result = await window.electronAPI.getMediaPath(
              mediaFile.path,
            );

            setMediaDataUrl(result);
          } else {
            // Use base64 for small files (images)
            const result = await window.electronAPI.getMediaData(
              mediaFile.path,
            );
            if (result.error) {
              console.error("Failed to get media data:", result.error);
              setLoading(false);
              return;
            }
            const dataUrl = `data:${result.mimeType};base64,${result.data}`;
            setMediaDataUrl(dataUrl);
          }
        }
        // Web: use blob
        else if (mediaFile.blob) {
          const url = URL.createObjectURL(mediaFile.blob);
          setMediaDataUrl(url);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading media:", error);
        setLoading(false);
      }
    };

    loadMedia();

    return () => {
      // Cleanup blob URLs
      if (mediaDataUrl && mediaDataUrl.startsWith("blob:")) {
        URL.revokeObjectURL(mediaDataUrl);
      }
    };
  }, [fileRef]);

  //  const loadMedia = async (mediaFilePath) => {

  //       if (!mediaFilePath) return;

  //       try {

  //         // bigger files use safe-path
  //         if (mediaFilePath && eventManager.isElectron) {

  //             // Use base64 for small files (images)
  //             const result = await window.electronAPI.getMediaData(
  //               mediaFilePath,
  //             );
  //             const dataUrl = `data:${result.mimeType};base64,${result.data}`;
  //             console.log(dataUrl);
  //             return dataUrl;

  //         }
  //         // Web: use blob
  //         else if (mediaFile.blob) {
  //           const url = URL.createObjectURL(mediaFile.blob);
  //           console.log(url);
  //           return url;
  //         }
  //       }
  //  catch (error) {
  //         console.error("Error loading media:", error);
  //       }

  //     };

  const truncateString = (str, maxLength) => {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};


  // Loading state fs
  if (loading) {
    return (
      <div className="media media-img" style={{ maxHeight }}>
        <span>Loading...</span>
      </div>
    );
  }

  // No media URL
  if (!mediaDataUrl) {
    return <div>Failed to load media</div>;
  }
  // VIDEO
  if (fileType?.startsWith("video/")) {
        if (isThumb) {
      return (
        <div className="media media-img" max-height={maxHeight}>
          <img
            src={videoIcon}
            alt={fileName}
            style={{ width: "70%", height: "70%" }}
            className="thumb-symbol"
          />
                    <span className="image-subinfo">
                        {truncateString(fileName,20)} ({(fileSize / 1024 / 1024).toFixed(1)} MB)
          </span>
        </div>
      );
    }

    return (
      <div className="media media-video">
        <video
          controls
          preload="metadata"
          style={{
            width: "100%",
            maxHeight: maxHeight || "500px",
            height: "auto",
            backgroundColor: "#000",
          }}
          onError={(e) => {
            const error = e.target.error;
            console.error("Video error details:", {
              URL: mediaDataUrl,
              error: error,
              code: error?.code,
              message: error?.message,
              src: e.target.src,
              networkState: e.target.networkState,
              readyState: e.target.readyState,
              currentSrc: e.target.currentSrc,
            });

            // Decode error codes
            if (error) {
              const errorMessages = {
                1: "MEDIA_ERR_ABORTED - Fetching aborted by user",
                2: "MEDIA_ERR_NETWORK - Network error",
                3: "MEDIA_ERR_DECODE - Decoding error",
                4: "MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported or file not found",
              };
              console.error(
                "Error code meaning:",
                errorMessages[error.code] || "Unknown error",
              );
            }
          }}
          onLoadStart={(e) => {
            console.log("Video load started:", e.target.src);
          }}
          onLoadedMetadata={(e) => {
            console.log("Video metadata loaded:", {
              duration: e.target.duration,
              videoWidth: e.target.videoWidth,
              videoHeight: e.target.videoHeight,
            });
          }}
          onCanPlay={(e) => {
            console.log("Video can play");
          }}
        >
          <source src={mediaDataUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
        {hasData && (
          <span className="image-subinfo">
            {fileName} ({(fileSize / 1024 / 1024).toFixed(2)} MB)
          </span>
        )}
      </div>
    );
  }

  // AUDIO hh
  if (fileType?.startsWith("audio/")) {
    if (isThumb) {
      return (
        <div className="media media-img" max-height={maxHeight}>
          <img
            src={audioIcon}
          alt={fileName}
            style={{ width: "70%", height: "70%" }}
            className="thumb-symbol"
          />
                    <span className="image-subinfo">
                       {truncateString(fileName,20)} ({(fileSize / 1024 / 1024).toFixed(1)} MB)
          </span>
        </div>
      );
    }

    return (
      <div className="media media-audio">
        <audio
          controls
          preload="metadata"
          style={{ width: "100%", maxHeight: maxHeight || "500px" }}
          onError={(e) => {
            console.error(" Audio error:", {
              error: e.target.error,
              code: e.target.error?.code,
              src: e.target.src,
            });
          }}
        >
          <source src={mediaDataUrl} type={fileType} />
          Your browser does not support the audio tag.
        </audio>
        <br />
        <span className="image-subinfo">
          {fileName} ({(fileSize / 1024).toFixed(2)} KB)
        </span>
      </div>
    );
  }

  // IMAGE
  if (fileType?.startsWith("image/")) {
    if (isThumb) {
      return (
        <div className="media media-img" max-height={maxHeight}>
          <img
            src={mediaDataUrl}
            alt={fileName}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      );
    }

    return (
      <div className="media media-img" max-height={maxHeight}>
        <img
          src={mediaDataUrl}
          alt={fileName}
          style={{ width: "100%", height: "100%" }}
        />
        {hasData && (
          <span className="image-subinfo">
            {fileName} ({(fileSize / 1024).toFixed(2)} KB)
          </span>
        )}
      </div>
    );
  }

  //pdf
  // PDF - Simple version without pdf.js
  if (fileType === "application/pdf") {
        if (isThumb) {
      return (
        <div className="media media-img" max-height={maxHeight}>
          <img
            src={pdfIcon}
          alt={fileName}
            style={{ width: "70%", height: "70%" }}
            className="thumb-symbol"
          />
                    <span className="image-subinfo">
            {truncateString(fileName,20)} ({(fileSize / 1024 / 1024).toFixed(1)} MB)
          </span>
        </div>
      );
    }

    return (
      <div className="media media-pdf">
        <embed
          src={mediaDataUrl}
          type="application/pdf"
          className="pdf"
          style={{
            width: "100%",
            // height: "600px",
            border: "1px solid #dee2e6",
            borderRadius: "4px",
          }}
        />
        <span className="image-subinfo">
          {fileName} ({(fileSize / 1024).toFixed(2)} KB)
        </span>
      </div>
    );
  }

  // Unsupported
  return (
    <div className="media">
      <p>Unsupported file type: {fileType}</p>
      <span className="image-subinfo">
        <Link to={mediaDataUrl}>{fileName}</Link> (
        {(fileSize / 1024).toFixed(2)} KB)
      </span>
    </div>
  );
};
