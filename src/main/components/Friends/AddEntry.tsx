import { useParams } from 'react-router-dom';
import { AddFriendForm } from './AddEntryBit';

const SingleItem = () => {
  const { id } = useParams(); // get the id from the route

  return (
    <>
      <h2>Edit</h2>
              {id ? (
      <AddFriendForm itemID={id} />
    ) : (
      <div>No ID provided.</div>
    )}
    </>
  );
};

export default SingleItem;
