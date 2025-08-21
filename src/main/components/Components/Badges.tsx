import React from 'react';
import { GetSubentryCount, GetMediaCount,CheckAvailable, CheckUnread } from '../../../hooks/dbHooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, dbHelpers } from '../../utils/db'; 

export function MediaCountCell({ 
  itemId, 
  type = 'entry' 
}: { 
  itemId: number; 
  type?: 'entry' | 'subentry' 
}) {
  const count = GetMediaCount(itemId, type);

  return (
<>
      {count > 0 ? <div className="badger">{count}</div> : null}
</>
  );
}

export function SubentryCountCell({ parentId }: { parentId: number }) {
  const count = GetSubentryCount(parentId);
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
  type = 'entry' 
}: { 
  itemId: number; 
  type?: 'entry' | 'subentry' 
}) {
    const available = CheckAvailable(itemId,type );

  return (
      <div className="badger">{available ? 'y' : 'x'}</div>
  );
}

// badge to show current availabilty, used ont eh edit entry page. 
export function UnreadBadge({ 
  itemId, 
  type = 'entry' 
}: { 
  itemId: number; 
  type?: 'entry' | 'subentry' 
}) {
    const unread = CheckUnread(itemId,type );

  return (
      <div className={'badger' + (unread ? ' unread' : ' empty')}></div>
  );
}

export function BookMarkCheck({ 
  itemID, 
  type 
}: { 
  itemID: string | number, 
  type: 'subentry' | 'entry' 
}) {

  const entry = useLiveQuery(async () => {
    if (!itemID) return null;
    
    if (type === 'subentry') {
      return await db.subentries.get(Number(itemID));
    } else {
      return await db.friends.get(Number(itemID));
    }
  }, [itemID, type]);

  const isBookmarked = entry?.bookmark || false;

  const toggleBookmark = async () => {
    if (!entry) return;
    
    try {
      const newBookmarkState = !isBookmarked;
      
      if (type === 'subentry') {
        await db.subentries.update(Number(itemID), { bookmark: newBookmarkState });
      } else {
        await db.friends.update(Number(itemID), { bookmark: newBookmarkState });
      }
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
