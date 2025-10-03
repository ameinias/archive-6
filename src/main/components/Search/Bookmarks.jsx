
import React, { useEffect, useState } from 'react';
import { db, dbMainEntry, bothEntries } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { SearchResults } from './Searchresults';
import { useNavigate, Link } from 'react-router-dom';

const Bookmarks = () => {
  const [val, setVal] =  useState('');
  const [results, setResults] =  useState([]);

  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());


  useEffect(() => {
    bookmark();
  }, [friends, subentries]);

  const bookmark = () => {

    let tempItems = [];
    let nextID = 0;

      const foundItems = friends?.filter(
      (item) => item.bookmark === true,
    );

    const foundSubItems = subentries?.filter(
      (item) => item.bookmark === true,
    );

        // Add main entries
    if (foundItems) {
      for (const item of foundItems) {
        tempItems.push({
          id: nextID,
          fauxID: item.fauxID,
           origin: item.id,
          title: item.title,
          date: item.date,
          type: 'main',
        });
        nextID = nextID + 1;
      }
    }
    // Add subs
    if (foundSubItems) {
      for (const subItem of foundSubItems) {
        // Add the subitem to the results with its parentId
        tempItems.push({
          id: nextID, // Ensure id is included
          origin: subItem.id,
          parentId: subItem.parentId,
          fauxID: subItem.fauxID, // Ensure fauxID is included
          title: subItem.title, // Ensure title is included
          date: subItem.date, // Include date if available
          type: 'sub', // Mark as sub entry
        });
        nextID = nextID + 1;
      }
    }

    if (foundItems && foundItems.length > 0 || foundSubItems && foundSubItems.length > 0) {
      setResults(tempItems); // update state
    } else {
      setResults([]); // clear results if nothing found
    }
  };

  return (
    <>
      <h1>Bookmarks</h1>

      <SearchResults results={results} />
    </>
  );
};

export default Bookmarks;
