import React, {useState, useEffect} from 'react';
import { eventManager } from '@utils/events'
import Button from 'react-bootstrap/Button';
import { db } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Select from 'react-select'; // https://react-select.com/home#getting-started 
import VisNetworkReat from '@components/parts/VisNetworkReat' //https://www.npmjs.com/package/react-graph-vis

export default function TestComp() {

          const friends = useLiveQuery(() => db.friends.toArray())
  const subentries = useLiveQuery(() => db.subentries.toArray())
  // const navigate = useNavigate()
  const [val, setVal] = React.useState([]);

    useEffect(() => {
      // so far nothing that needs rerendering - not sure how to pass this into the options list. 
    }, [friends, subentries])



    const filteredFriends = useLiveQuery(() => {
     if (!db.isOpen()) return [];

         let tempItems = [];
    let nextID = 0;





          const foundSubItems = subentries.filter((item) => item.available === true); 

          const foundFriends = friends.filter((item) => item.available === true); 

    
      if (foundSubItems) {
      for (const item of foundSubItems) {
        tempItems.push({
          id: nextID,
          value:nextID, // ['subentry',item.id],
          label: item.fauxID,
          origin: item.id,
          fauxID: item.fauxID,
          parentId: item.parentId,       
          title: item.title,
          date: item.date,
          displayDate: item.displayDate,   
          type: 'subentry',             
          description: item.description,
          devNotes: item.devNotes,
          hexHash: item.hexHash,           
          lastEditedBy: item.lastEditedBy, 
          triggerEvent: item.triggerEvent, 
          available: item.available       
        });
        nextID = nextID + 1;
      }
    }

    // Add main entries too
    if (foundFriends) {
      for (const item of foundFriends) {
        tempItems.push({
          id: nextID,
          value: nextID, // ['subentry',item.id],
          label: item.fauxID,
          origin: item.id,
          fauxID: item.fauxID,
          type: 'entry',
          parentId: null,                  
          title: item.title,
          date: item.date,
          displayDate: item.displayDate,
          description: item.description,
          devNotes: item.devNotes,
          hexHash: item.hexHash,
          lastEditedBy: item.lastEditedBy,
          triggerEvent: item.triggerEvent,
          available: item.available
        });
        nextID = nextID + 1;
      }
    }



        // dont need sorting 
      return tempItems


  }, [])


          const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

  const handleChange = (e) => {
    setVal(e.target.value);
  };

    const handleArrayChange = (e) => {
    const { name, options } = e.target;
    if(!options)  return;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

setVal(selectedValues);

  };

  const onChange = (
    newValue,
    actionMeta
  ) => {
    switch (actionMeta.action) {
      case 'remove-value':
      case 'pop-value':
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        newValue = colourOptions.filter((v) => v.isFixed);
        break;
    }

    setVal(newValue);
  };


return (
  <div>

<Select options={options}
    className="basic-multi-select"
    classNamePrefix="select"
    value={val}
    onChange={onChange}
    isMulti
    name="colors" 
     isClearable={true}
    
    />

  
<div>Current: 
  
              {val.map((student, index) => (
                <div key={index}>
                    <span>{student.value}</span>
                    <span>{student.label}</span>
                </div>
            ))}
</div>

<VisNetworkReat />
  </div>
);
}

export function FormSelectSearch({
    label,
    name,
    formValue,
    readOnly = false,
    onChange,
    options
}) {
    return (
        <div className='row'>
            {label && (<div className="formLabel">{label}</div>)}
            <select
                name={name}
                className="form-control form-control-dropdown col hex-select"
                multiple={true}
                value={formValue}
                onChange={onChange}
                disabled={readOnly}
                >
                {options}
            </select>
        </div>
    );
}