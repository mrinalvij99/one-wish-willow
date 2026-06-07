"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Phase } from "@/lib/types";

interface Props { phase: Phase }

interface Particle {
  id: number;
  x: number;   // % from center (−50..50)
  y: number;   // % from willow center
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

let particleIdCounter = 0;

function makeParticle(index: number): Particle {
  return {
    id: particleIdCounter++,
    x: (Math.random() - 0.5) * 70,
    y: (Math.random() - 0.5) * 60,
    size: Math.random() * 3 + 1,
    duration: 2.5 + Math.random() * 3,
    delay: Math.random() * 2,
    drift: (Math.random() - 0.5) * 30,
  };
}

export default function Particles({ phase }: Props) {
  const targetCount = phase === "idle"
    ? 18
    : phase === "charging"
    ? 36
    : phase === "shaking"
    ? 55
    : 12;

  const [particles, setParticles] = useState<Particle[]>(() =>
    Array.from({ length: 18 }, (_, i) => makeParticle(i))
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setParticles((prev) => {
        const next = prev.filter(() => Math.random() > 0.25);
        while (next.length < targetCount) {
          next.push(makeParticle(next.length));
        }
        return next.slice(-targetCount);
      });
    }, 800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [targetCount]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]"
      aria-hidden
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              left: `calc(50% + ${p.x}vw)`,
              top:  `calc(50% + ${p.y * 0.6}vh)`,
              width:  p.size,
              height: p.size,
              background: "#ff1a1a",
              boxShadow: `0 0 ${p.size * 2}px rgba(255,26,26,0.8)`,
              borderRadius: 0,
            }}
            initial={{ opacity: 0, y: 0, x: 0 }}
            animate={{
              opacity: [0, 0.9, 0.7, 0],
              y: [-5, -40 - Math.random() * 40],
              x: [0, p.drift],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
