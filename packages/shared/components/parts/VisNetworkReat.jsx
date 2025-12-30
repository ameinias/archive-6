import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";
import Graph from "react-graph-vis";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { GameLogic } from "@utils/gamelogic";
import { applyHexFilter } from "@components/parts/ListingComponent";

const VisNetworkReat = ({ filterAvailable = true }) => {
  const { setStatusMessage, gameState, setColumn, setSort, updateGameState } =
    GameLogic();

  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const navigate = useNavigate();

  
  // useEffect(() => {
  //   // so far nothing that needs rerendering - not sure how to pass this into the options list.
  // }, [friends, subentries, filterAvailable]);

  const filteredFriends = useLiveQuery(() => {
    if (!db.isOpen()) return [];

    let tempItems = [];
    let nextID = 0;

    let foundSubItems = subentries;
    let foundFriends = friends;

    if (filterAvailable) {
      foundSubItems = subentries.filter((item) => item.available === true);
      foundFriends = friends.filter((item) => item.available === true);
    }

    if (foundSubItems) {
      for (const item of foundSubItems) {
        tempItems.push({
          id: nextID,
          label: item.fauxID + " - " + item.title,
          group: "sub",
          //   value: nextID, // ['subentry',item.id],
          //   label: item.fauxID,
          //   origin: item.id,
          //   fauxID: item.fauxID,
          //   parentId: item.parentId,
          //   title: item.title,
          //   date: item.date,
          //   displayDate: item.displayDate,
          //   type: "subentry",
          //   description: item.description,
          //   devNotes: item.devNotes,
          //   hexHash: item.hexHash,
          //   lastEditedBy: item.lastEditedBy,
          //   triggerEvent: item.triggerEvent,
          //   available: item.available,
        });
        nextID = nextID + 1;
      }
    }

    // Add main entries too
    if (foundFriends) {
      for (const item of foundFriends) {
        tempItems.push({
          id: nextID,
          label: item.fauxID + " - " + item.title,
          group: "entry",

          //   origin: item.id,
          //   fauxID: item.fauxID,
          //   color:red,
          //   parentId: null,
          //   title: item.title,
          //   date: item.date,
          //   displayDate: item.displayDate,
          //   description: item.description,
          //   devNotes: item.devNotes,
          //   hexHash: item.hexHash,
          //   lastEditedBy: item.lastEditedBy,
          //   triggerEvent: item.triggerEvent,
          //   available: item.available,
        });
        nextID = nextID + 1;
      }
    }

    return tempItems;
  }, [filterAvailable, friends, subentries]);

  const theNodes = [
    { id: 1, label: "ggggg", title: "node 1 tootip text", group: "entry" },
    { id: 2, label: "sssss", title: "node 2 tootip text", group: "sub" },
    { id: 3, label: "jjjjj", title: "node 3 tootip text" },
    { id: 4, label: "Node 4", title: "node 4 tootip text" },
    { id: 5, label: "Node 5", title: "node 5 tootip text" },
    { id: 6, label: "Node 455", title: "node 5 tootip text" },
  ];

  //    { id: 14, shape: "circularImage", image: DIR + "14.png" },

  const graph = {
    nodes: filteredFriends, // theNodes,
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 1 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
    ],
  };

  const options = {
    groups: {
      entry: { color: { background: "red" }, borderWidth: 3 },
      sub: { color: { background: "blue" }, borderWidth: 1 },
    },
    nodes: {
      shape: "dot",
      borderWidth: 4,
      size: 10,
      color: {
        border: "#222222",
        background: "#666666",
      },
      font: { color: "#666666" },
    },
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#000000",
      arrows: "none",
    },
    height: "500px",
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };
  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={(network) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    /> 
  );
};

export default VisNetworkReat;
