import { useParams } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';
import { StaticSingleDefault } from '../Templates/StaticSingleFunc-Default';
import { StaticSingleMess } from '../Templates/StaticSingleFunc-Mess';
import { AddEntryForm } from '../Admin/EditEntryFunc';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';

const StaticSingle = () => {
  const { id } = useParams(); // get the id from the route
  const { isAdmin } = GameLogic();


  const CheckConditionals = () => {
    if (!entryData) {
      return <div>No valid ID provided.</div>;
    }

    if (entryData.template === 'messed up') {
      return  <StaticSingleMess itemID={id} />;
    } else {
      return <StaticSingleDefault itemID={id} />;
    }
  };

   const entryData = useLiveQuery(() => {
     const numericID = Number(id);
     if (!id || isNaN(numericID) || numericID <= 0) {
       return null;
     }
     return db.friends.get(numericID);
   }, [id]);

  return (
    <>
      {id ? (
        <>
        {isAdmin ? ( <AddEntryForm itemID={id}/>) : ( <>

          {/* <StaticSingleDefault itemID={id} /> */}

          {CheckConditionals()}
        </>)
          }
        </>
      ) : (
        <div>No ID provided.</div>
      )}
    </>
  );
};

export default StaticSingle;
