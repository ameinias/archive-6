import React, { useState, useEffect } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AddSubEntryForm } from '../Admin/AddSubEntryFunc';

export function SearchResults({ results }: { results: any[] }) {
  const [toggleShowNewSubEntry, setToggleShowNewSubEntry] = useState(false);
  const navigate = useNavigate();



  return (
    <div className="subentry-add-list">
        <table>
          <tbody>
            {results.map((item) => (
              <tr key={item.id}>
                <td width="80%">
                 {item.id} <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                    {item.fauxID} : {item.title}
                  </Link>
                </td>
                <td>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
     
    </div>
  );
}


