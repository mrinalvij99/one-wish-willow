"use client";

import { motion } from "framer-motion";
import type { Phase } from "@/lib/types";

interface Props {
  phase: Phase;
}

export default function Background({ phase }: Props) {
  const isCharging = phase === "charging" || phase === "shaking" || phase === "breaking";
  const isDark =
    phase === "fading" || phase === "success" || phase === "breaking";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient layers */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 45%, #1a0000 0%, transparent 70%),
            radial-gradient(ellipse 100% 80% at 50% 100%, #120000 0%, transparent 60%),
            #050505
          `,
        }}
        animate={{
          opacity: isDark ? 0.15 : isCharging ? 0.55 : 1,
        }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />

      {/* Ambient red glow behind willow */}
      <motion.div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "55vmin",
          height: "55vmin",
          background:
            "radial-gradient(circle, rgba(255,26,26,0.18) 0%, rgba(255,26,26,0.06) 40%, transparent 70%)",
          filter: "blur(30px)",
          mixBlendMode: "screen",
        }}
        animate={{
          opacity:
            phase === "shaking"
              ? 0.95
              : phase === "charging"
              ? 0.7
              : phase === "breaking"
              ? 1
              : phase === "idle"
              ? 0.45
              : 0.2,
          scale:
            phase === "shaking"
              ? [1, 1.15, 1.08]
              : phase === "charging"
              ? [1, 1.08, 1]
              : 1,
        }}
        transition={{
          duration: phase === "shaking" ? 0.35 : 2.5,
          repeat: phase === "shaking" || phase === "charging" ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      {/* Subtle scan band */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.15) 2px, rgba(255,0,0,0.15) 3px)",
        }}
      />
    </div>
  );
}
