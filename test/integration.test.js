/**
 * Integration tests for the library
 * These tests verify the library can be imported and used correctly
 */

const VSegments = require('../src/index');
const { BoundingBox, SegmentationMask, SegmentationResult } = require('../src/index');

describe('Library exports', () => {
  it('should export VSegments as default', () => {
    expect(VSegments).toBeDefined();
    expect(typeof VSegments).toBe('function');
  });

  it('should export VSegments as named export', () => {
    const { VSegments: NamedVSegments } = require('../src/index');
    expect(NamedVSegments).toBeDefined();
    expect(NamedVSegments).toBe(VSegments);
  });

  it('should export BoundingBox', () => {
    expect(BoundingBox).toBeDefined();
    expect(typeof BoundingBox).toBe('function');
  });

  it('should export SegmentationMask', () => {
    expect(SegmentationMask).toBeDefined();
    expect(typeof SegmentationMask).toBe('function');
  });

  it('should export SegmentationResult', () => {
    expect(SegmentationResult).toBeDefined();
    expect(typeof SegmentationResult).toBe('function');
  });

  it('should export version', () => {
    const { version } = require('../src/index');
    expect(version).toBeDefined();
    expect(typeof version).toBe('string');
  });
});

describe('Library integration', () => {
  it('should create VSegments instance with API key', () => {
    const vseg = new VSegments({ apiKey: 'test-key' });
    expect(vseg).toBeInstanceOf(VSegments);
  });

  it('should create BoundingBox instance', () => {
    const box = new BoundingBox('test', 0, 0, 100, 100);
    expect(box).toBeInstanceOf(BoundingBox);
    expect(box.label).toBe('test');
  });

  it('should create SegmentationMask instance', () => {
    const mask = new SegmentationMask(0, 0, 100, 100, Buffer.alloc(10000), 'test');
    expect(mask).toBeInstanceOf(SegmentationMask);
    expect(mask.label).toBe('test');
  });

  it('should create SegmentationResult instance', () => {
    const boxes = [new BoundingBox('test', 0, 0, 100, 100)];
    const result = new SegmentationResult(boxes);
    expect(result).toBeInstanceOf(SegmentationResult);
    expect(result.length).toBe(1);
  });
});
