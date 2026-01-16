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
  const gameLog = GameLogic();

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

  // useEffect(() => {
  //   const markAsRead = async () => {
  //     if (entryData && entryData.unread) {
  //       try {
  //         await db.friends.update(Number(id), { unread: false });
  //         console.log(entryData.fauxID + " was unread, now marked as read");
  //       } catch (error) {
  //         console.error("Error marking as read:", error);
  //       }
  //     }
  //   };

  //   markAsRead();
  // }, [entryData, id]);

  const CheckConditionals = () => {
    // console.log("checking conditionals for entry ID:", id);

    if (isAdmin) {
      return (<>  <AddEntryForm itemID={id} />
      </>);
    }

    else if (!entryData) {
      return <div>No valid ID provided.</div>;
    }

    // else if (isAdmin) {
    //   return (<>  <AddEntryForm itemID={id} />
    //   </>);
    // }

  else if (entryData.hexHash === "50" || entryData.hexHash === 50) {
      
      console.log(" hex 50: ", id);
      return(<div>NO ENTRY</div>);
    } else {
      return (<><StaticSingleDefault itemID={id} /></> );
    }
  }


  return (
    <>
      {id ? (
            <>
              {CheckConditionals()}
            </>
      ) : (
        <div>No ID provided.</div>
      )}
    </>
  );
};

export default Entry;
