import React, {useState, useEffect} from 'react';
import {db, dbHelpers} from '@utils/db'; // import the database
import Button from 'react-bootstrap/Button';
import {categories, subCategories, researcherIDs, entryTemplate, hexHashes, editType} from '@utils/constants';
import {Form, useNavigate} from 'react-router-dom';
import {GameLogic} from '@utils/gamelogic';
import {ListSubEntries} from '@components/lists/ListSubEntries';
import {MediaUpload} from '@components/parts/Media/MediaUpload';
import * as FormAssets from '@components/parts/FormAssets';
import {eventManager} from '@utils/events';

const defaultFormValue = {
    fauxID: 'MX0000',
    title: 'Entry',
    description: '',
    category: 'Object',
    date: new Date(),
    entryDate: new Date(),
    available: true,
    researcherID: researcherIDs[0] || '',
    media: [],
    template: 'default',
    bookmark: false,
    hexHash: [1],
    devNotes: '',
    modEditDate: '2008-07-21',
    modEdit: 'added',
    displayDate: '1970-01-01', // YYYY-MM-DD
    lastEditedBy: researcherIDs[0] || '',
};


export function AddEntryForm({itemID, parentID, isSubEntry}) {
    const [formValues,
        setFormValue] = useState(defaultFormValue);

    const {setStatusMessage} = GameLogic();
    const [title,
        setName] = useState('');
    const navigate = useNavigate();
    const [status,
        setStatus] = useState('');
    let savedID = 0;
    const [isNewEntry,
        setNewEntry] = useState(false);
    const [isFormValid,
        setFormValid] = useState(true);
    const [isIDValid,
        setIDValid] = useState(true);

    const {isAdmin, toggleAdmin} = GameLogic();

    useEffect(() => {
        async function fetchData() {
            if (!itemID || itemID === 'new') {
                const newID = await generateNewID();
                setFormValue({
                    ...defaultFormValue,
                    fauxID: newID
                });
                setNewEntry(true);
                return;
            }

            const entry = await db
                .friends
                .get(Number(itemID));
            if (entry) {
                setFormValue({
                    fauxID: entry.fauxID || '',
                    title: entry.title || '',
                    hexHash: Array.isArray(entry.hexHash)
                        ? entry.hexHash // Keep the IDs as-is
                        : [entry.hexHash] || [1],
                    description: entry.description || '',
                    category: entry.category || 'Object',
                    date: entry.date || new Date(),
                    entryDate: entry.entryDate || new Date(),
                    available: entry.available || false,
                    media: entry.media || [],
                    template: entry.template || 'default',
                    bookmark: entry.bookmark || false,
                    devNotes: entry.devNotes || '',
                    modEditDate: entry.modEditDate || '1996-07-21',
                    modEdit: entry.modEdit,
                    displayDate: entry.displayDate ||'1970-01-01',
                    lastEditedBy: entry.lastEditedBy
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

    const FormToEntry = () => {
        return {
            title: formValues.title,
            fauxID: formValues.fauxID,
            hexHash: formValues.hexHash,
            description: formValues.description,
            category: formValues.category,
            date: formValues.date,
            entryDate: formValues.entryDate,
            available: formValues.available,
            media: formValues.media,
            template: formValues.template,
            bookmark: formValues.bookmark,
            devNotes: formValues.devNotes,
            modEditDate: formValues.modEditDate,
            modEdit: formValues.modEdit,
            displayDate: formValues.displayDate,
            lastEditedBy: formValues.lastEditedBy
        };
    }


    const generateNewID = async() => {
        try {
            const items = await db
                .friends
                .toArray();
            const existingIDs = items.map((item) => item.fauxID);
            const numericIDs = existingIDs.filter((id) => id.startsWith('MX')).map((id) => parseInt(id.replace('MX', ''))).filter((num) => !isNaN(num));

            const highestID = numericIDs.length > 0
                ? Math.max(...numericIDs)
                : 999;
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

            db
                .friends
                .update(idNumber, FormToEntry())
                .then(function (updated) {
                    if (updated)
                        setStatusMessage(idNumber + ' ' + formValues.fauxID + ' was updated with ' + formValues.media.length + ' attachments',);
                    else
                        setStatusMessage('Nothing was updated - no key:' + idNumber);
                    }
                );

            // setFormValue(defaultFormValue); navigate('/'); // <-- Go to Home
        } catch (error) {
            setStatusMessage(`Failed to edit ${title}  & ${formValues.title}: ${error}`,);
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

            const id = await db
                .friends
                .add(FormToEntry());

            setStatusMessage(`Entry ${title} successfully added. Saved attachments: ${formValues.media.length}`);

            navigate(`/edit-item/${id}`); // <-- Reset Page to show subitems
            // setFormValue(defaultFormValue);  // Reset to defaults
        } catch (error) {
            setStatusMessage(`Failed to add ${title}: ${error}`);
        }
    }

    async function removeCurrentEntry() {
        if (await eventManager.showConfirm(`Are you sure you want to delete "${formValues.title}"?`)) {
            try {
                const id = Number(itemID);
                if (isNaN(id)) {
                    setStatusMessage('Invalid ID: ' + itemID);
                    return;
                }

                await db
                    .friends
                    .delete(id);
                setStatusMessage(`Entry ${formValues.title} successfully deleted.`);
                navigate('/'); // Go back to home
            } catch (error) {
                setStatusMessage(`Failed to delete ${formValues.title}: ${error}`);
            }
        }
    }

    //*    ---------------    HANDLERS  ------------------ */ Checkbox handler
    const handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        setFormValue({
            ...formValues,
            [name]: checked
        });
    };

    // Manage state and input field
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValue({
            ...formValues,
            [name]: value
        });
    };

    const handleArrayChange = (e) => {
        const {name, options} = e.target;
        const selectedValues = Array
            .from(options)
            .filter(option => option.selected)
            .map(option => option.value);

        setFormValue({
            ...formValues,
            [name]: selectedValues
        });
    };

    // Manage state and input field
    const handleIDChange = (e) => {
        const {name, value} = e.target;
        // Ensure the ID starts with 'MX' and is followed by numbers
        if (!/^MX\d+$/.test(value)) {
            setIDValidWithMessage(false, `ID ${value} must start with "MX" followed by numbers.`,);
            return;
        }
        //check if the ID is unique
        db
            .friends
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
                    [name]: value
                });
            });
    };

    const setIDValidWithMessage = (isValid, message) => {
        setIDValid(isValid);
        setFormValid(isValid);
        if (message)
            setStatusMessage(message);
        if (!message && isValid)
            setStatusMessage(''); // Clear on success
        };

    const checkExistingID = async(id) => {
        const count = await db
            .friends
            .where('fauxID')
            .equals(id)
            .count();
        return count > 0;
    };

    //*    --------------------------    RETURN  ------------------------------- */
    return ( <> <div className="Single">
        {isNewEntry
            ? <h2>Add New Entry</h2>
            : <h2>Edit Entry</h2>}
        <p>
            {/* {status} {isFormValid ? 'Form is valid' : 'Form is invalid'} */}
        </p>
        <div className="row">


                <FormAssets.FormTextBox
                    label="Title:"
                    name="title"
                    formValue={formValues.title}
                    readOnly={false}
                    onChange={handleChange}/>

        </div>
        <div className="row">
           <div className="col">
            <div className="row">
                    <div className="formLabel">ID:</div>
                    {isNewEntry || isAdmin
                        ? (<input className={`form-control ${ !isIDValid
                            ? 'is-invalid'
                            : ''} col`} type="text" name="fauxID"
                            placeholder="ID"
                            value={formValues.fauxID}
                            onChange={handleIDChange}
                            // readOnly={!isNewEntry && !isAdmin}
                            />
                            )
                        : (<input
                            className="form-control col"
                            type="text"
                            name="fauxID"
                            placeholder="ID"
                            value={formValues.fauxID}
                            onChange={handleChange}/>)}
            </div>
            </div>

            <div className="col-6">

                <FormAssets.FormDropDown
                    name="category"
                    label="Type:"
                    multiple={false}
                    formValue={formValues.category}
                    readOnly={false}
                    onChange={handleChange}
                    options={categories.map((sub, i) => (
                    <option key={i} value={sub}>
                        {sub}
                    </option>
                ))}/>

            </div>

        </div>
        <div className="row">

            <div className="col">
                <FormAssets.FormDate
                    label="Last Modified"
                    name="modEditDate"
                    formValue={formValues.modEditDate}
                    onChange={handleChange}
                   />
            </div>
                        <div className="col">
                <FormAssets.FormDate
                    label="Collection Date"
                    name="displayDate"
                    formValue={formValues.displayDate}
                    onChange={handleChange}
                   />

            </div>
        </div>
        <div className="row">
<div className="col">
                <FormAssets.FormDropDown
                    label="Edit Type"
                    name="modEdit"
                    formValue={formValues.modEdit}
                    onChange={handleChange}
                    options={editType.map((sub, i) => (
                    <option key={i} value={sub}>
                        {sub}
                    </option>
                   ))}/>
            </div>
            <div className="col">
                      <FormAssets.FormDropDown
                     label="Last Edit By"
                    name="lastEditedBy"
                    formValue={formValues.lastEditedBy}
                    onChange={handleChange}
                    options={researcherIDs.map((sub, i) => (
                    <option key={i} value={sub.id}>
                        {sub.name}
                    </option>
                ))}/>


            </div>

        </div>
        <div className="row">
            {' '}
            {/*// ------ Description  ------*/}

            <textarea
                rows={4}
                className="form-control"
                name="description"
                placeholder="Description"
                value={formValues.description}
                onChange={handleChange}/>
        </div>

        <div className="row">
            {' '}
            {/*// ------ Media   ------*/}
            <MediaUpload mediaFiles={formValues.media}/>
        </div>

        {isAdmin && (
            <div className="row adminOnly">
            <div className="row">
                {' '}
                {/*// ------ available  ------*/}
                <label className="formLabel">available</label>
                <input
                    type="checkbox"
                    className="formLabel"
                    checked={formValues.available}
                    onChange={handleCheckboxChange}
                    name="available"/>
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
                    name="bookmark"/>
            </div>
                        <div className="col">
                {' '}

                <FormAssets.FormDropDown
                    name="hexHash"

                    multiple={true}
                    formValue={formValues.hexHash}
                    readOnly={false}
                    onChange={handleArrayChange}
                    options={hexHashes.map((sub, i) => (
                    <option key={i} value={sub.id}>
                        {sub.name}
                        ({sub.hexHashcode})
                    </option>
                ))}/>

            </div>
            {/* <div className="row">
                <div className="col-1 formLabel">hexhash:</div>
                <input
                    className="form-control col"
                    type="text"
                    placeholder="aeoh-3q484-da232"
                    value={formValues.hexHash}
                    onChange={handleChange}
                    name="hexHash"/>
            </div> */}
            <div className="row">
                {' '}
                {/*// ------ Description  ------*/}
                <div className="formLabel">Dev Notes:</div>
                <textarea
                    rows={3}
                    className="form-control"
                    name="devNotes"
                    value={formValues.devNotes}
                    onChange={handleChange}/>
            </div>

            {/*// ------ Template  ------*/}
            <div className="row">
                <div className="col-1 formLabel">Template:</div>
                <select
                    className="form-control form-control-dropdown col"
                    multiple={false}
                    value={formValues.template}
                    onChange={handleChange}
                    name="template">
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
        {!isSubEntry && itemID != 'new'
            ? (
                <div className="row">
                    {' '}
                    {/*// ------ subentries   ------*/}
                    <ListSubEntries itemID={itemID}/>
                </div>
            )
            : ( <>< />
        )}
        <div className="save-buttons">
            {' '}
            {/*// ------ Save Buttons  ------*/}
            {isNewEntry
                ? (
                    <Button
                        className="btn-save-add-item"
                        onClick={addEntry}
                        disabled={!isFormValid}>
                        Add
                    </Button>
                )
                : ( <> <Button
                    className="btn-save-add-item"
                    onClick={updateEntry}
                    disabled={!isFormValid}>
                    Save
                </Button> < Button className = "remove-button" onClick = {
                    removeCurrentEntry
                } > Remove </Button>
                sfsdf
            </>)}
        </div>
    </div> < />
  );
}
