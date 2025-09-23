import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../utils/gamelogic';

const defaultFormValue = {
  username: '',
  password: '',
};

function Register() {
  const [formValues, setFormValue] = useState(defaultFormValue);
  const navigate = useNavigate();
    // const { isAdmin, toggleAdmin } = GameLogic();
      const { setStatusMessage } = GameLogic();

  const handleClose = () => {
    navigate('/');
  };

    const handleSubmit = () => {
      // Will eventually check database but for now just checks for admin

          try {
            const username = formValues.username || 'Untitled';
            if (!username) {
              setStatusMessage('Username is required');
              return;
            }

            const password = formValues.password || 'Untitled';
            if (!password) {
              setStatusMessage('Password is required');
              return;
            }

            setStatusMessage(`Logged in as ${username} `);

            handleClose();
            // setFormValue(defaultFormValue);  // Reset to defaults
          } catch (error) {
            setStatusMessage(`missing required fields`);
          }

    navigate('/');
  };

  // Manage state and input field
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValues,
      [name]: value,
    });
  };

  return (

      <div className="Single">
        <div className="row">
          <div className="col">
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
        </div>
        <div className="row">
          <div className="col">
            {' '}
            <div className="formLabel col">password:</div>
            <input
              className="form-control col"
              type="text"
              name="password"
              placeholder="password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>
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

export default Register;
