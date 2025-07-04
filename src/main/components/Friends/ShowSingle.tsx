import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const ShowSingle = () => {
  const { id } = useParams(); // get the id from the route
  const item = useLiveQuery(() => db.friends.get(Number(id)), [id]);
  const navigate = useNavigate();

  if (!item) return <div>Loading...</div>;

  const removeItem = (item: any) => {
    db.friends.delete(item.id);
    navigate('/'); // <-- Go to Home
    console.log('Removing item: ', item.title);
  };

    const editItem = (item: any) => {
    // db.friends.delete(item.id);
      navigate(`/edit-item/${item.id}`);

    console.log('Edit item: ', item.id);
  };

  return (
    <div className="List">
      <table>
        <tbody>
        <tr key={item.id}>
          <div>
            {' '}
            <h2>
              {item.fauxID} : {item.title}
            </h2>
          </div>
          <div>
            <b>Category:</b> {item.category}{' '}
          </div>
          <div>
            <b>Description:</b> <br />
            {item.description}{' '}
            <hr />
            <br />
            <b>Thumbnail:</b> <br />
          </div>{' '}
          <div>
            <span>
              <b>Actual Entry Date:</b>{' '}
              {item.date
                ? new Date(item.date).toLocaleString()
                : 'No date'}{' '}
            </span>{' '}
          </div>{' '}
          <div>
            <span>
              {' '}
              <b>Fictional date:</b>
              {item.entryDate
                ? new Date(item.entryDate).toLocaleString()
                : 'No entry date'}
            </span>
          </div>
        </tr>
        <tr>
          {' '}
          <Button variant="outline-danger" onClick={() => removeItem(item)}>
            R
          </Button>
          <Button variant="outline-warning" onClick={() => editItem(item)}>
            E
          </Button>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ShowSingle;
