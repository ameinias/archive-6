import React, { useState, useEffect } from "react";
import { eventManager } from "@utils/events";
import Button from "react-bootstrap/Button";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import Select from "react-select"; // https://react-select.com/home#getting-started
import VisNetworkReat from "@components/parts/VisNetworkReat"; //https://www.npmjs.com/package/react-graph-vis
import { SelectEntry } from "@components/parts/FormAssets";

export default function TestComp() {
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  // const navigate = useNavigate()
  const [val, setSelected] = React.useState([]);
  const [filterAvailable, setFilterAvailable] = React.useState(false);

  useEffect(() => {
    // so far nothing that needs rerendering - not sure how to pass this into the options list.
  }, [friends, subentries]);

  const filteredFriends = useLiveQuery(() => {
    if (!db.isOpen()) return [];
    //     if (!subentries) return [];
    // if (!friends) return [];

    let tempItems = [];
    let nextID = 0;

    let foundSubItems = subentries;
    let foundFriends = friends;

    if (filterAvailable) {
      foundSubItems = subentries.filter((item) => item.available === true);
      foundFriends = friends.filter((item) => item.available === true);
    }

    if (foundSubItems) {
      for (const item of foundSubItems) {
        tempItems.push({
          id: nextID,
          value: nextID,
          label: item.fauxID,
          origin: item.id,
          fauxID: item.fauxID,
          parentId: item.parentId,
          title: item.title,
          date: item.date,
          displayDate: item.displayDate,
          type: "sub",
          description: item.description,
          devNotes: item.devNotes,
          hexHash: item.hexHash,
          lastEditedBy: item.lastEditedBy,
          triggerEvent: item.triggerEvent,
          available: item.available,
        });
        nextID = nextID + 1;
      }
    }

    // Add main entries too
    if (foundFriends) {
      for (const item of foundFriends) {
        tempItems.push({
          id: nextID,
          value: nextID, 
          label: item.fauxID,
          origin: item.id,
          fauxID: item.fauxID,
          type: "entry",
          parentId: null,
          title: item.title,
          date: item.date,
          displayDate: item.displayDate,
          description: item.description,
          devNotes: item.devNotes,
          hexHash: item.hexHash,
          lastEditedBy: item.lastEditedBy,
          triggerEvent: item.triggerEvent,
          available: item.available,
        });
        nextID = nextID + 1;
      }
    }

    return tempItems;
  }, [filterAvailable, friends, subentries]);

  // const handleChange = (e) => {
  //   setSelected(e.target.value);
  // };

  // const handleArrayChange = (e) => {
  //   const { name, options } = e.target;
  //   if (!options) return;
  //   const selectedValues = Array.from(options)
  //     .filter((option) => option.selected)
  //     .map((option) => option.value);

  //   setSelected(selectedValues);
  // };

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = filteredFriends.filter((v) => v.isFixed);
        break;
    }
    console.log("change the value!!!");
    setSelected(newValue);
  };

  const changeBool = (e) => {
    const { name, checked } = e.target;
    setFilterAvailable(checked);
    console.log("filter: " + filterAvailable);
  };

  return (
    <div>
      <div>
        {" "}
        <input
          type="checkbox"
          value={filterAvailable}
          onChange={changeBool}
        />{" "}
        Available Only
      </div>
      {filterAvailable ? "true" : "false"}

      <SelectEntry
        value={val}
        onChange={onChange}
        filterAvailable={filterAvailable}
        name="ref"
        includeSubentries={false}
      />

      <div>
        Current:  
        {val.map((item, index) => (
          <div key={index}>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      {/* 
      <VisNetworkReat filterAvailable={filterAvailable} /> */}
    </div>
  );
}

export function FormSelectSearch({
  label,
  name,
  formValue,
  readOnly = false,
  onChange,
  options,
}) {
  return (
    <div className="row">
      {label && <div className="formLabel">{label}</div>}
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
