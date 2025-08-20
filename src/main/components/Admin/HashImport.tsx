import { GameLogic } from '../../utils/gamelogic';
import Dexie from 'dexie';
import { db, dbHelpers } from '../../utils/db'; 
import { Button } from 'react-bootstrap';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

function HashImport() {
    const friends = useLiveQuery(() => db.friends.toArray());
    const subentries = useLiveQuery(() => db.subentries.toArray());

    // Sort friends by date
  const findByHash = (hash: string) => friends
    ? [...friends]
    .filter(item => item.hexHash === hash)

    // .sort((a, b) => {
    //     const dateA = a.date ? new Date(a.date).getTime() : 0;
    //     const dateB = b.date ? new Date(b.date).getTime() : 0;
    //     return dateB - dateA;
    //   })
    : [];
    
const importHash = async (event) => {

      const hash = event.target.elements.hash.value;
      const entries = findByHash(hash);

      if (
      !window.alert(`Entries added to database.
      `)
    ) {
      console.log("fone");
}
}

return(

     <div className="hashImport-div">
              <div className="row">
                {' '}
                {/*// ------ Title  ------*/}
                <div className="formLabel col-2">hexHash:</div>
                <input
                  className="form-control col"
                  type="text"
                  name="title"
                  placeholder="Title"
                  // value={formValues.title}
                  // onChange={handleChange}
                />
    
              </div>
               <div className="row">
                          <Button
                  className="btn-save-add-item"
                  onClick={importHash}
                >
                  Import Hash
                </Button>
                </div>
                Try:        eeqR-4fd9-D04S  
              </div>
);
}

export default HashImport;