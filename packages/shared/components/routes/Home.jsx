import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Search from '@components/search/Search';
import { EntryList } from '@components/lists/ListEditEntry';
import { GameLogic } from '@utils/gamelogic';
import { StaticList } from '@components/lists/StaticList';


const Home = () => {
  const { isAdmin, toggleAdmin } = GameLogic();

  return (
    <div>
      {isAdmin ? ( <EntryList />) : ( <StaticList />) }
       {/* <EntryList /> */}
    </div>
  );
};

export default Home;
