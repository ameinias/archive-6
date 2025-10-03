import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import { GameLogic } from '../../utils/gamelogic';
import {
  newGame
} from '../../utils/db'; // import the database

const defaultFormValue = {
  username: '',
  password: ''
};


function Login() {
  const [formValues, setFormValue] = useState(defaultFormValue);
  const navigate = useNavigate();
    // const { isAdmin, toggleAdmin } = GameLogic();
    const { isLoggedIn, setLoggedIn } = GameLogic();
      const { setStatusMessage } = GameLogic();
      const { globalUser, setPlayerUsername, setPlayerPassword } = GameLogic();

  const handleClose = () => {
    navigate('/');
  };

    const handleKeyDown = (e) => {

  if (e.key === 'Enter') {
    handleSubmit();
  }
};


    const handleSubmit = () => {
      // Will eventually check database but for now just checks for admin

          try {
            const username = formValues.username || '';
            if (!username) {
              setStatusMessage('Username is required');
              return;
            }

            // Check for spaces or special characters (only allow letters, numbers, underscore, hyphen)
            if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
              setStatusMessage('Username can only contain letters, numbers, underscore, and hyphen (no spaces or special characters)');
              return;
            }

            const password = formValues.password || '';
            if (!password) {
              setStatusMessage('Password is required');
              return;
            }
            setPlayerUsername(username);
            setPlayerPassword(password);
            setLoggedIn(true);
            setStatusMessage(`Logged in as ${username}`);
            // Don't navigate immediately, let the state update first
            newGame();

            // handleClose();
            // setFormValue(defaultFormValue);  // Reset to defaults
          } catch (error) {
            setStatusMessage(`missing required fields`);
          }
    };

  // Manage state and input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValues,
      [name]: value,
    });
  };

  return (

      <div className="login">
        <div className=" row">
          Please enter the user name and password you would like to use.
        </div>
        <div className=" row">

            {' '}

            <div className="formLabel col">username:</div>
            <input
              className="form-control col"
              type="text"
              name="username"
              placeholder="username"
              value={formValues.username}
              onChange={handleChange}
            />

        </div>
        <div className="row">

            {' '}
            <div className="formLabel col">password:</div>
            <input
              className="form-control col"
              type="password"
              name="password"
              placeholder="password"
              value={formValues.password}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
            />

        </div>

        <div className="row">
          {/* <Button className="btn-save-add-item" onClick={updateEntry}>
            Register
          </Button> */}
          <Button className="btn-save-add-itemn" onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </div>
  );
}

export default Login;
