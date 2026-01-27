import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import { BookMarkCheck, UnreadBadge } from "@components/parts/Badges";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function StaticList() {


  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());

  const navigate = useNavigate();

// console.log('Sample item:', sortedFriends[0]);

  useEffect(() => {
    const handleNewGameStart = () => setIsLoading(true);
    const handleNewGameEnd = () => {
      setIsLoading(false);
      console.log("New game ended, reloading...");
      // Force component refresh after new game
      window.location.reload(); // Simple but effective
    };

    window.addEventListener("newGameStart", handleNewGameStart);
    window.addEventListener("newGameEnd", handleNewGameEnd);

    return () => {
      window.removeEventListener("newGameStart", handleNewGameStart);
      window.removeEventListener("newGameEnd", handleNewGameEnd);
    };
  }, []);




  // Sort friends by fauxID
  const sortedFriends = friends
    ? [...friends]
        .filter((item) => item.available)
        .sort((a, b) => b.fauxID.localeCompare(a.fauxID))
    : [];


    //   const sortedFriendsDate = friends
    // ? [...friends]
    //     .filter((item) => item.available)
    //     .sort((a, b) => {
    //       const dateA = a.displayDate ? new Date(a.date).getTime() : 0;
    //       const dateB = b.displayDate ? new Date(b.date).getTime() : 0;
    //       return dateB - dateA;
    //     })
    // : [];



  return (
    <div className="List">
      <h3>Entries:</h3>

      <table className="entryTable">
        <tbody>
          {sortedFriends.length === 0 ? (
            <tr>
              <td colSpan={2}>
                No Entries!
                <br />
                Hit <Link to="/import-export">Admin</Link> / New Game to get the
                starter database while work in progress.
              </td>
            </tr>
          ) : (
            sortedFriends.map((item) => (
              <tr key={item.id} className={item.unread ? "unread-display" : ""}>


                {/* {item.hexHash &&
                (item.hexHash.includes("50") || item.hexHash.includes(50)) ? (
                  <td colSpan={4}>{item.fauxID} : Entry depreciated.</td>
                ) : ( */}
                  <>
                    <td width="35px">
                      <BookMarkCheck itemID={item.id} type="entry" />
                    </td>
                    <td width="35px">
                      <UnreadBadge itemId={item.id} type="entry" />
                    </td>
                    <td>
                      <Link to={`/entry/${item.id}`}>
                        {item.fauxID} : {item.title} {item.available ? 'true':'false'}
                      </Link>
                    </td>
                    <td width="75px">
                      {item.displayDate
                        ? (typeof item.displayDate === 'string'
                            ? item.displayDate
                            : new Date(item.displayDate).toLocaleDateString())
                        : "unknown"}
                    </td>
                  </>
                {/* )} */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
