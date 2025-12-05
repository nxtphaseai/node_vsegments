# vsegments (Node.js)

**Visual segmentation and bounding box detection using Google Gemini AI**

`vsegments` is a powerful Node.js library and CLI tool that leverages Google's Gemini AI models to perform advanced visual segmentation and object detection on images. It provides an easy-to-use interface for detecting bounding boxes and generating segmentation masks with high accuracy.

[![npm version](https://img.shields.io/npm/v/vsegments.svg)](https://www.npmjs.com/package/vsegments)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Bounding Box Detection**: Automatically detect and label objects in images
- 🎨 **Segmentation Masks**: Generate precise segmentation masks for identified objects
- 🖼️ **Visualization**: Beautiful visualization with customizable colors, fonts, and transparency
- 🛠️ **CLI Tool**: Powerful command-line interface for batch processing
- 📦 **Library**: Clean JavaScript API for integration into your projects
- 🚀 **Multiple Models**: Support for various Gemini models (Flash, Pro, etc.)
- ⚙️ **Customizable**: Fine-tune prompts, system instructions, and output settings
- 📊 **JSON Export**: Export detection results in structured JSON format

## Installation

### From npm (Recommended)

```bash
npm install vsegments
```

### Global Installation (for CLI)

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

## Quick Start

### Prerequisites

You need a Google API key to use this library. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

Set your API key as an environment variable:

```bash
export GOOGLE_API_KEY="your-api-key-here"
```

### CLI Usage

#### Basic Bounding Box Detection

```bash
vsegments -f image.jpg
```

#### Save Output Image

```bash
vsegments -f image.jpg -o output.jpg
```

#### Perform Segmentation

```bash
vsegments -f image.jpg --segment -o segmented.jpg
```

#### Custom Prompt

```bash
vsegments -f image.jpg -p "Find all people wearing red shirts"
```

#### Export JSON Results

```bash
vsegments -f image.jpg --json results.json
```

#### Compact Output

```bash
vsegments -f image.jpg --compact
```

### Library Usage

#### Basic Detection

```javascript
const VSegments = require('vsegments');

// Initialize
const vs = new VSegments({ apiKey: 'your-api-key' });

// Detect bounding boxes
const result = await vs.detectBoxes('image.jpg');

// Print results
console.log(`Found ${result.boxes.length} objects`);
result.boxes.forEach(box => {
  console.log(`  - ${box.label}`);
});

// Visualize
await vs.visualize('image.jpg', result, { outputPath: 'output.jpg' });
```

#### Advanced Detection

```javascript
const VSegments = require('vsegments');

// Initialize with custom settings
const vs = new VSegments({
  apiKey: 'your-api-key',
  model: 'gemini-2.5-pro',
  temperature: 0.7,
  maxObjects: 50
});

// Detect with custom prompt and instructions
const result = await vs.detectBoxes('image.jpg', {
  prompt: 'Find all vehicles in the image',
  customInstructions: 'Focus on cars, trucks, and motorcycles. Ignore bicycles.'
});

// Access individual boxes
result.boxes.forEach(box => {
  console.log(`${box.label}: [${box.x1}, ${box.y1}] -> [${box.x2}, ${box.y2}]`);
});
```

#### Segmentation

```javascript
const VSegments = require('vsegments');

const vs = new VSegments({ apiKey: 'your-api-key' });

// Perform segmentation
const result = await vs.segment('image.jpg');

// Visualize with custom settings
await vs.visualize('image.jpg', result, {
  outputPath: 'segmented.jpg',
  lineWidth: 6,
  fontSize: 18,
  alpha: 0.6
});
```

## CLI Reference

### Required Arguments

- `-f, --file <image>`: Path to input image file

### Mode Options

- `--segment`: Perform segmentation instead of bounding box detection

### API Options

- `--api-key <key>`: Google API key (default: `GOOGLE_API_KEY` env var)
- `-m, --model <model>`: Model name (default: `gemini-flash-latest`)
- `--temperature <temp>`: Sampling temperature 0.0-1.0 (default: 0.5)
- `--max-objects <n>`: Maximum objects to detect (default: 25)

### Prompt Options

- `-p, --prompt <text>`: Custom detection prompt
- `--instructions <text>`: Additional system instructions for grounding

### Output Options

- `-o, --output <file>`: Save visualized output to file
- `--json <file>`: Export results as JSON
- `--no-show`: Don't display the output image
- `--raw`: Print raw API response

### Visualization Options

- `--line-width <n>`: Bounding box line width (default: 4)
- `--font-size <n>`: Label font size (default: 14)
- `--alpha <a>`: Mask transparency 0.0-1.0 (default: 0.7)
- `--max-size <n>`: Maximum image dimension for processing (default: 1024)

### Other Options

- `-V, --version`: Show version information
- `-q, --quiet`: Suppress informational output
- `--compact`: Compact output format
- `-h, --help`: Show help message

## API Reference

### `VSegments` Class

#### Constructor

```javascript
new VSegments({
  apiKey: String,          // Optional (defaults to GOOGLE_API_KEY env var)
  model: String,           // Optional (default: 'gemini-flash-latest')
  temperature: Number,     // Optional (default: 0.5)
  maxObjects: Number       // Optional (default: 25)
})
```

#### Methods

##### `detectBoxes()`

Detect bounding boxes in an image.

```javascript
await vs.detectBoxes(imagePath, {
  prompt: String,              // Optional custom prompt
  customInstructions: String,  // Optional system instructions
  maxSize: Number             // Optional (default: 1024)
})
```

Returns: `Promise<SegmentationResult>`

##### `segment()`

Perform segmentation on an image.

```javascript
await vs.segment(imagePath, {
  prompt: String,    // Optional custom prompt
  maxSize: Number   // Optional (default: 1024)
})
```

Returns: `Promise<SegmentationResult>`

##### `visualize()`

Visualize detection/segmentation results.

```javascript
await vs.visualize(imagePath, result, {
  outputPath: String,   // Optional output file path
  lineWidth: Number,    // Optional (default: 4)
  fontSize: Number,     // Optional (default: 14)
  alpha: Number        // Optional (default: 0.7)
})
```

Returns: `Promise<Canvas>`

### Data Models

#### `BoundingBox`

```javascript
{
  label: String,
  y1: Number,  // Normalized 0-1000
  x1: Number,
  y2: Number,
  x2: Number,
  
  toAbsolute(imgWidth, imgHeight)  // Returns [absX1, absY1, absX2, absY2]
}
```

#### `SegmentationResult`

```javascript
{
  boxes: BoundingBox[],
  masks: SegmentationMask[] | null,
  rawResponse: String | null,
  length: Number  // Number of detected objects
}
```

## Examples

See the `examples/` directory for complete working examples:

- `basic.js` - Basic object detection
- `segmentation.js` - Image segmentation with masks

Run examples:

```bash
cd examples
node basic.js path/to/image.jpg
node segmentation.js path/to/image.jpg
```

## Supported Models

- `gemini-flash-latest` (default, fastest)
- `gemini-2.0-flash`
- `gemini-2.5-flash-lite`
- `gemini-2.5-flash`
- `gemini-2.5-pro` (best quality, slower)

**Note**: Segmentation features require 2.5 models or later.

## Requirements

- Node.js 16.0.0 or higher
- Dependencies:
  - `@google/generative-ai` ^0.21.0
  - `canvas` ^2.11.2
  - `commander` ^12.0.0

## Publishing to npm

### 1. Build and Test

```bash
npm install
npm test
```

### 2. Update Version

Edit `package.json` and update the version number.

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
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built using [Google Gemini AI](https://ai.google.dev/)
- Inspired by the [Google AI Cookbook](https://github.com/google-gemini/cookbook)

## Support

- **Issues**: [GitHub Issues](https://github.com/nxtphaseai/vsegments/issues)
- **Documentation**: [GitHub README](https://github.com/nxtphaseai/vsegments#readme)

---

Made with ❤️ by Marco Kotrotsos
