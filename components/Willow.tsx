"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { Phase } from "@/lib/types";

interface Props { phase: Phase }

/* ── Constants ────────────────────────────────────────────── */
const STICK_PATH =
  "M38 8 C42 30, 36 55, 40 80 C44 105, 38 130, 42 155 C44 175, 40 192, 38 198";

const SHARD_COUNT = 8;
// Deterministic seed so shards are consistent across renders
const SEED_SHARDS = Array.from({ length: SHARD_COUNT }, (_, i) => {
  const t = (i / SHARD_COUNT) * Math.PI * 2;
  const r = 80 + (i % 3) * 40;
  return {
    id: i,
    x: Math.cos(t) * r + (i % 2 === 0 ? 15 : -15),
    y: Math.sin(t) * r * 0.7 - 20,
    rotate: (i * 47) % 360,
    scale: 0.35 + (i % 4) * 0.15,
  };
});

/* ── Shared stick visuals ─────────────────────────────────── */
function StickBody({ clipId, glowId }: { clipId?: string; glowId: string }) {
  return (
    <svg
      viewBox="0 0 80 200"
      className="w-full h-full"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <defs>
        {clipId && (
          <clipPath id={clipId}>
            {/* Top half: y 0→100 */}
            <rect
              x="0" y="0"
              width="80"
              height={clipId.endsWith("top") ? 100 : 0}
            />
          </clipPath>
        )}
        {clipId && clipId.endsWith("bot") && (
          <clipPath id={clipId}>
            {/* Bottom half: y 100→200 */}
            <rect x="0" y="100" width="80" height="100"/>
          </clipPath>
        )}
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g clipPath={clipId ? `url(#${clipId})` : undefined} filter={`url(#${glowId})`}>
        {/* Outer dark stroke — body */}
        <path d={STICK_PATH} fill="none" stroke="#3d1a0a" strokeWidth="9"  strokeLinecap="round"/>
        {/* Mid colour */}
        <path d={STICK_PATH} fill="none" stroke="#5c2e14" strokeWidth="5"  strokeLinecap="round"/>
        {/* Highlight groove */}
        <path
          d="M36 20 C34 45, 38 70, 36 95 C34 120, 38 145, 36 170"
          fill="none" stroke="#7a4020" strokeWidth="1.5" opacity="0.5"
        />
        {/* Grain shadow */}
        <path
          d="M42 35 C44 60, 40 85, 44 110 C46 135, 42 160, 44 185"
          fill="none" stroke="#2a1208" strokeWidth="1" opacity="0.6"
        />

        {/* Mystical carvings */}
        <text x="40" y="55"  textAnchor="middle" fill="#ff1a1a" fontSize="7" fontFamily="monospace" opacity="0.85">☽</text>
        <text x="40" y="95"  textAnchor="middle" fill="#ff3333" fontSize="6" fontFamily="monospace" opacity="0.7">✦</text>
        <text x="40" y="135" textAnchor="middle" fill="#ff1a1a" fontSize="7" fontFamily="monospace" opacity="0.85">☾</text>

        {/* Knot */}
        <ellipse cx="40" cy="168" rx="5" ry="3" fill="#2a1208" opacity="0.7"/>

        {/* Glow fringe */}
        <path
          d={STICK_PATH}
          fill="none"
          stroke="rgba(255,26,26,0.35)"
          strokeWidth="12"
          strokeLinecap="round"
          style={{ mixBlendMode: "screen" }}
        />
      </g>
    </svg>
  );
}

