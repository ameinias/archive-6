import React from 'react';

// use import * as FormBits from '../main/components/Components/FormAssets';

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

    return (
        <div className='row'>

            <div className="formLabel">{label}</div>
            <input
                name={name}
                className="form-control col"
                type="date"
                placeholder={placeholder}
                value={formValue}
                onChange={onChange}
                readOnly={readOnly}/>
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
