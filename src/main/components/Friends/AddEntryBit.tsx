import React, { useState, useEffect } from 'react';
import { db } from '../../utils/db'; // import the database
import { categories, subCategories, researcherIDs } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';
import { ListSubEntries } from './ListSubEntries';

import { Network } from 'inspector/promises';

export function AddFriendForm({
  itemID,
  parentID,
  isSubEntry,
}: {
  itemID?: string;
  parentID?: string;
  isSubEntry?: boolean;
}) {
  const [status, setStatus] = useState('');
  const [title, setName] = useState('');
  const navigate = useNavigate();
  let savedID: number = 0;
  const [isNewEntry, setNewEntry] = useState(false);

  const { isAdmin, toggleAdmin } = GameLogic();

  const NewID = () => {
    // TODO: Calculate a new ID based on the existing items in storage
    // For now, just return a random number
    return 'MX' + Math.floor(Math.random() * 10000);
  };

  const defaultFormValue = {
    fauxID: NewID(),
    title: '',
    description: '',
    category: 'Object',
    date: new Date(),
    entryDate: new Date(),
    availableOnStart: false, // Default to false
    researcherID: researcherIDs[0],
  };

  // Initialize form values - if an ID came through, get that. If not, default empty.
  useEffect(() => {
    async function fetchData() {
      if (!itemID || itemID === 'new') {
        setFormValue(defaultFormValue);
        setNewEntry(true);
        console.log('is new entry: ', isNewEntry);
        return;
      }

      const entry = await db.friends.get(Number(itemID));
      if (entry) {
        setFormValue({
          fauxID: entry.fauxID,
          title: entry.title,
          description: entry.description,
          category: entry.category,
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
        setStatus(
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

  async function updateEntry() {
    try {
      const title = formValues.title || 'Untitled';
      if (!title) {
        setStatus('Title is required');
        return;
      }

      let idNumber = Number(itemID);
      if (isNaN(idNumber)) {
        setStatus(savedID + 'is not a number');
        return;
      }

      db.friends
        .update(idNumber, {
          title: formValues.title,
          fauxID: formValues.fauxID,
          description: formValues.description,
          category: formValues.category,
          date: formValues.date,
          entryDate: formValues.entryDate,
          availableOnStart: formValues.availableOnStart,
        })
        .then(function (updated) {
          if (updated)
            setStatus(idNumber + ' was updated to ' + formValues.title);
          else setStatus('Nothing was updated - no key:' + idNumber);
        });

      // setFormValue(defaultFormValue);
      //navigate('/'); // <-- Go to Home
    } catch (error) {
      setStatus(`Failed to edit ${title}  & ${formValues.title}: ${error}`);
      return;
    }
    setStatus(`Entry ${title} & ${formValues.title} successfully updated.`);
  }

  // Add the entry to the database
  async function addEntry() {
    try {
      const title = formValues.title || 'Untitled';
      if (!title) {
        setStatus('Title is required');
        return;
      }

      const id = await db.friends.add({
        title: formValues.title,
        fauxID: formValues.fauxID,
        hexHash: '',
        description: formValues.description,
        thumbnail: '',
        category: formValues.category,
        date: formValues.date,
        entryDate: formValues.entryDate,
        available: formValues.availableOnStart,
        availableOnStart: formValues.availableOnStart,
      });

      setStatus(`Entry ${title} successfully added. Got id ${id}`);
      // setName('');
      // setCat(defaultCat);
      // navigate('/'); // <-- Go to Home
      setFormValue(defaultFormValue);
    } catch (error) {
      setStatus(`Failed to add ${title}: ${error}`);
    }
  }

  async function addSubEntry() {
    try {
      const title = formValues.title || 'Untitled';
      if (!title) {
        setStatus('Title is required');
        return;
      }

      // Ensure we have a valid parent ID
      const parentId = parentID ? Number(parentID) : Number(itemID);
      if (isNaN(parentId)) {
        setStatus('Invalid parent ID for subentry');
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
        parentId: parentId, // Link to the main entry
        available: formValues.availableOnStart,
        availableOnStart: formValues.availableOnStart,
        researcherID: researcherIDs[0], // researcher who added the entry
      });

      setStatus(
        `Subentry ${title} successfully added to parent ${parentId}. Got id ${id}`,
      );
      setFormValue(defaultFormValue);
    } catch (error) {
      setStatus(`Failed to add subentry ${title}: ${error}`);
    }
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
      <div className="Single">
        {isNewEntry ? <h2>Add New Entry</h2> : <h2>Edit Entry</h2>}
        <p>{status}</p>
        <div className="row">
          <div className="col-3">
            ID:
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
            Title:
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
        Description:
        <input
          className="form-control"
          type="text"
          name="description"
          placeholder="Description"
          value={formValues.description}
          onChange={handleChange}
        />
        Category:
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
        </select>{' '}
        {isAdmin && <div className="adminOnly">"is admin"
          <input type="checkbox" checked={formValues.availableOnStart} onChange={handleChange} name="availableOnStart" />
          <label>available on start</label>
          <br />



          </div>}

        {/* Only show Add Subentry button when not already a subentry. */}
        {!isSubEntry ? (
          <>

            <ListSubEntries itemID={itemID} />

          </>
        ) : (
         <></>
        )

        }

              {isNewEntry ? (
          <button className="outline-primary" onClick={addEntry}>
            Add
          </button>
        ) : (
          <button className="outline-warning" onClick={updateEntry}>
            Save
          </button>
        )}
    </div>
    </>
  );
}
