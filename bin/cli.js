#!/usr/bin/env node

/**
 * Command-line interface for vsegments
 */

const { Command } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const VSegments = require('../src/index');

const program = new Command();

program
  .name('vsegments')
  .description('Visual segmentation and bounding box detection using Google Gemini AI')
  .version('0.1.0')
  .requiredOption('-f, --file <image>', 'Path to input image file')
  .option('--segment', 'Perform segmentation instead of bounding box detection')
  .option('--api-key <key>', 'Google API key (default: GOOGLE_API_KEY env var)')
  .option('-m, --model <model>', 'Model name to use', 'gemini-flash-latest')
  .option('--temperature <temp>', 'Sampling temperature 0.0-1.0', parseFloat, 0.5)
  .option('--max-objects <n>', 'Maximum number of objects to detect', parseInt, 25)
  .option('-p, --prompt <text>', 'Custom detection prompt')
  .option('--instructions <text>', 'Additional system instructions for grounding')
  .option('-o, --output <file>', 'Save visualized output to file')
  .option('--json <file>', 'Export results as JSON')
  .option('--no-show', 'Don\'t display the output image')
  .option('--raw', 'Print raw API response')
  .option('--line-width <n>', 'Bounding box line width', parseInt, 4)
  .option('--font-size <n>', 'Label font size', parseInt, 14)
  .option('--alpha <a>', 'Mask transparency 0.0-1.0', parseFloat, 0.7)
  .option('--max-size <n>', 'Maximum image dimension for processing', parseInt, 1024)
  .option('-q, --quiet', 'Suppress informational output')
  .option('--compact', 'Compact output: order. subject [x y xx yy]');

program.parse(process.argv);

const options = program.opts();

async function main() {
  try {
    // Validate file exists
    try {
      await fs.access(options.file);
    } catch (err) {
      console.error(`Error: Image file not found: ${options.file}`);
      process.exit(1);
    }
    
    // Initialize VSegments
    const vs = new VSegments({
      apiKey: options.apiKey,
      model: options.model,
      temperature: options.temperature,
      maxObjects: options.maxObjects
    });
    
    // Perform detection or segmentation
    let result;
    
    if (options.segment) {
      if (!options.quiet && !options.compact) {
        console.log(`Performing segmentation on: ${options.file}`);
      }
      
      result = await vs.segment(options.file, {
        prompt: options.prompt,
        maxSize: options.maxSize
      });
    } else {
      if (!options.quiet && !options.compact) {
        console.log(`Detecting bounding boxes in: ${options.file}`);
      }
      
      result = await vs.detectBoxes(options.file, {
        prompt: options.prompt,
        customInstructions: options.instructions,
        maxSize: options.maxSize
      });
    }
    
    // Print results
    if (options.compact) {
      // Compact output: order. subject [x y xx yy]
      result.boxes.forEach((box, i) => {
        console.log(`${i + 1}. ${box.label} [${box.x1} ${box.y1} ${box.x2} ${box.y2}]`);
      });
    } else if (!options.quiet) {
      console.log(`\nDetected ${result.boxes.length} object(s):`);
      result.boxes.forEach((box, i) => {
        console.log(`  ${i + 1}. ${box.label}`);
      });
    }
    
    // Print raw response if requested
    if (options.raw && !options.compact) {
      console.log('\nRaw API Response:');
      console.log(result.rawResponse);
    }
    
    // Export JSON if requested
    if (options.json) {
      const jsonData = {
        boxes: result.boxes.map(box => ({
          label: box.label,
          box_2d: [box.y1, box.x1, box.y2, box.x2]
        })),
        model: options.model,
        temperature: options.temperature
      };
      
      if (result.masks) {
        jsonData.masks = result.masks.length;
      }
      
      await fs.writeFile(
        options.json,
        JSON.stringify(jsonData, null, 2)
      );
      
      if (!options.quiet && !options.compact) {
        console.log(`\nJSON results saved to: ${options.json}`);
      }
    }
    
    // Visualize and save if requested
    if (options.output && !options.compact) {
      if (!options.quiet) {
        console.log(`\nCreating visualization...`);
      }
      
      await vs.visualize(options.file, result, {
        outputPath: options.output,
        lineWidth: options.lineWidth,
        fontSize: options.fontSize,
        alpha: options.alpha
      });
      
      if (!options.quiet) {
        console.log(`Output saved to: ${options.output}`);
      }
    }
    
    // Success
    if (!options.quiet && !options.compact) {
      console.log('\n✓ Complete!');
    }
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    if (!options.quiet) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();
