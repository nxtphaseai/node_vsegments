/**
 * Tests for data models
 */

const { BoundingBox, SegmentationMask, SegmentationResult } = require('../src/models');

describe('BoundingBox', () => {
  describe('constructor', () => {
    it('should create a bounding box with correct properties', () => {
      const box = new BoundingBox('person', 100, 200, 300, 400);
      
      expect(box.label).toBe('person');
      expect(box.y1).toBe(100);
      expect(box.x1).toBe(200);
      expect(box.y2).toBe(300);
      expect(box.x2).toBe(400);
    });
  });

  describe('toAbsolute', () => {
    it('should convert normalized coordinates to absolute pixels', () => {
      const box = new BoundingBox('object', 0, 0, 500, 500);
      const [absX1, absY1, absX2, absY2] = box.toAbsolute(1000, 1000);
      
      expect(absX1).toBe(0);
      expect(absY1).toBe(0);
      expect(absX2).toBe(500);
      expect(absY2).toBe(500);
    });

    it('should handle different image dimensions', () => {
      const box = new BoundingBox('object', 250, 250, 750, 750);
      const [absX1, absY1, absX2, absY2] = box.toAbsolute(800, 600);
      
      expect(absX1).toBe(200);
      expect(absY1).toBe(150);
      expect(absX2).toBe(600);
      expect(absY2).toBe(450);
    });

    it('should round to nearest pixel', () => {
      const box = new BoundingBox('object', 333, 333, 666, 666);
      const [absX1, absY1, absX2, absY2] = box.toAbsolute(1000, 1000);
      
      expect(Number.isInteger(absX1)).toBe(true);
      expect(Number.isInteger(absY1)).toBe(true);
      expect(Number.isInteger(absX2)).toBe(true);
      expect(Number.isInteger(absY2)).toBe(true);
    });
  });

  describe('fromDict', () => {
    it('should create BoundingBox from API response object', () => {
      const data = {
        label: 'car',
        box_2d: [100, 200, 300, 400]
      };
      
      const box = BoundingBox.fromDict(data);
      
      expect(box.label).toBe('car');
      expect(box.y1).toBe(100);
      expect(box.x1).toBe(200);
      expect(box.y2).toBe(300);
      expect(box.x2).toBe(400);
    });
  });
});

describe('SegmentationMask', () => {
  describe('constructor', () => {
    it('should create a segmentation mask with correct properties', () => {
      const maskData = Buffer.alloc(100);
      const mask = new SegmentationMask(10, 20, 110, 120, maskData, 'object');
      
      expect(mask.y0).toBe(10);
      expect(mask.x0).toBe(20);
      expect(mask.y1).toBe(110);
      expect(mask.x1).toBe(120);
      expect(mask.mask).toBe(maskData);
      expect(mask.label).toBe('object');
    });

    it('should accept Buffer as mask data', () => {
      const maskData = Buffer.from([0, 255, 128, 64]);
      const mask = new SegmentationMask(0, 0, 2, 2, maskData, 'test');
      
      expect(Buffer.isBuffer(mask.mask)).toBe(true);
      expect(mask.mask.length).toBe(4);
    });
  });
});

describe('SegmentationResult', () => {
  describe('constructor', () => {
    it('should create result with boxes only', () => {
      const boxes = [
        new BoundingBox('object1', 0, 0, 100, 100),
        new BoundingBox('object2', 200, 200, 300, 300)
      ];
      
      const result = new SegmentationResult(boxes);
      
      expect(result.boxes).toEqual(boxes);
      expect(result.masks).toBeNull();
      expect(result.rawResponse).toBeNull();
    });

    it('should create result with boxes and masks', () => {
      const boxes = [new BoundingBox('object', 0, 0, 100, 100)];
      const masks = [new SegmentationMask(0, 0, 100, 100, Buffer.alloc(10000), 'object')];
      
      const result = new SegmentationResult(boxes, masks);
      
      expect(result.boxes).toEqual(boxes);
      expect(result.masks).toEqual(masks);
    });

    it('should store raw response if provided', () => {
      const boxes = [];
      const rawResponse = '{"test": "data"}';
      
      const result = new SegmentationResult(boxes, null, rawResponse);
      
      expect(result.rawResponse).toBe(rawResponse);
    });
  });

  describe('length getter', () => {
    it('should return number of detected objects', () => {
      const boxes = [
        new BoundingBox('obj1', 0, 0, 100, 100),
        new BoundingBox('obj2', 100, 100, 200, 200),
        new BoundingBox('obj3', 200, 200, 300, 300)
      ];
      
      const result = new SegmentationResult(boxes);
      
      expect(result.length).toBe(3);
    });

    it('should return 0 for empty results', () => {
      const result = new SegmentationResult([]);
      
      expect(result.length).toBe(0);
    });
  });
});
