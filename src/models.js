/**
 * Data models for vsegments
 */

class BoundingBox {
  /**
   * Represents a 2D bounding box with label
   * @param {string} label - Object label
   * @param {number} y1 - Top coordinate (normalized 0-1000)
   * @param {number} x1 - Left coordinate (normalized 0-1000)
   * @param {number} y2 - Bottom coordinate (normalized 0-1000)
   * @param {number} x2 - Right coordinate (normalized 0-1000)
   */
  constructor(label, y1, x1, y2, x2) {
    this.label = label;
    this.y1 = y1;
    this.x1 = x1;
    this.y2 = y2;
    this.x2 = x2;
  }

  /**
   * Convert normalized coordinates to absolute pixel coordinates
   * @param {number} imgWidth - Image width in pixels
   * @param {number} imgHeight - Image height in pixels
   * @returns {number[]} - [absX1, absY1, absX2, absY2]
   */
  toAbsolute(imgWidth, imgHeight) {
    const absX1 = Math.round((this.x1 / 1000) * imgWidth);
    const absY1 = Math.round((this.y1 / 1000) * imgHeight);
    const absX2 = Math.round((this.x2 / 1000) * imgWidth);
    const absY2 = Math.round((this.y2 / 1000) * imgHeight);
    return [absX1, absY1, absX2, absY2];
  }

  /**
   * Create BoundingBox from API response object
   * @param {Object} data - Raw data from API
   * @returns {BoundingBox}
   */
  static fromDict(data) {
    const box = data.box_2d;
    return new BoundingBox(
      data.label,
      box[0],
      box[1],
      box[2],
      box[3]
    );
  }
}

class SegmentationMask {
  /**
   * Represents a segmentation mask for an object
   * @param {number} y0 - Top coordinate (absolute pixels)
   * @param {number} x0 - Left coordinate (absolute pixels)
   * @param {number} y1 - Bottom coordinate (absolute pixels)
   * @param {number} x1 - Right coordinate (absolute pixels)
   * @param {Buffer} mask - Mask data [height, width] with values 0-255
   * @param {string} label - Object label
   */
  constructor(y0, x0, y1, x1, mask, label) {
    this.y0 = y0;
    this.x0 = x0;
    this.y1 = y1;
    this.x1 = x1;
    this.mask = mask;
    this.label = label;
  }
}

class SegmentationResult {
  /**
   * Container for segmentation/detection results
   * @param {BoundingBox[]} boxes - Array of bounding boxes
   * @param {SegmentationMask[]|null} masks - Array of segmentation masks (optional)
   * @param {string|null} rawResponse - Raw API response (optional)
   */
  constructor(boxes, masks = null, rawResponse = null) {
    this.boxes = boxes;
    this.masks = masks;
    this.rawResponse = rawResponse;
  }

  /**
   * Get number of detected objects
   * @returns {number}
   */
  get length() {
    return this.boxes.length;
  }
}

module.exports = {
  BoundingBox,
  SegmentationMask,
  SegmentationResult
};
