import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Form } from "react-bootstrap";
// use import * as FormBits from '../main/components/Components/FormAssets';
import { GameLogic } from "@utils/gamelogic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db, dbHelpers } from "@utils/db";
import { useLiveQuery } from "dexie-react-hooks";
import Select from "react-select"; // https://react-select.com/home#getting-started
import { applyHexFilter } from "@components/parts/ListingComponent";

import Quill from 'quill';
// Or if you only need the core build
// import Quill from 'quill/core';

import { Delta } from 'quill';
// Or if you only need the core build
// import { Delta } from 'quill/core';
// Or const Delta = Quill.import('delta');

import Link from 'quill/formats/link';
// Or const Link = Quill.import('formats/link');



export function FormTextBox({
  label = "Label:",
  name = "textInput",
  formValue = "",
  readOnly = false,
  disabled = false,
  onChange = () => {},
  placeholder = "",
  className = "form-control",
}) {
  return (
    <div className="row">
      <div className="formLabel">{label}</div>
      <input
        name={name}
        placeholder={placeholder}
        value={formValue}
        onChange={onChange}
        className={className}
        readOnly={readOnly}
        disabled={disabled}
      />
    </div>
  );
}

export function FormDate({
  label = "Label:",
  name = "textInput",
  formValue = "",
  readOnly = false,
  onChange = () => {},
  placeholder = "",
  className = "form-control",
}) {
  const handleDateChange = (date) => {
    // Create a synthetic event object that matches what handleChange expects
    const syntheticEvent = {
      target: {
        name: name,
        value: date ? date.toISOString().split("T")[0] : "", // Format as YYYY-MM-DD
      },
    };
    onChange(syntheticEvent);
  };

  return (
    <div className="row">
      <div className="formLabel">{label}</div>
      {/* <input
                name={name}
                className="form-control col"
                type="date"
                placeholder={placeholder}
                value={formValue}
                onChange={onChange}
                readOnly={readOnly}
                /> */}

      <DatePicker
        selected={formValue ? new Date(formValue) : null}
        name={name}
        className={className}
        placeholder={placeholder}
        // value={formValue}
        onChange={handleDateChange}
        readOnly={readOnly}
        dateFormat="yyyy-MM-dd" // Show format
        showYearDropdown // Allow year selection
        showMonthDropdown
      />
    </div>
  );
}

export function FormBool() {
  return (
    <div>
      <input type="checkbox" />
    </div>
  );
}

export function FormDropDown({
  label,
  name,
  multiple = false,
  formValue,
  readOnly = false,
  onChange,
  options,
  className = "form-control form-control-dropdown col",
}) {
  return (
    <div className="row">
      {label && <div className="formLabel">{label}</div>}
      <select
        name={name}
        className={className}
        multiple={multiple}
        value={formValue}
        onChange={onChange}
        disabled={readOnly}
      >
        {options}
      </select>
    </div>
  );
}

export function FormHexes({
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

export function SelectEntry({
  label,
  name,
  value,
  options,
  onChange,
  filterAvailable = true,
  filterGameState = false,
  includeSubentries = true,
  displayTrueID = true,
}) {
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  // const navigate = useNavigate()
  const [val, setSelected] = React.useState([]);
    const {  gameState } =
    GameLogic();

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


    if (includeSubentries) {
      if (foundSubItems) {
        for (const item of foundSubItems) {
          let theTitle;
          if (displayTrueID) {
            theTitle = item.id + " - " + dbHelpers.generateTitle(item);
          } else {
            theTitle = dbHelpers.generateTitle(item);
          }

          tempItems.push({
            id: nextID,
            value: nextID, 
            label: theTitle,
            originId: item.id,
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
    }

    // Add main entries too
    if (foundFriends) {
      for (const item of foundFriends) {
        let theTitle;
        if (displayTrueID) {
          theTitle = item.id + " " + dbHelpers.generateTitle(item);
        } else {
          theTitle = dbHelpers.generateTitle(item);
        }

        tempItems.push({
          id: nextID,
          value: nextID, 
          label: theTitle,
          originId: item.id,
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

    let tempItemsFilter = applyHexFilter(tempItems, gameState?.activeFilter);


    return tempItemsFilter;
  }, [filterAvailable, friends, subentries,gameState?.activeFilter]);

  const onRelatedChange = (newValue, actionMeta) => {
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

    setSelected(newValue);
    console.log("change the   value!!!");
  };

  return (
    <div className="row">
      <Select
        options={filteredFriends}
        className="basic-multi-select"
        classNamePrefix="select"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isSelected ? "grey" : "blue",
          }),
        }}
        value={value}
        onChange={onChange || onRelatedChange}
        isMulti
        name={name}
        isClearable={true}
        placeholder={label}
      />
    </div>
  );
}


export function DescriptionBox({
            value = "",
          onChange = () => {},

}){

  return(
            <textarea
          rows={4}
          className="form-control"
          name="description"
          placeholder="Description"
          value={value}
          onChange={onChange}
        />

  );
}