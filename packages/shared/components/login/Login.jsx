import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { GameLogic } from "@utils/gamelogic";
import { Link } from "react-router-dom";
import { newGame } from "@utils/db"; // import the database
import visible from "@assets/icons/eye.png";
import invisible from "@assets/icons/visible.png";


const defaultFormValue = {
  username: "",
  password: "",
};

function Login() {
  const [formValues, setFormValue] = useState(defaultFormValue);
  const navigate = useNavigate();
  const { isLoggedIn, setLoggedIn } = GameLogic();
  const { globalStatus, setStatusMessage } = GameLogic();
  const { globalUser, setPlayerUsername, setPlayerPassword, gameState } =
    GameLogic();

    const [showPassword, setShowPassword] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  //   const handleRegister = () => {
  //   navigate('/register');
  //   console.log("navigating to register");
  // };

  const handleSubmit = () => {
    // Will eventually check database but for now just checks for admin

    try {
      const username = formValues.username || "";
      if (!username) {
        setStatusMessage("Username is required");
        return;
      }

      // Check for spaces or special characters (only allow letters, numbers, underscore, hyphen)
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        setStatusMessage(
          "Username can only contain letters, numbers, underscore, and hyphen (no spaces or special characters)",
        );
        return;
      }

      const password = formValues.password || "";
      if (!password) {
        setStatusMessage("Password is required");
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(password)) {
        setStatusMessage(
          "Passwords can only contain letters, numbers, underscore, and hyphen (no spaces or special characters)",
        );

        return;
      }

      setPlayerUsername(username);
      setPlayerPassword(password);
      setLoggedIn(true);
      setStatusMessage(`Logged in as ${username}`);
      // Don't navigate immediately, let the state update first
      newGame(gameState.defaultStartHash);

      // handleClose();
      // setFormValue(defaultFormValue);  // Reset to defaults
    } catch (error) {
      setStatusMessage(`missing required fields`);
    }
  };

  // Manage state and input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    const str = JSON.stringify(name);

    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setStatusMessage(
        [name].toString() +
          " can only contain letters, numbers, underscore, and hyphen (no spaces or special characters)",
      );

      return;
    }

    setFormValue({
      ...formValues,
      [name]: value,
    });
  };

  if (!globalUser.username) {
    return (
      <>
        <div className="login">
          <div className=" row login-info-text">
            Never been here BeforeUnloadEvent.
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="login">
      <div className=" row login-info-text">
        Please register your user name and password. 
      </div>
      <div className=" row">
        {" "}
        <div className="formLabel col">username:</div>
        <input
          className="form-control col"
          type="text"
          name="username"
          placeholder="username"
          value={formValues.username}
          onChange={handleChange}
        /><div style={{width: '35px'}}></div>
      </div>
      <div className="row">
        {" "}
        <div className="formLabel col">password:</div>
        <input
          className="form-control col"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="password"
          value={formValues.password}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
                {
         showPassword ? (<button className="auth-icon-password-eye" onClick={handleShowPassword} ><img
            src={visible}
            alt="show password"

            // className="auth-icon-password-eye"
          />
        </button>)
            : (<button className="auth-icon-password-eye" onClick={handleShowPassword} ><img
            src={invisible}
            alt="show password"
          
            // className="auth-icon-password-eye"
          />
        </button>)
        }
      </div>

      <div className="row">
        {/* <Button className="btn-save-add-item" onClick={updateEntry}>
            Register
          </Button> */}

        <Button className="btn-save-add-itemn" onClick={handleSubmit}>
          Login
        </Button>
      </div>
      <div className="row text-center">
        <p className="errorStatus">{globalStatus}</p>
      </div>
    </div>
  );
}

export default Login;
