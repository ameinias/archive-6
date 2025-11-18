import React, {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent
} from 'react';
import {
  GameLogic
} from '@utils/gamelogic';
import {
  db
} from '@utils/db'; // import the database
import {
  useLiveQuery
} from 'dexie-react-hooks';


// Don't expect this page to work - this is just a reference script for simple react shit as I'm learning.

// Questions:
// What is ChangeEvent and KeyboardEvent again?


// Help:
// Insert Snippet: rxc


const ComponentName = () => {
  // UseState hooks here
  const [isLoading, setIsLoading] = useState(false);

  // variables from imported modules
  const gameLogic = GameLogic();

  // other simple constants and functions
  const friends = useLiveQuery(() => db.friends.toArray());



  // useEffect is a hook function. It always runs on start, and will run when the data it specific changes.

  useEffect(() => {

    const fetchItems = async () => {
      let sortedItems;
      if (sortDirection === 'asc') {
        sortedItems = await db.friends.orderBy(sortColumn).toArray();
      } else {
        sortedItems = await db.friends.orderBy(sortColumn).reverse().toArray();
      }
      setItems(sortedItems);
      sortedFriends = sortedItems
    };

    fetchItems();
    
  }, [sortColumn, sortDirection]); // Re-fetch when sort order changes


    const removeFile = (index) => {
    console.log(index);
  };

  return ( 
    <div>
    Content 

                  <Button
                className="image-edit-button"
                
                onClick={() => removeFile(index)}
              >
                x
              </Button>

    </div>
  );
};

export default ComponentName;
