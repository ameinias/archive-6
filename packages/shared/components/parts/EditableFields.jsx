
import {React, useState} from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@utils/db';
import { GameLogic } from '@utils/gamelogic';
import { researcherIDs } from '@utils/constants';
import * as FormAssets from '@components/parts/FormAssets';


export function EditResearcher({itemID, type}) {

    const gameLog = GameLogic();
    const [editingProp, setEditingProp] = useState(null);
    const [tempPropValue, setTempPropValue] = useState(''); 
    const { setStatusMessage } = GameLogic();


  const item = useLiveQuery(async () => {
    if (!itemID) return null;

    let result;
    if (type === 'subentry') {
      result = await db.subentries.get(itemID);
    } else {
      result = await db.friends.get(itemID);
    }

    if (!result) {
      console.error("Cannot find the entry with ID:", itemID);
      return null;
    }

    return result;
  });


  if (item === undefined) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }



      const startEditing = (item) => {
    const currentValue = item.researcherID;

          setTempPropValue(currentValue);
           setEditingProp(item.id);
    
  };


  const saveEdit = async (itemId, value, type) => {
    try {

        if(type === 'subentry') {


          await db.subentries.update(itemId, {
            researcherID: value
          });

        } else {


          await db.friends.update(itemId, {
            researcherID: value
          });

        }

            setEditingProp(null);
            setTempPropValue('');


      setStatusMessage(itemId + ' updated successfully');
    } catch (error) {
      console.error('Error updating hex hash:', error);
      setStatusMessage('Error updating hex hash');
    }
  };

  const cancelEditing = () => {
    setEditingProp(null);
    setTempPropValue('');
  };





    
    return (
        <>

      {editingProp === item.id ? (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', width: '40px' }}>

         < select
              className="form-control form-control-dropdown"
              multiple={false}
              value={tempPropValue}
              onChange={(e) => {
                // setTempPropValue(e.target.value);
                saveEdit(item.id, e.target.value, type);
              }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit(item.id, type);
              if (e.key === 'Escape') cancelEditing();
            }}
              name="researcherID"
              style={{ flex: 1, padding: '2px 5px', width: '120px' }}
            >
              {researcherIDs.map((sub, i) => (
                <option key={i} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
        </div>
      ) : (
        <div
          onClick={() => startEditing(item, type)}
          style={{
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '3px',
            ':hover': { backgroundColor: '#f0f0f0' }
          }}
          title="Click to edit"
        >
          {item.researcherID !== null && item.researcherID !== undefined
                   ? researcherIDs.find(researcher => researcher.id === parseInt(item.researcherID))?.name || 'Unknown'
                   : 'Unknown User'
                 }
        </div>
      )}

        </>
    );
}




export function EditDate({itemID, type}) {

    const gameLog = GameLogic();
    const [editingProp, setEditingProp] = useState(null);
    const [tempPropValue, setTempPropValue] = useState(''); 
    const { setStatusMessage } = GameLogic();


  const item = useLiveQuery(async () => {
    if (!itemID) return null;

    let result;
    if (type === 'subentry') {
      result = await db.subentries.get(itemID);
    } else {
      result = await db.friends.get(itemID);
    }

    if (!result) {
      console.error("Cannot find the entry with ID:", itemID);
      return null;
    }

    return result;
  });


  if (item === undefined) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }



      const startEditing = (item) => {
    const currentValue = item.researcherID;

          setTempPropValue(currentValue);
           setEditingProp(item.id);
    
  };


  const saveEdit = async (itemId, value, type) => {
    try {

        if(type === 'subentry') {


          await db.subentries.update(itemId, {
            displayDate: tempPropValue
          });

        } else {


          await db.friends.update(itemId, {
            displayDate: tempPropValue
          });

        }

            setEditingProp(null);
            setTempPropValue('');


      setStatusMessage(itemId + ' updated successfully');
    } catch (error) {
      console.error('Error updating hex hash:', error);
      setStatusMessage('Error updating hex hash');
    }
  };

  const cancelEditing = () => {
    setEditingProp(null);
    setTempPropValue('');
  };





    
    return (
        <>
fsdfsdfsd
      {editingProp === item.id ? (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', width: '40px' }}>


                        <FormAssets.FormDate
                    label="Last Modified"
                    name="modEditDate"
                    value={tempPropValue}
              onChange={(e) => {
                 setTempPropValue(e.target.value);
              }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit(item.id, type);
              if (e.key === 'Escape') cancelEditing();
            }}
                   />
                   </div>
      ) : (
        <div
          onClick={() => startEditing(item, type)}
          style={{
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '3px',
            ':hover': { backgroundColor: '#f0f0f0' }
          }}
          title="Click to edit"
        >
          {item.displayDate ? (
                             typeof item.displayDate === 'string' 
                               ? item.displayDate 
                               : new Date(item.displayDate).toLocaleDateString()
                           ) : 'No date'}
        </div>
      )}

        </>
    );
}
