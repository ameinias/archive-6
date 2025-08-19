
import { db, dbHelpers } from '../../utils/db'; 
import { Button } from 'react-bootstrap';

import { useLiveQuery } from 'dexie-react-hooks';

function BookMarkCheck({ 
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
      className='bookmark-btn'
      onClick={toggleBookmark}
      title={isBookmarked ? 'unbookmark' : 'bookmark'}
    >
      {isBookmarked ? '★' : '☆'}
    </button>
  );
}

export default BookMarkCheck;