/* ── Main component ───────────────────────────────────────── */
export default function Willow({ phase }: Props) {
  const controls = useAnimationControls();

  const isBroken      = phase === "breaking" || phase === "fading" || phase === "success";
  const isAccelerating = phase === "shaking";
  const isCharging     = phase === "charging";

  const glowIntensity =
    phase === "shaking"  ? 1 :
    phase === "charging" ? 0.6 :
    phase === "idle"     ? 0.2 : 0.7;

  // Drive the float/shake animation on the intact willow
  useEffect(() => {
    if (isBroken) { controls.stop(); return; }

    const dur     = isAccelerating ? 0.4  : isCharging ? 2.5 : 6;
    const floatDur = isAccelerating ? 0.25 : isCharging ? 2   : 4.5;
    const scaleB  = isAccelerating ? 1.06 : isCharging ? 1.03 : 1;

    controls.start({
      y:       isAccelerating ? [-8, 8, -8]    : [-14, 14, -14],
      rotateY: isAccelerating ? [-35, 35, -35] : [-20, 20, -20],
      rotateZ: isAccelerating ? [-6, 6, -6]    : [-3, 3, -3],
      scale:   [scaleB, scaleB * 1.025, scaleB],
      transition: {
        y:       { duration: floatDur, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: dur,      repeat: Infinity, ease: "easeInOut" },
        rotateZ: { duration: dur * 1.3,repeat: Infinity, ease: "easeInOut" },
        scale:   { duration: isAccelerating ? 0.3 : 3, repeat: Infinity, ease: "easeInOut" },
      },
    });
  }, [phase, isBroken, isAccelerating, isCharging, controls]);

  const containerStyle: React.CSSProperties = {
    width:  "clamp(60px, 12vw, 90px)",
    height: "clamp(200px, 38vh, 340px)",
    perspective: "900px",
  };

  const glowFilter = `drop-shadow(0 0 ${12 + glowIntensity * 25}px rgba(255,26,26,${0.3 + glowIntensity * 0.5}))`;

  /* ── Broken state ──────────────────────────────────────── */
  if (isBroken) {
    const isBreaking = phase === "breaking";
    const pieceOpacity = phase === "fading" ? 0.35 : phase === "success" ? 0.4 : 0.85;

    return (
      <div className="relative flex items-center justify-center" style={containerStyle}>

        {/* TOP piece — snaps up-left */}
        <motion.div
          className="absolute w-full h-full"
          style={{ transformStyle: "preserve-3d", transformOrigin: "50% 50%" }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: -85, y: -65, rotate: -38, opacity: pieceOpacity }}
          transition={isBreaking ? { duration: 0.6, ease: [0.2, 0.8, 0.3, 1] } : { duration: 0 }}
        >
          <svg
            viewBox="0 0 80 200"
            className="w-full h-full"
            style={{ overflow: "visible", filter: glowFilter }}
            aria-hidden
          >
            <defs>
              <clipPath id="wt-clip-top">
                <rect x="0" y="0" width="80" height="100"/>
              </clipPath>
              <filter id="wt-glow-top">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <g clipPath="url(#wt-clip-top)" filter="url(#wt-glow-top)">
              <path d={STICK_PATH} fill="none" stroke="#3d1a0a" strokeWidth="9"  strokeLinecap="round"/>
              <path d={STICK_PATH} fill="none" stroke="#5c2e14" strokeWidth="5"  strokeLinecap="round"/>
              <path d="M36 20 C34 45, 38 70, 36 95 C34 120, 38 145, 36 170" fill="none" stroke="#7a4020" strokeWidth="1.5" opacity="0.5"/>
              <text x="40" y="55" textAnchor="middle" fill="#ff1a1a" fontSize="7" fontFamily="monospace" opacity="0.85">☽</text>
              <text x="40" y="95" textAnchor="middle" fill="#ff3333" fontSize="6" fontFamily="monospace" opacity="0.7">✦</text>
              <path d={STICK_PATH} fill="none" stroke="rgba(255,26,26,0.35)" strokeWidth="12" strokeLinecap="round" style={{ mixBlendMode: "screen" }}/>
            </g>
          </svg>
        </motion.div>

        {/* BOTTOM piece — falls down-right */}
        <motion.div
          className="absolute w-full h-full"
          style={{ transformStyle: "preserve-3d", transformOrigin: "50% 50%" }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: 75, y: 75, rotate: 32, opacity: pieceOpacity }}
          transition={isBreaking ? { duration: 0.6, ease: [0.2, 0.8, 0.3, 1], delay: 0.02 } : { duration: 0 }}
        >
          <svg
            viewBox="0 0 80 200"
            className="w-full h-full"
            style={{ overflow: "visible", filter: glowFilter }}
            aria-hidden
          >
            <defs>
              <clipPath id="wt-clip-bot">
                <rect x="0" y="100" width="80" height="100"/>
              </clipPath>
              <filter id="wt-glow-bot">
                <feGaussianBlur stdDeviation="2" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <g clipPath="url(#wt-clip-bot)" filter="url(#wt-glow-bot)">
              <path d={STICK_PATH} fill="none" stroke="#3d1a0a" strokeWidth="9"  strokeLinecap="round"/>
              <path d={STICK_PATH} fill="none" stroke="#5c2e14" strokeWidth="5"  strokeLinecap="round"/>
              <path d="M42 35 C44 60, 40 85, 44 110 C46 135, 42 160, 44 185" fill="none" stroke="#2a1208" strokeWidth="1" opacity="0.6"/>
              <text x="40" y="135" textAnchor="middle" fill="#ff1a1a" fontSize="7" fontFamily="monospace" opacity="0.85">☾</text>
              <ellipse cx="40" cy="168" rx="5" ry="3" fill="#2a1208" opacity="0.7"/>
              <path d={STICK_PATH} fill="none" stroke="rgba(255,26,26,0.35)" strokeWidth="12" strokeLinecap="round" style={{ mixBlendMode: "screen" }}/>
            </g>
          </svg>
        </motion.div>

        {/* Shards — splinter fragments from the snap point (y≈100 = 50% height) */}
        {SEED_SHARDS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-[1px]"
            style={{
              width:  6 * s.scale,
              height: 14 * s.scale,
              background: "linear-gradient(180deg, #5c2e14, #2a1208)",
              boxShadow: "0 0 5px rgba(255,26,26,0.5)",
              left: "50%",
              top:  "50%",
              marginLeft: -3 * s.scale,
              marginTop:  -7 * s.scale,
            }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
            animate={{
              x: s.x,
              y: s.y,
              rotate: s.rotate,
              opacity: phase === "fading" ? 0.15 : 0.7,
            }}
            transition={
              isBreaking
                ? { duration: 0.55, ease: "easeOut", delay: 0.06 + s.id * 0.025 }
                : { duration: 0 }
            }
          />
        ))}
      </div>
    );
  }

  /* ── Intact floating state ─────────────────────────────── */
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ ...containerStyle, transformStyle: "preserve-3d" }}
      animate={controls}
    >
      <motion.div
        className="w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ filter: glowFilter }}
        transition={{ duration: 0.8 }}
      >
        <svg
          viewBox="0 0 80 200"
          className="w-full h-full"
          style={{ overflow: "visible" }}
          aria-hidden
        >
          <defs>
            <filter id="wt-glow-intact">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#wt-glow-intact)">
            <path d={STICK_PATH} fill="none" stroke="#3d1a0a" strokeWidth="9"  strokeLinecap="round"/>
            <path d={STICK_PATH} fill="none" stroke="#5c2e14" strokeWidth="5"  strokeLinecap="round"/>
            <path d="M36 20 C34 45, 38 70, 36 95 C34 120, 38 145, 36 170" fill="none" stroke="#7a4020" strokeWidth="1.5" opacity="0.5"/>
            <path d="M42 35 C44 60, 40 85, 44 110 C46 135, 42 160, 44 185" fill="none" stroke="#2a1208" strokeWidth="1" opacity="0.6"/>
            <text x="40" y="55"  textAnchor="middle" fill="#ff1a1a" fontSize="7" fontFamily="monospace" opacity="0.85">☽</text>
            <text x="40" y="95"  textAnchor="middle" fill="#ff3333" fontSize="6" fontFamily="monospace" opacity="0.7">✦</text>
            <text x="40" y="135" textAnchor="middle" fill="#ff1a1a" fontSize="7" fontFamily="monospace" opacity="0.85">☾</text>
            <ellipse cx="40" cy="168" rx="5" ry="3" fill="#2a1208" opacity="0.7"/>
            <path d={STICK_PATH} fill="none" stroke="rgba(255,26,26,0.35)" strokeWidth="12" strokeLinecap="round" style={{ mixBlendMode: "screen" }}/>
          </g>
        </svg>
      </motion.div>

      {/* Pulsing ambient halo */}
      <motion.div
        className="absolute -inset-8 pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(255,26,26,0.12) 0%, transparent 70%)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.4, 0.75, 0.4], scale: [0.95, 1.06, 0.95] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
