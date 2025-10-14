
import React, { useEffect, useState } from 'react';
import { db, dbMainEntry, bothEntries } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { SearchResults } from './Searchresults';
import { useNavigate, Link } from 'react-router-dom';
import { hexHashes } from '../../../../packages/shared/utils/constants';

const HexList = () => {
  const [val, setVal] =  useState('');
  //const [results, setResults] =  useState([]);

  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
    // const hexHashList = hexHashes;

  useEffect(() => {
   // hexHashEntries();
  }, [friends, subentries]);

  const hexHashEntries = (hexHashID) => {

    let tempItems = [];
    let nextID = 0;

      const foundItems = friends?.filter(
      (item) => item.hexHash?.includes(hexHashID),
    );

    const foundSubItems = subentries?.filter(
      (item) => item.hexHashes?.includes(hexHashID),
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
      return tempItems; // update state
    } else {
      return []; // clear results if nothing found
    }
  };

  return (
    <>
      <h1>HexList</h1>


    <table>
          <tbody>
           {hexHashes.map((item) => (
             <tr key={item.id}>
                <td width="80%">
                    <tr>
                <h3>{item.name} </h3>
                </tr>

                <tr className='hexInfo'>                            
                    <p><b>hexHash:</b> {item.hexHashcode} </p>
                            <p> <b>Note:</b> {item.note} </p>
                            <p><b>Entries:</b></p>
                            </tr>
<tr>
                            <SearchResults results={hexHashEntries(item.id)} />
                            </tr>
                        </td> 
                      </tr>
                    ))}
          </tbody>
        </table>

      {/* <SearchResults results={results} /> */}
    </>
  );
};

export default HexList;
