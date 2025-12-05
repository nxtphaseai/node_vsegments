# vsegments Package Structure (Node.js)

## Directory Tree

```
node_vsegments/
├── bin/
│   └── cli.js                 # CLI entry point
│
├── src/
│   ├── index.js              # Main package exports
│   ├── index.d.ts            # TypeScript definitions
│   ├── core.js               # VSegments main class
│   ├── models.js             # Data models (BoundingBox, etc.)
│   ├── utils.js              # Parsing utilities
│   └── visualize.js          # Visualization functions
│
├── examples/
│   ├── basic.js              # Basic usage example
│   └── segmentation.js       # Segmentation example
│
├── package.json              # Package configuration
├── README.md                 # Main documentation
├── QUICKSTART.md             # Quick start guide
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT license
├── .gitignore                # Git ignore rules
└── .npmignore                # npm publish ignore rules
```

## Module Overview

### Core Modules

#### `src/index.js`
- Main entry point
- Exports: `VSegments`, `BoundingBox`, `SegmentationResult`, `version`

#### `src/core.js`
- `VSegments` class - main API
- Methods:
  - `detectBoxes()` - Bounding box detection
  - `segment()` - Segmentation mask generation
  - `visualize()` - Result visualization

#### `src/models.js`
- `BoundingBox` - Bounding box data model
- `SegmentationMask` - Segmentation mask model
- `SegmentationResult` - Result container

#### `src/utils.js`
- `parseJson()` - JSON parsing with markdown removal
- `parseBoundingBoxes()` - Parse bounding boxes from API
- `parseSegmentationMasks()` - Parse segmentation masks

#### `src/visualize.js`
- `plotBoundingBoxes()` - Draw boxes on canvas
- `plotSegmentationMasks()` - Draw masks on canvas
- `loadImageToCanvas()` - Load image to canvas
- `saveCanvas()` - Save canvas to file

### CLI

#### `bin/cli.js`
- Command-line interface using Commander.js
- 20+ options for customization
- Entry point defined in `package.json`

### TypeScript Support

#### `src/index.d.ts`
- Complete TypeScript definitions
- Type safety for all classes and methods
- JSDoc-style documentation

## Dependencies

### Runtime (Required)

```json
{
  "@google/generative-ai": "^0.21.0",
  "canvas": "^2.11.2",
  "commander": "^12.0.0"
}
```

### Development (Optional)

```json
{
  "eslint": "^8.57.0",
  "prettier": "^3.2.5"
}
```

## Entry Points

### CLI Entry Point

Defined in `package.json`:

```json
{
  "bin": {
    "vsegments": "./bin/cli.js"
  }
}
```

This creates the `vsegments` command when installed globally.

### Library Entry Point

```javascript
const VSegments = require('vsegments');

const vs = new VSegments({ apiKey: '...' });
const result = await vs.detectBoxes('image.jpg');
```

## Package Configuration

### `package.json`

Key fields:
- `name`: "vsegments"
- `version`: "0.1.0"
- `main`: "src/index.js" (CommonJS entry)
- `types`: "src/index.d.ts" (TypeScript definitions)
- `bin`: CLI entry point
- `engines`: Node.js >= 16.0.0

### Scripts

```json
{
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint src/**/*.js",
  "format": "prettier --write \"src/**/*.js\"",
  "prepublishOnly": "npm run lint"
}
```

## Installation Methods

### From npm

```bash
npm install vsegments
```

### Global Installation

```bash
npm install -g vsegments
```

### From Source

```bash
git clone git@github.com:nxtphaseai/vsegments.git
cd node_vsegments
npm install
npm link
```

## Publishing to npm

### 1. Prepare Package

```bash
npm install
npm run lint
```

### 2. Update Version

Edit `package.json`:

```json
{
  "version": "0.1.1"
}
```

### 3. Login to npm

```bash
npm login
```

### 4. Publish

```bash
npm publish
```

### 5. Verify

```bash
npm info vsegments
npm install -g vsegments
vsegments --version
```

## Cross-Platform Support

The package uses the `canvas` library which requires native dependencies:

### macOS

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

### Ubuntu/Debian

```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

### Windows

Install windows-build-tools:

```bash
npm install --global windows-build-tools
```

## API Design

### Async/Await Pattern

All API methods are async:

```javascript
const result = await vs.detectBoxes('image.jpg');
const canvas = await vs.visualize('image.jpg', result);
```

### Options Objects

Methods accept options objects for flexibility:

```javascript
await vs.detectBoxes('image.jpg', {
  prompt: 'Find all people',
  customInstructions: 'Focus on faces',
  maxSize: 1024
});
```

### Method Chaining Not Supported

Due to async nature, but you can sequence operations:

```javascript
const result = await vs.detectBoxes('image.jpg');
await vs.visualize('image.jpg', result, { outputPath: 'output.jpg' });
```

## Error Handling

All errors are thrown as standard JavaScript errors:

```javascript
try {
  const result = await vs.detectBoxes('image.jpg');
} catch (err) {
  console.error('Detection failed:', err.message);
}
```

## Image Format Support

Supported formats:
- JPEG/JPG
- PNG
- GIF
- WebP

Auto-detected from file extension.

## Performance Considerations

- Images are resized to `maxSize` (default 1024px) before processing
- Visualization uses canvas for efficient rendering
- Masks are stored as Buffer objects for memory efficiency

## Future Enhancements

Planned features:
- Unit tests with Jest
- Batch processing utilities
- Video frame processing
- Stream processing
- Additional output formats (SVG, PDF)
- Caching for repeated detections

---

This structure mirrors the Python package but adapted for Node.js conventions and patterns.
