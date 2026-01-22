import React, { useState, useEffect } from 'react'
import { eventManager } from '@utils/events'
import Button from 'react-bootstrap/Button'
import { db } from '@utils/db' // import the database
import { useLiveQuery } from 'dexie-react-hooks'

import { AnimatedList } from '@utils/motion/animatedList'
import { Group, Panel, Separator } from 'react-resizable-panels';

// https://react-resizable-panels.vercel.app/

export default function TestComp () {
  const friends = useLiveQuery(() => db.friends.toArray())
  const subentries = useLiveQuery(() => db.subentries.toArray())
  // const navigate = useNavigate()
  const [val, setSelected] = React.useState([])
  const [filterAvailable, setFilterAvailable] = React.useState(false)

  useEffect(() => {
    // so far nothing that needs rerendering - not sure how to pass this into the options list.
  }, [friends, subentries])

  const filteredFriends = useLiveQuery(() => {
    if (!db.isOpen()) return []
    //     if (!subentries) return [];
    // if (!friends) return [];

    let tempItems = []
    let nextID = 0

    let foundSubItems = subentries
    let foundFriends = friends

    if (filterAvailable) {
      foundSubItems = subentries.filter(item => item.available === true)
      foundFriends = friends.filter(item => item.available === true)
    }

    if (foundSubItems) {
      for (const item of foundSubItems) {
        tempItems.push({
          id: nextID,
          value: nextID,
          label: item.fauxID,
          origin: item.id,
          fauxID: item.fauxID,
          parentId: item.parentId,
          title: item.title,
          date: item.date,
          displayDate: item.displayDate,
          type: 'sub',
          description: item.description,
          devNotes: item.devNotes,
          hexHash: item.hexHash,
          lastEditedBy: item.lastEditedBy,
          triggerEvent: item.triggerEvent,
          available: item.available
        })
        nextID = nextID + 1
      }
    }

    // Add main entries too
    if (foundFriends) {
      for (const item of foundFriends) {
        tempItems.push({
          id: nextID,
          value: nextID,
          label: item.fauxID,
          origin: item.id,
          fauxID: item.fauxID,
          type: 'entry',
          parentId: null,
          title: item.title,
          date: item.date,
          displayDate: item.displayDate,
          description: item.description,
          devNotes: item.devNotes,
          hexHash: item.hexHash,
          lastEditedBy: item.lastEditedBy,
          triggerEvent: item.triggerEvent,
          available: item.available
        })
        nextID = nextID + 1
      }
    }

    return tempItems
  }, [filterAvailable, friends, subentries])

  return (
    <div id="GroupParent" className="ugly maxSize">

      <Group  className="min-h-30" orientation="vertical">

  <Panel>
<div>

      top top top top top top top top top top top top top top top top top top top top top top top top top top top top top top top top top top top
</div>
      </Panel>
  <Separator />
  <Panel><div>bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom bottom
    </div>
  </Panel>

</Group>



    </div>
  )
}

// export function FormSelectSearch({
//   label,
//   name,
//   formValue,
//   readOnly = false,
//   onChange,
//   options,
// }) {
//   return (
//     <div className="row">
//       {label && <div className="formLabel">{label}</div>}
//       <select
//         name={name}
//         className="form-control form-control-dropdown col hex-select"
//         multiple={true}
//         value={formValue}
//         onChange={onChange}
//         disabled={readOnly}
//       >
//         {options}
//       </select>
//     </div>
//   );
// }
