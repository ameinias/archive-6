import React from 'react';
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button";
import {removeDataFromStorage, editDataInStorage} from "../renderer.js";

const List = ({itemsToTrack}) => {
  
  const removeItem = (item) => {
    removeDataFromStorage(item)
    console.log("Removing item: ", item)
  }

  // Not sure how to handle this on UI, doesn't work yet
  const editItem = (item) => {
    // add this back in to handle actually sending to the database,
    // for now, just repopulate the Single Item Page
    // editDataInStorage(item)
  }


  return (
    <div>
    <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Title</th>
      {/* <th>Amount</th>
      <th>Category</th>
      <th>Date</th> */}
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {itemsToTrack.map((item, i) => (
      <tr key={i + 1}>
        <td>{item.id}</td>
        <td>{item.title}</td>
        {/* <td>{item.amount}</td>
        <td>{item.category}</td>
        <td>{item.date}</td> */}
        <td>
                    <Button
            variant="outline-secondary"
            onClick={() => editDataInStorage(item.id)}
          >E</Button>
          <Button
            variant="outline-danger"
            onClick={() => removeItem(item.id)}
          >R</Button>

        </td>
      </tr>
    ))}
  </tbody>
</Table>
    </div>
  )
}

export default List;
