"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Background from "@/components/Background";
import CRTOverlay from "@/components/CRTOverlay";
import VHSNoise from "@/components/VHSNoise";
import RadialBurst from "@/components/RadialBurst";
import Particles from "@/components/Particles";
import Willow from "@/components/Willow";
import WishForm from "@/components/WishForm";
import SuccessMessage from "@/components/SuccessMessage";
import AudioController from "@/components/AudioController";
import type { Phase } from "@/lib/types";

const PHASE_TIMING = {
  charging: 2800,
  shaking: 1800,
  breaking: 900,
  fading: 2100,
} as const;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [wish, setWish] = useState("");
  const [audioActivated, setAudioActivated] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const handleGrant = useCallback(() => {
    if (phase !== "idle" || wish.trim().length === 0) return;

    clearTimers();
    setAudioActivated(true);
    setPhase("charging");

    schedule(() => setPhase("shaking"), PHASE_TIMING.charging);
    schedule(
      () => setPhase("breaking"),
      PHASE_TIMING.charging + PHASE_TIMING.shaking
    );
    schedule(
      () => setPhase("fading"),
      PHASE_TIMING.charging + PHASE_TIMING.shaking + PHASE_TIMING.breaking
    );
    schedule(
      () => setPhase("success"),
      PHASE_TIMING.charging +
        PHASE_TIMING.shaking +
        PHASE_TIMING.breaking +
        PHASE_TIMING.fading
    );
  }, [phase, wish, clearTimers, schedule]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const isShaking = phase === "shaking";

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden font-pixel crt-flicker">
      <Background phase={phase} />

      {/* Screen shake wrapper */}
      <motion.div
        className="relative z-10 flex h-full w-full flex-col items-center justify-between px-4 py-6 sm:py-8"
        animate={
          isShaking
            ? {
                x: [0, -6, 8, -10, 7, -5, 9, -4, 0],
                y: [0, 4, -6, 5, -8, 3, -5, 2, 0],
              }
            : { x: 0, y: 0 }
        }
        transition={
          isShaking
            ? { duration: 0.35, repeat: Infinity, ease: "linear" }
            : { duration: 0.3 }
        }
      >
        {/* Title */}
        <motion.header
          className="text-center z-20 shrink-0"
          animate={{
            opacity:
              phase === "fading" || phase === "success"
                ? 0
                : phase === "charging" || phase === "shaking"
                ? 0.35
                : 1,
          }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-[clamp(1.6rem,6vw,3rem)] tracking-[0.22em] text-horror-text text-glow leading-tight">
            ONE WISH WILLOW
          </h1>
          <p className="mt-2 text-[clamp(0.65rem,2vw,0.9rem)] tracking-[0.32em] text-horror-light/60">
            ONE WISH. ONE CONSEQUENCE.
          </p>
        </motion.header>

        {/* Willow stage */}
        <div className="relative flex flex-1 w-full max-w-lg items-center justify-center min-h-0">
          <RadialBurst phase={phase} />
          <Particles phase={phase} />
          <Willow phase={phase} />
        </div>

        {/* Input */}
        <div className="z-20 w-full flex justify-center shrink-0 pb-2">
          <WishForm
            phase={phase}
            wish={wish}
            onWishChange={setWish}
            onGrant={handleGrant}
          />
        </div>
      </motion.div>

      <VHSNoise />
      <CRTOverlay phase={phase} />
      {phase === "success" && <SuccessMessage />}
      <AudioController phase={phase} userActivated={audioActivated} />
    </main>
  );
}
