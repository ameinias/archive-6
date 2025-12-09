import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Form} from "react-bootstrap";
// use import * as FormBits from '../main/components/Components/FormAssets';
import { GameLogic } from "@utils/gamelogic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "@utils/db"; // import the database

export function FormTextBox({
    label = "Label:",
    name = "textInput",
    formValue = "",
    readOnly = false,
    onChange = () => {},
    placeholder = ""
}) {

    return (
        <div className='row'>

            <div className="formLabel">{label}</div>
            <input
                name={name}
                placeholder={placeholder}
                value={formValue}
                onChange={onChange}
                className="form-control"
                readOnly={readOnly}/>
        </div>
    );
}

export function FormDate({
    label = "Label:",
    name = "textInput",
    formValue = "",
    readOnly = false,
    onChange = () => {},
    placeholder = ""
}) {

        const handleDateChange = (date) => {
        // Create a synthetic event object that matches what handleChange expects
        const syntheticEvent = {
            target: {
                name: name,
                value: date ? date.toISOString().split('T')[0] : '' // Format as YYYY-MM-DD
            }
        };
        onChange(syntheticEvent);
    };

    return (
        <div className='row'>

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
                className="form-control col"
                placeholder={placeholder}
                // value={formValue}
                onChange={handleDateChange}
                readOnly={readOnly}
                   dateFormat="yyyy-MM-dd"  // Show format
                showYearDropdown         // Allow year selection
                showMonthDropdown
                      
/>

        </div>
    );
}

export function FormBool() {
    return (
        <div>
            <input type="checkbox"/>
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
    options
}) {
    return (
        <div className='row'>
            {label && (<div className="formLabel">{label}</div>)}
            <select
                name={name}
                className="form-control form-control-dropdown col"
                multiple={multiple}
                value={formValue}
                onChange={onChange}
                disabled={readOnly}>
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
    options
}) {
    return (
        <div className='row'>
            {label && (<div className="formLabel">{label}</div>)}
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



