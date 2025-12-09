import React from 'react';
import {GameLogic} from '@utils/gamelogic';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';



export function applyHexFilter(items, activeFilter) {
 let filtered = items;

    if (activeFilter === "vignette1") {
      filtered = items.filter(item => {
        const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
        return hexes.some(hex => hex >= 0 && hex <= 9);
      });
    } else if (activeFilter === "vignette2") {
      filtered = items.filter(item => {
        const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
        return hexes.some(hex => hex >=10 && hex <= 20);
      });
    } else if (activeFilter === "junk") {
      filtered = items.filter(item => {
        const hexes = Array.isArray(item.hexHash) ? item.hexHash : [item.hexHash];
        return hexes.some(hex => hex >= 50 && hex <= 50);
      });
    }


  return filtered; // "all" filter
}


export function FilterList ({ onFilterChange, activeFilter = "all" }) {
  return (
    <div className="filter-buttons">
      <span
        className={activeFilter === "all" ? "active" : ""}
        onClick={() => onFilterChange("all")}
        style={{ cursor: "pointer", margin: "0 10px" }}
      >
        All
      </span>
            <span
        className={activeFilter === "junk" ? "active" : ""}
        onClick={() => onFilterChange("junk")}
        style={{ cursor: "pointer", margin: "0 10px" }}
      >
        Junk
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
        Vignette #2 (Hex 11+)
      </span>
    </div>
  );
}



export function OldSearchPageItem({itemID}) {
    const gameLog = GameLogic();
    //const [item, setItem] = React.useState(null);

    const item = useLiveQuery(async () => {
      if (!itemID) return null;
      return
        await db.subentries.get(Number(itemID)); }, [itemID]); if (!item) {
      return
    <div>Loading...</div>; }

    return (

    <>  {item.id}
    {
        item.type === 'sub'
            ? ( <> {
                (!gameLog.isAdmin
                    ? (
                        <Link to={`/entry / $ {item.parentId} / `}>
                            {item.fauxID}
                            : {item.title}
                        </Link>
                    )
                    : (

                        <Link to={` / $ {urlSubDirect} / $ {item.parentId} / $ {item.origin}`}>
                            {item.fauxID}
                            : {item.title}
                        </Link>
                    ))
            } < />
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



export function SearchPageItem({itemID, type}) {
    const gameLog = GameLogic();
    //const [item, setItem] = React.useState(null);

    const item = useLiveQuery(async () => {
      if (!itemID) return null;
      return
        await db.subentries.get(Number(itemID)); }, [itemID]); if (!item) {
      return
    <div>Loading...</div>; }

    return (

    <> sdffs {itemID}   {type}
    {
        item.type === 'sub'
            ? ( <> {
                (!gameLog.isAdmin
                    ? (
                        <Link to={`/entry / $ {item.parentId} / `}>
                            {item.fauxID}
                            : {item.title}
                        </Link>
                    )
                    : (

                        <Link to={` / $ {urlSubDirect} / $ {item.parentId} / $ {item.origin}`}>
                            {item.fauxID}
                            : {item.title}
                        </Link>
                    ))
            } < />
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
