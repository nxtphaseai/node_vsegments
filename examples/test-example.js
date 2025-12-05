/**
 * Example test script for vsegments
 * 
 * This script demonstrates proper usage and helps troubleshoot issues
 */

const VSegments = require('../src/index');
const fs = require('fs');

async function testVSegments() {
  console.log('=== VSegments Test Script ===\n');
  
  // Step 1: Check API key
  console.log('1. Checking API key...');
  const apiKey = process.env.GOOGLE_API_KEY || 'YOUR_API_KEY_HERE';
  
  if (apiKey === 'YOUR_API_KEY_HERE' || !apiKey) {
    console.error('❌ Error: Please set your GOOGLE_API_KEY environment variable');
    console.log('   export GOOGLE_API_KEY="your-api-key-here"');
    process.exit(1);
  }
  console.log('✅ API key found\n');
  
  // Step 2: Check image file
  console.log('2. Checking image file...');
  const imagePath = process.argv[2] || 'breakfast.jpg';
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Error: Image file not found: ${imagePath}`);
    console.log('   Usage: node test-example.js path/to/image.jpg');
    process.exit(1);
  }
  console.log(`✅ Image found: ${imagePath}\n`);
  
  // Step 3: Initialize VSegments
  console.log('3. Initializing VSegments...');
  const vs = new VSegments({ 
    apiKey,
    model: 'gemini-3-pro-preview',  // Default model
    temperature: 0.4
  });
  console.log('✅ VSegments initialized\n');
  
  // Step 4: Detect bounding boxes
  console.log('4. Detecting bounding boxes...');
  try {
    const result = await vs.detectBoxes(imagePath);
    console.log(`✅ Detection complete! Found ${result.boxes.length} objects:`);
    
    result.boxes.forEach((box, i) => {
      console.log(`   ${i + 1}. ${box.label}`);
    });
    console.log();
    
    // Step 5: Visualize (optional)
    if (result.boxes.length > 0) {
      console.log('5. Creating visualization...');
      const outputPath = 'output-' + Date.now() + '.jpg';
      await vs.visualize(imagePath, result, { outputPath });
      console.log(`✅ Visualization saved to: ${outputPath}\n`);
    }
    
    console.log('✅ All tests passed!\n');
    
  } catch (error) {
    console.error('\n❌ Error during detection:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('500')) {
      console.log('💡 Troubleshooting tips:');
      console.log('   1. Try a different model: gemini-2.5-flash');
      console.log('   2. Check if your API key has proper permissions');
      console.log('   3. Ensure your image is under 4MB');
      console.log('   4. Wait a moment and try again (API may be busy)');
      console.log('\n   See TROUBLESHOOTING.md for more help\n');
    }
    
    process.exit(1);
  }
}

testVSegments().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
