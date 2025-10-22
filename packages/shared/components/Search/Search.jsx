import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { EntryList } from '../lists/ListEditEntry';
import {StaticList} from '../lists/StaticList';
import React from 'react';
import { db } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { SearchResults } from './Searchresults';
import { GameLogic } from '@utils/gamelogic';
import {eventManager} from '@utils/events';

const Search = () => {
  const [val, setVal] = React.useState('');
  const {isAdmin} = GameLogic();
  const [results, setResults] = React.useState([]);

  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());

  const handleChange = (e) => {
    setVal(e.target.value);
  };

  const searchItem = (searchTerm) => {
    if (!searchTerm) {
      eventManager.showAlert('Please enter a search term.');
      return;
    }

    let searchTermLower = searchTerm.toLowerCase();
    const foundItems = friends?.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTermLower) ||
        item.fauxID.toLowerCase().includes(searchTermLower) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTermLower)),
    ).filter((item) => item.available === true,);

    let tempItems = [];
    let nextID = 0;

    if (foundItems) {
      for (const item of foundItems) {
        // Add the subitem to the results with its parentId
        tempItems.push({
          id: nextID,
          origin: item.id,
          fauxID: item.fauxID, // Ensure fauxID is included
          // parentId: item.id, // Include parentId for main entries
          title: item.title, // Ensure title is included
          date: item.date, // Include date if available
          type: 'main', // Mark as main entry
        });
        nextID = nextID + 1;
      }
    }

    const foundSubItems = subentries?.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTermLower) ||
        item.fauxID.toLowerCase().includes(searchTermLower) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTermLower)),
    );

    if (foundSubItems) {
      for (const subItem of foundSubItems) {
        // Add the subitem to the results with its parentId
        tempItems.push({
          id: nextID, // Ensure id is included
          origin: subItem.id,
          fauxID: subItem.fauxID, // Ensure fauxID is included
          parentId: subItem.parentId, // Include parentId for subentries
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

  const handleKeyDown = (e) => {

  if (e.key === 'Enter') {
    searchItem(val);
  }
};

  return (
    <>
    <h3>Search</h3>
      {/* <InputGroup className="searchboxr"> */}
      <div class="searchbox">
        <input
          type="search"
          onChange={handleChange}
          className="form-control"
          placeholder="Search by entry title"
          onKeyDown={handleKeyDown}
          title="search entries"
          value={val}
        />
        <button aria-label="search" onClick={() => searchItem(val)}>

        </button>
      {/* </InputGroup> */}
      </div>


      <SearchResults results={results} />

    </>
  );
};

export default Search;
