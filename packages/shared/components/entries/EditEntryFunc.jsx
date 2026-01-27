import React, { useState, useEffect } from "react";
import { db, dbHelpers } from "@utils/db"; // import the database
import Button from "react-bootstrap/Button";
import {
  categories,
  subCategories,
  researcherIDs,
  entryTemplate,
  hexHashes,
  editType,
} from "@utils/constants";
import { Form, useNavigate } from "react-router-dom";
import { GameLogic } from "@utils/gamelogic";
import { ListSubEntriesOnEntries } from "@components/lists/ListSubEntriesOnEntries";
import { MediaUpload } from "@components/parts/Media/MediaUpload";
import * as FormAssets from "@components/parts/FormAssets";
import { eventManager } from "@utils/events";
import { useToggle } from "@hooks/hooks";
import { UpdateFauxIDAndReorderSubs, GetMediaCount } from "@hooks/dbHooks";
import { useLiveQuery } from "dexie-react-hooks";
import { SelectEntry } from "@components/parts/FormAssets";
import { FilterList } from "@components/parts/ListingComponent";
import {
  MediaCountCell,
  SubentryCountCell,
  AvailableCell,
} from "@components/parts/Badges";

const isElectron = eventManager.isElectron;

// default variables - update as needed
let defaultFauxIDStart = "LT";
if(!isElectron){ defaultFauxIDStart = "LL"; }
const defaultHex = 30;

const defaultFormValue = {
  fauxID: "MX0000",
  title: "Entry",
  description: "",
  category: "Object",
  date: new Date(), // real date i added things
  available: true,
  media: [],
  template: "default",
  bookmark: false,
  hexHash: [defaultHex],
  devNotes: "",
  modEditDate: "2008-07-21", // date modified in database
  modEdit: "added",
  displayDate: "1970-01-01", // date added to archive
  lastEditedBy: researcherIDs[0] || 0,
  triggerEvent: "",
  unread: true,
  entryRef: [],
  newWebEntry: !isElectron,
  realEditDate: new Date(),
};

