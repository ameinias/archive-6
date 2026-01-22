import React, { useEffect, useState, useRef } from 'react'
import { db } from '@utils/db' // import the database
import { useLiveQuery } from 'dexie-react-hooks'
import { GameLogic } from '@utils/gamelogic'

import { HyperText } from "@utils/motion/hypertext"

const Console = () => {
  const [consoleArray, setConsoleArray] = useState([])
  const { gameState } = GameLogic()
  const friends = useLiveQuery(() => db.friends.toArray())
  const subentries = useLiveQuery(() => db.subentries.toArray())

  useEffect(() => {
    // window.scrollTo(0, 0);
    if (gameState.showConsole) {
      scrollToBottom
      // console.log("use effect");
    }
  }, [friends, subentries, gameState.showConsole])

  const addConsoleLog = newLog => {
    consoleArray.push(newLog)
  }
  const containerRef = useRef(null)

  // Function to scroll to the bottom of the container
  const scrollToBottom = () => {
    // Scroll to the bottom of the container by setting scrollTop to the container's scrollHeight
    containerRef.current.scrollTop = containerRef.current.scrollHeight
    console.log('scroll to bottom')
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
          " at JSXParserMixin.jsxParseAttributeValue
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:4637:21)
          at JSXParserMixin.jsxParseAttribute
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:4686:38)
          at JSXParserMixin.jsxParseOpeningElementAfterName
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:4700:28)
          at JSXParserMixin.jsxParseOpeningElementAt
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:4695:17)
          at JSXParserMixin.jsxParseElementAt
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:4719:33)
          at JSXParserMixin.jsxParseElementAt
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:4731:32)
          at JSXParserMixin.jsxParseElement
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:4782:17)
          at JSXParserMixin.parseExprAtom
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:4792:19)
          at JSXParserMixin.parseExprSubscripts
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:11085:23)
          at JSXParserMixin.parseUpdate
          (C:\Users\gillian\_Academic\Thesis\archive-5\node_modules\@babel\parser\lib\index.js:11070:21)"
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

export default Console
