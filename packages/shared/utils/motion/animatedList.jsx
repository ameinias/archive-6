//https://magicui.design/docs/components/animated-list

// import { AnimatedList } from '@utils/motion/animatedList'


// Call with
//       <AnimatedList>
//   <p>Item 1</p>
//   <p>Item 2</p>
//   <p>Item 3</p>
// </AnimatedList>


import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AnimatePresence, motion, MotionProps } from "motion/react"

// import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }) {
  const animations= {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}



export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }) => {
    const [index, setIndex] = useState(0)
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )


    useEffect(() => {
      if (index < childrenArray.length - 1) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length)
        }, delay)

        return () => clearTimeout(timeout)
      }
    }, [index, delay, childrenArray.length])

    const itemsToShow = useMemo(() => {
      const result = childrenArray.slice(0, index + 1).reverse()
      return result
    }, [index, childrenArray])

    return (
      <div
        className={`flex flex-col items-center gap-4`}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
