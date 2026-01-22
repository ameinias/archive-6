import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { db } from "@utils/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { GameLogic } from "@utils/gamelogic";

const Graph = ({ filterAvailable = true, includeSubentries = true }) => {
  const { setStatusMessage, gameState } = GameLogic();
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const navigate = useNavigate();

  // Ref for the DOM container
  const containerRef = useRef(null);
  // Ref for the network instance
  const networkRef = useRef(null);

  const filteredFriends = useLiveQuery(() => {
    if (!db.isOpen()) return [];

    let tempItems = [];
    let nextID = 0;

    let foundSubItems = subentries;
    let foundFriends = friends;

    if (filterAvailable) {
      foundSubItems = subentries?.filter((item) => item.available === true);
      foundFriends = friends?.filter((item) => item.available === true);
    }

    includeSubentries = false;

    if (includeSubentries && foundSubItems) {
      for (const item of foundSubItems) {
        tempItems.push({
          id: nextID,
          label: item.fauxID + " - " + item.title,
          originId: item.id,
          parentId: item.parentId,
          group: "sub",
          entryRef: item.entryRef || [],
        });
        nextID = nextID + 1;
      }
    }

    if (foundFriends) {
      for (const item of foundFriends) {
        tempItems.push({
          id: nextID,
          label: item.fauxID + " - " + item.title,
          group: "entry",
          originId: item.id,
          parentId: null,
          entryRef: item.entryRef || [],
        });
        nextID = nextID + 1;
      }
    }

    return tempItems;
  }, [filterAvailable, friends, subentries, includeSubentries]);

  // Initialize the network
  useEffect(() => {
    if (
      !containerRef.current ||
      !filteredFriends ||
      filteredFriends.length === 0
    ) {
      return;
    }

    // Create nodes
    const nodes = new DataSet(
      filteredFriends.map((item) => ({
        id: item.id,
        label: item.label,
        title: item.label,
        group: item.group,
      })),
    );

    // Create edges (you'll need to build this based on your relationships)
    // const edges = new DataSet([
    //   { from: 0, to: 2 },
    //   { from: 0, to: 1 },
    // ]);

    // Then create a map to convert original IDs to new IDs
    const idMap = new Map();
    filteredFriends.forEach((item) => {
      if (item.originId) {
        idMap.set(item.originId, item.id);
      }
    });

    const edgesArray = [];

    filteredFriends.forEach((item) => {
      // Add edges for parent-child relationships
      if (item.parentId && idMap.has(item.parentId)) {
        edgesArray.push({
          from: idMap.get(item.parentId),
          to: item.id,
        });
      }

      // Add edges for entryRef relationships
      if (item.entryRef && Array.isArray(item.entryRef)) {
        item.entryRef.forEach((refObj) => {
          // Check if the referenced entry exists in our filtered list

          // console.log("nooode ID: " + filteredFriends[0].originId + " type: " + filteredFriends[0].group);
          // console.log("target ID: " + refObj.originId + " type: " + refObj.type);

          // Find the matching node by both originId AND type
          const targetNode = filteredFriends.find(
            (node) =>
              node.originId === refObj.originId && node.group === refObj.type,
          );

          //  if (!targetNode) console.log("no targetnode");
          //  console.log("ref " + item.id + " - " + refObj.id + " " + targetNode.id);

          if (targetNode) {
            edgesArray.push({
              from: item.id,
              to: targetNode.id,
              color: "#0d0fb9ff", //{ color: '#FF0000' }, // Red for entryRef connections
               // Make them dashed
            });
          }
        });
      }
    });

    const edges = new DataSet(edgesArray);

    const data = { nodes, edges };

    const options = {
      autoResize: true,
      groups: {
        entry: { color: { background: "green" }, borderWidth: 1 },
        sub: { color: { background: "blue" }, borderWidth: 1 },
      },
      nodes: {
        shape: "dot",

        borderWidth: 4,
        widthConstraint: {
          maximum: 250,
        },
        color: {
          border: "#222222",
          background: "#666666",
        },
        font: { color: "#000000ff", size: 25, multi: "html"},
      },
      layout: {
        hierarchical: false,
        improvedLayout: true,
      },
      edges: {
        color: "#000000",
        // arrows: "from",
        smooth: false, // or { enabled: false }
          arrows: {
    to: { enabled: false },
    from: { enabled: false }
          }
      },
      height: "500px",
      width: "100%",
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -8000, // Higher = more repulsion
          centralGravity: 0.7,
          springLength: 120, // Distance nodes try to maintain
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.2, // Critical for boxes! 0-1, higher = stronger
        },
        stabilization: {
          iterations: 150,
        },
      },
    };

    // Create network
    networkRef.current = new Network(containerRef.current, data, options);


// Wait for stabilization, then fit the network
networkRef.current.once('stabilizationIterationsDone', () => {
  networkRef.current.fit({
    animation: {
      duration: 1000,
      easingFunction: "easeInOutQuad"
    },
    minZoomLevel: 0.2,
    maxZoomLevel: 0.4
  });
});

    // Add event listeners
    networkRef.current.on("select", (params) => {
      console.log("Selected nodes:", params.nodes);
      console.log("Selected edges:", params.edges);

      // Navigate if a node is selected
      if (params.nodes.length > 0) {
        const selectedId = params.nodes[0];
        const selectedNode = filteredFriends.find((f) => f.id === selectedId);
        if (selectedNode?.originId) {
          // navigate(`/entry/${selectedNode.originId}`);
        }
      }
    });

    // Cleanup
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [filteredFriends, navigate]);

  if (!filteredFriends || filteredFriends.length === 0) {
    return <div>Loading graph data...</div>;
  }

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          height: "500px",
          width: "100%",
          border: "1px solid lightgray",
        }}
      />
    </div>
  );
};

export default Graph;
