import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import React from 'react';

const { ipcRenderer } = require("electron");
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA, HANDLE_EDIT_DATA } = require("../../utils/constants")

const Search = ({itemsToTrack}) => {

// const searchItem = (searchTerm) => {
// const storage = require('electron-json-storage');

// itemsToTrack.has(searchTerm, function(error, hasKey) {
//   if (error) throw error;

//   if (hasKey) {
//     console.log('There is data stored as ' + searchTerm);
//   }
// });

// deal with search later, electron-json-storage
return(
 <InputGroup className="searchBar">
        {/* <input type="text" onChange={handleChange} value={val} /> */}
        {/* <Button variant="outline-primary" onClick={() => searchItem(val)}>Search</Button> */}
      </InputGroup>
)

}

export default Search