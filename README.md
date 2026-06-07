# 🌿 One Wish Willow

A **cursed, interactive horror-themed web application** where users make wishes to an ancient willow stick. The stick dramatically breaks—granting or denying the wish—with haunting animations and synthesized sound effects.

**Built with Next.js 15 • Ready for Vercel • Zero Build Errors**

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
- Enhanced entropy randomizer using multiple entropy sources for true randomness

🔊 **Web Audio API** (Optional - currently disabled)
- Synthesized sound effects using oscillators
- Breaking animation sound effects
- Removed per user preference

📱 **Responsive Design**
- Works on desktop, tablet, and mobile
- Horizontal wooden stick orientation
- SVG-based animations

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

**Option 1: Via GitHub**
1. Push to GitHub: `git push origin main`
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your `one-wish-willow` repository
5. Click "Deploy"
6. Done! Your app is live at `one-wish-willow.vercel.app`

**Option 2: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

### Deploy to Other Platforms

**Netlify:**
```bash
npm run build
# Drag and drop the `.next` folder to Netlify
```

**Traditional Node Hosting:**
```bash
npm run build
npm start
# Server runs on port 3000
```

## Project Structure

```
one-wish-willow/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main application
│   └── globals.css          # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS (if using)
├── vercel.json              # Vercel deployment config
└── README.md                # This file
```

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: CSS-in-JS with styled-jsx
- **Animations**: CSS animations & Web API
- **Font**: VT323 (Google Fonts)
- **Deployment**: Vercel

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
- SVG-based horizontal willow stick
- Left and right piece splitting animations
- Flying splinters with rotation effects
- Smooth fade transitions

### CRT Effects
- Scanline overlay (animated)
- VHS scan line effect
- Film grain overlay
- Vignette darkening at edges
- Glass curve shadow effect

## Randomizer Implementation

Enhanced entropy algorithm for true randomness:

```typescript
const rand1 = Math.random();
const rand2 = Math.random();
const rand3 = Math.random();
wishGranted = ((Math.floor(rand1 * 1000) + Math.floor(rand2 * 1000) + Math.floor(rand3 * 1000)) % 2) === 0;
```

This produces 50/50 randomness without alternating patterns.

## Environment Variables

No environment variables are required for this project.

## Known Features & Behaviors

✅ Horizontal stick orientation (user-specified design)
✅ 50/50 randomizer for wish outcomes
✅ Proper animation sequencing
✅ Input field properly resets between wishes
✅ Full CRT/VHS aesthetic
✅ Enhanced entropy randomizer (true randomness)
✅ Responsive on all screen sizes
✅ No external API dependencies

## Troubleshooting

**Build fails with "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Port 3000 already in use**
```bash
npm run dev -- -p 3001
```

**Vercel deployment fails**
- Ensure `package.json` has correct scripts
- Check that all imports are valid
- Run `npm run build` locally first to test

## Future Enhancements

- [ ] Persistent wish history
- [ ] Multiplayer interactions
- [ ] Dynamic background colors
- [ ] Extended narrative system
- [ ] Mobile touch optimizations
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Sound effects (Web Audio API)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern browsers with ES6 support

## License

MIT - Feel free to use this cursed willow in your own projects!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

**Made with 🖤 and dark magic**  
One wish. One consequence.
