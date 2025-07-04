import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const NavBar = () => {
  // const [val, setVal] = useState("");
  // const [itemsToTrack, setItems] = useState([]);

  return (
    <div>
      <Link to="/">
        <Button variant="outline-primary">Home</Button>
      </Link>{' '}
      |{' '}
      <Link to="/user-profile">
        <Button variant="outline-primary">User Profile</Button>
      </Link> |{' '}
      <Link to="/edit-item/new">
        <Button variant="outline-primary">New Entry</Button>
      </Link> |{' '}
      <Link to="/import-export">
        <Button variant="outline-primary">ImportExport</Button>
      </Link>
    </div>
  );
};

export default NavBar;
