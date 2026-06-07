"use client";

import { useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import type { Phase } from "@/lib/types";

interface Props { phase: Phase }

/* ── SVG paths ────────────────────────────────────────────── */
// Full stick outline — used in both whole-stick and clipped pieces
const STICK_D =
  "M40 8 C38 6,35 9,33 25 C31 50,30 100,30 213 L30 390 Q29 408 40 410 Q51 408 50 390 L50 213 C50 100,49 50,47 25 C45 9,42 6,40 8 Z";

/* Tiny splinter shapes clustered around the break point y≈213 */
const SHARDS = [
  { id: 0, d: "M38 208 L36 214 L40 218 Z",      dx: -88, dy: -65, rot: -135, w: 5,  h: 14 },
  { id: 1, d: "M42 209 L46 213 L43 221 Z",      dx:  92, dy: -40, rot:  148, w: 4,  h: 12 },
  { id: 2, d: "M33 208 L31 214 L35 222 Z",      dx: -108, dy: 25, rot: -112, w: 3,  h: 18 },
  { id: 3, d: "M47 211 L51 209 L49 220 Z",      dx: 112, dy:  50, rot:  130, w: 4,  h: 14 },
  { id: 4, d: "M37 212 L35 219 L40 224 L41 218 Z", dx: -52, dy: 85, rot:  -95, w: 5,  h: 10 },
  { id: 5, d: "M43 208 L47 211 L44 219 Z",      dx:  68, dy: -85, rot:  118, w: 3,  h: 16 },
  { id: 6, d: "M36 214 L33 219 L38 221 Z",      dx: -60, dy: 70,  rot: -148, w: 4,  h: 12 },
  { id: 7, d: "M44 213 L48 218 L45 224 Z",      dx:  88, dy: 80,  rot:  122, w: 3,  h: 14 },
];

const SVG_H = "40vh";

/* ── Inner SVG content (shared between whole + clipped copies) ── */
function StickContent({ pfx }: { pfx: string }) {
  return (
    <>
      {/* Wood body */}
      <path d={STICK_D} fill={`url(#${pfx}-wood)`} />
      {/* Highlight */}
      <path d={STICK_D} fill={`url(#${pfx}-shine)`} />

      {/* Carved tip */}
      <path d="M40 5 L37 12 L40 10 L43 12 Z" fill="#120802" />

      {/* Grain lines */}
      <path d="M35 28 Q34 65 33 110"  stroke="#0d0401" strokeWidth="0.5" opacity="0.75" fill="none"/>
      <path d="M38 40 Q37 85 36 140"  stroke="#0d0401" strokeWidth="0.3" opacity="0.55" fill="none"/>
      <path d="M44 32 Q45 78 45 125"  stroke="#0d0401" strokeWidth="0.5" opacity="0.70" fill="none"/>
      <path d="M46 55 Q47 105 47 165" stroke="#0d0401" strokeWidth="0.3" opacity="0.50" fill="none"/>
      <path d="M32 155 Q31 200 31 255"stroke="#0d0401" strokeWidth="0.3" opacity="0.50" fill="none"/>
      <path d="M48 165 Q49 215 49 265"stroke="#0d0401" strokeWidth="0.4" opacity="0.60" fill="none"/>
      <path d="M34 275 Q33 325 33 375"stroke="#0d0401" strokeWidth="0.3" opacity="0.50" fill="none"/>
      <path d="M46 285 Q47 335 47 378"stroke="#0d0401" strokeWidth="0.4" opacity="0.60" fill="none"/>

      {/* Knots */}
      <ellipse cx="37" cy="98"  rx="3.2" ry="4.5" fill="#0d0401" opacity="0.50"/>
      <circle  cx="44" cy="102" r="1.8"            fill="#0d0401" opacity="0.40"/>
      <ellipse cx="42" cy="285" rx="2.6" ry="3.8" fill="#0d0401" opacity="0.40"/>

      {/* Left branch (y≈128, inside top-clip) */}
      <path d="M30 128 C21 124 15 119 10 112"    stroke="#3a1a08" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
      <path d="M30 128 C21 124 15 119 10 112"    stroke="#5a2810" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M20 122 C16 115 13 109 11 103"    stroke="#3a1a08" strokeWidth="3"   strokeLinecap="round" fill="none"/>

      {/* Right branch (y≈248, inside bottom-clip) */}
      <path d="M50 248 C59 244 65 239 70 233"    stroke="#3a1a08" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      <path d="M50 248 C59 244 65 239 70 233"    stroke="#5a2810" strokeWidth="2"   strokeLinecap="round" fill="none" opacity="0.5"/>

      {/* Grip wrap bands */}
      <rect x="29" y="178" width="22" height="2.5" rx="1" fill="#100601" opacity="0.48"/>
      <rect x="29" y="183" width="22" height="2"   rx="1" fill="#100601" opacity="0.36"/>
      <rect x="29" y="188" width="22" height="2.5" rx="1" fill="#100601" opacity="0.48"/>
      <rect x="29" y="193" width="22" height="2"   rx="1" fill="#100601" opacity="0.36"/>

      {/* Base cap */}
      <ellipse cx="40" cy="407" rx="11.5" ry="3.5" fill="#0d0401" opacity="0.75"/>
      <path d="M30 392 Q29 410 40 411 Q51 410 50 392" fill="#180901" opacity="0.5"/>
    </>
  );
}

/* ── Component ───────────────────────────────────────────── */
export default function WillowStick({ phase }: Props) {
  const floatControls = useAnimation();
  const isBroken      = phase === "breaking" || phase === "fading" || phase === "success";

  const glowPulse  = phase === "charging" ? 0.55 : phase === "shaking" ? 0.8 : phase === "idle" ? 0.35 : 0.2;
  const filterCSS  = {
    idle:     "drop-shadow(0 0 18px rgba(255,50,0,0.45)) drop-shadow(0 0 36px rgba(200,0,0,0.28))",
    charging: "drop-shadow(0 0 28px rgba(255,60,0,0.72)) drop-shadow(0 0 55px rgba(200,0,0,0.45))",
    shaking:  "drop-shadow(0 0 42px rgba(255,80,0,0.9))  drop-shadow(0 0 80px rgba(255,0,0,0.6))",
    breaking: "drop-shadow(0 0 12px rgba(255,30,0,0.3))",
    fading:   "drop-shadow(0 0 6px  rgba(255,20,0,0.18))",
    success:  "drop-shadow(0 0 6px  rgba(255,20,0,0.18))",
  }[phase];

  useEffect(() => {
    if (phase === "idle") {
      floatControls.start({
        rotateY: [-18, 18, -18],
        y:       [0, -14, 0],
        scale:   [1, 1.025, 1],
        rotateZ: [-1, 1, -1],
        x: 0,
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      });
    } else if (phase === "charging") {
      floatControls.start({
        rotateY: [-23, 23, -23],
        y:       [0, -20, 0],
        scale:   [1, 1.05, 1],
        rotateZ: [-1.6, 1.6, -1.6],
        x: 0,
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      });
    } else if (phase === "shaking") {
      floatControls.stop();
      floatControls.start({
        x:       [-5, 5, -4, 4, -3, 3, -2, 2, 0],
        y:       [-2, 2, -2, 2, -1, 1, 0],
        rotateZ: [-4, 4, -3, 3, -2, 2, 0],
        scale:   1.04,
        transition: { duration: 0.22, repeat: Infinity, ease: "linear" },
      });
    } else if (phase === "breaking") {
      floatControls.stop();
      // Snap to neutral so pieces fly in clean 2-D space
      floatControls.set({ rotateY: 0, rotateZ: 0, x: 0, y: 0, scale: 1 });
    }
  }, [phase, floatControls]);

  /* Shared gradient defs (declared in the whole-stick SVG, referenced globally) */
  const WoodDefs = ({ pfx }: { pfx: string }) => (
    <defs>
      <linearGradient id={`${pfx}-wood`} x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#170a03"/>
        <stop offset="22%"  stopColor="#3a1a08"/>
        <stop offset="40%"  stopColor="#5a2810"/>
        <stop offset="50%"  stopColor="#6b2f12"/>
        <stop offset="60%"  stopColor="#5a2810"/>
        <stop offset="78%"  stopColor="#3a1a08"/>
        <stop offset="100%" stopColor="#170a03"/>
      </linearGradient>
      <linearGradient id={`${pfx}-shine`} x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="rgba(200,100,50,0)"/>
        <stop offset="40%"  stopColor="rgba(200,100,50,0)"/>
        <stop offset="48%"  stopColor="rgba(230,115,55,0.14)"/>
        <stop offset="54%"  stopColor="rgba(245,120,60,0.24)"/>
        <stop offset="68%"  stopColor="rgba(200,100,50,0.06)"/>
        <stop offset="100%" stopColor="rgba(200,100,50,0)"/>
      </linearGradient>
    </defs>
  );

  return (
    <div className="relative flex items-center justify-center">

      {/* ── Ambient glow behind the stick ─────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: "-60%", zIndex: 0 }}
        aria-hidden
      >
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [glowPulse * 0.7, glowPulse, glowPulse * 0.7] }}
          transition={{ duration: phase === "shaking" ? 0.4 : 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 45% 55% at 50% 50%, rgba(255,30,0,0.6) 0%, rgba(200,0,0,0.3) 35%, transparent 70%)",
            filter: "blur(28px)",
          }}
        />
      </div>

      {/* ── Whole floating stick ───────────────────────── */}
      <div style={{ perspective: "700px", perspectiveOrigin: "50% 50%", zIndex: 1 }}>
        <motion.div animate={floatControls} style={{ transformStyle: "preserve-3d" }}>
          <motion.svg
            viewBox="0 0 80 420"
            style={{ height: SVG_H, width: "auto", display: "block", overflow: "visible", filter: filterCSS }}
            animate={{ opacity: isBroken ? 0 : 1 }}
            transition={{ duration: 0.1 }}
          >
            <WoodDefs pfx="oww" />
            <StickContent pfx="oww" />
          </motion.svg>
        </motion.div>
      </div>

      {/* ── Broken pieces (appear in-place, then fly) ─── */}
      <AnimatePresence>
        {isBroken && (
          <>
            {/* TOP piece */}
            <motion.div
              key="top-piece"
              className="absolute"
              style={{
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                transformOrigin: "50% 51%",
                zIndex: 2,
              }}
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{ x: -62, y: -98, rotate: -44 }}
              transition={{ duration: 1.0, ease: [0.2, 0, 0.72, 1] }}
            >
              <svg
                viewBox="0 0 80 420"
                style={{ height: SVG_H, width: "auto", display: "block", overflow: "visible", filter: filterCSS }}
              >
                <defs>
                  <clipPath id="oww-clip-top">
                    <rect x="0" y="0" width="80" height="213"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#oww-clip-top)">
                  <StickContent pfx="oww" />
                </g>
              </svg>
            </motion.div>

            {/* BOTTOM piece */}
            <motion.div
              key="bot-piece"
              className="absolute"
              style={{
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                transformOrigin: "50% 51%",
                zIndex: 2,
              }}
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{ x: 68, y: 105, rotate: 36 }}
              transition={{ duration: 1.0, ease: [0.2, 0, 0.72, 1] }}
            >
              <svg
                viewBox="0 0 80 420"
                style={{ height: SVG_H, width: "auto", display: "block", overflow: "visible", filter: filterCSS }}
              >
                <defs>
                  <clipPath id="oww-clip-bot">
                    <rect x="0" y="213" width="80" height="210"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#oww-clip-bot)">
                  <StickContent pfx="oww" />
                </g>
              </svg>
            </motion.div>

            {/* SHARDS — div rectangles exploding from break point */}
            {SHARDS.map((s) => (
              <motion.div
                key={`shard-${s.id}`}
                style={{
                  position: "absolute",
                  top: "calc(50% + 1%)",
                  left: "50%",
                  marginLeft: -(s.w / 2),
                  width: s.w,
                  height: s.h,
                  background: "#4a2010",
                  borderRadius: 1,
                  transformOrigin: "center",
                  zIndex: 3,
                }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                animate={{
                  x:       s.dx * 0.55,
                  y:       s.dy * 0.55,
                  rotate:  s.rot,
                  opacity: [0, 1, 0.85],
                }}
                transition={{ duration: 1.1, ease: "easeOut", times: [0, 0.12, 1] }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
