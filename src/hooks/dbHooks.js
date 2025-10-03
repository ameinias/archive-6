import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../main/utils/db';





// get subentry count
export function GetSubentryCount(parentID) {
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


export function GetAllSubentriesOfEntry(entryId) {
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


export function GetAvailableSubCount(parentID){
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


// This can be called from multiple hooks
const getEntryOrSubentry = async (itemId) => {
  if (!itemId) return null;
  return (await db.friends.get(itemId)) || (await db.subentries.get(itemId));
};

// Use it in multiple hooks
export function CheckUnread(itemId) {
  return useLiveQuery(async () => {
    const item = await getEntryOrSubentry(itemId);
    return item?.unread;
  }, [itemId]);
}

export function CheckAvailable(itemId) {
  return useLiveQuery(async () => {
    const item = await getEntryOrSubentry(itemId);
    return item?.available;
  }, [itemId]);
}







  // The logic in these might need to get fixed if theire are overlapped IDs in both databases.

export function useReturnEntryOrSubentry(itemId) {
  return useLiveQuery(async () => {
    if (!itemId) return null;

    if (db.friends.get(itemId)) return db.friends.get(itemId);

    if (db.subentries.get(itemId)) return db.subentries.get(itemId);
  }, [itemId]) || null;
  return null;
}

export function useReturnDatabase(itemId) {
  return useLiveQuery(async () => {
    if (!itemId) return null;

    if (db.friends.get(itemId)) return db.friends;

    if (db.subentries.get(itemId)) return db.subentries;
  }, [itemId]) || null;
  return null;
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

export const findByHashAndUnLock = async (hash) => {
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
export function GetMediaCount(itemId, type) {
  return useLiveQuery(async () => {
    if (!itemId) return 0;

    try {

      if(type === 'entry'){
      const entry = await db.friends.get(itemId);
      return entry?.media?.length || 0;
      }

      if(type === 'subentry'){
      const subentry = await db.subentries.get(itemId);
      return subentry?.mediaSub?.length || 0;
      }

      // // Fallback: check both tables
      // const entry = await db.friends.get(itemId);
      // if (entry) return entry.media?.length || 0;

      // const subentry = await db.subentries.get(itemId);
      // if (subentry) return subentry.mediaSub?.length || 0;

      // return 0;
    } catch (error) {
      console.log('Error getting media count:', error);
      return 0;
    }
  }, [itemId]) || 0;
}

// returns entry by id
export function useEntry(itemId) {
  return useLiveQuery(async () => {
    if (!itemId) return null;
    return await db.friends.get(itemId);
  }, [itemId]);
}

// returns subentry by id
export function useSubentry(itemId) {
  return useLiveQuery(async () => {
    if (!itemId) return null;
    return await db.subentries.get(itemId);
  }, [itemId]);
}

  export function getFileType(filename){
    const ext = filename.toLowerCase().split('.').pop();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];

    if (imageExts.includes(ext || '')) return 'image';
    if (videoExts.includes(ext || '')) return 'video';
    return 'other';
  };

  // In dbHooks.js - add this regular function (not a hook)
export const updateEntryProperty = async (itemId, updates) => {
  if (!itemId) return false;

  try {
    // Try to find which table the item is in
    const mainEntry = await db.friends.get(Number(itemId));
    if (mainEntry) {
      await db.friends.update(Number(itemId), updates);
      return true;
    }

    const subEntry = await db.subentries.get(Number(itemId));
    if (subEntry) {
      await db.subentries.update(Number(itemId), updates);
      return true;
    }

    return false; // Item not found
  } catch (error) {
    console.error('Error updating entry:', error);
    return false;
  }
};
