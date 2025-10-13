import { useParams } from 'react-router-dom';
import { AddEntryForm } from '../Admin/EditEntryFunc';
import { AddSubEntryForm } from '../Admin/AddSubEntryFunc';
import { GameLogic } from '../../../../packages/shared/utils/gamelogic';

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
