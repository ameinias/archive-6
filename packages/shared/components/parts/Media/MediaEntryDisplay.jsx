import React, { useRef, useState } from "react";
import { db, dbHelpers } from "@utils/db";
import { useLiveQuery } from "dexie-react-hooks";
import { MediaThumbnail } from "@components/parts/Media/MediaThumbnail.jsx";

export function MediaEntryDisplay({ itemID, type = "entry" }) {
  const [refreshKey, setRefreshKey] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0); 


  const item = useLiveQuery(async () => {
    if (!itemID) return null;

    // if (type === "entry")
    return await db.friends.get(Number(itemID));
    // else return await db.subentries.get(Number(itemID));
  }, [itemID, type]);



  if (!item) {
    return <div>Loading....</div>;
  }

  if (!item.media || item.media.length === 0) {
    return <>No Attachments.</>;
  }
    var itemRef = item.media[0];

      async function makeDefault(id) {
            // var itemRef = item.media[id];
            setSelectedIndex(id);
            setRefreshKey((prev) => prev + 1);
         console.log("Image things "+ id);
      }

  if (item.media.length === 1) {
    return (
      <>
        {item.media.map((file, index) => {
          return (
            <div
              key={index}
              className="media-thumbnail"
              style={{ maxWidth: "400px" }}
            >
              <MediaThumbnail
                key={index}
                fileRef={file}
                maxHeight={"400px"}
                hasData={false}
              />
              {/* {file.name} ({(file.size / 1024).toFixed(2)} KB) */}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
           <MediaThumbnail
        fileRef={item.media[selectedIndex]}
        maxHeight={"500px"}
        hasData={true}
        key={refreshKey}
      /> 
{/* // selectedIndex */}
      {item.media.map((file, index) => {
        return(
        <div
          key={index}
          className="media-thumbnail"
          style={{ maxWidth: "150px" }}
          onClick={() => makeDefault(index)}
        >
          <MediaThumbnail
            key={index}
            fileRef={file}
            maxHeight={"100px"}
            hasData={false}
            isThumb={true}
            // onClick={() => makeDefault(index)}
          />
          
          {/* {file.name} ({(file.size / 1024).toFixed(2)} KB) */}
      
        </div>
        );
     })} 
    </>
  );
}
