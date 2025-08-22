import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../main/utils/db';





// get subentry count
export function GetSubentryCount(parentID: number) {
  return useLiveQuery(async () => {
         if (!parentID || typeof parentID !== 'number' || isNaN(parentID) || parentID <= 0) {
      return 0;
    }

    try{
    const subentries = await db.subentries.where('parentId').equals(parentID).toArray();


    return subentries.length  ;
  }catch (error) {
    console.log('Error, database may be closed');
    return 0;
  }
  }, [parentID]) ;
}


export function GetAllSubentriesOfEntry(entryId: number) {
  return useLiveQuery(async () => {
    if (!entryId) return [];
try{

    const subArray = await db.subentries.where('parentId').equals(entryId).toArray();
    return subArray;
 }catch (error) {
    console.log('Error, database may be closed');
    return 0;
  }
  }, [entryId]);
}   


export function GetAvailableSubCount(parentID: number){
  return useLiveQuery(async () => {
        if (!parentID || typeof parentID !== 'number' || isNaN(parentID) || parentID <= 0) {
      return 0;
    }

    try{
    const subentries = await db.subentries.where('parentId').equals(parentID).toArray();
    return subentries.filter(subentry => subentry.available).length;
      }catch (error) {
    console.log('Error, database may be closed');
    return 0;
  }
  }, [parentID]) || 0;
}

    
// is this  entry/subentry available?
export function CheckAvailable(itemId: number, type: 'entry' | 'subentry' = 'entry') {
  return useLiveQuery(async () => {
    if (!itemId) return 0;

    try{
    
    const item = type === 'entry' 
      ? (await db.friends.get(itemId))
      : (await db.subentries.get(itemId));

    return item?.available; 
      }catch (error) {
    console.log('Error, database may be closed');
    return 0;
  }
  }, [itemId, type]) || false;
}


// is this  entry/subentry available?
export function CheckUnread(itemId: number, type: 'entry' | 'subentry' = 'entry') {
  return useLiveQuery(async () => {
    if (!itemId) return 0;

    try{
    
    const item = type === 'entry' 
      ? (await db.friends.get(itemId))
      : (await db.subentries.get(itemId));

    return item?.unread; 
      }catch (error) {
    console.log('Error, database may be closed');
    return 0;
  }
  }, [itemId, type]) || false;
}



// export const markRead = async (itemId: number, type: 'entry' | 'subentry' = 'entry') => {
//   if (!itemId) return false;

//   try {
//     if (type === 'entry') {
//       const item = await db.friends.get(itemId);
//       if (item) {
//         await db.friends.update(itemId, { unread: false });
//         return true;
//       }
//     } else {
//       const item = await db.subentries.get(itemId);
//       if (item) {
//         await db.subentries.update(itemId, { unread: false });
//         return true;
//       }
//     }
//     return false;
//   } catch (error) {
//     console.log('Error marking as read:', error);
//     return false;
//   }
// };

export const findByHashAndUnLock = async (hash: string) => {
  if (!hash) return "Please enter a hash code to continue.";

  try {
    const friendsUpdated = await db.friends
      .where('hexHash')
      .equals(hash)
      .modify({ available: true });

    const subentriesUpdated = await db.subentries
      .where('hexHash')
      .equals(hash)
      .modify({ available: true });

        
    const message = `Hash: ${hash} | Entries unlocked: ${friendsUpdated} | Subentries unlocked: ${subentriesUpdated}`;
    
    
    return message; 
  } catch (error) {
    console.error('Error unlocking items by hash:', error);
    return "Hash not recognized.";
  }
};

export const setStartAvalability = async () => {
  try {
    await db.friends.toCollection().modify(item => { item.available = item.availableOnStart; });
    await db.subentries.toCollection().modify(item => { item.available = item.availableOnStart; });
    return "Set starting availability";
  } catch (error) {
    return "Error.";
  }
};

// picks between entries and wubentries and poulls out their respective media query.
export function GetMediaCount(itemId: number, type: 'entry' | 'subentry' = 'entry') {
  return useLiveQuery(async () => {
    if (!itemId) return 0;

    try {
      if (type === 'entry') {
        const item = await db.friends.get(itemId);
        return item?.media?.length || 0;
      } else {
        const item = await db.subentries.get(itemId);
        return item?.mediaSub?.length || 0;
      }
    } catch (error) {
      console.log('Error getting media count:', error);
      return 0;
    }
  }, [itemId, type]) || 0;
}

// returns entry by id
export function useEntry(itemId: number) {
  return useLiveQuery(async () => {
    if (!itemId) return null;
    return await db.friends.get(itemId);
  }, [itemId]);
}

// returns subentry by id
export function useSubentry(itemId: number) {
  return useLiveQuery(async () => {
    if (!itemId) return null;
    return await db.subentries.get(itemId);
  }, [itemId]);
}

  export function getFileType(filename: string): 'image' | 'video' | 'other' {
    const ext = filename.toLowerCase().split('.').pop();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];

    if (imageExts.includes(ext || '')) return 'image';
    if (videoExts.includes(ext || '')) return 'video';
    return 'other';
  };
