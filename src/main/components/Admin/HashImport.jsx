import { GameLogic } from '../../utils/gamelogic';
import Dexie from 'dexie';
import { db, dbHelpers } from '../../utils/db';
import { Button } from 'react-bootstrap';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { findByHashAndUnLock } from  '../../../hooks/dbHooks'

function HashImport() {
    const [hashValue, setHashVal] = React.useState('');
    const friends = useLiveQuery(() => db.friends.toArray());
    const subentries = useLiveQuery(() => db.subentries.toArray());



const importHash =  async() => {


 const result = await findByHashAndUnLock(hashValue);
  console.log(result);
window.alert(result);
}

  const handleChange = (e) => {
    setHashVal(e.target.value);
  };


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
                   onChange={handleChange}
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
                Try:   <br />
                eeqR-4fd9-D04S  <br />
                aeoh-3q484-da232 <br />
                ooo5-6jdsA-GH7aa <br />
                iaeF-33pqJ-ef09H <br />

              </div>
);
}

export default HashImport;
