import React from 'react';
import { eventManager } from '@utils/events'
import Button from 'react-bootstrap/Button';
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@utils/terminal"

export default function Conversation() {

{/*
  Other components for animation

*/}

// const appVersion = process.env.APP_VERSION || 'newapp';

return (
  <div>
   <Terminal>
  <TypingAnimation>pnpm dlx shadcn@latest init</TypingAnimation>
  <AnimatedSpan>✔ Preflight checks.</AnimatedSpan>
  <AnimatedSpan>✔ Validating Tailwind CSS.</AnimatedSpan>
  <TypingAnimation>Success! Project initialization completed.</TypingAnimation>
</Terminal>
{/* npx shadcn@latest add @magicui/terminal */}

  </div>
);
}
