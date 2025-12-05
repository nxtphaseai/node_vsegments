/**
 * Utility functions for parsing and processing API responses
 */

const { BoundingBox, SegmentationMask } = require('./models');
const { createCanvas, loadImage } = require('canvas');

/**
 * Parse JSON output, removing markdown fencing if present
 * @param {string} jsonOutput - Raw JSON string
 * @returns {string} - Cleaned JSON string
 */
function parseJson(jsonOutput) {
  const lines = jsonOutput.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '```json') {
      jsonOutput = lines.slice(i + 1).join('\n');
      jsonOutput = jsonOutput.split('```')[0];
      break;
    }
  }
  return jsonOutput.trim();
}

/**
 * Parse bounding boxes from API response
 * @param {string} responseText - Raw response text from API
 * @returns {BoundingBox[]} - Array of BoundingBox objects
 */
function parseBoundingBoxes(responseText) {
  const cleanedJson = parseJson(responseText);
  const data = JSON.parse(cleanedJson);
  
  const boxes = [];
  for (const item of data) {
    if (item.box_2d) {
      boxes.push(BoundingBox.fromDict(item));
    }
  }
  
  return boxes;
}

/**
 * Parse segmentation masks from API response
 * @param {string} responseText - Raw response text
 * @param {number} imgHeight - Image height
 * @param {number} imgWidth - Image width
 * @returns {Promise<SegmentationMask[]>} - Array of SegmentationMask objects
 */
async function parseSegmentationMasks(responseText, imgHeight, imgWidth) {
  const cleanedJson = parseJson(responseText);
  const data = JSON.parse(cleanedJson);
  
  const masks = [];
  
  for (const item of data) {
    if (!item.box_2d || !item.mask) continue;
    
    const box = item.box_2d;
    const label = item.label;
    
    // Convert normalized bbox to absolute coordinates
    const absY0 = Math.round((box[0] / 1000) * imgHeight);
    const absX0 = Math.round((box[1] / 1000) * imgWidth);
    const absY1 = Math.round((box[2] / 1000) * imgHeight);
    const absX1 = Math.round((box[3] / 1000) * imgWidth);
    
    const bboxWidth = absX1 - absX0;
    const bboxHeight = absY1 - absY0;
    
    // Decode base64 mask
    const maskBase64 = item.mask.replace(/^data:image\/png;base64,/, '');
    const maskBuffer = Buffer.from(maskBase64, 'base64');
    
    // Load mask image and resize to bbox size
    const maskImg = await loadImage(maskBuffer);
    const canvas = createCanvas(bboxWidth, bboxHeight);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(maskImg, 0, 0, bboxWidth, bboxHeight);
    
    // Get image data and extract alpha channel
    const imageData = ctx.getImageData(0, 0, bboxWidth, bboxHeight);
    const maskData = new Uint8Array(bboxWidth * bboxHeight);
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      maskData[i / 4] = imageData.data[i + 3]; // Alpha channel
    }
    
    // Create full-size mask
    const fullMask = Buffer.alloc(imgHeight * imgWidth);
    
    for (let y = 0; y < bboxHeight; y++) {
      for (let x = 0; x < bboxWidth; x++) {
        const srcIdx = y * bboxWidth + x;
        const dstY = absY0 + y;
        const dstX = absX0 + x;
        
        if (dstY < imgHeight && dstX < imgWidth) {
          const dstIdx = dstY * imgWidth + dstX;
          fullMask[dstIdx] = maskData[srcIdx];
        }
      }
    }
    
    masks.push(new SegmentationMask(
      absY0, absX0, absY1, absX1, fullMask, label
    ));
  }
  
  return masks;
}

module.exports = {
  parseJson,
  parseBoundingBoxes,
  parseSegmentationMasks
};
