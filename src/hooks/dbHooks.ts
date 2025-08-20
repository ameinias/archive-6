import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../main/utils/db';

// get subentry count
export function GetSubentryCount(parentID: number) {
  return useLiveQuery(async () => {
         if (!parentID || typeof parentID !== 'number' || isNaN(parentID) || parentID <= 0) {
      return 0;
    }

    const subentries = await db.subentries.where('parentId').equals(parentID).toArray();


    return subentries.length  ;
  }, [parentID]) ;
}


export function GetAllSubentriesOfEntry(entryId: number) {
  return useLiveQuery(async () => {
    if (!entryId) return [];


    const subArray = await db.subentries.where('parentId').equals(entryId).toArray();
    return subArray;
  }, [entryId]);
}   


export function GetAvailableSubCount(parentID: number){
  return useLiveQuery(async () => {
        if (!parentID || typeof parentID !== 'number' || isNaN(parentID) || parentID <= 0) {
      return 0;
    }
    const subentries = await db.subentries.where('parentId').equals(parentID).toArray();
    return subentries.filter(subentry => subentry.available).length;
  }, [parentID]) || 0;
}

    
// is this  entry/subentry available?
export function CheckAvailable(itemId: number, type: 'entry' | 'subentry' = 'entry') {
  return useLiveQuery(async () => {
    if (!itemId) return 0;

    //let length = 0;
    
    const item = type === 'entry' 
      ? (await db.friends.get(itemId))
      : (await db.subentries.get(itemId));

    return item?.available; 
  }, [itemId, type]) || false;
}



// picks between entries and wubentries and poulls out their respective media query.
export function GetMediaCount(itemId: number, type: 'entry' | 'subentry' = 'entry') {
  return useLiveQuery(async () => {
    if (!itemId) return 0;

    //let length = 0;
    
    const item = type === 'entry' 
      ? (await db.friends.get(itemId))
      : (await db.subentries.get(itemId));

        if (type === 'entry') {
      const item = await db.friends.get(itemId);
      return item?.media?.length || 0;
    } else {
      const item = await db.subentries.get(itemId);
      return item?.mediaSub?.length || 0;
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