export function AddEntryForm({ itemID, parentID, isSubEntry }) {
  //#region ---------    HOOKS   -------- */
  const [formValues, setFormValue] = useState(defaultFormValue);
  const [title, setName] = useState("");
  const [status, setStatus] = useState("");
  const [isNewEntry, setNewEntry] = useState(false);
  const [isFormValid, setFormValid] = useState(true);
  const [isIDValid, setIDValid] = useState(true);
  const [dbKey, setDbKey] = useState(0);
  const [animate, setAnimate] = useState(false);

  const triggerAnimation = () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false); // Reset after animation
    }, 1000); // Match duration of the animation
  };

  // Custom hooks
  const [toggleMetaData, setToggleMetaData] = useToggle(false);
  const [toggleAdminSection, setToggleAdminSection] = useToggle(false);
  const [toggleEntryRef, setToggleEntryRef] = useToggle(false);
    const [toggleMedia, setToggleMedia] = useToggle(false);

  // import functions
  const { setStatusMessage, isAdmin, toggleAdmin, gameState, updateGameState } =
    GameLogic();
  const navigate = useNavigate();
  // const UpdateFauxIDAndReorderSubs = UpdateFauxIDAndReorderSubs(itemID, "MX000");

  // other const
  let savedID = 0;

  //#endregion

  useEffect(() => {
    async function fetchData() {
      console.log("Entry Func: " + itemID);
      if (!itemID || itemID === "new") {
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
          fauxID: entry.fauxID || "",
          title: entry.title || "",
          hexHash: Array.isArray(entry.hexHash)
            ? entry.hexHash // Keep the IDs as-is
            : [entry.hexHash] || [1],
          description: entry.description || "",
          category: entry.category || "Object",
          date: entry.date || new Date().toLocaleDateString(),
          available: entry.available || false,
          media: entry.media || [],
          template: entry.template || "default",
          bookmark: entry.bookmark || false,
          devNotes: entry.devNotes || "",
          modEditDate: entry.modEditDate || "1996-07-21",
          modEdit: entry.modEdit,
          displayDate: entry.displayDate || "1970-01-01",
          lastEditedBy: entry.lastEditedBy,
          triggerEvent: entry.triggerEvent,
          unread: entry.unread || true,
          entryRef: entry.entryRef || [],
          newWebEntry: entry.newWebEntry || false,
          realEditDate: entry.realEditDate || new Date().toLocaleDateString(),
        });
        savedID = entry.id;
        setNewEntry(false);
      } else {
        setFormValue(defaultFormValue);
        setNewEntry(true);
      }
    }

    fetchData();
  }, [itemID, dbKey]);

  //#region ---------------    CREATE ENTRY  ------------- */
  const FormToEntry = () => {
    let hexHashValue = formValues.hexHash;

    // convert array of strings to numbers
    if (Array.isArray(hexHashValue)) {
      hexHashValue = hexHashValue
        .map((h) => parseInt(h, 10))
        .filter((n) => !isNaN(n));

      // save int as itself
      if (hexHashValue.length === 1) {
        hexHashValue = hexHashValue[0];
      }
    } else if (typeof hexHashValue === "string") {
      hexHashValue = parseInt(hexHashValue, 10);
    }
    //toLocaleDateString()
    return {
      title: formValues.title,
      fauxID: formValues.fauxID,
      hexHash: hexHashValue,
      description: formValues.description,
      category: formValues.category,
      date: formValues.date,
      available: formValues.available,
      media: formValues.media,
      template: formValues.template,
      bookmark: formValues.bookmark,
      devNotes: formValues.devNotes,
      modEditDate: formValues.modEditDate,
      modEdit: formValues.modEdit,
      displayDate: formValues.displayDate,
      lastEditedBy: parseInt(formValues.lastEditedBy, 10),
      triggerEvent: formValues.triggerEvent,
      unread: formValues.unread,
      entryRef: formValues.entryRef,
      newWebEntry: formValues.newWebEntry,
    };
  };

  const calculateMatches = () => {
    return hexHashes.map((sub, i) => (
      <option key={i} value={sub.id}>
        {sub.name}({sub.hexHashcode})
      </option>
    ));
  };

  const FormToTemplate = () => {
    let hexHashValue = formValues.hexHash;

    // convert array of strings to numbers
    if (Array.isArray(hexHashValue)) {
      hexHashValue = hexHashValue
        .map((h) => parseInt(h, 10))
        .filter((n) => !isNaN(n));

      // save int as itself
      if (hexHashValue.length === 1) {
        hexHashValue = hexHashValue[0];
      }
    } else if (typeof hexHashValue === "string") {
      hexHashValue = parseInt(hexHashValue, 10);
    }

    return {
      id: 0,
      title: "Template",
      fauxID: "MX0000",
      hexHash: hexHashValue,
      description: "",
      category: formValues.category,
      date: formValues.date,
      available: false,
      media: [],
      template: formValues.template,
      bookmark: false,
      devNotes: formValues.devNotes,
      modEditDate: formValues.modEditDate,
      modEdit: formValues.modEdit,
      displayDate: formValues.displayDate,
      lastEditedBy: formValues.lastEditedBy,
      triggerEvent: formValues.triggerEvent,
      unread: formValues.unread,
      entryRef: formValues.entryRef,
      newWebEntry: formValues.newWebEntry,
    };
  };

  const generateNewID = async () => {
    try {
      const items = await db.friends.toArray();
      const existingIDs = items.map((item) => item.fauxID);
      const numericIDs = existingIDs
        .filter((id) => id.startsWith(defaultFauxIDStart))
        .map((id) => parseInt(id.replace(defaultFauxIDStart, "")))
        .filter((num) => !isNaN(num));

      const highestID = numericIDs.length > 0 ? Math.max(...numericIDs) : 999;
      let newID = Math.max(highestID + 1, 1000);

      while (existingIDs.includes(defaultFauxIDStart + newID)) {
        newID++;
      }

      setStatusMessage(`Generated new ID: ${defaultFauxIDStart}${newID}`);
      return defaultFauxIDStart + newID;
    } catch (error) {
      console.error("Error generating ID:", error);
      const randomID = Math.floor(Math.random() * 9000) + 1000;
      return defaultFauxIDStart + randomID;
    }
  };

  //#endregion

  //#region   -------   ADD EDIT ENTRY FUNCTIONS  ---------- */

  async function updateEntry() {
    try {
      const title = formValues.title || "Untitled";
      if (!title) {
        setStatusMessage("Title is required");
        return;
      }

      // if fauxID has changed
      // find subentries with parent ID
      // update child title

      let idNumber = Number(itemID);
      if (isNaN(idNumber)) {
        setStatusMessage(savedID + "is not a number");
        return;
      }

      db.friends.update(idNumber, FormToEntry()).then(function (updated) {
        if (updated)
          setStatusMessage(
            idNumber +
              " " +
              formValues.fauxID +
              " was updated with " +
              formValues.media.length +
              " attachments",
          );
        else setStatusMessage("Nothing was updated - no key:" + idNumber);
      });

      loadConfirmEffect();

      // setFormValue(defaultFormValue); navigate('/'); // <-- Go to Home
    } catch (error) {
      setStatusMessage(
        `Failed to edit ${title}  & ${formValues.title}: ${error}`,
      );
      return;
    }
  }


  async function duplicateCurrentEntry() {

    try {
      const title = formValues.title || "Untitled";
      if (!title) {
        setStatusMessage("Title is required");
        return;
      }

      const nid = await db.friends.add(FormToEntry());
       const newID = await generateNewID(); 

        await  db.friends.update(Number(nid), {
      devNotes: "Dupe of " + itemID + " code ##" + formValues.fauxID,
      fauxID: newID,
      hexHash: [defaultHex],
    });

    console.log(nid.devNotes + nid.title)


      setStatusMessage(
        `Entry ${title} successfully duplicated. Saved attachments: ${formValues.media.length}`,
      );
      loadConfirmEffect();
      navigate(`/entry/${nid}`); // <-- Reset Page to show subitems
      // setFormValue(defaultFormValue);  // Reset to defaults
    } catch (error) {
      setStatusMessage(`Failed to add ${title}: ${error}`);
    }
  }


  // Add the entry to the database
  async function addEntry() {
    try {
      const title = formValues.title || "Untitled";
      if (!title) {
        setStatusMessage("Title is required");
        return;
      }

      const id = await db.friends.add(FormToEntry());

      setStatusMessage(
        `Entry ${title} successfully added. Saved attachments: ${formValues.media.length}`,
      );
      loadConfirmEffect();
      navigate(`/entry/${id}`); // <-- Reset Page to show subitems
      // setFormValue(defaultFormValue);  // Reset to defaults
    } catch (error) {
      setStatusMessage(`Failed to add ${title}: ${error}`);
    }
  }

  async function loadConfirmEffect() {
    // Do something that makes it clear the item is saved
    triggerAnimation();
  }

  const handleFilterChange = (filter) => {
    updateGameState("activeFilter", filter);
    console.log("Update filter: " + filter);
  };

  const handleRenumberSubs = async () => {
    console.log("🔵 Calling UpdateFauxIDAndReorderSubs with:", {
      itemID,
      fauxID: formValues.fauxID,
    });

    const success = await UpdateFauxIDAndReorderSubs(itemID, formValues.fauxID);
    // update sub list
    setDbKey((prev) => prev + 1);
  };

  async function removeCurrentEntry() {
    if (
      await eventManager.showConfirm(
        `Are you sure you want to delete "${formValues.title}"?`,
      )
    ) {
      try {
        const id = Number(itemID);
        if (isNaN(id)) {
          setStatusMessage("Invalid ID: " + itemID);
          return;
        }

        await db.friends.delete(id);
        setStatusMessage(`Entry ${formValues.title} successfully deleted.`);
        navigate("/"); // Go back to home
      } catch (error) {
        setStatusMessage(`Failed to delete ${formValues.title}: ${error}`);
      }
    }
  }

  //#endregion

  //#region ---------------    HANDLERS  ------------------ */
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

  const handleArrayChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFormValue({
      ...formValues,
      [name]: selectedValues,
    });
  };

  const handleRef = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        break;
    }

    // setSelected(newValue);

    setFormValue({
      ...formValues,
      entryRef: newValue,
    });
  };

  // Manage state and input field
  const handleIDChange = (e) => {
    const { name, value } = e.target;
    // Ensure the ID starts with 'MX' and is followed by numbers
    // if (!/^MX\d+$/.test(value)) {
    //   setIDValidWithMessage(
    //     false,
    //     `ID ${value} must start with "MX" followed by numbers.`,
    //   );
    //   return;
    // }
    //check if the ID is unique
    db.friends
      .where("fauxID")
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
    if (!message && isValid) setStatusMessage(""); // Clear on success
  };

  const checkExistingID = async (id) => {
    const count = await db.friends.where("fauxID").equals(id).count();
    return count > 0;
  };

  //#endregion

  //*    ----------------    RETURN  -------------- */
  return (
    <div className="Single">
      <div id="blink" className={` ${animate ? "blink-save" : ""}`}></div>
      {isNewEntry ? <h2>Add New Entry</h2> : <h2>Edit Entry - {itemID}</h2>}
      {/* {status} {isFormValid ? 'Form is valid' : 'Form is invalid'} */}
      <div title="entry title" className="row">
        <FormAssets.FormTextBox
          label=""
          name="title"
          formValue={formValues.title}
          readOnly={false}
          onChange={handleChange}
        />
      </div>
      <div >
        <div className="button-row div-dash">
          <button onClick={setToggleMetaData} className="toggle-button ">
            Metadata
          </button>
        </div>

        {toggleMetaData && (
          <div >
            <div className="row">
              <div className="col">
                <div className="row">
                  <div className="formLabel">ID:</div>
                  {isNewEntry || isAdmin ? (
                    <input
                      className={`form-control ${
                        !isIDValid ? "is-invalid" : ""
                      } col`}
                      type="text"
                      name="fauxID"
                      placeholder="ID"
                      value={formValues.fauxID}
                      onChange={handleIDChange}
                      // readOnly={!isNewEntry && !isAdmin}
                    />
                  ) : (
                    <input
                      className="form-control col"
                      type="text"
                      name="fauxID"
                      placeholder="ID"
                      value={formValues.fauxID}
                      onChange={handleChange}
                    />
                  )}
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
                  ))}
                />
              </div>
            </div>
            <div className="row">
              <div className="col" title="date item was modified / migrated">
                <FormAssets.FormDate
                  label="Last Modified"
                  name="modEditDate"
                  formValue={formValues.modEditDate.toString()}
                  onChange={handleChange}
                />
              </div>
              <div className="col" title=" Date written on log">
                <FormAssets.FormTextBox
                  label="Date written on log"
                  name="displayDate"
                  formValue={formValues.displayDate.toString()}
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
                  ))}
                />
              </div>
              <div className="col"> 
                <FormAssets.FormDropDown
                  label="Last Edit By"
                  name="lastEditedBy"
                  formValue={formValues.lastEditedBy}
                  onChange={handleChange}
                  options={researcherIDs.map((sub, i) => (
                    <option key={i} value={sub.id} title={sub.note}>
                      {sub.devName}
                    </option>
                  ))}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="row">
        {" "}
        {/*// ------ Description  ------*/}
        {/* <textarea
          rows={4}
          className="form-control"
          name="description"
          placeholder="Description"
          value={formValues.description}
          onChange={handleChange}
        /> */}

        <FormAssets.DescriptionBox
         value={formValues.description}
          onChange={handleChange}
          />
              {/* <Editor
        ref={quillRef}
        readOnly={readOnly}
        defaultValue={new Delta()
          .insert('Hello')
          .insert('\n', { header: 1 })}
        onSelectionChange={setRange}
        onTextChange={setLastChange}
      /> */}
      </div>

            <div className="button-row div-dash">
        <button onClick={setToggleMedia} className="toggle-button">
          {" "}
          Media {GetMediaCount(itemID, "entry")}
        </button>
      </div>

      {toggleMedia && (
      <div title="media" className="row">
        {" "}
        {/*// ------ Media   ------*/}
        <MediaUpload mediaFiles={formValues.media} />
      </div>
        )}

      <div className="button-row div-dash">
        <button onClick={setToggleEntryRef} className="toggle-button">
          {" "}
          Related Entry
        </button>
      </div>

      {toggleEntryRef && (
        <div id="entryRef" className="row">
          <FilterList
            type="entry"
            onFilterChange={handleFilterChange}
            activeFilter={gameState?.activeFilter}
          />

          <SelectEntry
            value={formValues.entryRef}
            onChange={handleRef}
            filterAvailable={false}
            name="ref"
            includeSubentries={true}
            label="related entries"
            displayTrueID="true"
          />
        </div>
      )}

      <div title="admin">
        <div className="button-row div-dash">
          <button onClick={setToggleAdminSection} className="toggle-button">
            {" "}
            Admin {formValues.triggerEvent != "" && formValues.triggerEvent != null && (
                        <a title={formValues.triggerEvent}>⚡|</a>
                      )} {formValues.hexHash
                            ? Array.isArray(formValues.hexHash)
                              ? formValues.hexHash.join(", ")
                              : formValues.hexHash.toString()
                            : ""}
          </button>
        </div>

        {toggleAdminSection && (
          <div className="row adminOnly">
            <div className="row">
              <div className="col">
                {" "}
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

              <div className="col">
                {" "}
                {/*// ------ available  ------*/}
                <label className="formLabel">unread</label>
                <input
                  type="checkbox"
                  className="formLabel"
                  checked={formValues.unread}
                  onChange={handleCheckboxChange}
                  name="unread"
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
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
              <div className="col">
                <label className="formLabel">newWebEntry</label>
                <input
                  type="checkbox"
                  className="formLabel"
                  checked={formValues.newWebEntry}
                  onChange={handleCheckboxChange}
                  name="newWebEntry"
                />
              </div>
            </div>
            <div className="col">
              {" "}
              <FormAssets.FormHexes
                name="hexHash"
                multiple={true}
                rows={3}
                formValue={formValues.hexHash}
                readOnly={false}
                onChange={handleArrayChange}
                options={hexHashes.map((sub, i) => (
                  <option key={i} value={sub.id}>
                    {sub.name}({sub.hexHashcode})
                  </option>
                ))}
              />
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
              {" "}
              {/*// ------ Description  ------*/}
              <div className="formLabel">Dev Notes:</div>
              <textarea
                rows={3}
                className="form-control"
                name="devNotes"
                value={formValues.devNotes}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="formLabel">Triggers:</div>
              <span className="instruct-span">
                Comma seperated strings. value-function format. consolelog: to print to in-game console.
              </span>
              <textarea
                rows={3}
                className="form-control"
                name="triggerEvent"
                value={formValues.triggerEvent}
                onChange={handleChange}
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
              </select>{" "}
            </div>
          </div>
        ) }
      </div>
      <div title="subentries" key={dbKey}>
        {/* Only show Add Subentry button when not already a subentry. */}
        {!isSubEntry && itemID != "new" && (
          <div className="row">
            <ListSubEntriesOnEntries itemID={itemID} />
          </div>
        )}
      </div>
      <div className="save-buttons">
        {" "}
        {/*// ------ Save Buttons  ------*/}
        {isNewEntry ? (
          <button
            className="btn-save-add-item"
            onClick={addEntry}
            disabled={!isFormValid}
          >
            Add
          </button>
        ) : (
          <>
            {" "}
            <div className="button-row">
              {" "}
              <button
                className="btn-save-add-item btn-taller"
                onClick={updateEntry}
                disabled={!isFormValid}
              >
                Save
              </button>{" "}
              <button
                className="btn-save-add-item btn-taller"
                onClick={handleRenumberSubs}
                disabled={!isFormValid}
              >
                Update IDs
              </button>{" "}
              <button
                className="remove-button  btn-taller"
                onClick={removeCurrentEntry}
              >
                Remove{" "}
              </button>
                            <button
                className="btn-save-add-item  btn-taller"
                onClick={duplicateCurrentEntry}
              >
                Duplicate Entry{" "}
              </button>
            </div>
          </>
        )}
        {/* gave up on this feature for now */}
        {/* <div className="save-buttons">
              <Button className="" onClick={saveToTemplate}>
                Save to Template{" "}
              </Button>

               <Button className="" onClick={updateFromTemplate}>
                Update From Template{" "}
              </Button>

              </div> */}
      </div>
    </div>
  );
}
