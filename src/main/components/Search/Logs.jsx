import React, {useState, useEffect} from 'react';
import {db} from '../../utils/db'; // import the database
import {useLiveQuery} from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {AddSubEntryForm} from '../Admin/AddSubEntryFunc';
import {GameLogic} from '../../utils/gamelogic';

const Logs = () => {
    const [toggleShowNewSubEntry,
        setToggleShowNewSubEntry] = useState(false);

    const navigate = useNavigate();
    const gameLog = GameLogic();
      const [results, setResults] =  useState([]);
    
      const friends = useLiveQuery(() => db.friends.toArray());
      const subentries = useLiveQuery(() => db.subentries.toArray());

          const { globalUser } = GameLogic();
    const urlDirect = !gameLog.isAdmin
        ? 'entry'
        : 'edit-item';
    const urlSubDirect = 'edit-subitem'; // Same for both admin and non-admin




  useEffect(() => {
    generateLogs();
  }, [friends, subentries]);

  const generateLogs = () => {

    let tempItems = [];
    let nextID = 0;

      const foundItems = friends?.filter(
      (item) => item.available === true,
    );

    const foundSubItems = subentries?.filter(
      (item) => item.available === true,
    );

        // Add main entries
    if (foundItems) {
      for (const item of foundItems) {
        tempItems.push({
          id: nextID,
          fauxID: item.fauxID,
           origin: item.id,
          title: item.title,
          date: item.date,
          type: 'main',
        });
        nextID = nextID + 1;
      }
    }
    // Add subs
    if (foundSubItems) {
      for (const subItem of foundSubItems) {
        // Add the subitem to the results with its parentId
        tempItems.push({
          id: nextID, // Ensure id is included
          origin: subItem.id,
          parentId: subItem.parentId,
          fauxID: subItem.fauxID, // Ensure fauxID is included
          title: subItem.title, // Ensure title is included
          date: subItem.date, // Include date if available
          type: 'sub', // Mark as sub entry
        });
        nextID = nextID + 1;
      }
    }

    tempItems.sort((a, b) => {
      const dateA = a.modEditDate ? new Date(a.modEditDate) : new Date(0);
      const dateB = b.modEditDate ? new Date(b.modEditDate) : new Date(0);
      return dateB - dateA; // Sort descending
    });

    if (foundItems && foundItems.length > 0 || foundSubItems && foundSubItems.length > 0) {
      setResults(tempItems); // update state
    } else {
      setResults([]); // clear results if nothing found
    }
  };


const displayUserLink = () => {
    return (
        <>
        <Link to={`/user-profile`}>
            @{globalUser.username}
        </Link>
        </>
    );
};


    return (
            <>
      <h1>Logs</h1>

        <div className="subentry-add-list">

            {results.length === 0
                ? ( <> No results to show. < />

      ) : (
        <table className="searchResults">
          <tbody>
            {results.map((item) => (
              <tr key={item.id}>
                <td width="80%">
                 {item.type === 'sub' ? 
                 (

                 <>
                 {(!gameLog.isAdmin ?  (
                 <Link to={`/entry / $ {item.parentId} / `}>{item.fauxID} : {item.title}</Link>
                 )
                 :  (

                 <Link to={` / $ {urlSubDirect} / $ {item.parentId} / $ {item.origin}`}>{item.fauxID} : {item.title}</Link>)
                 )}

                </>
                 )
                 : (  // main entry
                 <>
                    <Link to={`/${urlDirect}/${item.origin}`}>
                            {item.fauxID} : {item.title}
                    </Link>
                </>
                 )}

                </td>
                <td>
                    {item.modEdit ? item.modEdit : <i>modified</i>}
                </td>

                <td>
                   {item.hexHash === 1 ? displayUserLink() : item.researcherID ? item.researcherID : "@unknown"}
                </td>
                <td>
                    {item.modEditDate ? item.modEditDate : "DD/MM/YY"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        </div>
            </>
    );
}
export default Logs;