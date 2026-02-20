import React, { useState, useEffect } from "react";
import { db, dbHelpers } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AddSubEntryForm } from "@components/entries/AddSubEntryFunc";
import { GameLogic } from "@utils/gamelogic";
import { SearchPageItem } from "@components/parts/ListingComponent";

export function SearchResults({ results, searchterm=""}) {
  const [toggleShowNewSubEntry, setToggleShowNewSubEntry] = useState(false);

  const navigate = useNavigate();
  const gameLog = GameLogic();

  const urlDirect = !gameLog.isAdmin ? "entry" : "edit-item";
  const urlSubDirect = "edit-subitem"; // Same for both admin and non-admin

  return (
    <div className="subentry-add-list">
      {results.length === 0 ? (
        <>
         {searchterm ? <> '{searchterm}' did not return any results. </> : <> No results to show. </>}
       
        </>
      ) : (
        <table>
          <tbody>
            {results.map((item) => (
              <tr key={item.id}>
                <td width="80%">
                  <>
                    {item.available ? (
                      <>
                        {item.type === "sub" ? (
                          <>
                            {" "}
                            {!gameLog.isAdmin ? (
                              <Link to={`/entry/${item.parentId}/`}>
                                {dbHelpers.generateTitle(item)}
                              </Link>
                            ) : (
                              <Link
                                to={`/${urlSubDirect}/${item.parentId}/${item.origin}`}
                              >
                                {item.fauxID} | {item.title}
                              </Link>
                            )}{" "}
                          </>
                        ) : (
                          <>
                            <Link to={`/${urlDirect}/${item.origin}`}>
                              {dbHelpers.generateTitle(item)}
                            </Link>
                          </>
                        )}
                      </>
                    ) : (
                      <div>{item.fauxID} | NOT AVAILABLE </div>
                    )}
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
