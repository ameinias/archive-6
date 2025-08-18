import { useParams } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';
import { ShowStaticSingle } from './ShowStaticSingleFunc';
import { AddEntryForm } from '../Admin/EditEntryFunc';

const StaticSingle = () => {
  const { id } = useParams(); // get the id from the route
  const { isAdmin } = GameLogic();

  return (
    <>
      {id ? (
        <>
        {isAdmin ? ( <AddEntryForm itemID={id}/>) : ( <ShowStaticSingle itemID={id} />) }

        </>
      ) : (
        <div>No ID provided.</div>
      )}
    </>
  );
};

export default StaticSingle;
