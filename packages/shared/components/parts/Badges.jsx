import React from 'react';

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
      <div className="badger">{available ? 'y' : 'x'}</div>
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
