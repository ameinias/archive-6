import React, { useState, useEffect } from 'react';
import { db } from '../../utils/db'; // import the database
import Button from 'react-bootstrap/Button';
import {
  categories,
  subCategories,
  researcherIDs,
  entryTemplate,
} from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';
import { ListSubEntries } from '../Lists/ListSubEntries';
import { MediaUpload } from './MediaUpload';

const defaultFormValue = {
  fauxID: 'MX0000',
  title: '',
  description: '',
  category: 'Object',
  date: new Date(),
  entryDate: new Date(),
  availableOnStart: false,
  available: true,
  researcherID: researcherIDs[0] || '',
  media: [],
  template: 'default',
  bookmark: false,
  hexHash: 'aeoh-3q484-da232',
};

export function AddEntryForm({
  itemID,
  parentID,
  isSubEntry,
}) {
  const [formValues, setFormValue] = useState(defaultFormValue);

  const { setStatusMessage } = GameLogic();
  const [title, setName] = useState('');
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  let savedID = 0;
  const [isNewEntry, setNewEntry] = useState(false);
  const [isFormValid, setFormValid] = useState(true);
  const [isIDValid, setIDValid] = useState(true);

  const { isAdmin, toggleAdmin } = GameLogic();

  useEffect(() => {
    async function fetchData() {
      if (!itemID || itemID === 'new') {
        const newID = await generateNewID();
        setFormValue({
          ...defaultFormValue,
          fauxID: newID,
        });
        setNewEntry(true);
        return;
      }

      const entry = await db.friends.get(Number(itemID));
      if (entry) {
        setFormValue({
          fauxID: entry.fauxID || '', //
          title: entry.title || '',
          hexHash: entry.hexHash || '',
          description: entry.description || '',
          category: entry.category || 'Object',
          date: entry.date || new Date(),
          entryDate: entry.entryDate || new Date(),
          availableOnStart: entry.availableOnStart || false,
          available: entry.available || false,
          // researcherID: entry.researcherID || researcherIDs[0] || '',
          media: entry.media || [],
          template: entry.template || 'default',
          bookmark: entry.bookmark || false,
        });
        savedID = entry.id;
        setNewEntry(false);
      } else {
        setFormValue(defaultFormValue);
        setNewEntry(true);
      }
    }

    fetchData();
  }, [itemID]);

  const generateNewID = async () => {
    try {
      const items = await db.friends.toArray();
      const existingIDs = items.map((item) => item.fauxID);
      const numericIDs = existingIDs
        .filter((id) => id.startsWith('MX'))
        .map((id) => parseInt(id.replace('MX', '')))
        .filter((num) => !isNaN(num));

      const highestID = numericIDs.length > 0 ? Math.max(...numericIDs) : 999;
      let newID = Math.max(highestID + 1, 1000);

      while (existingIDs.includes('MX' + newID)) {
        newID++;
      }

      setStatusMessage(`Generated new ID: MX${newID}`);
      return 'MX' + newID;
    } catch (error) {
      console.error('Error generating ID:', error);
      const randomID = Math.floor(Math.random() * 9000) + 1000;
      return 'MX' + randomID;
    }
  };

  //*    ---------------    ENTRY FUNCTIONS  ------------------ */

  async function updateEntry() {
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

      db.friends
        .update(idNumber, {
          title: formValues.title,
          fauxID: formValues.fauxID,
          hexHash: formValues.hexHash,
          description: formValues.description,
          category: formValues.category,
          date: formValues.date,
          entryDate: formValues.entryDate,
          availableOnStart: formValues.availableOnStart,
          available: formValues.available,
          media: formValues.media,
          template: formValues.template,
          bookmark: formValues.bookmark,
        })
        .then(function (updated) {
          if (updated)
            setStatusMessage(
              idNumber +
                ' ' +
                formValues.fauxID +
                ' was updated with ' +
                formValues.media.length +
                ' attachments',
            );
          else setStatusMessage('Nothing was updated - no key:' + idNumber);
        });

      // setFormValue(defaultFormValue);
      //navigate('/'); // <-- Go to Home
    } catch (error) {
      setStatusMessage(
        `Failed to edit ${title}  & ${formValues.title}: ${error}`,
      );
      return;
    }
  }

  // Add the entry to the database
  async function addEntry() {
    try {
      const title = formValues.title || 'Untitled';
      if (!title) {
        setStatusMessage('Title is required');
        return;
      }

      const id = await db.friends.add({
        title: formValues.title,
        fauxID: formValues.fauxID,
        hexHash: formValues.hexHash ,
        description: formValues.description,
        media: formValues.media,
        category: formValues.category,
        date: formValues.date,
        entryDate: formValues.entryDate,
        available: formValues.availableOnStart,
        availableOnStart: formValues.availableOnStart,
        template: formValues.template,
        bookmark: formValues.bookmark || false, // Optional field for bookmark
      });

      setStatusMessage(`Entry ${title} successfully added. Saved attachments: ${formValues.media.length}`);

      navigate(`/edit-item/${id}`); // <-- Reset Page to show subitems
      // setFormValue(defaultFormValue);  // Reset to defaults
    } catch (error) {
      setStatusMessage(`Failed to add ${title}: ${error}`);
    }
  }

  async function removeCurrentEntry() {
    if (
      await window.electronAPI.showConfirm(`Are you sure you want to delete "${formValues.title}"?`)
    ) {
      try {
        const id = Number(itemID);
        if (isNaN(id)) {
          setStatusMessage('Invalid ID: ' + itemID);
          return;
        }

        await db.friends.delete(id);
        setStatusMessage(`Entry ${formValues.title} successfully deleted.`);
        navigate('/'); // Go back to home
      } catch (error) {
        setStatusMessage(`Failed to delete ${formValues.title}: ${error}`);
      }
    }
  }

  //*    ---------------    HANDLERS  ------------------ */
  // Checkbox handler
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormValue({
      ...formValues,
      [name]: checked,
    });
  };

  // Manage state and input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValues,
      [name]: value,
    });
  };

  // Manage state and input field
  const handleIDChange = (e) => {
    const { name, value } = e.target;
    // Ensure the ID starts with 'MX' and is followed by numbers
    if (!/^MX\d+$/.test(value)) {
      setIDValidWithMessage(
        false,
        `ID ${value} must start with "MX" followed by numbers.`,
      );
      return;
    }
    //check if the ID is unique
    db.friends
      .where('fauxID')
      .equals(value)
      .count()
      .then((count) => {
        if (count > 0) {
          //setStatusMessage(`ID ${value} already exists. Please choose a different ID.`);
          setIDValidWithMessage(false, `ID ${value} already exists.`);
        } else {
          setIDValidWithMessage(true);
        }
        setFormValue({
          ...formValues,
          [name]: value,
        });
      });
  };

  const setIDValidWithMessage = (isValid, message) => {
    setIDValid(isValid);
    setFormValid(isValid);
    if (message) setStatusMessage(message);
    if (!message && isValid) setStatusMessage(''); // Clear on success
  };

  const checkExistingID = async (id) => {
    const count = await db.friends.where('fauxID').equals(id).count();
    return count > 0;
  };

  //*    --------------------------    RETURN  ------------------------------- */
  return (
    <>
      <div className="Single">
        {isNewEntry ? <h2>Add New Entry</h2> : <h2>Edit Entry</h2>}
        <p>
          {/* {status} {isFormValid ? 'Form is valid' : 'Form is invalid'} */}
        </p>
        <div className="row">
          <div className="col-3">
            {' '}
            {/*// ------ ID  ------*/}
            <div className="formLabel col">ID:</div>
            {isNewEntry || isAdmin ? (
              <input
                className={`form-control ${!isIDValid ? 'is-invalid' : ''} col`}
                type="text"
                name="fauxID"
                placeholder="ID"
                value={formValues.fauxID}
                onChange={handleIDChange} // ← Use the ID-specific handler
                readOnly={!isNewEntry && !isAdmin}
              />
            ) : (
              <input
                className="form-control col"
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
            {' '}
            {/*// ------ Title  ------*/}
            <div className="formLabel col">Title:</div>
            <input
              className="form-control col"
              type="text"
              name="title"
              placeholder="Title"
              value={formValues.title}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            {' '}
            {/*// ------ CATAGORY  ------*/}
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
          </div>
          <div className="col">
            {' '}
            {/*// ------ Researcher  ------*/}
            {/* <div className="formLabel">Researcher:</div>
            <select
              className="form-control form-control-dropdown"
              multiple={false}
              value={formValues.researcherID}
              onChange={handleChange}
              name="researcherID"
            >
              {researcherIDs.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))}
            </select> */}
          </div>
        </div>
        <div className="row">
          {' '}
          {/*// ------ Description  ------*/}
          <div className="formLabel">Description:</div>
          <textarea
            rows={4}
            className="form-control"
            name="description"
            placeholder="Description"
            value={formValues.description}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          {' '}
          {/*// ------ Media   ------*/}
          <MediaUpload mediaFiles={formValues.media} />
        </div>

        {isAdmin && (
          <div className="row adminOnly">
            <div className="row">
              {' '}
              {/*// ------ Available on Start  ------*/}
              <label className="formLabel">available on start</label>
              <input
                type="checkbox"
                className="formLabel"
                checked={formValues.availableOnStart}
                onChange={handleCheckboxChange}
                name="availableOnStart"
              />
            </div>

            <div className="row">
              {' '}
              {/*// ------ available  ------*/}
              <label className="formLabel">available</label>
              <input
                type="checkbox"
                className="formLabel"
                checked={formValues.available}
                onChange={handleCheckboxChange}
                name="available"
              />
            </div>
            <div className="row">
              {' '}
              {/*// ------ bookmark  ------*/}
              <label className="formLabel">bookmark</label>
              <input
                type="checkbox"
                className="formLabel"
                checked={formValues.bookmark}
                onChange={handleCheckboxChange}
                name="bookmark"
              />
            </div>
            <div className="row">
              <div className="col-1 formLabel">hexhash:</div>
              <input
                className="form-control col"
                type="text"
                placeholder="aeoh-3q484-da232"
                value={formValues.hexHash}
                onChange={handleChange}
                name="hexHash"
              />
            </div>

            {/*// ------ Template  ------*/}
            <div className="row">
              <div className="col-1 formLabel">Template:</div>
              <select
                className="form-control form-control-dropdown col"
                multiple={false}
                value={formValues.template}
                onChange={handleChange}
                name="template"
              >
                {entryTemplate.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>{' '}
            </div>
          </div> // admin row
        )}

        {/* Only show Add Subentry button when not already a subentry. */}
        {!isSubEntry && itemID != 'new' ? (
          <div className="row">
            {' '}
            {/*// ------ subentries   ------*/}
            <ListSubEntries itemID={itemID} />
          </div>
        ) : (
          <></>
        )}
        <div className="save-buttons">
          {' '}
          {/*// ------ Save Buttons  ------*/}
          {isNewEntry ? (
            <Button
              className="btn-save-add-item"
              onClick={addEntry}
              disabled={!isFormValid}
            >
              Add
            </Button>
          ) : (
            <>
              <Button
                className="btn-save-add-item"
                onClick={updateEntry}
                disabled={!isFormValid}
              >
                Save
              </Button>
              <Button className="remove-button" onClick={removeCurrentEntry}>
                Remove
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
