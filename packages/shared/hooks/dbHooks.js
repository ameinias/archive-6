import { useLiveQuery } from "dexie-react-hooks";
import { db, dbHelpers } from "../utils/db";

// get subentry count
export function GetSubentryCount(parentID) {
  return useLiveQuery(async () => {
    if (
      !parentID ||
      typeof parentID !== "number" ||
      isNaN(parentID) ||
      parentID <= 0
    ) {
      return 0;
    }

    try {
      const subentries = await db.subentries
        .where("parentId")
        .equals(parentID)
        .toArray();

      return subentries.length;
    } catch (error) {
      console.log("Error, database may be closed");
      return 0;
    }
  }, [parentID]);
}

export function GetAllSubentriesOfEntry(entryId) {
  return useLiveQuery(async () => {
    if (!entryId) return [];
    try {
      const subArray = await db.subentries
        .where("parentId")
        .equals(entryId)
        .toArray();
      return subArray;
    } catch (error) {
      console.log("Error, database may be closed");
      return 0;
    }
  }, [entryId]);
}

// const sortedSubs = (array)
//   ? [...array]
//       .filter((item) => item.where('parentId').equals(entryId).toArray();)
//       .sort((a, b) => {
//         const dateA = a.displayDate ? new Date(a.date).getTime() : 0;
//         const dateB = b.displayDate ? new Date(b.date).getTime() : 0;
//         return dateB - dateA;
//       })
//   : [];

// TODO: finish ReTitleSubentrys

export const UpdateFauxIDAndReorderSubs = async (entryId, newFauxID) => {
  if (!entryId || !newFauxID) {
    console.error("Missing entryId or newFauxID");
    return false;
  }

  try {
    const updateParent = await db.friends.update(Number(entryId), {
      fauxID: newFauxID,
    });



    const subArray = await db.subentries
      .where("parentId")
      .equals(Number(entryId))
      .toArray();



    if (subArray.length === 0) {
      console.log("No subentries found for parent:", entryId);
      return true;
    } else {      console.log("updating " + subArray.length + " subentries on entry "+ Number(entryId));}

    const sortedSubs = subArray.sort((a, b) => {
      const dateA = a.displayDate || "0000-00-00";
      const dateB = b.displayDate || "0000-00-00";

      return dateA.localeCompare(dateB);
    });

    const updates = sortedSubs.map((sub, index) => ({
      key: sub.id,
      changes: {
        fauxID: `${newFauxID}-${index + 1}`,
      },
    }));

    await db.subentries.bulkUpdate(updates);

    console.log(
      `Updated ${updates.length} subentries with new fauxIDs based on ${newFauxID}`,
    );

    return true;
  } catch (error) {
    console.log("Error, database may be closed", error);
    return false;
  }
};

export function GetAvailableSubCount(parentID) {
  return (
    useLiveQuery(async () => {
      if (
        !parentID ||
        typeof parentID !== "number" ||
        isNaN(parentID) ||
        parentID <= 0
      ) {
        return 0;
      }

      try {
        const subentries = await db.subentries
          .where("parentId")
          .equals(parentID)
          .toArray();
        return subentries.filter((subentry) => subentry.available).length;
      } catch (error) {
        console.log("Error, database may be closed");
        return 0;
      }
    }, [parentID]) || 0
  );
}

