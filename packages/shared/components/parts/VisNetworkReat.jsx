import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import Graph from "react-graph-vis";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { GameLogic } from "@utils/gamelogic";
import { applyHexFilter } from "@components/parts/ListingComponent";

const VisNetworkReat = ({
  filterAvailable = true,
  includeSubentries = true,
}) => {
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

    if (includeSubentries) {
      if (foundSubItems) {
        for (const item of foundSubItems) {
          tempItems.push({
            id: nextID,
            label: item.fauxID + " - " + item.title,
            originId: item.id,
            parentId: item.parentId,
            group: "sub",
          });
          nextID = nextID + 1;
        }
      }
    }

    // Add main entries too
    if (foundFriends) {
      for (const item of foundFriends) {
        tempItems.push({
          id: nextID,
          label: item.fauxID + " - " + item.title,
          group: "entry",
          originId: item.id,
          parentId: null,
        });
        nextID = nextID + 1;
      }
    }

    return tempItems;
  }, [filterAvailable, friends, subentries]);



  // // Then create a map to convert original IDs to new IDs
  // const idMap = new Map();
  // filteredFriends.forEach(item => {
  //   if (item.originId) {
  //     idMap.set(item.originId, item.id);
  //   }
  // });

  // // Create edges using the mapped IDs
  // const edges = new DataSet(
  //   filteredFriends
  //     .filter(item => item.parentId && idMap.has(item.parentId))
  //     .map(item => ({
  //       from: idMap.get(item.parentId),
  //       to: item.id
  //     }))
  // );

  const nodes = React.useMemo(() => {
    if (!filteredFriends) return new DataSet([]);

    return new DataSet(
      filteredFriends.map((item) => ({
        id: item.id,
        label: item.label,
        title: item.label,
        group: item.group,
      })),
    );
  }, [filteredFriends]);

  const ledges = React.useMemo(() => {
    return new DataSet([
      { from: 0, to: 2 },
      { from: 0, to: 1 },
    ]);
  }, []);

  const graph = React.useMemo(
    () => ({
      nodes: nodes,
      edges: ledges,
    }),
    [nodes, ledges],
  );

  const options = {
    groups: {
      entry: { color: { background: "green" }, borderWidth: 3 },
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
      arrows: "middle",
    },
    height: "500px",
    
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };

  // Or if you want formatted output:
console.log("nodes:", nodes?.get().map(item => ({ id: item.id, label: item.label })));
console.log("ledges:", ledges?.get().map(item => ({ from: item.from, to: item.to })));

    if (!filteredFriends) {
    return <div>Loading...</div>;
  }

  return (
    <Graph
      key={filteredFriends?.length}
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
