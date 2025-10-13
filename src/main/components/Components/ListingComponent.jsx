import React from 'react';
import {GameLogic} from '../../../../packages/shared/utils/gamelogic';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';

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

    <> sdffs {item.id}
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
