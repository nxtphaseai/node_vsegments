/**
 * Core VSegments class for image segmentation and bounding box detection
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { loadImage } = require('canvas');
const fs = require('fs').promises;
const { SegmentationResult } = require('./models');
const { parseBoundingBoxes, parseSegmentationMasks } = require('./utils');
const { 
  loadImageToCanvas, 
  plotBoundingBoxes, 
  plotSegmentationMasks,
  saveCanvas 
} = require('./visualize');

class VSegments {
  /**
   * Main class for visual segmentation using Google Gemini AI
   * @param {Object} options - Configuration options
   * @param {string} options.apiKey - Google API key (defaults to GOOGLE_API_KEY env var)
   * @param {string} options.model - Model name (default: gemini-flash-latest)
   * @param {number} options.temperature - Sampling temperature (default: 0.5)
   * @param {number} options.maxObjects - Maximum objects to detect (default: 25)
   */
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.GOOGLE_API_KEY;
    
    if (!this.apiKey) {
      throw new Error(
        'API key must be provided or set in GOOGLE_API_KEY environment variable'
      );
    }
    
    this.model = options.model || 'gemini-3-pro-preview';
    this.temperature = options.temperature !== undefined ? options.temperature : 0.5;
    this.maxObjects = options.maxObjects || 25;
    
    // Initialize Google AI client
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    
    // Default system instructions
    this.defaultSystemInstructions = `
Return bounding boxes as a JSON array with labels. Never return masks or code fencing. Limit to ${this.maxObjects} objects.
If an object is present multiple times, name them according to their unique characteristic (colors, size, position, unique characteristics, etc..).
    `.trim();
    
    // Safety settings
    this.safetySettings = [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ];
  }
  
  /**
   * Load image from file and convert to format for API
   * @param {string} imagePath - Path to image file
   * @returns {Promise<Object>} - Image data for API
   */
  async _loadImage(imagePath) {
    const imageBuffer = await fs.readFile(imagePath);
    const base64Data = imageBuffer.toString('base64');
    const mimeType = this._getMimeType(imagePath);
    
    return {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };
  }
  
  /**
   * Get MIME type from file extension
   * @param {string} filePath - File path
   * @returns {string} - MIME type
   */
  _getMimeType(filePath) {
    const ext = filePath.toLowerCase().split('.').pop();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }
  
  /**
   * Get system instructions with custom additions
   * @param {string} customInstructions - Additional instructions
   * @returns {string} - Complete system instructions
   */
  _getSystemInstructions(customInstructions) {
    let instructions = this.defaultSystemInstructions;
    
    if (customInstructions) {
      instructions += '\n' + customInstructions;
    }
    
    return instructions;
  }
  
  /**
   * Detect bounding boxes in an image
   * @param {string} imagePath - Path to image file
   * @param {Object} options - Detection options
   * @param {string} options.prompt - Custom prompt
   * @param {string} options.customInstructions - Additional system instructions
   * @param {number} options.maxSize - Maximum image dimension
   * @returns {Promise<SegmentationResult>} - Detection results
   */
  async detectBoxes(imagePath, options = {}) {
    const {
      prompt = 'Detect the 2d bounding boxes',
      customInstructions = null,
      maxSize = 1024
    } = options;
    
    // Load image
    const image = await this._loadImage(imagePath);
    
    // Get model
    const model = this.genAI.getGenerativeModel({
      model: this.model,
      safetySettings: this.safetySettings,
      systemInstruction: this._getSystemInstructions(customInstructions)
    });
    
    // Generate content
    let result, response, text;
    try {
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }, image] }],
        generationConfig: {
          temperature: this.temperature,
        }
      });
      
      response = result.response;
      text = response.text();
    } catch (error) {
      if (error.status === 500) {
        throw new Error(
          `Google Gemini API error (500): This may be a temporary issue. Try again later or verify your API key and image. Original error: ${error.message}`
        );
      }
      throw error;
    }
    
    // Parse response
    const boxes = parseBoundingBoxes(text);
    
    return new SegmentationResult(boxes, null, text);
  }
  
  /**
   * Perform segmentation on an image
   * @param {string} imagePath - Path to image file
   * @param {Object} options - Segmentation options
   * @param {string} options.prompt - Custom prompt
   * @param {number} options.maxSize - Maximum image dimension
   * @returns {Promise<SegmentationResult>} - Segmentation results
   */
  async segment(imagePath, options = {}) {
    const {
      prompt = 'Give the segmentation masks for the objects. Output a JSON list of segmentation masks where each entry contains the 2D bounding box in the key "box_2d", the segmentation mask in key "mask", and the text label in the key "label". Use descriptive labels.',
      maxSize = 1024
    } = options;
    
    // Load image
    const image = await this._loadImage(imagePath);
    
    // Get image dimensions
    const img = await loadImage(imagePath);
    const imgWidth = img.width;
    const imgHeight = img.height;
    
    // Get model (no system instructions for segmentation)
    const model = this.genAI.getGenerativeModel({
      model: this.model,
      safetySettings: this.safetySettings
    });
    
    // Generate content
    let result, response, text;
    try {
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }, image] }],
        generationConfig: {
          temperature: this.temperature,
        }
      });
      
      response = result.response;
      text = response.text();
    } catch (error) {
      if (error.status === 500) {
        throw new Error(
          `Google Gemini API error (500): This may be a temporary issue. Try again later or verify your API key and image. Original error: ${error.message}`
        );
      }
      throw error;
    }
    
    // Parse response
    const boxes = parseBoundingBoxes(text);
    const masks = await parseSegmentationMasks(text, imgHeight, imgWidth);
    
    return new SegmentationResult(boxes, masks, text);
  }
  
  /**
   * Visualize detection/segmentation results
   * @param {string} imagePath - Path to original image
   * @param {SegmentationResult} result - Detection/segmentation results
   * @param {Object} options - Visualization options
   * @param {string} options.outputPath - Path to save output
   * @param {number} options.lineWidth - Bounding box line width
   * @param {number} options.fontSize - Label font size
   * @param {number} options.alpha - Mask transparency (0-1)
   * @returns {Promise<Canvas>} - Canvas with visualizations
   */
  async visualize(imagePath, result, options = {}) {
    const {
      outputPath = null,
      lineWidth = 4,
      fontSize = 14,
      alpha = 0.7
    } = options;
    
    // Load image to canvas
    const canvas = await loadImageToCanvas(imagePath, 2048);
    
    // Draw visualizations
    if (result.masks) {
      plotSegmentationMasks(canvas, result.masks, {
        lineWidth,
        fontSize,
        alpha
      });
    } else {
      plotBoundingBoxes(canvas, result.boxes, {
        lineWidth,
        fontSize
      });
    }
    
    // Save if requested
    if (outputPath) {
      await saveCanvas(canvas, outputPath);
    }
    
    return canvas;
  }
}

module.exports = VSegments;
