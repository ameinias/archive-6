import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";
import List from "./List";
import Search from "./Search";
// const { ipcRenderer } = window.require("electron");
// const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, HANDLE_REMOVE_DATA, HANDLE_EDIT_DATA } = window.require("../../utils/constants");
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface Item {
  // Define the shape of your item here
  [key: string]: any;
}

const Home: React.FC = () => {
  const [val, setVal] = useState<string>("");
  const [itemsToTrack, setItems] = useState<Item[]>([]);
  // const navigate = useNavigate(); // Add this line

  // // Example handler types
  // const handleReceiveData = (_event: any, data: { message: Item[] }) => {
  //   setItems(Array.from(data.message));
  // };

  // const handleNewItem = (_event: any, data: { message: Item }) => {
  //   setItems(itemsToTrack.concat(data.message));
  // };

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setVal(e.target.value);
  // };

  // const addItem = (input: string) => {
  //   // saveDataInStorage(input); // Uncomment and implement if needed
  //   setVal("");
  // };

  // const handleKeypress = (event: KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter') {
  //     addItem(val);
  //     console.log("attempt send");
  //   }
  // };

  return (
    <div className="sidebar">
      <Link to="/user-profile">
  <Button variant="outline-primary">Go to User Profile</Button>
</Link>
     {/* <div> <Button
                variant="outline-secondary"
                onClick={() => navigate('/add-friend')}
              >
                🔓
              </Button> */}
              
              
      <span>I am home, here!</span>
    </div>
  );
};

export default Home;