// This can be called from multiple hooks
const getEntryOrSubentry = async (itemId) => {
  if (!itemId) return null;
     if (!db.isOpen()) return null;

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

export function GetTitle(itemId, type) {
  return useLiveQuery(async () => {
    const item = await getEntryOrSubentry(itemId); //useReturnEntryOrSubentry(itemId, type)
    return item?.title;
  }, [itemId]);
}

// The logic in these might need to get fixed if theire are overlapped IDs in both databases.

export function useReturnEntryOrSubentry(itemId, type) {
  return (
    useLiveQuery(async () => {
      if (!itemId) return null;
      if(!db.isOpen) return null;

      if (type === "entry") {
        if (db.friends.get(itemId)) return db.friends.get(itemId);
      } else {
        if (db.subentries.get(itemId)) return db.subentries.get(itemId);
      }
    }, [itemId]) || null
  );
  return null;
}

export function useReturnDatabase(itemId) {
  return (
    useLiveQuery(async () => {
      if (!itemId) return null;

      if (db.friends.get(itemId)) return db.friends;

      if (db.subentries.get(itemId)) return db.subentries;
    }, [itemId]) || null
  );
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

// export const setStartAvalability = async (startHash) => {
//   try {

//     await db.friends.toCollection().modify(item => { item.available = item.hexHash?.includes(startHash) || item.hexHash?.includes(startHash);
//       console.log(item.id, item.hexHash, "available: ", item.available);
//     });

//     await db.subentries.toCollection().modify(item => { item.available = item.hexHash?.includes(startHash) || item.hexHash?.includes(startHash) });

//     return { friendsUpdated: db.friends.length, subentriesUpdated: db.subentries.length };
//   } catch (error) {
//     return "Error.";
//   }
// };

// this shold fix array issues
export const setStartAvalability = async (startHash) => {
  console.log(" Setting start availability for hash:", startHash);
     if (!db.isOpen()) return 0;

  try {
    // Get all entries
    const subentries = await db.subentries.toArray();
    const friends = await db.friends.toArray();

    console.log(
      `Processing ${friends.length} friends and ${subentries.length} subentries`,
    );

    // Update subentries
    const subentryUpdates = subentries.map((entry) => {
      let shouldBeAvailable = false;

      //  Handle both array and single number cases
      if (Array.isArray(entry.hexHash)) {
        shouldBeAvailable = entry.hexHash.includes(startHash);
      } else if (typeof entry.hexHash === "number") {
        shouldBeAvailable = entry.hexHash === startHash;
      }

      return {
        key: entry.id,
        changes: { available: shouldBeAvailable },
      };
    });

    if (subentryUpdates.length > 0) {
      await db.subentries.bulkUpdate(subentryUpdates);
    }

    // Update friends based on startHash
    const friendUpdates = friends.map((entry) => {
      let shouldBeAvailable = false;

      //  Handle both array and single number cases
      if (Array.isArray(entry.hexHash)) {
        shouldBeAvailable = entry.hexHash.includes(startHash);
      } else if (typeof entry.hexHash === "number") {
        shouldBeAvailable = entry.hexHash === startHash;
      }

      return {
        key: entry.id,
        changes: { available: shouldBeAvailable },
      };
    });

    if (friendUpdates.length > 0) {
      await db.friends.bulkUpdate(friendUpdates);
    }

    // Verify updates
    const availableFriends = await db.friends
      .filter((f) => f.available === true)
      .count();
    const availableSubs = await db.subentries
      .filter((s) => s.available === true)
      .count();

    // console.log(" Start availability set:", {
    //   availableFriends,
    //   availableSubs,
    // });

    return {
      friendsUpdated: friendUpdates.length,
      subentriesUpdated: subentryUpdates.length,
    };
  } catch (error) {
    console.error("Error setting start availability:", error);
    throw error;
  }
};

// picks between entries and wubentries and poulls out their respective media query.
export function GetMediaCount(itemId, type) {

  return (
    useLiveQuery(async () => {
      if (!itemId) return 0;
   if (!db.isOpen()) return 0;
      try {
        if (type === "entry") {
          const entry = await db.friends.get(itemId);
          // console.log(`Entry media for ${itemId} count:`, entry?.media?.length);
          return entry?.media?.length || 0;
        }

        if (type === "subentry") {
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
        console.log("Error getting media count:", error);
        return 0;
      }
    }, [itemId]) || 0
  );
}

// returns entry by id
export function useEntry(itemId) {
  return useLiveQuery(async () => {
    if (!itemId) return null;
       if (!db.isOpen()) return null;
    return await db.friends.get(itemId);
  }, [itemId]);
}

// returns subentry by id
export function useSubentry(itemId) {
  return useLiveQuery(async () => {
    if (!itemId) return null;
       if (!db.isOpen()) return null;
    return await db.subentries.get(itemId);
  }, [itemId]);
}

export function getFileType(filename) {
  const ext = filename.toLowerCase().split(".").pop();
  const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
  const videoExts = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];

  if (imageExts.includes(ext || "")) return "image";
  if (videoExts.includes(ext || "")) return "video";
  return "other";
}

// In dbHooks.js - add this regular function (not a hook)
export const updateEntryProperty = async (itemId, type, updates) => {
  if (!itemId) return false;
     if (!db.isOpen()) return false;

  try {
    // Try to find which table the item is in

    if (type === "entry") {
      await db.friends.update(Number(itemId), updates);
      return true;
    } else {
      await db.subentries.update(Number(itemId), updates);
      return true;
    }

    return false; // Item not found
  } catch (error) {
    console.error("Error updating entry:", error);
    return false;
  }
};
