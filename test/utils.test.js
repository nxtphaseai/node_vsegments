/**
 * Tests for utility functions
 */

const { parseJson, parseBoundingBoxes, parseSegmentationMasks } = require('../src/utils');
const { BoundingBox } = require('../src/models');

describe('parseJson', () => {
  it('should parse clean JSON string', () => {
    const input = '{"test": "value"}';
    const result = parseJson(input);
    
    expect(result).toBe('{"test": "value"}');
  });

  it('should remove markdown code fencing', () => {
    const input = '```json\n{"test": "value"}\n```';
    const result = parseJson(input);
    
    expect(result).toBe('{"test": "value"}');
  });

  it('should handle JSON with newlines', () => {
    const input = '```json\n{\n  "test": "value"\n}\n```';
    const result = parseJson(input);
    
    expect(result).toBe('{\n  "test": "value"\n}');
  });

  it('should trim whitespace', () => {
    const input = '  {"test": "value"}  ';
    const result = parseJson(input);
    
    expect(result).toBe('{"test": "value"}');
  });

  it('should handle text before json marker', () => {
    const input = 'Here is the result:\n```json\n{"test": "value"}\n```';
    const result = parseJson(input);
    
    expect(result).toBe('{"test": "value"}');
  });
});

describe('parseBoundingBoxes', () => {
  it('should parse single bounding box', () => {
    const responseText = JSON.stringify([
      {
        label: 'person',
        box_2d: [100, 200, 300, 400]
      }
    ]);
    
    const boxes = parseBoundingBoxes(responseText);
    
    expect(boxes).toHaveLength(1);
    expect(boxes[0]).toBeInstanceOf(BoundingBox);
    expect(boxes[0].label).toBe('person');
    expect(boxes[0].y1).toBe(100);
    expect(boxes[0].x1).toBe(200);
    expect(boxes[0].y2).toBe(300);
    expect(boxes[0].x2).toBe(400);
  });

  it('should parse multiple bounding boxes', () => {
    const responseText = JSON.stringify([
      { label: 'car', box_2d: [50, 100, 150, 200] },
      { label: 'person', box_2d: [200, 300, 400, 500] },
      { label: 'tree', box_2d: [0, 0, 100, 100] }
    ]);
    
    const boxes = parseBoundingBoxes(responseText);
    
    expect(boxes).toHaveLength(3);
    expect(boxes[0].label).toBe('car');
    expect(boxes[1].label).toBe('person');
    expect(boxes[2].label).toBe('tree');
  });

  it('should handle JSON with markdown fencing', () => {
    const responseText = '```json\n' + JSON.stringify([
      { label: 'object', box_2d: [10, 20, 30, 40] }
    ]) + '\n```';
    
    const boxes = parseBoundingBoxes(responseText);
    
    expect(boxes).toHaveLength(1);
    expect(boxes[0].label).toBe('object');
  });

  it('should skip items without box_2d property', () => {
    const responseText = JSON.stringify([
      { label: 'valid', box_2d: [0, 0, 100, 100] },
      { label: 'invalid' },
      { label: 'also_valid', box_2d: [100, 100, 200, 200] }
    ]);
    
    const boxes = parseBoundingBoxes(responseText);
    
    expect(boxes).toHaveLength(2);
    expect(boxes[0].label).toBe('valid');
    expect(boxes[1].label).toBe('also_valid');
  });

  it('should return empty array for empty response', () => {
    const responseText = JSON.stringify([]);
    const boxes = parseBoundingBoxes(responseText);
    
    expect(boxes).toEqual([]);
  });
});

describe('parseSegmentationMasks', () => {
  it('should return empty array when no masks in response', async () => {
    const responseText = JSON.stringify([
      { label: 'object', box_2d: [0, 0, 100, 100] }
    ]);
    
    const masks = await parseSegmentationMasks(responseText, 100, 100);
    
    expect(masks).toEqual([]);
  });

  it('should skip items without box_2d or mask', async () => {
    const responseText = JSON.stringify([
      { label: 'no_box' },
      { label: 'no_mask', box_2d: [0, 0, 100, 100] }
    ]);
    
    const masks = await parseSegmentationMasks(responseText, 100, 100);
    
    expect(masks).toEqual([]);
  });

  // Note: Testing actual mask parsing requires creating valid base64 encoded PNG images
  // which is complex. This would be better tested with integration tests using real data.
});
