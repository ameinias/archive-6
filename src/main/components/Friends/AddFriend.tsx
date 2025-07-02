import React, { useState } from 'react';
import { db } from '../../utils/db'; // import the database

export function AddFriendForm({ defaultCat } = { defaultCat: 'Object' }) {
  const [title, setName] = useState('');
  const [description, setDesc] = useState('');
    const [catagory, setCat] = useState(defaultCat);
  const [status, setStatus] = useState('');

  async function addFriend() {
    try {
      // Add the new friend!
      const id = await db.friends.add({
        title,
        description
      });

      setStatus(`Entry ${title} successfully added. Got id ${id}`);
      setName('');
      setCat(defaultCat);
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