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

  const nodesRef = useRef(null);
  const edgesRef = useRef(null);
  const isFirstRender = useRef(true); // Add this

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

  useEffect(() => {
    if (
      !containerRef.current ||
      !filteredFriends ||
      filteredFriends.length === 0
    ) {
      return;
    }

    // If network doesn't exist yet, create it
    if (!networkRef.current) {
      nodesRef.current = new DataSet();
      edgesRef.current = new DataSet();

      const data = { nodes: nodesRef.current, edges: edgesRef.current };

      const options = {
        autoResize: false,
          interaction: {
    zoomView: true,
  },
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
          font: { color: "#000000ff", size: 25, multi: "html" },
        },
        layout: {
          hierarchical: false,
          improvedLayout: true,
        },
        edges: {
          color: "#000000",
          smooth: false,
          arrows: {
            to: { enabled: false },
            from: { enabled: false },
          },
        },
        height: "500px",
        width: "100%",
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -8000,
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.03, //0.04
            damping: 0.9, //0.4
            avoidOverlap: 0.6, //0.2
          },
          stabilization: {
            // iterations: 150,
          },
        },
      };

      networkRef.current = new Network(containerRef.current, data, options);

      // Only fit on first render
      // networkRef.current.once('stabilizationIterationsDone', () => {
      //   networkRef.current.fit({
      //     animation: {
      //       duration: 1000,
      //       easingFunction: "easeInOutQuad"
      //     },
      //       padding: 300
      //   });
      // });

      //       networkRef.current.once('stabilizationIterationsDone', () => {
      //   const scale = 0.8; // 0.8 = zoom out to 80%
      //   networkRef.current.moveTo({
      //     scale: scale,
      //     animation: {
      //       duration: 1000,
      //       easingFunction: "easeInOutQuad"
      //     }
      //   });
      // });

      // networkRef.current.once("stabilizationIterationsDone", () => {
      //   networkRef.current.fit();
      //   const currentScale = networkRef.current.getScale();
      //   networkRef.current.moveTo({
      //     scale: currentScale * 0.8, // Zoom out by 20%
      //   });
      // });

networkRef.current.moveTo({ scale: 0.5 });

      // Add event listeners only once
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
    }

    // Disable physics during updates (except first render)
    // if (!isFirstRender.current) {
    //   networkRef.current.setOptions({ physics: { enabled: false } });
    // }

    // Update nodes
    const nodeData = filteredFriends.map((item) => ({
      id: item.id,
      label: item.label,
      title: item.label,
      group: item.group,
    }));
    nodesRef.current.clear();
    nodesRef.current.add(nodeData);

    // Build and update edges
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
          // Find the matching node by both originId AND type
          const targetNode = filteredFriends.find(
            (node) =>
              node.originId === refObj.originId && node.group === refObj.type,
          );

          if (targetNode) {
            edgesArray.push({
              from: item.id,
              to: targetNode.id,
              color: "#0d0fb9ff",
            });
          }
        });
      }
    });

    isFirstRender.current = false; // Mark that first render is done

    edgesRef.current.clear();
    edgesRef.current.add(edgesArray);

    // Cleanup only on unmount
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
