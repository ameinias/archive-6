import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";


import { db } from '../utils/db'; // import the database

const { categories } = require("../../utils/constants.js");

const NewID = () => {
  // TODO: Calculate a new ID based on the existing items in storage
  // For now, just return a random number
  return "MX" + Math.floor(Math.random() * 10000);
};

const defaultFormValue = {
  id: NewID(),
  title: "",
  description: "",
  category: "Object",
};

const SingleItem = () => {
  const [show, toggleShow] = useState(false);
  const [formValues, setFormValue] = useState(defaultFormValue);
  const [date, setDate] = useState(new Date());

  // Manage state and input field
  const handleChange = (e) => {
    const updatedFormValues = {
      id: formValues.id,
      title: formValues.title,
      description: formValues.description,
      category: formValues.category,
      [e.target.name]: e.target.value,
    };
    setFormValue(updatedFormValues);
  };

  // Send the input to main
  const addExpense = (e, expenseToAdd) => {
    e.preventDefault();
    saveDataInStorage(expenseToAdd);
    setFormValue(defaultFormValue);
    toggleShow(show);
     NewID();
  };

  return (
    <div>
      <h1>Single Item</h1>

      <Form
        onSubmit={(e) =>
          addExpense(e, {
            id: formValues.id,
            title: formValues.title,
            description: formValues.description,
            category: formValues.category,
            date: date,
          })
        }
      >
        {/* <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control pattern="[0-9, '.']*" type="text" name="amount" onChange={handleChange} value={formValues.amount} placeholder="Enter Amount" />
          </InputGroup>  */}
        <Form.Group controlId="formID">
          <div className="row">
            <Form.Label>ID</Form.Label>
            {show ? (
              <div>
            <div className="col-3">
              <Form.Control
                type="text"
                name="ID"
                onChange={handleChange}
                value={formValues.id}
                placeholder="Enter ID"
              />
            </div>
            <div >
              <Button
                variant="outline-secondary"
                onClick={() => toggleShow(!show)}
              >
                🔓
              </Button>
            </div>
            </div>
            ):(
              <div>
            <div className="col-3">
              <Form.Control
                type="text"
                name="ID"
                onChange={handleChange}
                value={formValues.id}
                placeholder="Enter ID"
                readOnly
              />
              </div>
            <div >
              <Button
                variant="outline-secondary"
                onClick={() => toggleShow(!show)}
              >
                🔒
              </Button>
            </div>
            </div>
            )}
            <div className="col">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                onChange={handleChange}
                value={formValues.title}
                placeholder="Enter Title"
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group controlId="formCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="category"
            onChange={handleChange}
            value={formValues.category}
            placeholder="Category"
          >
            {categories.map((c, i) => (
              <option key={i}>{c}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            onChange={handleChange}
            value={formValues.description}
            placeholder="Enter Descriptionnn"
          />
        </Form.Group>
        <Button
          variant="outline-primary"
          type="submit"
          style={{ marginTop: "10px" }}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default SingleItem;
