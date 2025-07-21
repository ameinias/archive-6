import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import List from './List';
import Search from './Search/Search';
import { EntryList } from './Lists/ListEditEntry';
import { GameLogic } from '../utils/gamelogic';
import { StaticList } from './Lists/StaticList';


const Home: React.FC = () => {
  const [val, setVal] = useState<string>('');
  // const [itemsToTrack, setItems] = useState<Item[]>([]);
  const { isAdmin, toggleAdmin } = GameLogic();

  return (
    <div>
      {isAdmin ? ( <EntryList />) : ( <StaticList />) }
       {/* <EntryList /> */}
    </div>
  );
};

export default Home;
