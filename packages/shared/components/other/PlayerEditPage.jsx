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
import { ListSubEntries } from "@components/lists/ListSubEntries";
import { MediaUpload } from "@components/parts/Media/MediaUpload";
import * as FormAssets from "@components/parts/FormAssets";
import { eventManager } from "@utils/events";
import { useToggle } from '@hooks/hooks'
import { UpdateFauxIDAndReorderSubs } from '@hooks/dbHooks'
import { useLiveQuery } from 'dexie-react-hooks';
import Webcam from "react-webcam";

// default variables - update as needed
const defaultFauxIDStart = "OS";
const defaultHex = 20;

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
  modEditDate: "2008-07-21",   // date modified in database
  modEdit: "added",
  displayDate: "1970-01-01", // date added to archive
  lastEditedBy: researcherIDs[0] || 0,
  triggerEvent: "",
};

export function PlayerAddEntryForm({ }) {
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

  // import functions
  const { setStatusMessage, isAdmin, toggleAdmin, globalUser } = GameLogic();
  const navigate = useNavigate();
 
  // const WebcamComponent = () => <Webcam />;

   const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
    },
    [webcamRef]
  );

  const videoConstraints = {
  width: 720,
  height: 650,
  // facingMode: "user"
};

  // other const
  let savedID = 0;

  //#endregion

  useEffect(() => {
    async function fetchData() {
      // if (!itemID || itemID === "new") {
        const newID = await generateNewID();
        setFormValue({
          ...defaultFormValue,
          fauxID: newID,
        });
        setNewEntry(true);
        return;
     // }

    //   const entry = await db.friends.get(Number(itemID));
    //   if (entry) {
    //     setFormValue({
    //       fauxID: entry.fauxID || "",
    //       title: entry.title || "",
    //       hexHash: Array.isArray(entry.hexHash)
    //         ? entry.hexHash // Keep the IDs as-is
    //         : [entry.hexHash] || [1],
    //       description: entry.description || "",
    //       category: entry.category || "Object",
    //       date: entry.date || new Date().toLocaleDateString(),
    //       available: entry.available || false,
    //       media: entry.media || [],
    //       template: entry.template || "default",
    //       bookmark: entry.bookmark || false,
    //       devNotes: entry.devNotes || "",
    //       modEditDate: entry.modEditDate || "1996-07-21",
    //       modEdit: entry.modEdit,
    //       displayDate: entry.displayDate || "1970-01-01",
    //       lastEditedBy: entry.lastEditedBy,
    //       triggerEvent: entry.triggerEvent,
    //     });
    //     savedID = entry.id;
    //     setNewEntry(false);
    //   } else {
    //     setFormValue(defaultFormValue);
    //     setNewEntry(true);
    //   }
    }

    fetchData();
  }, [dbKey]);

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
      category: "Object",
      date: new Date(), // real date i added things
      available: true,
      media: formValues.media,
      template: formValues.template,
      bookmark: false,
      devNotes: "player addition ",
      modEditDate: formValues.modEditDate,
      modEdit: globalUser.username,
      displayDate: formValues.displayDate,
      // lastEditedBy: parseInt(formValues.lastEditedBy, 10),
      // triggerEvent: formValues.triggerEvent,
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
          <div id="blink" className={` ${animate ? 'blink-save' : ''}`}></div>
        {isNewEntry ? <h2>Add New Entry</h2> : <h2>Edit Entry</h2>}


          {/* {status} {isFormValid ? 'Form is valid' : 'Form is invalid'} */}

        <div title ="entry title" className="row">
          <div className="col-2">
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

                    </div>
          <div className="col">
          <FormAssets.FormTextBox
            label=""
            name="title"
            formValue={formValues.title}
            readOnly={false}
            onChange={handleChange}
          />
        </div></div>

<div title="metadata">


          <div title=" Metadata">
            <div className="row">


              {/* <div className="col-6">
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
              </div> */}
            </div>
            <div className="row">
              {/* <div className="col" title="date item was modified / migrated">
                <FormAssets.FormDate
                  label="Last Modified"
                  name="modEditDate"
                  formValue={formValues.modEditDate.toString()}
                   onChange={handleChange}

                />
              </div> */}
              <div className="col" title=" Date written on log">
                <FormAssets.FormDate
                  label="Date:"
                  name="displayDate"
                  formValue={formValues.displayDate.toString()}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              {/* <div className="col">
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
                    <option key={i} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                />
              </div>*/}
            </div>
          </div>

</div>

        <div title="Description" className="row">
          {" "}
          {/*// ------ Description  ------*/}
          <textarea
            rows={4}
            className="form-control"
            name="description"
            placeholder="Description"
            value={formValues.description}
            onChange={handleChange}
          />
        </div>

        <div title="media" className="row">
          {" "}
          {/*// ------ Media   ------*/}
          {/* <MediaUpload mediaFiles={formValues.media} /> */}
              <>  
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
    </>
        </div>


{/* <div title="subentries" key={dbKey}>

        {!isSubEntry && itemID != "new" && (
          <div className="row">
            <ListSubEntries itemID={itemID} />
          </div>
        ) }
</div> */}
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
                {/* <button
                  className="btn-save-add-item btn-taller"
                  onClick={handleRenumberSubs}
                  disabled={!isFormValid}
                >
                  Update IDs
                </button>{" "}
                <button className="remove-button  btn-taller" onClick={removeCurrentEntry}>
                  Remove{" "}
                </button> */}
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
