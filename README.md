# 🌿 One Wish Willow

A **cursed, interactive horror-themed web application** where users make wishes to an ancient willow stick. The stick dramatically breaks—granting or denying the wish—with haunting animations and synthesized sound effects.

## Features

✨ **Immersive Horror Aesthetic**
- Dark, retro-arcade visual design with pixel font (VT323)
- CRT scanline effects and VHS video glitch overlay
- Red neon glow with vignette darkness
- Animated vignette edges for cinematic feel

🎮 **6-Phase Interaction Sequence**
1. **Idle**: Stick floats peacefully in the center
2. **Charging**: Red energy builds as the player enters their wish
3. **Shaking**: The stick trembles with mounting supernatural power
4. **Breaking**: Willow stick shatters dramatically with flying splinters
5. **Fading**: Environment fades to darkness
6. **Success**: Wish outcome revealed (granted or denied)

🎰 **Randomized Wish Outcomes**
- 50/50 chance of wish being **granted** or **denied**
- Granted: "Your wish has been granted... please wait 24 hours to see effect"
- Denied: "Your wish was not granted... the willow does not favour your wish"

🔊 **Web Audio API**
- Synthesized sound effects using oscillators and noise generation
- Spinning/twisting sound during breaking animation
- No ambient hum or static (disabled per user preference)

📱 **Responsive Design**
- Works on desktop, tablet, and mobile
- Horizontal wooden stick orientation (not vertical)
- SVG-based animations with proper coordinate transformations

## Getting Started

### Option 1: Standalone HTML (Instant)

The simplest way to run One Wish Willow is using the standalone HTML file:

```bash
# Navigate to the project directory
cd one-wish-willow

# Start a local server (Ruby WEBrick)
ruby -run -ehttpd . -p4001

# Or use Python if available
python3 -m http.server 4001

# Open in browser
open http://localhost:4001/index.html
```

**File**: `index.html` - fully self-contained with all CSS and JavaScript inline.

### Option 2: Next.js Development Server

To run the full Next.js 15 React application:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
open http://localhost:3000
```

## Project Structure

```
one-wish-willow/
├── index.html                  # Standalone single-page app (ready to deploy)
├── app/
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main interaction logic & phase sequencing
│   └── globals.css            # Global styles
├── components/
│   ├── Willow.tsx             # Main willow stick SVG component
│   ├── WillowStick.tsx         # SVG path rendering
│   ├── WishForm.tsx           # Input and button components
│   ├── SuccessMessage.tsx     # Wish outcome display
│   ├── Background.tsx         # Dark horror background
│   ├── CRTOverlay.tsx         # Scanline effects
│   ├── VHSNoise.tsx           # VHS glitch overlay
│   ├── AudioController.tsx    # Web Audio API wrapper
│   ├── Particles.tsx          # Visual effects
│   └── RadialBurst.tsx        # Breaking animation particles
├── lib/
│   └── types.ts               # TypeScript phase definitions
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── tailwind.config.ts         # Tailwind CSS configuration
```

## Technical Stack

- **Framework**: Next.js 15 with React and TypeScript
- **Styling**: Tailwind CSS with custom horror palette
- **Animations**: Framer Motion, Web Animations API, CSS keyframes
- **Audio**: Web Audio API with synthesized oscillators
- **Font**: VT323 (Google Fonts) - pixel/arcade aesthetic
- **Visual Effects**: SVG clipping paths, CRT scanlines, VHS noise

## Color Palette

```css
--dark:     #050505  /* Deep black background */
--red:      #ff4444  /* Main text color */
--glow:     #ff1a1a  /* Red neon glow */
--accent:   #ff3333  /* Accent highlights */
--light:    #ffe0e0  /* Light red text */
```

## Animation Details

### Stick Breaking Sequence
- Left piece flies to **upper-left** with counterclockwise rotation
- Right piece flies to **lower-right** with clockwise rotation
- 3 red impact triangles burst from center
- 5 wood splinter shards fly outward with rotation

### SVG Coordinate System
- ViewBox: `"0 0 300 80"` (horizontal orientation)
- Width: `clamp(220px, 58vw, 380px)`
- Height: `clamp(52px, 11vh, 84px)`
- Thick wooden baton with rough weathered ends and red glow fringe

## Sound Effects

- **Charging**: [Disabled - was causing annoying buzzing]
- **Breaking Spin**: Oscillator-based twisting/warping sound
- **Ambient**: [Disabled - removed static hum per user request]

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires Web Audio API and SVG support

## Deployment

### Deploy as Static Site
The `index.html` file can be deployed to any static hosting:

```bash
# Deploy to Vercel, Netlify, GitHub Pages, etc.
# Just upload index.html or the entire directory
```

### Deploy as Next.js Application
```bash
npm run build
npm run start
```

## Known Features & Behaviors

✅ Horizontal stick orientation (as per user reference image)
✅ 50/50 randomizer for wish outcomes
✅ No annoying background sounds
✅ Proper shard visibility (only shows during breaking animation)
✅ Input field properly resets between wishes
✅ Spin sound during breaking (Web Audio)
✅ Full CRT/VHS aesthetic with scanlines and film grain

## Future Enhancements

- [ ] Persistent wish history stored locally
- [ ] Multiplayer wish interactions
- [ ] Dynamic background colors based on wish type
- [ ] Extended narrative system
- [ ] Mobile-optimized touch interactions
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

## License

MIT - Feel free to use this cursed willow in your own projects!

---

**Made with 🖤 and dark magic**  
One wish. One consequence.
