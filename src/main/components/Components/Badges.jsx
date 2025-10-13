import React from 'react';

import * as dbHooks from '../../../../packages/shared/hooks/dbHooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, dbHelpers } from '../../../../packages/shared/utils/db';

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
      <div className={'badger' + (unread ? ' unread' : ' empty')}>sfsdhdddgff asfdghfgfff</div>
  );
}

export function BookMarkCheck({
  itemID
}) {

const entry = dbHooks.useReturnEntryOrSubentry(itemID);

  const isBookmarked = entry?.bookmark || false;

  const toggleBookmark = async () => {
    if (!entry) return;

    try {
      const newBookmarkState = !isBookmarked;

      await dbHooks.updateEntryProperty(itemID, { bookmark: newBookmarkState });

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
