import React, { useEffect, useState, useRef } from 'react'
import { db } from '@utils/db' // import the database
import { useLiveQuery } from 'dexie-react-hooks'
import { GameLogic } from '@utils/gamelogic'

import { HyperText } from '@utils/motion/hypertext'
import { AnimatedList } from '@utils/motion/animatedList'

let globalConsoleArray = []
const consoleUpdateCallbacks = []

// Export this function for use in other scripts
const addConsoleEntry = entry => {
  globalConsoleArray = [...globalConsoleArray, entry]
  consoleUpdateCallbacks.forEach(callback => callback(globalConsoleArray))
}

const addConsoleEntryHypertext = entry => {
  const messEntry = (
    <span className='trapped'>
      <HyperText
      duration="80"
      delay="10"
  >{entry}</HyperText>
    </span>
  )

   globalConsoleArray = [...globalConsoleArray, messEntry]
  consoleUpdateCallbacks.forEach(callback => callback(globalConsoleArray))
}

const Console = () => {
  // const [consoleArray, setConsoleArray] = useState([])
  const { gameState } = GameLogic()
  const friends = useLiveQuery(() => db.friends.toArray())
  const subentries = useLiveQuery(() => db.subentries.toArray())

  const [consoleArray, setConsoleArray] = useState(globalConsoleArray)

  useEffect(() => {
    consoleUpdateCallbacks.push(setConsoleArray)
  setConsoleArray([...globalConsoleArray]);

    return () => {
      const index = consoleUpdateCallbacks.indexOf(setConsoleArray)
      if (index > -1) consoleUpdateCallbacks.splice(index, 1)
    }
  }, [])

  useEffect(() => {
    // window.scrollTo(0, 0);
    if (gameState.showConsole) {
      scrollToBottom()
      // console.log("use effect");
    }
  }, [friends, subentries, gameState.showConsole, consoleArray])

  const containerRef = useRef(null)

  // Function to scroll to the bottom of the container
  const scrollToBottom = () => {
    // Scroll to the bottom of the container by setting scrollTop to the container's scrollHeight
    containerRef.current.scrollTop = containerRef.current.scrollHeight
    console.log('scroll to bottom')
  }

  const clearConsole = () => {
    setConsoleArray([])
  }

  const printLostEntries = () => {
    // Find friends and subentries that are not available
    const lostFriends = friends.filter(friend => !friend.available)
    const lostSubentries = subentries.filter(subentry => !subentry.available)

    // Log lost entries to the console
    lostFriends.forEach(friend => {
      addConsoleEntry(`Lost Friend Entry: ${friend.fauxID} - ${friend.title}`)
    })

    lostSubentries.forEach(subentry => {
      addConsoleEntry(`Lost Subentry: ${subentry.fauxID} - ${subentry.title}`)
    })
  }

  return (
    <>
      <div
        ref={containerRef}
        // className={`console ${!gameState.showConsole && 'hide'}`}
        className={`console`}
      >
        <div>
          <HyperText>Hover me</HyperText>
        </div>

        {consoleArray.map((item, index) => (
          <div key={index}>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export { Console, addConsoleEntry, addConsoleEntryHypertext }
