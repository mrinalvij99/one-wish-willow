'use client';

export default function Home() {
  return (
    <>
      <style jsx global>{`
        /* ─── Reset & base ────────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; background: #050505; }

        :root {
          --red:   #ff4444;
          --glow:  #ff1a1a;
          --dark:  #050505;
          --font:  'VT323', 'Courier New', monospace;
        }

        body {
          font-family: var(--font);
          color: var(--red);
          user-select: none;
          -webkit-user-select: none;
        }

        /* ─── CRT scanlines ───────────────────────────────────────── */
        body::before {
          content: '';
          position: fixed; inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px, transparent 3px,
            rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px
          );
          pointer-events: none; z-index: 9000;
        }

        body::after {
          content: '';
          position: fixed; inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,5,5,0.016) 0px, rgba(255,5,5,0.016) 2px,
            transparent 2px, transparent 4px
          );
          pointer-events: none; z-index: 9001;
        }

        /* ─── CRT vignette ────────────────────────────────────────── */
        #vignette {
          position: fixed; inset: 0;
          background: radial-gradient(ellipse 92% 92% at 50% 50%,
            transparent 38%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.90) 100%);
          pointer-events: none; z-index: 8900;
        }

        #crt-curve {
          position: fixed; inset: 0;
          border-radius: 5%;
          box-shadow: inset 0 0 120px rgba(0,0,0,0.72),
                      inset 0 0 40px rgba(180,0,0,0.04);
          pointer-events: none; z-index: 8800;
        }

        #vhs-line {
          position: fixed; left: 0; width: 100%; height: 3px;
          background: linear-gradient(to right,
            transparent, rgba(255,30,30,0.045) 20%,
            rgba(255,30,30,0.08) 50%,
            rgba(255,30,30,0.045) 80%, transparent);
          pointer-events: none; z-index: 9002;
          animation: vhsScan 5s linear infinite;
        }

        @keyframes vhsScan {
          0%   { top: -4px; }
          100% { top: 100vh; }
        }

        #film-grain {
          position: fixed; inset: 0;
          opacity: 0.04;
          mix-blend-mode: overlay;
          pointer-events: none; z-index: 8700;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          animation: grain 0.12s steps(4) infinite;
        }

        @keyframes grain {
          0%  { transform: translate(0,0); }
          25% { transform: translate(-2%, 1%); }
          50% { transform: translate(1%,-2%); }
          75% { transform: translate(-1%,-1%); }
        }

        body.phase-idle #red-flash { opacity: 0; }
        body.phase-charging #red-flash { opacity: 1; animation: pulse 0.2s ease-in-out infinite; }
        body.phase-shaking #red-flash { opacity: 1; }
        body.phase-breaking #red-flash { opacity: 0; }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        #red-flash {
          position: fixed; inset: 0;
          background: rgba(255, 20, 20, 0.25);
          pointer-events: none; z-index: 8900;
          opacity: 0;
          transition: opacity 0.2s;
        }

        #blackout {
          position: fixed; inset: 0;
          background: #000;
          pointer-events: none; z-index: 8950;
          opacity: 0;
          transition: opacity 1.7s ease-in;
        }

        #blackout.active { opacity: 1; }

        #container {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        #title {
          position: absolute;
          top: clamp(20px, 5vh, 60px);
          font-size: clamp(28px, 8vw, 72px);
          font-weight: bold;
          text-align: center;
          letter-spacing: 2px;
          color: var(--red);
          text-shadow: 0 0 20px var(--glow), 0 0 40px rgba(255,20,20,0.3);
          line-height: 1;
          z-index: 100;
        }

        #tagline {
          position: absolute;
          top: clamp(55px, 12vh, 105px);
          font-size: clamp(10px, 2vw, 20px);
          letter-spacing: 1px;
          color: var(--red);
          opacity: 0.7;
          z-index: 100;
        }

        #willow-container {
          position: relative;
          width: 100%;
          height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #willow-float {
          width: clamp(220px, 58vw, 380px);
          height: clamp(52px, 11vh, 84px);
          opacity: 1;
          transition: opacity 0.3s;
        }

        #willow-float.hidden { opacity: 0; }

        #input-section {
          position: absolute;
          bottom: clamp(40px, 8vh, 100px);
          width: clamp(300px, 90vw, 700px);
          display: flex;
          flex-direction: column;
          gap: clamp(12px, 2vh, 20px);
          opacity: 1;
          transition: opacity 0.3s;
          z-index: 100;
        }

        #input-label {
          font-size: clamp(12px, 2vw, 18px);
          letter-spacing: 0.5px;
          color: var(--red);
          text-align: center;
          text-shadow: 0 0 10px var(--glow);
        }

        #wish-input {
          width: 100%;
          padding: clamp(8px, 1.5vh, 15px);
          background: transparent;
          border: 2px solid var(--red);
          color: var(--red);
          font-family: var(--font);
          font-size: clamp(11px, 1.8vw, 16px);
          letter-spacing: 0.5px;
          caret-color: var(--red);
          outline: none;
          text-align: left;
        }

        #wish-input::placeholder {
          color: rgba(255, 68, 68, 0.4);
        }

        #wish-input:focus {
          border-color: var(--glow);
          box-shadow: 0 0 10px var(--glow);
        }

        #grant-btn {
          padding: clamp(10px, 1.8vh, 18px);
          background: transparent;
          border: 2px solid var(--red);
          color: var(--red);
          font-family: var(--font);
          font-size: clamp(11px, 1.8vw, 16px);
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          text-shadow: 0 0 5px var(--glow);
        }

        #grant-btn:hover:not(:disabled) {
          border-color: var(--glow);
          box-shadow: 0 0 10px var(--glow);
        }

        #grant-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        #success-msg, #denied-msg {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 9050;
          opacity: 0;
          pointer-events: none;
        }

        #success-msg.show, #denied-msg.show { opacity: 1; }

        .success-line {
          font-size: clamp(20px, 4vw, 48px);
          font-weight: bold;
          letter-spacing: 2px;
          color: var(--red);
          text-shadow: 0 0 20px var(--glow), 0 0 40px rgba(255,20,20,0.3);
          margin: clamp(8px, 1.5vh, 16px) 0;
          opacity: 0;
          line-height: 1.3;
          transition: opacity 0.5s ease-in;
        }

        .success-line.visible { opacity: 1; }

        .success-subtext { font-size: clamp(12px, 2vw, 18px); opacity: 0.8; }
      `}</style>

      <div id="vignette"></div>
      <div id="crt-curve"></div>
      <div id="vhs-line"></div>
      <div id="film-grain"></div>
      <div id="red-flash"></div>
      <div id="blackout"></div>

      <div id="container">
        <div id="title">ONE WISH WILLOW</div>
        <div id="tagline">ONE WISH, ONE CONSEQUENCE.</div>

        <div id="willow-container">
          <svg id="willow-float" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="woodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3a2020" />
                <stop offset="50%" stopColor="#2a1515" />
                <stop offset="100%" stopColor="#1a0a0a" />
              </linearGradient>
              <radialGradient id="redGlowGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff6666" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#ff1a1a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff1a1a" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g id="willow-main">
              <ellipse cx="150" cy="40" rx="95" ry="25" fill="url(#woodGradient)" opacity="0.9" />
              <ellipse cx="150" cy="38" rx="92" ry="22" fill="none" stroke="#8b4513" strokeWidth="1" opacity="0.4" />
              <path d="M 60 35 Q 150 25 240 35" stroke="#654321" strokeWidth="0.5" fill="none" opacity="0.6" />
              <circle cx="75" cy="40" r="1.5" fill="#ff6666" opacity="0.7" />
              <circle cx="225" cy="40" r="1.5" fill="#ff6666" opacity="0.7" />

              <ellipse cx="150" cy="40" rx="100" ry="28" fill="none" stroke="url(#redGlowGradient)" strokeWidth="8" />
            </g>

            <g id="piece-top" style={{ opacity: 0 }}>
              <ellipse cx="80" cy="30" rx="50" ry="18" fill="url(#woodGradient)" opacity="0.9" />
            </g>

            <g id="piece-bottom" style={{ opacity: 0 }}>
              <ellipse cx="220" cy="50" rx="50" ry="18" fill="url(#woodGradient)" opacity="0.9" />
            </g>
          </svg>
        </div>

        <div id="input-section">
          <div id="input-label">WHAT DO YOU WISH FOR?</div>
          <input
            id="wish-input"
            type="text"
            placeholder="ENTER YOUR WISH..."
          />
          <button id="grant-btn">GRANT WISH</button>
        </div>
      </div>

      <div id="success-msg">
        <div class="success-line" style={{ transitionDelay: '0s' }}>YOUR WISH</div>
        <div class="success-line" style={{ transitionDelay: '0.1s' }}>HAS BEEN GRANTED</div>
        <div class="success-line success-subtext" style={{ transitionDelay: '0.2s' }}>PLEASE WAIT 24 HOURS</div>
        <div class="success-line success-subtext" style={{ transitionDelay: '0.3s' }}>TO SEE EFFECT</div>
        <div class="success-line success-subtext" style={{ transitionDelay: '0.4s' }}>THE WILLOW HAS HEARD YOU.</div>
        <button id="reset-btn" class="success-line success-subtext" style={{ transitionDelay: '0.5s', background: 'transparent', border: '2px solid var(--red)', padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>MAKE ANOTHER WISH</button>
      </div>

      <div id="denied-msg">
        <div class="success-line" style={{ transitionDelay: '0s' }}>YOUR WISH</div>
        <div class="success-line" style={{ transitionDelay: '0.1s' }}>HAS NOT GRANTED</div>
        <div class="success-line success-subtext" style={{ transitionDelay: '0.2s' }}>THE WILLOW DOES NOT FAVOUR YOUR WISH</div>
        <button id="reset-btn-denied" class="success-line success-subtext" style={{ transitionDelay: '0.3s', background: 'transparent', border: '2px solid var(--red)', padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>MAKE ANOTHER WISH</button>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            let phase = 'idle';
            let wishGranted = false;
            const timers = [];

            function setPhase(newPhase) {
              phase = newPhase;
              document.body.className = 'phase-' + newPhase;
            }

            function schedule(fn, delay) {
              const timer = setTimeout(fn, delay);
              timers.push(timer);
              return timer;
            }

            function clearTimers() {
              timers.forEach(t => clearTimeout(t));
              timers.length = 0;
            }

            function randomizeWish() {
              const rand1 = Math.random();
              const rand2 = Math.random();
              const rand3 = Math.random();
              wishGranted = ((Math.floor(rand1 * 1000) + Math.floor(rand2 * 1000) + Math.floor(rand3 * 1000)) % 2) === 0;
            }

            function showSuccess() {
              if (wishGranted) {
                const msg = document.getElementById('success-msg');
                msg.style.opacity = '1';
                msg.classList.add('show');
                document.querySelectorAll('#success-msg .success-line').forEach(el => {
                  const delay = parseFloat(el.style.transitionDelay) * 1000 || 0;
                  setTimeout(() => el.classList.add('visible'), delay);
                });
              } else {
                const msg = document.getElementById('denied-msg');
                msg.style.opacity = '1';
                msg.classList.add('show');
                document.querySelectorAll('#denied-msg .success-line').forEach(el => {
                  const delay = parseFloat(el.style.transitionDelay) * 1000 || 0;
                  setTimeout(() => el.classList.add('visible'), delay);
                });
              }
            }

            function grantWish() {
              const input = document.getElementById('wish-input');
              if (!input.value.trim() || phase !== 'idle') return;
              input.disabled = true;
              document.getElementById('grant-btn').disabled = true;

              randomizeWish();
              setPhase('charging');
              schedule(() => {
                setPhase('shaking');
                document.getElementById('red-flash').classList.add('active');
              }, 1200);
              schedule(() => {
                setPhase('breaking');
                document.getElementById('red-flash').classList.remove('active');
                document.getElementById('input-section').style.opacity = '0';
              }, 1200 + 700);
              schedule(() => {
                setPhase('fading');
                document.getElementById('blackout').classList.add('active');
              }, 1200 + 700 + 850);
              schedule(() => {
                setPhase('success');
                showSuccess();
              }, 1200 + 700 + 850 + 1700);
            }

            function resetWish() {
              clearTimers();
              setPhase('idle');
              document.getElementById('blackout').classList.remove('active');
              document.getElementById('input-section').style.opacity = '1';

              const input = document.getElementById('wish-input');
              input.value = '';
              input.disabled = false;

              const successMsg = document.getElementById('success-msg');
              successMsg.style.opacity = '0';
              successMsg.classList.remove('show');
              const deniedMsg = document.getElementById('denied-msg');
              deniedMsg.style.opacity = '0';
              deniedMsg.classList.remove('show');
              document.querySelectorAll('.success-line').forEach(el => el.classList.remove('visible'));

              document.getElementById('willow-float').style.opacity = '1';
            }

            document.getElementById('grant-btn').addEventListener('click', grantWish);
            document.getElementById('reset-btn')?.addEventListener('click', resetWish);
            document.getElementById('reset-btn-denied')?.addEventListener('click', resetWish);

            setPhase('idle');
          `,
        }}
      />
    </>
  );
}
