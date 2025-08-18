import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from 'react';
import React from 'react';
import { db, dbMainEntry, bothEntries } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { SearchResults } from './Searchresults';
import { useNavigate, Link } from 'react-router-dom';


const Search = () => {

  const [val, setVal] = React.useState<string>('');
  const [results, setResults] = React.useState<bothEntries[]>([]);

  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };




  const searchItem = (searchTerm: string) => {
    if (!searchTerm) {
      alert("Please enter a search term.");
      return;
    }

    let searchTermLower = searchTerm.toLowerCase();
    const foundItems = friends?.filter(item =>

    item.title.toLowerCase().includes(searchTermLower) ||
    item.fauxID.toLowerCase().includes(searchTermLower) ||
    (item.description && item.description.toLowerCase().includes(searchTermLower))
  );

  let tempItems: bothEntries[] = [];
  let nextID = 0;


if (foundItems) {
  for (const item of foundItems) {
    // Add the subitem to the results with its parentId
    tempItems.push({
      id: nextID,
      fauxID: item.fauxID, // Ensure fauxID is included
      title: item.title, // Ensure title is included
      date: item.date, // Include date if available
      type: 'main', // Mark as main entry
    });
  nextID = nextID + 1;

  }
}


      const foundSubItems = subentries?.filter(item =>

    item.title.toLowerCase().includes(searchTermLower) ||
    item.fauxID.toLowerCase().includes(searchTermLower) ||
    (item.description && item.description.toLowerCase().includes(searchTermLower))
  );

if (foundSubItems) {

  for (const subItem of foundSubItems) {
    // Add the subitem to the results with its parentId
    tempItems.push({
      id: nextID, // Ensure id is included
      fauxID: subItem.fauxID, // Ensure fauxID is included
      title: subItem.title, // Ensure title is included
      date: subItem.date, // Include date if available
      type: 'sub', // Mark as sub entry
    });
    nextID = nextID + 1;

  }
}

    if (foundItems && foundItems.length > 0) {
      setResults(tempItems); // update state!

    } else {
      setResults([]); // clear results if nothing foun
    }
  };



  return (
    <>
    <InputGroup className="searchBar">
      <input type="text" onChange={handleChange}
      className="form-control"
      placeholder="Search by entry title"
      onKeyDown={e => {
      if (e.key === 'Enter') {
        searchItem(val);
      }
    }} title="search entries"
      value={val} />
      <Button variant="outline-primary"
      onClick={() => searchItem(val)}


  >Search</Button>
    </InputGroup>

          <SearchResults
            results={results}
          />

      </>

)

}

export default Search
