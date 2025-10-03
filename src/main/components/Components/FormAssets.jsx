import React from 'react';

// use import * as FormBits from '../main/components/Components/FormAssets';

export function FormTextBox({label, name, formValue, readOnly, onChange}) {

    return (
        <div className='row'>

            <div className="formLabel">{label}</div>
            <input
                name={name}
                className="form-control col"
                type="text"
                placeholder="Title"
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
    multiple,
    formValue,
    readOnly,
    onChange,
    options
}) {
    return (
        <div className='row'>
            <div className="formLabel">{label}</div>
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
