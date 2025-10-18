import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Search from '@components/search/Search';
import { EntryList } from '@components/lists/ListEditEntry';
import { GameLogic } from '@utils/gamelogic';
import { StaticList } from '@components/lists/StaticList';
import { eventManager } from '@utils/events';
import { MobileEntryList } from '@components/lists/MobileEntries';


const Home = () => {
  const { isAdmin, toggleAdmin } = GameLogic();
const isElectron = eventManager.isElectron;

  if (!isAdmin) {
    return (
      <div>
        <StaticList />
      </div>
    );
  }


  return (
    <div>
 
        {isElectron ? (
          <EntryList />
        ):(
        <MobileEntryList />
        )}

    </div>
  );
};

export default Home;
