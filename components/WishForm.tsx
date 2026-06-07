"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Phase } from "@/lib/types";

interface Props {
  phase: Phase;
  wish: string;
  onWishChange: (value: string) => void;
  onGrant: () => void;
}

export default function WishForm({ phase, wish, onWishChange, onGrant }: Props) {
  const isLocked = phase !== "idle";
  const isVisible = phase === "idle" || phase === "charging";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="w-full max-w-md px-4 flex flex-col items-center gap-5"
          initial={{ opacity: 1, y: 0 }}
          animate={{
            opacity: phase === "charging" ? 0.4 : 1,
            y: 0,
          }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="text-horror-text text-[clamp(0.85rem,2.5vw,1.1rem)] tracking-[0.28em] text-glow-sm font-pixel"
            animate={{ opacity: phase === "charging" ? 0.5 : 1 }}
          >
            WHAT DO YOU WISH FOR?
          </motion.p>

          <input
            type="text"
            value={wish}
            onChange={(e) => onWishChange(e.target.value)}
            disabled={isLocked}
            placeholder="..."
            maxLength={120}
            className="wish-input w-full py-3 px-4 cursor-blink rounded-none"
            aria-label="Your wish"
          />

          <motion.button
            className="grant-btn w-full py-4 text-[clamp(1rem,3vw,1.35rem)] rounded-none uppercase"
            onClick={onGrant}
            disabled={isLocked || wish.trim().length === 0}
            whileHover={!isLocked ? { scale: 1.02 } : {}}
            whileTap={!isLocked ? { scale: 0.97 } : {}}
          >
            GRANT WISH
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
