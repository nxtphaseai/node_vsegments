/**
 * vsegments - Visual Segmentation Library
 * 
 * A Node.js library for image segmentation and bounding box detection 
 * using Google Gemini AI.
 * 
 * @module vsegments
 * @author Marco Kotrotsos
 * @license MIT
 */

const VSegments = require('./core');
const { BoundingBox, SegmentationMask, SegmentationResult } = require('./models');

module.exports = VSegments;
module.exports.VSegments = VSegments;
module.exports.BoundingBox = BoundingBox;
module.exports.SegmentationMask = SegmentationMask;
module.exports.SegmentationResult = SegmentationResult;
module.exports.version = '0.1.0';
