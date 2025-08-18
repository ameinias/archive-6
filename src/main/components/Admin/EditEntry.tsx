import { useParams } from 'react-router-dom';
import { AddEntryForm } from './EditEntryFunc';
import { AddSubEntryForm } from './AddSubEntryFunc';
import { GameLogic } from '../../utils/gamelogic';

const EditEntry = () => {
  const { id } = useParams(); // get the id from the route
  const { isAdmin } = GameLogic();

  return (
    <>
      {id ? (
        <>
            <AddEntryForm itemID={id} />
        </>
      ) : (
        <div>No ID provided.</div>
      )}
    </>
  );
};

export default EditEntry;
