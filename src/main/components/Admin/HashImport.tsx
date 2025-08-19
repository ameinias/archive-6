import { GameLogic } from '../../utils/gamelogic';
import Dexie from 'dexie';
import { db, dbHelpers } from '../../utils/db'; 
import { Button } from 'react-bootstrap';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';

function HashImport() {

    
const importHash = async (event) => {


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
              </div>
);
}

export default HashImport;