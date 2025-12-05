# vsegments Quick Start (Node.js)

Get started with vsegments in 5 minutes!

## 1. Install

```bash
npm install vsegments
```

Or globally for CLI:

```bash
npm install -g vsegments
```

## 2. Set Your API Key

Get your Google API key from: https://aistudio.google.com/app/apikey

```bash
export GOOGLE_API_KEY="your-api-key-here"
```

## 3. CLI Quick Test

```bash
vsegments -f image.jpg
```

Save output:

```bash
vsegments -f image.jpg -o output.jpg
```

Compact output:

```bash
vsegments -f image.jpg --compact
```

## 4. Library Quick Test

Create `test.js`:

```javascript
const VSegments = require('vsegments');

async function main() {
  const vs = new VSegments({ apiKey: process.env.GOOGLE_API_KEY });
  
  const result = await vs.detectBoxes('image.jpg');
  
  console.log(`Found ${result.boxes.length} objects:`);
  result.boxes.forEach(box => {
    console.log(`  - ${box.label}`);
  });
  
  await vs.visualize('image.jpg', result, { outputPath: 'output.jpg' });
}

main().catch(console.error);
```

Run it:

```bash
node test.js
```

## 5. Try Segmentation

```bash
vsegments -f image.jpg --segment -o segmented.jpg
```

Or in code:

```javascript
const result = await vs.segment('image.jpg');
await vs.visualize('image.jpg', result, { 
  outputPath: 'segmented.jpg',
  alpha: 0.5 
});
```

## Common Options

```bash
# Custom prompt
vsegments -f image.jpg -p "Find all people"

# Different model
vsegments -f image.jpg -m gemini-2.5-pro

# Export JSON
vsegments -f image.jpg --json results.json

# Customize visualization
vsegments -f image.jpg -o output.jpg --line-width 6 --font-size 18
```

## Next Steps

- Check out `examples/basic.js` for library usage
- Check out `examples/segmentation.js` for segmentation
- Read the full [README.md](README.md) for API reference
- See all CLI options: `vsegments --help`

## Troubleshooting

### API Key Error

```
Error: API key must be provided or set in GOOGLE_API_KEY environment variable
```

**Solution:** Set your API key:

```bash
export GOOGLE_API_KEY="your-key-here"
```

### Module Not Found

```
Error: Cannot find module 'canvas'
```

**Solution:** Reinstall dependencies:

```bash
npm install
```

On macOS, you may need:

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

On Ubuntu/Debian:

```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

---

Happy segmenting! 🎯
