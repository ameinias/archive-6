import { React, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@utils/db";
import { GameLogic } from "@utils/gamelogic";
import { researcherIDs } from "@utils/constants";
import * as FormAssets from "@components/parts/FormAssets";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function EditResearcher({ itemID, type }) {
  const gameLog = GameLogic();
  const [editingProp, setEditingProp] = useState(null);
  const [tempPropValue, setTempPropValue] = useState("");
  const { setStatusMessage } = GameLogic();

  const item = useLiveQuery(async () => {
    if (!itemID) return null;

    let result;
    if (type === "subentry") {
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
      if (type === "subentry") {
        await db.subentries.update(itemId, {
          researcherID: value,
        });
      } else {
        await db.friends.update(itemId, {
          researcherID: value,
        });
      }

      setEditingProp(null);
      setTempPropValue("");

      setStatusMessage(itemId + " updated successfully");
    } catch (error) {
      console.error("Error updating hex hash:", error);
      setStatusMessage("Error updating hex hash");
    }
  };

  const cancelEditing = () => {
    setEditingProp(null);
    setTempPropValue("");
  };

  return (
    <>
      {editingProp === item.id ? (
        <div
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
            width: "40px",
          }}
        >
          <select
            className="form-control form-control-dropdown"
            multiple={false}
            value={tempPropValue}
            onChange={(e) => {
              // setTempPropValue(e.target.value);
              saveEdit(item.id, e.target.value, type);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(item.id, type);
              if (e.key === "Escape") cancelEditing();
            }}
            name="researcherID"
            style={{ flex: 1, padding: "2px 5px", width: "120px" }}
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
            cursor: "pointer",
            padding: "5px",
            borderRadius: "3px",
            ":hover": { backgroundColor: "#f0f0f0" },
          }}
          title="Click to edit"
        >
          {item.researcherID !== null && item.researcherID !== undefined
            ? researcherIDs.find(
                (researcher) => researcher.id === parseInt(item.researcherID),
              )?.name || "Unknown"
            : "Unknown User"}
        </div>
      )}
    </>
  );
}

export function FormEditListDate({
  editing = false,
  type = "entry",
  item,
  onChange,
  options,
}) {
  const [editingValue, setEditingValue] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { setStatusMessage } = GameLogic();

  const startEditingDate = (item, type) => {
    // Convert current hexHash to string for editing
    const currentValue = item.displayDate || "1970-01-01";

    // don't know if I need to check entry/subentry yet these yet
    // if (type === "entry") {
    setTempValue(currentValue);
    setEditingValue(item.id);
    setIsEditing(true);

    console.log(editing, " start editing ", currentValue);
    // } else {
    //   setTempSubHexValue(currentValue);
    //   setEditingSubHex(item.id);
    // }
  };

  // try this https://js.devexpress.com/React/Demos/WidgetsGallery/Demo/DateBox/Overview/FluentBlueLight/
  const saveValue = async (itemId, type) => {
    try {
      if (type === "subentry") {
        await db.subentries.update(itemId, {
          displayDate: tempValue || null,
        });
      } else {
        await db.friends.update(itemId, {
          displayDate: tempValue || null,
        });
      }

      setEditingValue(null);
      setTempValue("");
      setIsEditing(false);
      //   }

      setStatusMessage(itemId + " date " + tempValue + "updated successfully");
    } catch (error) {
      console.error("Error updating date:", error);
      setStatusMessage("Error updating date");
    }
  };

  const cancelEditingValue = () => {
    setEditingValue(null);
    setTempValue("");
    setIsEditing(false);
  };

  // td on the outside
  return (
    <div>
      {isEditing ? (
        <div
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
            width: "40px",
          }}
        >
          <DatePicker
            selected={tempValue}
            onChange={(tempValue) => setTempValue(tempValue)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveValue(item.id, "entry");
              if (e.key === "Escape") cancelEditingValue();
            }}
          />
        </div>
      ) : (
        <div
          onClick={() => startEditingDate(item, type)}
          style={{
            cursor: "pointer",
            // backgroundColor: "#ae19c2ff",
            padding: "5px",
            borderRadius: "3px",
            ":hover": { backgroundColor: "#f0f0f0" },
          }}
          title="Click to edit"
        >
          {item.displayDate
            ? new Date(item.displayDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })
            : "No Date"}
        </div>
      )}
    </div>
  );
}


export function FormEditListText({
  editing = false,
  type = "entry",
  item,
  onChange,
  options,
}) {
  const [editingValue, setEditingValue] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { setStatusMessage } = GameLogic();

  const startEditingDate = (item, type) => {
    // Convert current hexHash to string for editing
    const currentValue = item.displayDate || "1970-01-01";

    // don't know if I need to check entry/subentry yet these yet
    // if (type === "entry") {
    setTempValue(currentValue);
    setEditingValue(item.id);
    setIsEditing(true);

    console.log(editing, " start editing ", currentValue);

  };

  // try this https://js.devexpress.com/React/Demos/WidgetsGallery/Demo/DateBox/Overview/FluentBlueLight/
  const saveValue = async (itemId, type) => {
    try {
      if (type === "subentry") {
        await db.subentries.update(itemId, {
          displayDate: tempValue || null,
        });
      } else {
        await db.friends.update(itemId, {
          displayDate: tempValue || null,
        });
      }

      setEditingValue(null);
      setTempValue("");
      setIsEditing(false);
      //   }

      setStatusMessage(itemId + " date " + tempValue + "updated successfully");
    } catch (error) {
      console.error("Error updating date:", error);
      setStatusMessage("Error updating date");
    }
  };

  const cancelEditingValue = () => {
    setEditingValue(null);
    setTempValue("");
    setIsEditing(false);
  };

  // td on the outside
  return (
    <div>
      {isEditing ? (
        <div
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
            width: "40px",
          }}
        >
          {/* <DatePicker
            selected={tempValue}
            onChange={(tempValue) => setTempValue(tempValue)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveValue(item.id, "entry");
              if (e.key === "Escape") cancelEditingValue();
            }}
          /> */}

           <input
                            type='text'
                            name='displayDate'
                            title='date'
                            value={tempValue}
                             onChange={(tempValue) => setTempValue(tempValue)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveValue(item.id, "entry");
              if (e.key === "Escape") cancelEditingValue();
            }}

                            placeholder='1970-01-01'
                            style={{
                              flex: 1,
                              padding: '2px 5px',
                              width: '140px'
                            }}
                            autoFocus
                          />
        </div>
      ) : (
        <div
          onClick={() => startEditingDate(item, type)}
          style={{
            cursor: "pointer",
            // backgroundColor: "#ae19c2ff",
            padding: "5px",
            borderRadius: "3px",
            ":hover": { backgroundColor: "#f0f0f0" },
          }}
          title="Click to edit"
        >
                        {item.displayDate
                        ? (typeof item.displayDate === 'string'
                            ? item.displayDate
                            : new Date(item.displayDate).toLocaleDateString())
                        : "unknown"}

        </div>
      )}
    </div>
  );
}
