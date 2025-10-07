
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
    export const researcherIDs= [
      { id:0,name: 'unknown-user', note: 'For the first unlockable scenes.' },
    { id:1,name: 'RM',  note: 'For scenes that are available at the beginning of the game.' },
    { id:2,name: 'EQ', note: 'For the first unlockable scenes.' },
    { id:3,name: 'programmer96-2001', note: 'ony works atuniversity 96 97 then from home ' },
    { id:4,name: 'historian73-82s', note: 'For the first unlockable scenes.' },
    { id:5,name: 'society1-archivist-10-23', note: 'For the first unlockable scenes.' },
    { id:6,name: 'socieity2-archivist-24-52', note: 'For the first unlockable scenes.' },

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
  { id:1,name: 'startHash', hexHashcode: 'null', note: 'For scenes that are available at the beginning of the game.' },
  { id:2, name: 'V1_1', hexHashcode: 'eeqR-4fd9-D04S', note: 'For the first unlockable scenes.' },
  { id:3, name: 'V1_2', hexHashcode: 'aeoh-3q484-da232', note: 'More stuff' },
  { id:4, name: 'V1_3', hexHashcode: 'iaeF-33pqJ-ef09H', note: 'And again.  aeFFh-548aA-ffv55 '  },
    { id:50, name: 'junk', hexHashcode: 'ooo5-6jdsA-GH7aa', note: 'Random fluff entries from testing I don\'t want to toISOString.' },
];


