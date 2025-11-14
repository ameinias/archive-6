import { useParams } from "react-router-dom";
import { GameLogic } from "@utils/gamelogic";
import { EntryFunc } from "@components/entries/EntryFunc";
import { db } from "@utils/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react"; //
import { StaticSingleMess } from "@components/templates/StaticSingleFunc-Mess";
import { StaticSingleDefault } from "@components/templates/StaticSingleFunc-Default";
import { AddEntryForm } from "@components/entries/EditEntryFunc.jsx";

const Entry = () => {
  const { id } = useParams();
  const { isAdmin } = GameLogic();

  const entryData = useLiveQuery(async () => {
    const numericID = Number(id);
    if (!id || isNaN(numericID) || numericID <= 0) {
      return null;
    }

    const entry = await db.friends.get(numericID);
    if (!entry) {
      console.error("Cannot find the entry with ID:", numericID);
      return null;
    }

    return entry;
  }, [id]);

  useEffect(() => {
    const markAsRead = async () => {
      if (entryData && entryData.unread) {
        try {
          await db.friends.update(Number(id), { unread: false });
          console.log(entryData.fauxID + " was unread, now marked as read");
        } catch (error) {
          console.error("Error marking as read:", error);
        }
      }
    };

    markAsRead();
  }, [entryData, id]);

  const CheckConditionals = () => {
    if (!entryData) {
      return <div>No valid ID provided.</div>;
    }

    if (entryData.hexHash === "50" || entryData.hexHash === 50) {
      <div>NO ENTRY</div>;
    } else if (entryData.template === "messed up") {
      return <StaticSingleMess itemID={id} />;
    } else {
      return <StaticSingleDefault itemID={id} />;
    }
  };

  return (
    <>
      {id ? (
        <>
          {isAdmin ? (
            <>
            Admin 
              <AddEntryForm itemID={id} />
            </>
          ) : (
            <>
            Not Admin
              <StaticSingleDefault itemID={id} />
            </>
          )}
        </>
      ) : (
        <div>No ID provided.</div>
      )}
    </>
  );
};

export default Entry;
