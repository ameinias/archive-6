import React from 'react';
// import { GetSubentryCount, GetMediaCount,CheckAvailable, CheckUnread,  ReturnEntryOrSubentry } from '../../../hooks/dbHooks';
import * as dbHooks from '../../../hooks/dbHooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, dbHelpers } from '../../utils/db';

export function MediaCountCell(
  itemId
) {
  const count = dbHooks.GetMediaCount(itemId);

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
  itemId,

}) {
    const available = dbHooks.CheckAvailable(itemId,type );

  return (
      <div className="badger">{available ? 'y' : 'x'}</div>
  );
}

// badge to show current availabilty, used ont eh edit entry page.
export function UnreadBadge({
  itemId

}) {
    const unread = dbHelpers.CheckUnread(itemId,type );

  return (
      <div className={'badger' + (unread ? ' unread' : ' empty')}></div>
  );
}

export function BookMarkCheck({
  itemID
}) {

const entry = dbHooks.ReturnEntryOrSubentry(itemID);

  const isBookmarked = entry?.bookmark || false;

  const toggleBookmark = async () => {
    if (!entry) return;

    try {
      const newBookmarkState = !isBookmarked;

      dbHooks.ReturnDatabase(itemID).update(Number(itemID), { bookmark: newBookmarkState });

    //   if (type === 'subentry') {
    //     await db.subentries.update(Number(itemID), { bookmark: newBookmarkState });
    //   } else {
    //     await db.friends.update(Number(itemID), { bookmark: newBookmarkState });
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
      className='badger bookmark-btn'
      onClick={toggleBookmark}
      title={isBookmarked ? 'unbookmark' : 'bookmark'}
    >
      {isBookmarked ? '★' : '☆'}
    </button>
  );
}
