import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";
import Graph from "react-graph-vis";
import { db } from '@utils/db' // import the database
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'

const VisNetworkReat = () => {

      const friends = useLiveQuery(() => db.friends.toArray())
  const subentries = useLiveQuery(() => db.subentries.toArray())
  const navigate = useNavigate()

    const filteredFriends = useLiveQuery(() => {
     if (!db.isOpen()) return [];

         let tempItems = [];
    let nextID = 0;


    const column = gameState?.sortColumn || 'title'
    const direction = gameState?.sortDirection || 'asc'


          const foundSubItems = subentries; 

    
      if (foundSubItems) {
      for (const item of foundSubItems) {
        tempItems.push({
          id: nextID,
          origin: item.id,
          fauxID: item.fauxID,
          parentId: item.parentId,       
          title: item.title,
          date: item.date,
          displayDate: item.displayDate,   
          type: 'subentry',             
          description: item.description,
          devNotes: item.devNotes,
          hexHash: item.hexHash,           
          lastEditedBy: item.lastEditedBy, 
          triggerEvent: item.triggerEvent, 
          available: item.available       
        });
        nextID = nextID + 1;
      }
    }

    // Add main entries too
    if (friends) {
      for (const item of friends) {
        tempItems.push({
          id: nextID,
          origin: item.id,
          fauxID: item.fauxID,
          parentId: null,                  
          title: item.title,
          date: item.date,
          displayDate: item.displayDate,
          type: 'entry',
          description: item.description,
          devNotes: item.devNotes,
          hexHash: item.hexHash,
          lastEditedBy: item.lastEditedBy,
          triggerEvent: item.triggerEvent,
          available: item.available
        });
        nextID = nextID + 1;
      }
    }

    const list =  applyHexFilter(tempItems, gameState?.activeFilter)

        // dont need sorting 
      return list


  }, [gameState?.sortColumn, gameState?.sortDirection, gameState?.activeFilter])



      const graph = {
    nodes: [
      { id: 1, label: "Node 1", title: "node 1 tootip text" },
      { id: 2, label: "Node 2", title: "node 2 tootip text" },
      { id: 3, label: "Node 3", title: "node 3 tootip text" },
      { id: 4, label: "Node 4", title: "node 4 tootip text" },
      { id: 5, label: "Node 5", title: "node 5 tootip text" }
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 }
    ]
  };

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000"
    },
    height: "500px"
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };
  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={network => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />
  );

};

export default VisNetworkReat;