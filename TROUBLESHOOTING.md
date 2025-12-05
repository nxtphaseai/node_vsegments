# Troubleshooting Guide

## Common Issues and Solutions

### 1. Google Gemini API Errors

#### Error: 500 Internal Server Error
```
GoogleGenerativeAIFetchError: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/...: [500 Internal Server Error]
```

**Possible Causes:**
- Temporary API outage
- Model name is incorrect or unavailable
- API quota exceeded
- Image is too large or in unsupported format

**Solutions:**
1. **Try a different model:**
   ```javascript
   const vs = new VSegments({ 
     apiKey: 'YOUR_API_KEY',
     model: 'gemini-3-pro-preview'  // Default model
   });
   ```

2. **Wait and retry:** The API may be experiencing temporary issues

3. **Check your API key:** Verify it's valid and has proper permissions

4. **Reduce image size:** Ensure images are under 4MB and reasonable dimensions

5. **Verify image path:** Make sure the image file exists and is readable

#### Error: 403 Forbidden
```
GoogleGenerativeAIFetchError: [403 Forbidden]
```

**Causes:**
- Invalid API key
- API key doesn't have necessary permissions
- API not enabled for your project

**Solutions:**
1. Verify your API key is correct
2. Enable the Generative Language API in Google Cloud Console
3. Check API key restrictions in Google Cloud Console

#### Error: 429 Too Many Requests
```
GoogleGenerativeAIFetchError: [429 Too Many Requests]
```

**Causes:**
- Rate limit exceeded
- Quota exceeded

**Solutions:**
1. Wait before making more requests
2. Implement rate limiting in your code
3. Upgrade your API quota if needed

### 2. Image Loading Issues

#### Error: Image file not found
```
Error: Image file not found: path/to/image.jpg
```

**Solutions:**
1. Check the file path is correct (use absolute paths)
2. Verify the file exists: `ls path/to/image.jpg`
3. Check file permissions

#### Unsupported Image Format
**Supported formats:** JPG, JPEG, PNG, GIF, WEBP

**Solutions:**
1. Convert your image to a supported format
2. Check the file extension is correct

### 3. Module/Package Issues

#### Warning: MODULE_TYPELESS_PACKAGE_JSON
```
(node:xxxxx) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///... is not specified
```

**Solution:**
Add to your `package.json`:
```json
{
  "type": "module"
}
```

Or use CommonJS syntax:
```javascript
const VSegments = require('vsegments');
```

#### Error: Cannot find module 'vsegments'
```
Error: Cannot find module 'vsegments'
```

**Solutions:**
1. Install the package: `npm install vsegments`
2. Check you're in the right directory
3. Verify `node_modules` exists

### 4. Segmentation Issues

#### No objects detected
```
Found 0 objects
```

**Possible causes:**
- Image is too simple/blank
- Objects are not clear enough
- Prompt is too specific

**Solutions:**
1. Use a clearer image
2. Try a custom prompt
3. Adjust the model settings

#### Poor segmentation quality

**Solutions:**
1. **Use higher quality images:**
   ```javascript
   const result = await vs.segment('image.jpg', {
     maxSize: 2048  // Increase max size
   });
   ```

2. **Adjust temperature:**
   ```javascript
   const vs = new VSegments({ 
     apiKey: 'YOUR_API_KEY',
     temperature: 0.2  // Lower = more consistent
   });
   ```

3. **Use custom prompts:**
   ```javascript
   const result = await vs.segment('image.jpg', {
     prompt: 'Detect and segment all people and vehicles in this image'
   });
   ```

### 5. Performance Issues

#### Slow processing

**Solutions:**
1. **Reduce image size:**
   ```javascript
   const result = await vs.segment('image.jpg', {
     maxSize: 512  // Smaller = faster
   });
   ```

2. **Use recommended model:**
   ```javascript
   const vs = new VSegments({ 
     apiKey: 'YOUR_API_KEY',
     model: 'gemini-3-pro-preview'  // Default high-quality model
   });
   ```

3. **Process images in batches** rather than all at once

### 6. Canvas/Visualization Issues

#### Error: Cannot find module 'canvas'
```
Error: Cannot find module 'canvas'
```

**Solutions:**
1. The `canvas` dependency requires native compilation
2. Install build tools:
   - **macOS:** `xcode-select --install`
   - **Ubuntu/Debian:** `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`
   - **Windows:** Install windows-build-tools

3. Reinstall canvas: `npm install canvas --build-from-source`

## Testing Your Setup

Create a simple test script (`test-setup.js`):

```javascript
import VSegments from 'vsegments';
import fs from 'fs';

async function test() {
  console.log('Testing vsegments setup...\n');
  
  // 1. Test API key
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('❌ GOOGLE_API_KEY not set');
    process.exit(1);
  }
  console.log('✅ API key found');
  
  // 2. Test initialization
  try {
    const vs = new VSegments({ apiKey });
    console.log('✅ VSegments initialized');
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  }
  
  // 3. Test image file
  const imagePath = 'test-image.jpg';
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ Test image not found: ${imagePath}`);
    console.log('   Create a test-image.jpg to continue');
    process.exit(1);
  }
  console.log('✅ Test image found');
  
  console.log('\n✅ Setup looks good! Try running your script.');
}

test().catch(console.error);
```

## Getting Help

If you continue to experience issues:

1. **Check the examples:** Review the example scripts in the `examples/` directory
2. **Review the API documentation:** [Google Gemini API Docs](https://ai.google.dev/docs)
3. **File an issue:** [GitHub Issues](https://github.com/nxtphaseai/node_vsegments/issues)
4. **Check API status:** [Google Cloud Status Dashboard](https://status.cloud.google.com/)

## Recommended Models (as of December 2025)

- **Default (Best quality):** `gemini-3-pro-preview`
- **Alternative:** `gemini-2.5-flash`

Update your code:
```javascript
const vs = new VSegments({ 
  apiKey: 'YOUR_API_KEY',
  model: 'gemini-3-pro-preview'  // Default
});
```
