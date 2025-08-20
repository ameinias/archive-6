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
import { MediaUploadSub } from './MediaUploadSub';
import { availableMemory } from 'process';
import { useLiveQuery } from 'dexie-react-hooks';

export function AddSubEntryForm({
  itemID,
  parentID,
}: {
  itemID?: string;
  parentID?: string;
}) {
  //*    ---------------    CONST  ------------------ */
  const { setStatusMessage } = GameLogic();
  const [title, setName] = useState('');
  const navigate = useNavigate();
  let savedID: number = 0;
  const [isNewEntry, setNewEntry] = useState(false);
  const { isAdmin, toggleAdmin } = GameLogic();
  const [parentFauxFauxID, setparentFauxID] = useState('');
  const [isFormValid, setFormValid] = useState(true);
  const [isIDValid, setIDValid] = useState(true);

  /* ------------------------  Generate entry functions --------*/
  // Create async function to generate new ID
  async function generateNewID(): Promise<string> {
    if (!parentID) return 'NEW-001';

    try {
      const parent = await db.friends.get(Number(parentID));
      const parentFauxID = parent?.fauxID || '';
      setparentFauxID(parentFauxID);

      const lengthOfSiblings = await db.subentries
        .where('parentId')
        .equals(Number(parentID))
        .toArray();

      function findLowestGap(siblings: any[]): number {
        // Extract numbers after the '-' from fauxIDs
        const existingNumbers = siblings
          .map((sibling) => {
            const fauxID = sibling.fauxID || '';
            const parts = fauxID.split('-');
            if (parts.length >= 2) {
              const number = parseInt(parts[1]);
              return isNaN(number) ? null : number;
            }
            return null;
          })
          .filter((num) => num !== null) // Remove null values
          .sort((a, b) => a - b); // Sort ascending

        console.log('Existing numbers:', existingNumbers);

        // If no existing numbers, start at 1
        if (existingNumbers.length === 0) {
          return 1;
        }

        // Check for gap starting from 1
        for (let i = 1; i <= existingNumbers.length + 1; i++) {
          if (!existingNumbers.includes(i)) {
            return i; // Found the first missing number
          }
        }

        // If no gaps found, return next number in sequence
        return Math.max(...existingNumbers) + 1;
      }

      const nextNumber = findLowestGap(lengthOfSiblings);
      console.log('Next available number:', nextNumber);

      return `${parentFauxID || 'PARENT'}-${nextNumber || 1}`;
    } catch (error) {
      console.error('Error generating ID:', error);
      return 'ERROR-001';
    }
  }

  /* ------------------------  Handlers --------*/
  // Manage state and input field
  const handleIDChange = (e: { target: { name: any; value: any } }) => {
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
    db.subentries
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

  const setIDValidWithMessage = (isValid: boolean, message?: string) => {
    setIDValid(isValid);
    setFormValid(isValid);
    if (message) setStatusMessage(message);
    if (!message && isValid) setStatusMessage(''); // Clear on success
  };

  /* ------------------------  Default Form Value --------*/
  const defaultFormValue = {
    fauxID: 'tempID',
    title: '',
    description: '',
    category: 'Object',
    date: new Date(),
    entryDate: new Date(),
    availableOnStart: false, // Default to false
    available: false, // Default to false
    mediaSub: [],
    subCategory: subCategories[0], // Default to first subcategory
    researcherID: researcherIDs[0],
    template: 'default', // Optional field for template
  };

  //*    ---------------    UseEffect   ------------------ */
  // Generate the fauxID when component mounts or parentID changes
  useEffect(() => {
    async function setupNewEntry() {
      if (isNewEntry && parentID) {
        const newFauxID = await generateNewID();
        setFormValue((prev) => ({
          ...prev,
          fauxID: newFauxID,
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
          date: entry.date || new Date(),
          entryDate: entry.entryDate,
          availableOnStart: entry.availableOnStart || false,
          available: entry.available || false,
          mediaSub: entry.mediaSub || [],
          template: entry.template || 'default',
          bookmark: entry.bookmark || false,
          hexHash: entry.hexHash || 'aeoh-3q484-da232',
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

  //*    ---------------    ENTRY FUNCTIONS  ------------------ */

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
          hexHash: formValues.hexHash || 'aeoh-3q484-da232',
          description: formValues.description,
          mediaSub: formValues.mediaSub || [],
          subCategory: subCategories[0], // Default to first subcategory
          date: formValues.date,
          entryDate: formValues.entryDate,
          parentId: Number(parentID), // Link to the main entry
          available: formValues.available,
          availableOnStart: formValues.availableOnStart,
          researcherID: researcherIDs[0], // researcher who added the entry
          template: formValues.template, // Handle  template
          bookmark: formValues.bookmark || false, // Handle optional bookmark
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
        hexHash: formValues.hexHash || 'aeoh-3q484-da232',
        description: formValues.description,
        mediaSub: formValues.mediaSub,
        subCategory: subCategories[0], // Default to first subcategory
        date: formValues.date,
        entryDate: formValues.entryDate,
        parentId: parentIdCast, // Link to the main entry
        available: formValues.available,
        availableOnStart: formValues.availableOnStart,
        researcherID: researcherIDs[0], // researcher who added the entry
        template: formValues.template, // Handle  template
        bookmark: formValues.bookmark || false, // Handle optional bookmark
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
    navigate(`/edit-item/${parentID}/`); // Go back to parent

    // const newFauxID = await generateNewID();
    // setFormValue({
    //   ...defaultFormValue,
    //   fauxID: newFauxID,
    // });
    // setNewEntry(true);
    // console.log('FinishEdit called, new entry state:', isNewEntry);
  }

  const ListMediaEntriesLength =
    useLiveQuery(async () => {
      if (!itemID || itemID === 'new' || isNaN(Number(itemID))) {
        return [];
      }

      const entry = await db.subentries.get(Number(itemID));
      const mediaFiles = entry?.mediaSub || [];
      return mediaFiles;
    }, [itemID]) || [];

  async function removeCurrentEntry() {
    if (
      window.confirm(`Are you sure you want to delete "${formValues.title}"?`)
    ) {
      try {
        const id = Number(itemID);
        if (isNaN(id)) {
          setStatusMessage('Invalid ID: ' + itemID);
          return;
        }

        await db.subentries.delete(id);
        setStatusMessage(`Entry ${formValues.title} successfully deleted.`);
        navigate(`/edit-item/${parentID}/`); // Go back to parent
      } catch (error) {
        setStatusMessage(`Failed to delete ${formValues.title}: ${error}`);
      }
    }
  }

  //*    ---------------    HANDLERS  ------------------ */
  // Manage state and input field
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValues,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: {
    target: { name: any; checked: boolean };
  }) => {
    const { name, checked } = e.target;
    setFormValue({
      ...formValues,
      [name]: checked,
    });
  };

  //*    --------------------------    RETURN  ------------------------------- */

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
            {' '}
            {/*// ------ ID  ------*/}
            <div className="formLabel">ID:</div>
            {isNewEntry || isAdmin ? (
              <input
                className="form-control"
                type="text"
                name="fauxID"
                placeholder="ID"
                value={formValues.fauxID}
                onChange={handleIDChange}
              />
            ) : (
              <input
                className="form-control-disabled"
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
            {' '}
            {/*// ------ Category  ------*/}
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
            </select>{' '}
          </div>

          <div className="col">
            {' '}
            {/*// ------ Researcher  ------*/}
            <div className="formLabel">Researcher:</div>
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
            </select>
          </div>
        </div>

        <div className="row">
          {' '}
          {/*// ------ Description  ------*/}
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

        <div className="row">
          {' '}
          {/*// ------ Media Upload  ------*/}
          <MediaUploadSub mediaSubFiles={formValues.mediaSub} />
        </div>

        {isAdmin && (
          <div className="adminOnly">
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
                className="form-control form-control-dropdown col"
                type="text"
                placeholder="aeoh-3q484-da232"
                value={formValues.hexHash}
                onChange={handleChange}
                name="hexhash"
              />
            </div>

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

        <div className="save-buttons">
          {' '}
          {/*// ------ Save Buttons  ------*/}
          {isNewEntry ? (
            <>
              <Button
                className="btn-save-add-item"
                onClick={addSubEntry}
                disabled={!isFormValid}
              >
                Add
              </Button>
            </>
          ) : (
            <>
              <Button
                className="btn-save-add-item"
                onClick={updateSubEntry}
                disabled={!isFormValid}
              >
                Save
              </Button>
              <Button
                className="btn-save-add-item"
                onClick={addSubEntry}
                disabled={!isFormValid}
              >
                &laquo; Return
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
