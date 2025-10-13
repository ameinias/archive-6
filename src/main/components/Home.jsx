import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Search from './Search/Search';
import { EntryList } from './Lists/ListEditEntry';
import { GameLogic } from '../../../packages/shared/utils/gamelogic';
import { StaticList } from './Lists/StaticList';


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
