import React, { useState } from 'react';
import { db } from '../../utils/db'; // import the database
import { categories, subCategories } from '../../utils/constants.js';

export function AddFriendForm({ defaultCat } = { defaultCat: 'Object' }) {
  const [title, setName] = useState('');
  const [description, setDesc] = useState('');
   // const [formValues, setFormValue] = useState(defaultFormValue);
  const [status, setStatus] = useState('');
  // const [category, setCat] = useState<categories>(defaultCat as categories);
  const [thumbnail, setThumbnail] = useState(''); 
  const [subItems, setSubItems] = useState([]);
  const [date, setDate] = useState(new Date());

  const [entryDate, setEntryDate] = useState(new Date());


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

  async function addFriend() {
    try {
      // Add the new friend!
      const id = await db.friends.add({
        title,
        description,
        thumbnail, 
        category, 
        subItems, 
        date, 
        entryDate
      });

      setStatus(`Entry ${title} successfully added. Got id ${id}`);
      setName('');
      setCat(defaultCat as Category);
    } catch (error) {
      setStatus(`Failed to add ${title}: ${error}`);
    }
  }



  return (
    <>
      <p>{status}</p>
      Name:
      <input
        type="text"
        value={title}
        onChange={(ev) => setName(ev.target.value)}
      />
      Age:
      <input
        type="number"
        value={description}
        onChange={(ev) => setDesc(ev.target.value)}
      />
      {/* <input 
      type="select"
        value={catagory}
        onChange={(ev) => setCat(ev.target.value)} 
        /> */}
      <button onClick={addFriend}>Add</button>
    </>
  );
}