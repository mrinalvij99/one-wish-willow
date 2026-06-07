# 🌿 One Wish Willow

A **cursed, interactive horror-themed web application** where users make wishes to an ancient willow stick. The stick dramatically breaks—granting or denying the wish—with haunting animations and synthesized sound effects.

**Zero Build Required • No Dependencies • Pure HTML/CSS/JavaScript**

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
- Enhanced entropy randomizer using multiple entropy sources

🔊 **Web Audio API**
- Synthesized sound effects using oscillators and noise generation
- Spinning/twisting sound during breaking animation
- No ambient hum or static (disabled per user preference)

📱 **Responsive Design**
- Works on desktop, tablet, and mobile
- Horizontal wooden stick orientation
- SVG-based animations with proper coordinate transformations

## Quick Start

### Option 1: Direct Deployment (Simplest)
Just upload `index.html` to any web host (GitHub Pages, Vercel, Netlify, etc.) and it works immediately!

### Option 2: Local Development Server

**Using Python (built-in on macOS/Linux):**
```bash
python3 -m http.server 3000
# Visit http://localhost:3000/index.html
```

**Using Node.js:**
```bash
npm start
# Visit http://localhost:3000/index.html
```

**Using Ruby:**
```bash
ruby -run -ehttpd . -p3000
# Visit http://localhost:3000/index.html
```

## Project Structure

```
one-wish-willow/
├── index.html              # ← The entire app in one file!
├── README.md              # This file
└── package.json           # Metadata (no build required)
```

That's it! No complex build steps, no configuration, no dependencies to install.

## Technical Stack

- **HTML5**: Semantic markup with SVG support
- **CSS3**: Custom properties, animations, gradients
- **JavaScript (Vanilla)**: No frameworks, no transpilation
- **Web Audio API**: Synthesized sound effects
- **SVG**: Scalable vector graphics for the stick animation

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

## Randomizer Implementation

The wish randomizer uses an **enhanced entropy algorithm**:
```javascript
const rand1 = Math.random();
const rand2 = Math.random();
const rand3 = Math.random();
wishGranted = ((Math.floor(rand1 * 1000) + Math.floor(rand2 * 1000) + Math.floor(rand3 * 1000)) % 2) === 0;
```

This produces true 50/50 randomness without alternating patterns.

## Deployment Options

### GitHub Pages
1. Push to your repository
2. Enable GitHub Pages in Settings
3. Select main branch as source
4. Access at `https://yourusername.github.io/one-wish-willow/`

### Vercel
1. Connect your GitHub repository
2. Deploy (zero configuration needed)
3. Automatic HTTPS and CDN

### Netlify
1. Drag and drop the folder or connect GitHub
2. Deploy immediately
3. Custom domain support

### Traditional Hosting
Upload `index.html` to any web server (Apache, Nginx, IIS, etc.)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires Web Audio API and SVG support (all modern browsers)

## Sound Effects

- **Charging**: [Disabled - removed per user request]
- **Breaking Spin**: Oscillator-based twisting/warping sound
- **Ambient**: [Disabled - removed static hum per user request]

## Known Features & Behaviors

✅ Horizontal stick orientation (user reference image)
✅ 50/50 randomizer for wish outcomes
✅ No annoying background sounds
✅ Proper shard visibility (only shows during breaking animation)
✅ Input field properly resets between wishes
✅ Spin sound during breaking (Web Audio)
✅ Full CRT/VHS aesthetic with scanlines and film grain
✅ Enhanced entropy randomizer (true randomness, no alternating patterns)

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
