export const categories = ["Artifact", "Document"];
export const subCategories = [
  "TextLog",
  "MetaData",
  "MediaItem",
  "Commentary",
  "AudioLog",
  "VideoLog",
];

export const metaData = [
  // ideally eventually these would be listed in order of ide on any entries that have them.
  {
    id: 1,
    name: "format",
    note: "file format, the physical medium (e.g. the data storage medium), or the dimension (the size or duration).",
  },
  { id: 2, name: "location", note: "For the first unlockable scenes." },
  {
    id: 3,
    name: "extent",
    note: "This property refers to the size (e.g. bytes, pages, inches, etc.) or duration (e.g. hours, minutes, days, etc.) of a resource.",
  },
  {
    id: 4,
    name: "subject",
    note: "Would be nice if we could cross reference these things",
  },
  {
    id: 5,
    name: "source",
    note: "Random fluff entries from testing I don't want to toISOString.",
  },
  {
    id: 6,
    name: "date-created",
    note: "Date the resource was created/discovered",
  },
  { id: 7, name: "date-submitted", note: "Date the resource was submitted" },
  {
    id: 8,
    name: "accrual-method",
    note: "where the archive got the item from",
  },
  { id: 9, name: "provenance", note: "The history of the ownership " },
];
// {item.researcherID !== null && item.researcherID !== undefined
//     ? researcherIDs.find(researcher => researcher.id === parseInt(item.researcherID))?.name || 'Unknown'
//     : 'Unknown User'
//   }

export const researcherIDs = [
  { id: 0, name: "unknown-user", note: "For the first unlockable scenes." },
  {
    id: 1,
    name: "RM",
    note: "For scenes that are available at the beginning of the game.",
  },
  { id: 2, name: "EQ", note: "For the first unlockable scenes." },
  {
    id: 3,
    name: "programmer96-2001",
    note: "ony works atuniversity 96 97 then from home ",
  },
  { id: 4, name: "historian73-82s", note: "historian73-82s" },
  {
    id: 5,
    name: "society1-archivist-10-23",
    note: "society1-archivist-10-23.",
  },
  {
    id: 6,
    name: "socieity2-archivist-24-52",
    note: "socieity2-archivist-24-52.",
  },
];


export const editType = ["added", "migrated", "modified"];

// Keep name and note clear and detailed about what content unlocks. hexhash is what players must type in to unlock new entries.
// MD5  https://www.itoolverse.com/calculator/hash-calculator
export const hexHashes = [
  {
    id: 1,
    name: "startHash",
    hexHashcode: "e5db0557296c615fa4ab2d2b0f0292da",
    note: "Articles that are already there. ",
  },
  {
    id: 2,
    name: "V1_2 - first histories",
    hexHashcode: "ff887d1e66aac9cec2dbce8790a07576",
    note: "a view of history",
  },
  {
    id: 3,
    name: "V1_3 - proof of stone",
    hexHashcode: "2ee3a8bd9d4bb57643c38635f3fbdb50",
    note: "proof in the stone",
  },
  {
    id: 4,
    name: "V1_4 - give stone a body",
    hexHashcode: "1a950780e461e4d3d694b9f11858dbf6",
    note: "give the stone a body",
  },
  {
    id: 5,
    name: "V1_5 - spiritual machines",
    hexHashcode: "2800044c8003e9eec1be25d88682231c",
    note: "spiritual machines ",
  },
  {
    id: 6,
    name: "V1_6 - valuable bodies",
    hexHashcode: "d8a346fd2f0d08779bff76102f7b32fd",
    note: "their bodies were very valuable ",
  },
  {
    id: 7,
    name: "V1_7 - dead historian",
    hexHashcode: "63a5b8ab25ece1f3657cf4af94a2019d",
    note: "Dead historian ",
  },
  {
    id: 8,
    name: "V1_8 - your material",
    hexHashcode: "c7ce0a5377c89ab055a95ffb5caac583",
    note: "what is your material",
  },
  {
    id: 9,
    name: "V1_9 - in case you need it",
    hexHashcode: "c7ce0a5377c89ab055a95ffb5caac583",
    note: "this hash wasnt used but I wanted an even number for vignette 2",
  },

// V2

  {
    id: 10,
    name: "V2_1 - vignette 2 start",
    hexHashcode: "1145cafae869ca2fbe4bf8ac92ecb62b",
    note: "start of vignette 2",
  },
  {
    id: 11,
    name: "V2_2 - sqvs minutes",
    hexHashcode: "0e2805a97520b5e034c4114ae249574e",

  },
    {
    id: 12,
    name: "V2_3 - illustration",
    hexHashcode: "d5f9b259a21092a89659aa16a9913737",

  },
    {
    id: 13,             // following hashes need new codes
    name: "V2_4 -  ",
    hexHashcode: "ss1145cafae869ca2fbe4bf8ac92ecb62b",
    note: "start of vignette 2",
  },
  {
    id: 14,
    name: "V2_5 - doc likes to other entries ",
    hexHashcode: "ss0e2805a97520b5e034c4114ae249574e",

  },
    {
    id: 15,           // final for now
    name: "V2_6 - Nest and final entry",
    hexHashcode: "ssd5f9b259a21092a89659aa16a9913737",

  },
    {
    id: 16,
    name: "V2_7 - mammel spine ",
    hexHashcode: "d66fdeb0b0f75cb7612686b9edbd07fa",

  },
    {
    id: 17,           // final for now
    name: "V2_8 - ",
    hexHashcode: "sfsfsdfs",

  },
    {
    id: 18,
    name: "V2_9 -  ",
    hexHashcode: "fff",

  },
    {
    id: 19,           // final for now
    name: "V2_10 - endgame",
    hexHashcode: "sss",

  },





      {
    id: 100,           // standalone
    name: "just teeth",
    hexHashcode: "621f1cea8a2e201cbebdbf0358d5f577",

  },
  {
    id: 101,           // standalone
    name: "just claws",
    hexHashcode: "fa0c24c601d8397f22edb7a13145cdee",

  },
      {
    id: 52,           // move to a future update
    name: "future entries",
    hexHashcode: "c888008f79798950760159f80f485fbf",

  },
      {
    id: 51,           // things players have made
    name: "player made",
    hexHashcode: "",

  },

  {
    id: 50,
    name: "junk",
    hexHashcode: "cefb5cdb392e7f6521d82da09d939102",
    note: "Random fluff entries from testing I don't want to toISOString.",
  },
];

export const badHashes = [
  "59015dcf608e7473f761ff5a5454a284",
  "223d0be2378460ba0df7b846f750b1c8",
  "aa1b626f18df70ea91b44075840ee136",
  "29325db26acf27db0232fae4ff4e21d5",
  "b3c6a89d8e241138ed661e4497519fea",
  "c888008f79798950760159f80f485fbf",
  "67d6a591bce402d7f3af94e97824239d",
  "fdd40fb8b099a215b1f085b06a287c45", // v1
  "ee92875a012afe4539c1e3d64665bf78",
  "b25f46c2979e7a27de4bbaf952f39e5f",
  "cefb5cdb392e7f6521d82da09d939102",
  "4d295cbc94335cf3cc1b31c37bd3e1c2",
  "a4f3c0b8f5f5e8e2f4d6b3c9e8f7a1b0",
  "9f1e2d3c4b5a69788796a5b4c3d2e1f0",
  "9f296b3481b3c8704f947a4110125a26",
  "36680042515dbee28e18cd17529c003d",
  "e5db0557296c615fa4ab2d2b0f0292da"

];

export const entryTemplate = [
  "default",
  "messed up",
  "mean",
  "trapped"

];

