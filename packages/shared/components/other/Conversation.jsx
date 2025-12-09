import React from 'react';
import { eventManager } from '@utils/events'
import Button from 'react-bootstrap/Button';
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@utils/motion/terminal"

import { MorphingText } from "@utils/motion/Morphing"

export default function Conversation() {
  // Other components for animation
  // const appVersion = process.env.APP_VERSION || 'newapp';
  // https://magicui.design/docs/components/spinning-text
  //https://magicui.design/docs/components/morphing-text


  return (
  <div>

    {/* <MorphingText texts={["you","us"]} /> */}


   <Terminal sequence={true} startOnView={true}>

  <TypingAnimation delay={100} duration={50}>thank you for playing along</TypingAnimation>
  <AnimatedSpan delay={180} ></AnimatedSpan>
  <AnimatedSpan delay={180} >We have you now.</AnimatedSpan>
    <AnimatedSpan delay={180} ></AnimatedSpan>
  <AnimatedSpan delay={100} >We are you now.</AnimatedSpan>
  <TypingAnimation>We will do whatever we need with what you've given us.</TypingAnimation>

   <AnimatedSpan>Your <span className="text-red">sacrifice</span> is appreciated.

   </AnimatedSpan>

</Terminal>






  </div>
);
}
