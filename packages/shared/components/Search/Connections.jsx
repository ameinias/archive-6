import React, { useState, useEffect } from "react";
import { eventManager } from "@utils/events";
import Button from "react-bootstrap/Button";
import { GameLogic } from "@utils/gamelogic";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import Select from "react-select"; // https://react-select.com/home#getting-started
import VisNetworkReat from "@components/parts/VisNetworkReat"; //https://www.npmjs.com/package/react-graph-vis
import { SelectEntry } from "@components/parts/FormAssets";

import Graph from "@components/parts/Graph";

export default function TestComp() {
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  // const navigate = useNavigate()
  const [val, setSelected] = React.useState([]);
  const [filterAvailable, setFilterAvailable] = React.useState(false);
  const { isAdmin } = GameLogic();


  useEffect(() => {
  if (!isAdmin) {
    setFilterAvailable(true);
  }
}, [isAdmin]);

  const changeBool = (e) => {
    const { name, checked } = e.target;
    setFilterAvailable(checked);
    console.log("filter: " + filterAvailable);
  };

  return (
    <div>
      {" "}
      {isAdmin && (
        <>
          <input
            type="checkbox"
            value={filterAvailable}
            onChange={changeBool}
          />{" "}
          Available Only
          {/* {filterAvailable ? "true" : "false"} */}
        </>
      )}
      {/* <VisNetworkReat filterAvailable={filterAvailable} /> */}

            <Graph filterAvailable={filterAvailable}
 />
    </div>
  );
}
