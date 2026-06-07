"use client";

import { motion } from "framer-motion";
// SuccessMessage has no Phase dependency — shown only when phase === "success"

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.9, delayChildren: 0.4 },
  },
};

const lineVariant = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

interface Line {
  text: string;
  className: string;
  glitch?: boolean;
}

const LINES: Line[] = [
  {
    text: "YOUR WISH",
    className: "text-[clamp(2.4rem,8vw,4.5rem)] tracking-[0.25em] text-glow-xl",
    glitch: true,
  },
  {
    text: "HAS BEEN GRANTED",
    className: "text-[clamp(2.4rem,8vw,4.5rem)] tracking-[0.25em] text-glow-xl",
    glitch: true,
  },
  {
    text: "─────────────────────",
    className: "text-[clamp(0.9rem,2.5vw,1.2rem)] opacity-30 tracking-widest mt-2",
  },
  {
    text: "PLEASE WAIT 24 HOURS",
    className: "text-[clamp(1.2rem,3.5vw,1.8rem)] tracking-[0.18em] opacity-80 mt-1",
  },
  {
    text: "TO SEE EFFECT",
    className: "text-[clamp(1.2rem,3.5vw,1.8rem)] tracking-[0.18em] opacity-80",
  },
  {
    text: "─────────────────────",
    className: "text-[clamp(0.9rem,2.5vw,1.2rem)] opacity-30 tracking-widest mt-2",
  },
  {
    text: "THE WILLOW HAS HEARD YOU.",
    className: "text-[clamp(0.9rem,2.5vw,1.1rem)] tracking-[0.22em] opacity-55 mt-3",
  },
];

export default function SuccessMessage() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[170] pointer-events-none px-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="text-center" style={{ color: "#ff4444", fontFamily: "var(--font-vt323), monospace" }}>
        {LINES.map((line, i) => (
          <motion.div key={i} variants={lineVariant} className={line.className}>
            {line.glitch ? (
              <span
                className="glitch-wrap"
                data-text={line.text}
                style={{ display: "inline-block" }}
              >
                {line.text}
              </span>
            ) : (
              line.text
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
