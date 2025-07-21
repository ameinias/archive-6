import React, { useState, useEffect } from 'react';
import { db } from '../../utils/db'; // import the database
import { categories, subCategories, researcherIDs } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';

export function AddSubEntryForm({
  itemID,
  parentID,
}: {
  itemID?: string;
  parentID?: string;
}) {
  const { status, setStatusMessage } = GameLogic();
  const [title, setName] = useState('');
  const navigate = useNavigate();
  let savedID: number = 0;
  const [isNewEntry, setNewEntry] = useState(false);
  const { isAdmin, toggleAdmin } = GameLogic();
   const [parentFauxFauxID, setparentFauxID] = useState('');




    // Create async function to generate new ID
  async function generateNewID(): Promise<string> {

    // TODO: Make this alpha numeric someday
    // https://stackoverflow.com/questions/36129721/convert-number-to-alphabet-letter

    if (!parentID) return 'NEW-001';

    try {
      const parent = await db.friends.get(Number(parentID));
      const parentFauxID = parent?.fauxID || '';
      setparentFauxID(parentFauxID);

      const lengthOfSiblings = await db.subentries.where('parentId').equals(Number(parentID)).toArray();


      const incrementNumber = lengthOfSiblings.length + 1;;
      return `${parentFauxID || 'PARENT'}-${incrementNumber || 1}`;
    } catch (error) {
      console.error('Error generating ID:', error);
      return 'ERROR-001';
    }
  }


  const defaultFormValue = {
    fauxID: generateNewID(),
    title: '',
    description: '',
    category: 'Object',
    date: new Date(),
    entryDate: new Date(),
    availableOnStart: false, // Default to false
    researcherID: researcherIDs[0],
  };

    // Generate the fauxID when component mounts or parentID changes
  useEffect(() => {
    async function setupNewEntry() {
      if (isNewEntry && parentID) {
        const newFauxID = await generateNewID();
        setFormValue(prev => ({
          ...prev,
          fauxID: newFauxID
        }));
      }
    }

    setupNewEntry();
  }, [isNewEntry, parentID]);

  // Initialize form values - if an ID came through, get that. If not, default empty.
  useEffect(() => {
    async function fetchData() {
      if (!itemID || itemID === 'new') {
        setFormValue(defaultFormValue);
        setNewEntry(true);
        console.log('Fetching data. Is new entry: ', isNewEntry);
        return;
      }

      const entry = await db.subentries.get(Number(itemID));
      if (entry) {
        setFormValue({
          fauxID: entry.fauxID,
          title: entry.title,
          description: entry.description,
          category: entry.subCategory,
          date: entry.date || new Date(), // Handle optional date
          entryDate: entry.entryDate,
          availableOnStart: entry.availableOnStart || false,
        });
        savedID = entry.id;
        setNewEntry(false);

        console.log(
          itemID + ' Fetched entry:',
          entry.fauxID,
          ' and ',
          formValues.fauxID,
        );
        setStatusMessage(
          'Fetched entry:' +
            entry.fauxID +
            ' and ID:' +
            entry.id +
            ' and ' +
            savedID,
        );
      } else {
        setFormValue(defaultFormValue);
        console.log('No Fetched entry, creating new');
        setNewEntry(true);
      }

      console.log('is new entry: ', isNewEntry);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemID]);

  const [formValues, setFormValue] = useState(defaultFormValue);


// Save the entry to the database.
  async function updateSubEntry() {
    try {
      const title = formValues.title || 'Untitled';
      if (!title) {
        setStatusMessage('Title is required');
        return;
      }

      let idNumber = Number(itemID);
      if (isNaN(idNumber)) {
        setStatusMessage(savedID + 'is not a number');
        return;
      }

      db.subentries
        .update(idNumber, {
        title: formValues.title,
        fauxID: formValues.fauxID,
        hexHash: '', // Add the missing hexHash field
        description: formValues.description,
        media: '',
        subCategory: subCategories[0], // Default to first subcategory
        date: formValues.date,
        entryDate: formValues.entryDate,
        parentId: Number(parentID), // Link to the main entry
        available: formValues.availableOnStart,
        availableOnStart: formValues.availableOnStart,
        researcherID: researcherIDs[0], // researcher who added the entry
        })
        .then(function (updated) {
          if (updated)
            setStatusMessage(idNumber + ' was updated to ' + formValues.title);
          else setStatusMessage('Nothing was updated - no key:' + idNumber);
        });

      // setFormValue(defaultFormValue);
      //navigate('/'); // <-- Go to Home
    } catch (error) {
      setStatusMessage(`Failed to edit ${title} : ${error}`);
      return;
    }
    setStatusMessage(`Entry ${title} successfully updated.`);
    FinishEdit();
   
  }



  async function addSubEntry() {
    try {
      const title = formValues.title || 'Untitled';
      if (!title) {
        setStatusMessage('Title is required');
        return;
      }

      // Ensure we have a valid parent ID
      const parentIdCast = parentID ? Number(parentID) : Number(itemID);
      if (isNaN(parentIdCast)) {
        setStatusMessage('Invalid parent ID for subentry');
        return;
      }

      const id = await db.subentries.add({
        title: formValues.title,
        fauxID: formValues.fauxID,
        hexHash: '', // Add the missing hexHash field
        description: formValues.description,
        media: '',
        subCategory: subCategories[0], // Default to first subcategory
        date: formValues.date,
        entryDate: formValues.entryDate,
        parentId: parentIdCast, // Link to the main entry
        available: formValues.availableOnStart,
        availableOnStart: formValues.availableOnStart,
        researcherID: researcherIDs[0], // researcher who added the entry
      });

      setStatusMessage(
        `Subentry ${title} successfully added to parent ${parentIdCast}. Got id ${id}`,
      );
      setFormValue(defaultFormValue);
    } catch (error) {
      setStatusMessage(`Failed to add subentry ${title}: ${error}`);
    }
    FinishEdit();

  }

    async function FinishEdit() {
      const newFauxID = await generateNewID();
      setFormValue({
        ...defaultFormValue,
        fauxID: newFauxID
      });
      setNewEntry(true);
      console.log('FinishEdit called, new entry state:', isNewEntry);
    }

  // Manage state and input field
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <>
      <div className="SubEntry">
        {isNewEntry ? <h2>Add New Sub Entry</h2> : <h2>Edit Sub Entry</h2>}
        <div className="row">
          {/* <div className="col-3">
                          <input
                className="form-control"
                type="text"
                name="fauxID"
                placeholder="ID"
                value={parentFauxFauxID}
                onChange={handleChange}
                readOnly
              />

          </div> */}
          <div className="col-3">
           <div className="formLabel">ID:</div>
            {isNewEntry || isAdmin ? (
              <input
                className="form-control"
                type="text"
                name="fauxID"
                placeholder="ID"
                value={formValues.fauxID}
                onChange={handleChange}
              />
            ) : (
              <input
                className="form-control"
                type="text"
                name="fauxID"
                placeholder="ID"
                value={formValues.fauxID}
                onChange={handleChange}
                readOnly
              />
            )}
          </div>
          <div className="col">
           <div className="formLabel">Title:</div>
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="Title"
              value={formValues.title}
              onChange={handleChange}
            />
          </div>
        </div>
                <div className="row">
<div className="col-3">
           <div className="formLabel">Category:</div>
            <select
              className="form-control form-control-dropdown"
              multiple={false}
              value={formValues.category}
          onChange={handleChange}
          name="category"
        >
          {categories.map((sub, i) => (
            <option key={i} value={sub}>
              {sub}
            </option>
          ))}
        </select>
        {' '}
        </div>

  <div className="col">
             <div className="formLabel">Researcher:</div>
              <select className="form-control form-control-dropdown"
                multiple={false} value={formValues.researcherID}
          onChange={handleChange} name="researcherID"
        >
          {researcherIDs.map((sub, i) => (
            <option key={i} value={sub}>
              {sub}
            </option>
          ))}
        </select>
        </div>
        

      </div>

        <div className="row">
           <div className="formLabel">Description:</div>
            <textarea
            rows={4}
              className="form-control"
              type="textarea"
              name="description"
          placeholder="Description"
          value={formValues.description}
          onChange={handleChange}
        />
        </div>




        {isAdmin && <div className="adminOnly">
          <input type="checkbox" checked={formValues.availableOnStart} onChange={handleChange} name="availableOnStart" />
          <label>available on start</label>
          <br />



          </div>}


              {isNewEntry ? (
          <button className="outline-primary" onClick={addSubEntry}>
            Add
          </button>
        ) : (
          <button className="outline-warning" onClick={updateSubEntry}>
            Save
          </button>
        )}
    </div>
    </>
  );
}
