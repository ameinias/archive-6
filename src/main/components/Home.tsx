import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import List from './List';
import Search from './Search';
import { FriendList } from './Friends/EntryList';
import { FileDrop } from './FileDrop';

// const { ipcRenderer } = window.require("electron");
// const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA, HANDLE_EDIT_DATA } = window.require("../../utils/constants");
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface Item {
  // Define the shape of your item here
  [key: string]: any;
}

const Home: React.FC = () => {
  const [val, setVal] = useState<string>('');
  const [itemsToTrack, setItems] = useState<Item[]>([]);

  return (
    <div>

<FileDrop />
      
      <div>
        <h2>Friend List</h2>
        <FriendList />
      </div>
    </div>
  );
};

export default Home;
