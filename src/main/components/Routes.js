import React, {useEffect} from 'react';
import Home from "./Home"
import List from "./List"
import NavBar from "./NavBar"
import SingleItem from "./SingleItem"
// import '../css/style.css';

const Routes = () => {

  return (
    <div className="thistle">
      <NavBar />
      <h3>archive software</h3>
      <div className="container">
        <Home />
        <SingleItem />
      </div>
    </div>
  );
};

export default Routes;

