import { useParams } from 'react-router-dom';
import { AddSubEntryForm } from './AddSubEntryFunc';

const AddSubEntry = () => {
  const { id } = useParams(); // get the id from the route

  return (
    <>
              {id ? (
                <>
      <AddSubEntryForm itemID={id} />
      </>
    ) : (
      <div>No Sub entry ID provided.</div>
    )}
    </>
  );
};

export default AddSubEntry;
