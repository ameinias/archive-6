import { useParams } from 'react-router-dom';
import { AddFriendForm } from './AddEntryBit';
import { AddSubEntryForm } from './AddSubEntryFunc';

const SingleItem = () => {
  const { id } = useParams(); // get the id from the route

  return (
    <>
              {id ? (
                <>
      <AddFriendForm itemID={id} />
      </>
    ) : (
      <div>No ID provided.</div>
    )}
    </>
  );
};

export default SingleItem;
