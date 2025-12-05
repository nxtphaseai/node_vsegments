#!/usr/bin/env node

/**
 * Example of using vsegments library for image segmentation
 * 
 * Usage:
 *   node segmentation.js path/to/image.jpg
 */

const VSegments = require('../src/index');
const path = require('path');

async function main() {
  // Check arguments
  if (process.argv.length < 3) {
    console.log('Usage: node segmentation.js <image-path>');
    console.log('Example: node segmentation.js ../image.jpg');
    process.exit(1);
  }
  
  const imagePath = process.argv[2];
  
  // Get API key from environment
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('Error: GOOGLE_API_KEY not set');
    process.exit(1);
  }
  
  console.log('=== vsegments Segmentation Example ===\n');
  
  // Initialize with custom settings
  const vs = new VSegments({
    apiKey,
    model: 'gemini-3-pro-preview',
    temperature: 0.4
  });
  
  // Perform segmentation
  console.log(`Processing: ${imagePath}\n`);
  const result = await vs.segment(imagePath);
  
  // Print results
  console.log(`Found ${result.boxes.length} objects:`);
  result.boxes.forEach((box, i) => {
    console.log(`  ${i + 1}. ${box.label}`);
  });
  
  if (result.masks) {
    console.log(`\nSegmentation masks generated: ${result.masks.length}`);
    result.masks.forEach((mask, i) => {
      console.log(`  ${i + 1}. ${mask.label}`);
      console.log(`     Box: (${mask.x0}, ${mask.y0}) -> (${mask.x1}, ${mask.y1})`);
      console.log(`     Mask size: ${mask.mask.length} bytes`);
    });
  }
  
  // Create visualization with custom settings
  const outputPath = path.join(
    path.dirname(imagePath),
    'segmented_' + path.basename(imagePath)
  );
  
  console.log(`\nCreating visualization with custom settings...`);
  await vs.visualize(imagePath, result, {
    outputPath,
    lineWidth: 6,
    fontSize: 18,
    alpha: 0.5  // More transparent masks
  });
  
  console.log(`\n✓ Segmentation complete! Saved to: ${outputPath}\n`);
}

main().catch(err => {
  console.error('Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
