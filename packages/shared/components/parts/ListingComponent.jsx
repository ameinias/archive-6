import React from "react";
import { GameLogic } from "@utils/gamelogic";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

export function applyHexFilter(items, activeFilter) {
  let filtered = items;

  if (activeFilter === "vignette1") {
    filtered = items.filter((item) => {
      const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
      return hexes.some((hex) => hex >= 0 && hex <= 9);
    });
  } else if (activeFilter === "vignette2") {
    filtered = items.filter((item) => {
      const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
      return hexes.some((hex) => hex >= 10 && hex <= 20);
    });
  } else if (activeFilter === "junk") {
    filtered = items.filter((item) => {
      const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
      return hexes.some((hex) => hex >= 50 && hex <= 50);
    });
  } else if (activeFilter === "standalone") {
    filtered = items.filter((item) => {
      const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
      return hexes.some((hex) => hex >= 100 && hex <= 200);
    });
  } else if (activeFilter === "future") {
    filtered = items.filter((item) => {
      const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
      return hexes.some((hex) => hex >= 52 && hex <= 52);
    });
  } else if (activeFilter === "player") {
    filtered = items.filter((item) => {
      const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
      return hexes.some((hex) => hex >= 51 && hex <= 51);
    });
  } else if (activeFilter === "vignette3") {
    filtered = items.filter((item) => {
      const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
      return hexes.some((hex) => hex >= 30 && hex <= 40);
    });
  }


  return filtered; // "all" filter
}

export function FilterList({ onFilterChange, activeFilter = "all" }) {
  return (
    <div className="filter-buttons">
      <div className="strip">
        <span
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => onFilterChange("all")}
          style={{ cursor: "pointer", margin: "0 10px" }}
        >
          All
        </span>

        <span
          className={activeFilter === "vignette1" ? "active" : ""}
          onClick={() => onFilterChange("vignette1")}
          style={{ cursor: "pointer", margin: "0 10px" }}
        >
          Vignette #1 (Hex 0-10)
        </span>
        <span
          className={activeFilter === "vignette2" ? "active" : ""}
          onClick={() => onFilterChange("vignette2")}
          style={{ cursor: "pointer", margin: "0 10px" }}
        >
          Vignette #2 (Hex 11-19)
        </span>
                <span
          className={activeFilter === "vignette3" ? "active" : ""}
          onClick={() => onFilterChange("vignette3")}
          style={{ cursor: "pointer", margin: "0 10px" }}
        >
          Vignette #3 (Hex 30-40)
        </span>
      </div>

      <div className="strip">
        <span
          className={activeFilter === "future" ? "active" : ""}
          onClick={() => onFilterChange("future")}
          style={{ cursor: "pointer", margin: "0 10px" }}
        >
          Future (Hex 52)
        </span>
        <span
          className={activeFilter === "player" ? "active" : ""}
          onClick={() => onFilterChange("player")}
          style={{ cursor: "pointer", margin: "0 10px" }}
        >
          Player (Hex 51)
        </span>
        <span
          className={activeFilter === "standalone" ? "active" : ""}
          onClick={() => onFilterChange("standalone")}
          style={{ cursor: "pointer", margin: "0 10px" }}
        >
          standalone (Hex 100+)
        </span>
                <span
          className={activeFilter === "junk" ? "active" : ""}
          onClick={() => onFilterChange("junk")}
          style={{ cursor: "pointer", margin: "0 10px" }}
        >
          Junk
        </span>
      </div>
    </div>
  );
}

// export function OldSearchPageItem({itemID}) {
//     const gameLog = GameLogic();
//     //const [item, setItem] = React.useState(null);

//     const item = useLiveQuery(async () => {
//       if (!itemID) return null;
//       return
//         await db.subentries.get(Number(itemID)); }, [itemID]); if (!item) {
//       return
//     <div>Loading...</div>; }

//     return (

//     <>  {item.id}
//     {
//         item.type === 'sub'
//             ? ( <> {
//                 (!gameLog.isAdmin
//                     ? (
//                         <Link to={`/entry / $ {item.parentId} / `}>
//                             {item.fauxID}
//                             : {item.title}
//                         </Link>
//                     )
//                     : (

//                         <Link to={` / $ {urlSubDirect} / $ {item.parentId} / $ {item.origin}`}>
//                             {item.fauxID}
//                             : {item.title}
//                         </Link>
//                     ))
//             } < />
//                  ) : (

//               <>
//               <Link to={` /$ {urlDirect} / $ {item.origin}`}>
//                          {item.fauxID} : {item.title}
//               </Link>

//               </>
//                  )}
//     </>
//     );
// }

export function SearchPageItem({ itemID, type }) {
  const gameLog = GameLogic();
  //const [item, setItem] = React.useState(null);

  const item = useLiveQuery(async () => {
    if (!itemID) return null;
    return;
    await db.subentries.get(Number(itemID));
  }, [itemID]);
  if (!item) {
    return;
    <div>Loading...</div>;
  }

  return (
    <>
      {" "}
      {itemID} {type}
      {item.type === "sub" ? (
        <>
          {" "}
          {!gameLog.isAdmin ? (
            <Link to={`/entry / $ {item.parentId} / `}>
              {item.fauxID}: {item.title}
            </Link>
          ) : (
            <Link
              to={` / $ {urlSubDirect} / $ {item.parentId} / $ {item.origin}`}
            >
              {item.fauxID}: {item.title}
            </Link>
          )}{" "}
        </>
      ) : (
        <>
          <Link to={` /$ {urlDirect} / $ {item.origin}`}>
            {item.fauxID} : {item.title}
          </Link>
        </>
      )}
    </>
  );
}
