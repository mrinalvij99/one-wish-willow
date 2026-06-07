"use client";

import { motion } from "framer-motion";
import type { Phase } from "@/lib/types";

interface Props { phase: Phase }

const RAY_COUNT = 12;

export default function RadialBurst({ phase }: Props) {
  const isActive  = phase !== "idle";
  const isCharging = phase === "charging";
  const isShaking  = phase === "shaking";

  const rotationDuration = isShaking ? 2.5 : isCharging ? 7 : 18;
  const opacity          = isShaking ? 0.28 : isCharging ? 0.18 : 0.07;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <motion.div
        className="relative"
        style={{ width: "60vmin", height: "60vmin" }}
        animate={{ rotate: isActive ? 360 : 0 }}
        transition={{
          rotate: {
            duration: rotationDuration,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <svg
          viewBox="-1 -1 2 2"
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          {Array.from({ length: RAY_COUNT }).map((_, i) => {
            const angle = (i / RAY_COUNT) * Math.PI * 2;
            const cos   = Math.cos(angle);
            const sin   = Math.sin(angle);
            const even  = i % 2 === 0;

            return (
              <motion.polygon
                key={i}
                points={`${cos * 0.06},${sin * 0.06} ${
                  Math.cos(angle + 0.12) * (even ? 1.6 : 1.1)
                },${Math.sin(angle + 0.12) * (even ? 1.6 : 1.1)} ${
                  Math.cos(angle - 0.12) * (even ? 1.6 : 1.1)
                },${Math.sin(angle - 0.12) * (even ? 1.6 : 1.1)}`}
                fill={`rgba(200,0,0,${opacity})`}
                style={{ mixBlendMode: "screen" }}
                animate={{ opacity: [opacity * 0.7, opacity, opacity * 0.7] }}
                transition={{
                  duration: 2 + (i % 3) * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            );
          })}

          {/* Centre bloom */}
          <motion.circle
            cx="0"
            cy="0"
            r="0.25"
            fill="none"
            stroke="rgba(255,30,30,0.25)"
            strokeWidth="0.04"
            animate={{
              r: [0.2, 0.3, 0.2],
              opacity: [0.15, opacity * 1.5, 0.15],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
