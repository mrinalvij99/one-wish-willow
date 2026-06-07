"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Phase } from "@/lib/types";

interface Props { phase: Phase }

export default function CRTOverlay({ phase }: Props) {
  const isShaking = phase === "shaking";
  const isFading = phase === "fading" || phase === "success";

  return (
    <>
      {/* Persistent CRT layers */}
      <div className="crt-scanlines pointer-events-none" />
      <div className="crt-vignette" />
      <div className="crt-curve" />
      <div className="vhs-line" />

      {/* Red flash during shaking */}
      <AnimatePresence>
        {isShaking && (
          <motion.div
            key="redflash"
            className="fixed inset-0 pointer-events-none z-[160]"
            style={{ background: "rgba(255,0,0,0.18)", mixBlendMode: "screen" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 0.7, 0, 0.5, 0] }}
            transition={{ duration: 0.45, repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* Fade-to-black overlay */}
      <AnimatePresence>
        {isFading && (
          <motion.div
            key="blackout"
            className="fixed inset-0 pointer-events-none z-[150]"
            style={{ background: "#000" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "fading" ? 0.94 : 0.88 }}
            transition={{ duration: 1.6, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
