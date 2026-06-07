"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Phase } from "@/lib/types";

interface Props {
  phase: Phase;
  userActivated?: boolean;
}

/* ── Synthesised sound engine ────────────────────────────── */
class SoundEngine {
  private ctx: AudioContext;
  private master: GainNode;
  private ambientOscs: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private chargingOscs: OscillatorNode[] = [];

  constructor() {
    this.ctx    = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
  }

  resume() { this.ctx.resume(); }

  // Low ambient drone + CRT hum
  startAmbient() {
    const now = this.ctx.currentTime;

    // Sub drone  42 Hz
    const osc1 = this.ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.value = 42;
    const g1 = this.ctx.createGain();
    g1.gain.value = 0.04;
    osc1.connect(g1); g1.connect(this.master); osc1.start(now);
    this.ambientOscs.push(osc1);

    // Warmth  80 Hz
    const osc2 = this.ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 80;
    const g2 = this.ctx.createGain();
    g2.gain.value = 0.025;
    osc2.connect(g2); g2.connect(this.master); osc2.start(now);
    this.ambientOscs.push(osc2);

    // CRT hum  60 Hz
    const osc3 = this.ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = 60;
    const g3 = this.ctx.createGain();
    g3.gain.value = 0.012;
    osc3.connect(g3); g3.connect(this.master); osc3.start(now);
    this.ambientOscs.push(osc3);

    // 3rd harmonic of hum  180 Hz
    const osc4 = this.ctx.createOscillator();
    osc4.type = "sine";
    osc4.frequency.value = 180;
    const g4 = this.ctx.createGain();
    g4.gain.value = 0.005;
    osc4.connect(g4); g4.connect(this.master); osc4.start(now);
    this.ambientOscs.push(osc4);
  }

  // Rising charging whine
  startCharging() {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 3.5);

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.01, now);
    g.gain.linearRampToValueAtTime(0.07, now + 2.5);
    g.gain.linearRampToValueAtTime(0, now + 4);

    osc.connect(g); g.connect(this.master);
    osc.start(now); osc.stop(now + 4);
    this.chargingOscs.push(osc);
  }

  // Wood crack + low-end boom
  playCrack() {
    const now    = this.ctx.currentTime;
    const sr     = this.ctx.sampleRate;
    const bufLen = Math.floor(sr * 0.35);
    const buf    = this.ctx.createBuffer(1, bufLen, sr);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.value = 1400;
    bpf.Q.value = 0.6;

    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.55, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(bpf); bpf.connect(ng); ng.connect(this.master);
    noise.start(now);

    // Sub boom
    const boom = this.ctx.createOscillator();
    boom.type = "sine";
    boom.frequency.setValueAtTime(60, now + 0.04);
    boom.frequency.exponentialRampToValueAtTime(20, now + 0.6);

    const bg = this.ctx.createGain();
    bg.gain.setValueAtTime(0, now);
    bg.gain.linearRampToValueAtTime(0.5, now + 0.05);
    bg.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    boom.connect(bg); bg.connect(this.master);
    boom.start(now); boom.stop(now + 0.8);
  }

  setMuted(muted: boolean) {
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(muted ? 0 : 1, now, 0.15);
  }

  destroy() {
    this.ambientOscs.forEach((n) => { try { (n as OscillatorNode).stop?.(); } catch {} });
    this.chargingOscs.forEach((n) => { try { n.stop?.(); } catch {} });
    this.ctx.close();
  }
}

/* ── Component ───────────────────────────────────────────── */
export default function AudioController({ phase, userActivated }: Props) {
  const [muted, setMuted]   = useState(true);
  const engineRef           = useRef<SoundEngine | null>(null);
  const prevPhase           = useRef<Phase>("idle");
  const started             = useRef(false);

  // Bootstrap engine on first user interaction
  function ensureEngine() {
    if (engineRef.current) return;
    const engine = new SoundEngine();
    engine.resume();
    engine.startAmbient();
    engine.setMuted(true);
    engineRef.current = engine;
    started.current   = true;
  }

  useEffect(() => {
    if (userActivated) ensureEngine();
  }, [userActivated]);

  // React to phase changes
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (phase === "charging" && prevPhase.current === "idle") {
      engine.startCharging();
    }
    if (phase === "breaking" && prevPhase.current !== "breaking") {
      engine.playCrack();
    }
    prevPhase.current = phase;
  }, [phase]);

  // Cleanup
  useEffect(() => {
    return () => { engineRef.current?.destroy(); };
  }, []);

  function toggleMute() {
    ensureEngine();
    const next = !muted;
    setMuted(next);
    engineRef.current?.setMuted(next);
  }

  return (
    <motion.button
      className="mute-btn fixed bottom-5 right-5 z-[210] w-11 h-11 flex items-center justify-center text-xl rounded-sm"
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      title={muted ? "Unmute" : "Mute"}
      aria-label={muted ? "Unmute" : "Mute"}
    >
      {muted ? "🔇" : "🔊"}
    </motion.button>
  );
}
