
   export const categories= [
    'Artifact',
    'Document'
  ];
  export const subCategories= [
    'TextLog',
     'MetaData',
    'MediaItem',
    'Commentary',
    'AudioLog',
    'VideoLog'
  ];

  export const metaData =[
    // ideally eventually these would be listed in order of ide on any entries that have them.
       { id:1,name: 'format', note: 'file format, the physical medium (e.g. the data storage medium), or the dimension (the size or duration).' },
    { id:2,name: 'location', note: 'For the first unlockable scenes.' },
    { id:3,name: 'extent', note: 'This property refers to the size (e.g. bytes, pages, inches, etc.) or duration (e.g. hours, minutes, days, etc.) of a resource.' },
    { id:4,name: 'subject', note: 'Would be nice if we could cross reference these things' },
    { id:5,name: 'source', note: 'Random fluff entries from testing I don\'t want to toISOString.' },
    { id:6,name: 'date-created', note: 'Date the resource was created/discovered' },
    { id:7,name: 'date-submitted', note: 'Date the resource was submitted' },
    { id:8,name: 'accrual-method', note: 'where the archive got the item from' },
    { id:9,name: 'provenance', note: 'The history of the ownership ' },

  ]
  // {item.researcherID !== null && item.researcherID !== undefined
  //     ? researcherIDs.find(researcher => researcher.id === parseInt(item.researcherID))?.name || 'Unknown'
  //     : 'Unknown User'
  //   }

    export const researcherIDs= [
      { id:0,name: 'unknown-user', note: 'For the first unlockable scenes.' },
    { id:1,name: 'RM',  note: 'For scenes that are available at the beginning of the game.' },
    { id:2,name: 'EQ', note: 'For the first unlockable scenes.' },
    { id:3,name: 'programmer96-2001', note: 'ony works atuniversity 96 97 then from home ' },
    { id:4,name: 'historian73-82s', note: 'historian73-82s' },
    { id:5,name: 'society1-archivist-10-23', note: 'society1-archivist-10-23.' },
    { id:6,name: 'socieity2-archivist-24-52', note: 'socieity2-archivist-24-52.' },

  ];
export const entryTemplate= [
    'default',
    'messed up'
  ]

export const editType= [
    'added',
    'migrated',
    'modified'
  ]

  // Keep name and note clear and detailed about what content unlocks. hexhash is what players must type in to unlock new entries.
  export const hexHashes = [
  { id:1,name: 'startHash', hexHashcode: 'null', note: 'Articles that are already there. ' },
  { id:2, name: 'V1_2 - first histories', hexHashcode: 'ff887d1e66aac9cec2dbce8790a07576', note: 'a view of history'  },
  { id:3, name: 'V1_3 - proof of stone', hexHashcode: '2ee3a8bd9d4bb57643c38635f3fbdb50', note: 'proof in the stone' }, 
  { id:4, name: 'V1_4 - give stone a body', hexHashcode: '1a950780e461e4d3d694b9f11858dbf6', note: 'give the stone a body' },
  { id:5, name: 'V1_5 - spiritual machines', hexHashcode: '2800044c8003e9eec1be25d88682231c', note: 'spiritual machines '  },
  { id:6, name: 'V1_6 - valuable bodies', hexHashcode: 'd8a346fd2f0d08779bff76102f7b32fd', note: 'their bodies were very valuable '  },
  { id:7, name: 'V1_7 - dead historian', hexHashcode: '63a5b8ab25ece1f3657cf4af94a2019d', note: 'Dead historian '  },
  { id:8, name: 'V1_8 - your material', hexHashcode: 'c7ce0a5377c89ab055a95ffb5caac583', note: 'what is your material'  },





  { id:50, name: 'junk', hexHashcode: 'ooo5-6jdsA-GH7aa', note: 'Random fluff entries from testing I don\'t want to toISOString.' },
];


export const badHashes= [
        '59015dcf608e7473f761ff5a5454a284', '223d0be2378460ba0df7b846f750b1c8', 'aa1b626f18df70ea91b44075840ee136', 
 '29325db26acf27db0232fae4ff4e21d5', 'b3c6a89d8e241138ed661e4497519fea', 'c888008f79798950760159f80f485fbf', '67d6a591bce402d7f3af94e97824239d', 'fdd40fb8b099a215b1f085b06a287c45', 
  ]