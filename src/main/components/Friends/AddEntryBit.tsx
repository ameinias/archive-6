import React, { useState, useEffect } from 'react';
import { db } from '../../utils/db'; // import the database
import { categories, subCategories } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

export function AddFriendForm({ itemID }: { itemID?: string }) {

  const [status, setStatus] = useState('');
  const [title, setName] = useState('');
  const navigate = useNavigate();

  const NewID = () => {
    // TODO: Calculate a new ID based on the existing items in storage
    // For now, just return a random number
    return 'MX' + Math.floor(Math.random() * 10000);
  };

  const defaultFormValue = {
    fauxID: NewID(),
    title: '',
    description: '',
    category: 'Object',
    subItems: [],
    date: new Date(),
    entryDate: new Date(),
  };

  // Initialize form values
    useEffect(() => {
    async function fetchData() {
      if(!itemID || itemID === 'new') {
        setFormValue(defaultFormValue);
        console.log('No Fetched entry, creating new');
        return;
      }

        const entry = await db.friends.get(Number(itemID));
        if (entry) {
           setFormValue({
    ...entry
  });
      console.log('Fetched entry:', entry.fauxID, " and ", formValues.fauxID);
      } else {
        setFormValue(defaultFormValue);
        console.log('No Fetched entry, creating new');
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemID]);



  const [formValues, setFormValue] = useState(defaultFormValue);



async function OverwriteEntry(id: number) {
    try { 


       } catch (error) {
      setStatus(`Failed to edit ${title}: ${error}`);
    }

  }

  // Add the entry to the database
  async function addEntry() {
    try {
      const id = await db.friends.add({
        title: formValues.title,
        fauxID: formValues.fauxID,
        hexHash: '',
        description: formValues.description,
        thumbnail: '',
        category: formValues.category,
        subItems: formValues.subItems,
        date: formValues.date,
        entryDate: formValues.entryDate,
      });

      setStatus(`Entry ${title} successfully added. Got id ${id}`);
      // setName('');
      // setCat(defaultCat);
      // navigate('/'); // <-- Go to Home
      setFormValue(defaultFormValue)
    } catch (error) {
      setStatus(`Failed to add ${title}: ${error}`);
    }

  }

  // Manage state and input field
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <>
      <div className="Single">
                  <p>{status}</p>
        <div className="row">

          <div className="col-3">
            ID:
            <input
              className="form-control"
              type="text"
              name="fauxID"
              placeholder="ID"
              value={formValues.fauxID}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            Title:
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="Title"
              value={formValues.title}
              onChange={handleChange}
            />
          </div>
        </div>
        Description:
        <input
          className="form-control"
          type="text"
          name="description"
          placeholder="Description"
          value={formValues.description}
          onChange={handleChange}
        />
Category: 
        <select
          className="form-control"
          multiple={false}
          value={formValues.category}
          onChange={handleChange}
          name="category"
        >
          {categories.map((sub, i) => (
            <option key={i} value={sub}>
              {sub}
            </option>
          ))}
        </select>
        <button className="outline-primary" onClick={addEntry}>Add</button>
      </div>
    </>
  );

}
