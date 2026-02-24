import React, { useState, useEffect } from 'react';


import * as dbHooks from '@hooks/dbHooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, dbHelpers } from '@utils/db';

export function MediaCountCell({ itemId, type }) {
  const count = dbHooks.GetMediaCount(itemId, type);

  return (
<>
      {count > 0 ? <div className="badger">{count}</div> : null}

</>
  );
}

export function ParentTitle({ parentID }) {


  const parentEntry = useLiveQuery(

    () => db.isOpen() ? db.friends.get(Number(parentID)) : undefined,
    [parentID]
  );

  return <>{parentEntry?.title || "Loading..."}</>;
}


export function SubentryCountCell({ parentId }) {
  const count = dbHooks.GetSubentryCount(parentId);
    if (count === undefined) return;
  return (
    <>
      {count > 0 ? <div className="badger">{count}</div> : null}
    </>
  );
}

// badge to show current availabilty, used ont eh edit entry page.
export function AvailableCell({
  itemId, type

}) {
    const available = dbHooks.CheckAvailable(itemId, type);

  return (
    <div> {available ? '🟢' : ''}</div>
  );
}

// badge to show current availabilty, used ont eh edit entry page.
export function UnreadBadge({
  itemId

}) {
    const unread = dbHooks.CheckUnread(itemId );

  return (
      <div className={'badger' + (unread ? ' unread' : ' empty')}></div>
  );
}

export function BookMarkCheck({
  itemID, type
}) {

const entry = dbHooks.useReturnEntryOrSubentry(itemID, type);

  const isBookmarked = entry?.bookmark || false;

  const toggleBookmark = async () => {
    if (!entry) return;

    try {
      const newBookmarkState = !isBookmarked;
      console.log(`Toggling bookmark for itemID ${itemID} to ${newBookmarkState}`);

      await dbHooks.updateEntryProperty(itemID, type, { bookmark: newBookmarkState });
          dbHelpers.addEvent('bookmarked: ' + entry.title + " available: " + entry.available, 'bookmark');

    //   }
 } catch (error) {
      console.error('Error updating bookmark:', error);
   }




  };

  if (!entry) {
    return <div>Loading...</div>;
  }
  return (
    <button
      className='badger bookmark-btn btn-override'
      onClick={toggleBookmark}
      title={isBookmarked ? 'unbookmark' : 'bookmark'}
    >
      {isBookmarked ? '⛊' : '⛉'}
    </button>
  );
}


// export function Icon({ path = "assets/icons/audio.png" }) {
//   const [iconUrl, setIconUrl] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadIcon = async () => {
//       try {
//         setLoading(true);

//         // Check if we're in Electron
//         if (window.electronAPI) {
//           const result = await window.electronAPI.getMediaData(path);

//           if (!result.error) {
//             const dataUrl = `data:${result.mimeType};base64,${result.data}`;
//             setIconUrl(dataUrl);
//           } else {
//             // Fallback to public path
//             setIconUrl(`/assets/${path}`);
//           }
//         } else {
//           // Web environment - use public path
//           setIconUrl(`/assets/${path}`);
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error('Error loading icon:', error);
//         setIconUrl(`/assets/${path}`); // Fallback
//         setLoading(false);
//       }
//     };

//     loadIcon();
//   }, [path]); // Re-run if path changes

//   if (loading) {
//     return <span>Loading...</span>;
//   }

//   if (!iconUrl) {
//     return <span>Failed to load icon</span>;
//   }

//   return (
//     <img
//       src={iconUrl}
//       alt={path}
//       style={{ width: "100%", height: "100%" }}
//     />
//   );
// }



export function Spinner() {
  return (
    <>    <span className="loader" aria-label="Loading"></span>
<span className="loader animate" aria-label="Processing your request"></span>
</>

  );
}


export const DataState = ({ refreshTrigger }) => {
  const entryCount = useLiveQuery(() =>
    db.isOpen() ? db.friends.count() : 0
  );

  const subentryCount = useLiveQuery(() =>
    db.isOpen() ? db.subentries.count() : 0
  );

  const availableCount = useLiveQuery(() =>
    db.isOpen() ? db.friends.filter((item) => item.available === true).count() : 0
  );

  const availableSubCount = useLiveQuery(() =>
    db.isOpen() ? db.subentries.filter((item) => item.available === true).count() : 0
  );

  if (
    entryCount === undefined ||
    subentryCount === undefined ||
    availableCount === undefined ||
    availableSubCount === undefined
  ) {
    return <div>Loading database stats...</div>;
  }

  return (
    <div>
      <div>
        <strong>Records:</strong> {availableCount}/{entryCount}
      </div>
      <div>
        <strong>Subentries:</strong> {availableSubCount}/{subentryCount}
      </div>
    </div>
  );
};


