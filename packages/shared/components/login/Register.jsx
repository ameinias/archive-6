import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { Link } from 'react-router-dom';
import {eventManager} from '@utils/events';


// import { create } from 'core-js/core/object';
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

    const handleLogin = () => {
    navigate('/login');
  };

      const handleKeyDown = (e) => {

  if (e.key === 'Enter') {
    handleSubmit();
  }
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
              eventManager.showAlert('Passwords is required');
              return;
            }


            if (formValues.password !== formValues.password2) {
              eventManager.showAlert('Passwords must match!');
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValues,
      [name]: value,
    });
  };


// const createUserName = (first, last) => {
//   if (!first && !last) return '';
//   if (!first) return last.toLowerCase();
//   if (!last) return first.toLowerCase();
//   return (first[0] + last).toLowerCase();
// }


return (

      <div className="login">
        <div className=" row login-info-text">
          Please register to access the archive database.
        </div>
        <div className=" row">

            {' '}

            <div className="formLabel ">first name:</div>
            <input
              className="form-control col"
              type="text"
              name="firstName"

              value={formValues.firstName}
              onChange={handleChange}
            />

        </div>

                <div className=" row">

            {' '}

            <div className="formLabel col-1">last name:</div>
            <input
              className="form-control col"
              type="text"
              name="lastname"
              value={formValues.lastname}
              onChange={handleChange}
            />

        </div>



                <div className=" row">

            {' '}

            <div className="formLabel col-1">username:</div>
            <input
              className="form-control col"
              type="text"
              name="username"
              value={vvv}
              onChange={handleChange}
            />
        </div>


        <div className="row">

            {' '}
            <div className="formLabel ">password:</div>
            <input
              className="form-control col"
              type="password"
              name="password"
              placeholder="password"
              value={formValues.password}

              onChange={handleChange}
            />
        </div>

        <div className="row">
     <div className="formLabel ">password:</div>
            <input
              className="form-control col"
              type="password"
              name="password2"
              placeholder="confirm password"
              value={formValues.password2}
              onKeyDown={handleKeyDown}
              onChange={handleChange}

            />

        </div>

        <div className="row">
          {/* <Button className="btn-save-add-item" onClick={updateEntry}>
            Register
          </Button> */}

                    <div className="row text-cente">
          <Button className="btn-save-add-itemn" onClick={handleSubmit}>
            Register
          </Button>
          </div>
                    <div className="row text-center">
          <Link className="altSignIn"to="/login" tooltip="If you already have an account, click here to login" >
            I already have an account
          </Link>
          </div>
        </div>
      </div>
  );
}
export default Register;
