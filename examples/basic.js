#!/usr/bin/env node

/**
 * Simple example of using vsegments library for object detection
 * 
 * Usage:
 *   node basic.js path/to/image.jpg
 */

const VSegments = require('../src/index');
const path = require('path');

async function main() {
  // Check arguments
  if (process.argv.length < 3) {
    console.log('Usage: node basic.js <image-path>');
    console.log('Example: node basic.js ../image.jpg');
    process.exit(1);
  }
  
  const imagePath = process.argv[2];
  
  // Get API key from environment
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('Error: GOOGLE_API_KEY environment variable not set');
    console.error("Set it with: export GOOGLE_API_KEY='your-key-here'");
    process.exit(1);
  }
  
  console.log('=== vsegments Basic Example ===\n');
  
  // Initialize VSegments
  const vs = new VSegments({ apiKey });
  
  // Detect objects
  console.log(`Processing: ${imagePath}\n`);
  const result = await vs.detectBoxes(imagePath);
  
  // Print results
  console.log(`Found ${result.boxes.length} objects:`);
  result.boxes.forEach((box, i) => {
    console.log(`  ${i + 1}. ${box.label}`);
  });
  
  // Visualize and save
  const outputPath = path.join(
    path.dirname(imagePath),
    'output_' + path.basename(imagePath)
  );
  
  console.log(`\nCreating visualization...`);
  await vs.visualize(imagePath, result, { outputPath });
  
  console.log(`✓ Output saved to: ${outputPath}\n`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
