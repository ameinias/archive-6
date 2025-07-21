import { useParams } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';
import { ShowStaticSingle } from './ShowStaticSingleFunc';

const StaticSingle = () => {
  const { id } = useParams(); // get the id from the route
  const { isAdmin } = GameLogic();

  return (
    <>
      {id ? (
        <>
            <ShowStaticSingle itemID={id} />
        </>
      ) : (
        <div>No ID provided.</div>
      )}
    </>
  );
};

export default StaticSingle;
