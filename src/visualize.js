/**
 * Visualization utilities for drawing bounding boxes and segmentation masks
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

// Extended color palette
const COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#F5F5DC',
  '#40E0D0', '#FF7F50', '#E6E6FA', '#EE82EE', '#FFD700', '#C0C0C0',
  '#000080', '#800000', '#008080', '#808000', '#FF6347', '#4B0082',
  '#DC143C', '#00CED1', '#9370DB', '#FF1493', '#7FFF00', '#D2691E'
];

/**
 * Draw bounding boxes on an image
 * @param {Canvas} canvas - Canvas with loaded image
 * @param {BoundingBox[]} boxes - Array of bounding boxes
 * @param {Object} options - Drawing options
 * @returns {Canvas} - Canvas with bounding boxes drawn
 */
function plotBoundingBoxes(canvas, boxes, options = {}) {
  const {
    lineWidth = 4,
    fontSize = 14,
    showLabels = true
  } = options;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  ctx.lineWidth = lineWidth;
  ctx.font = `${fontSize}px Arial`;
  
  boxes.forEach((box, i) => {
    const color = COLORS[i % COLORS.length];
    const [absX1, absY1, absX2, absY2] = box.toAbsolute(width, height);
    
    // Draw rectangle
    ctx.strokeStyle = color;
    ctx.strokeRect(absX1, absY1, absX2 - absX1, absY2 - absY1);
    
    // Draw label
    if (showLabels && box.label) {
      ctx.fillStyle = color;
      ctx.fillText(box.label, absX1 + 8, absY1 + fontSize + 6);
    }
  });
  
  return canvas;
}

/**
 * Overlay a mask on the image
 * @param {Canvas} canvas - Canvas with image
 * @param {Buffer} maskData - Mask data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} color - Color to use for mask
 * @param {number} alpha - Transparency (0-1)
 */
function overlayMask(canvas, maskData, width, height, color, alpha) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Parse color
  const colorInt = parseInt(color.slice(1), 16);
  const r = (colorInt >> 16) & 255;
  const g = (colorInt >> 8) & 255;
  const b = colorInt & 255;
  
  // Apply mask
  for (let i = 0; i < maskData.length; i++) {
    const maskValue = maskData[i] / 255;
    if (maskValue > 0) {
      const idx = i * 4;
      const maskAlpha = maskValue * alpha;
      
      data[idx] = Math.round(data[idx] * (1 - maskAlpha) + r * maskAlpha);
      data[idx + 1] = Math.round(data[idx + 1] * (1 - maskAlpha) + g * maskAlpha);
      data[idx + 2] = Math.round(data[idx + 2] * (1 - maskAlpha) + b * maskAlpha);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Draw segmentation masks on an image
 * @param {Canvas} canvas - Canvas with loaded image
 * @param {SegmentationMask[]} masks - Array of segmentation masks
 * @param {Object} options - Drawing options
 * @returns {Canvas} - Canvas with masks drawn
 */
function plotSegmentationMasks(canvas, masks, options = {}) {
  const {
    lineWidth = 4,
    fontSize = 14,
    alpha = 0.7,
    showLabels = true
  } = options;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Overlay masks first
  masks.forEach((mask, i) => {
    const color = COLORS[i % COLORS.length];
    overlayMask(canvas, mask.mask, width, height, color, alpha);
  });
  
  // Draw bounding boxes and labels
  ctx.lineWidth = lineWidth;
  ctx.font = `${fontSize}px Arial`;
  
  masks.forEach((mask, i) => {
    const color = COLORS[i % COLORS.length];
    
    // Draw bounding box
    ctx.strokeStyle = color;
    ctx.strokeRect(mask.x0, mask.y0, mask.x1 - mask.x0, mask.y1 - mask.y0);
    
    // Draw label
    if (showLabels && mask.label) {
      ctx.fillStyle = color;
      ctx.fillText(mask.label, mask.x0 + 8, mask.y0 - 6);
    }
  });
  
  return canvas;
}

/**
 * Load image into canvas
 * @param {string} imagePath - Path to image file
 * @param {number} maxSize - Maximum dimension
 * @returns {Promise<Canvas>} - Canvas with loaded image
 */
async function loadImageToCanvas(imagePath, maxSize = 1024) {
  const img = await loadImage(imagePath);
  
  // Calculate new dimensions
  let width = img.width;
  let height = img.height;
  
  if (width > maxSize || height > maxSize) {
    const scale = Math.min(maxSize / width, maxSize / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  
  // Create canvas and draw image
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  
  return canvas;
}

/**
 * Save canvas to file
 * @param {Canvas} canvas - Canvas to save
 * @param {string} outputPath - Output file path
 */
async function saveCanvas(canvas, outputPath) {
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
}

module.exports = {
  plotBoundingBoxes,
  plotSegmentationMasks,
  loadImageToCanvas,
  saveCanvas,
  COLORS
};
