/**
 * Tests for VSegments core class
 */

const VSegments = require('../src/core');
const { SegmentationResult } = require('../src/models');

describe('VSegments', () => {
  describe('constructor', () => {
    it('should create instance with API key from options', () => {
      const vseg = new VSegments({ apiKey: 'test-api-key' });
      
      expect(vseg.apiKey).toBe('test-api-key');
      expect(vseg.model).toBe('gemini-3-pro-preview');
      expect(vseg.temperature).toBe(0.5);
      expect(vseg.maxObjects).toBe(25);
    });

    it('should use environment variable if no API key provided', () => {
      const originalEnv = process.env.GOOGLE_API_KEY;
      process.env.GOOGLE_API_KEY = 'env-api-key';
      
      const vseg = new VSegments();
      
      expect(vseg.apiKey).toBe('env-api-key');
      
      // Restore
      if (originalEnv) {
        process.env.GOOGLE_API_KEY = originalEnv;
      } else {
        delete process.env.GOOGLE_API_KEY;
      }
    });

    it('should throw error if no API key available', () => {
      const originalEnv = process.env.GOOGLE_API_KEY;
      delete process.env.GOOGLE_API_KEY;
      
      expect(() => {
        new VSegments();
      }).toThrow('API key must be provided');
      
      // Restore
      if (originalEnv) {
        process.env.GOOGLE_API_KEY = originalEnv;
      }
    });

    it('should accept custom model name', () => {
      const vseg = new VSegments({
        apiKey: 'test-key',
        model: 'gemini-pro-vision'
      });
      
      expect(vseg.model).toBe('gemini-pro-vision');
    });

    it('should accept custom temperature', () => {
      const vseg = new VSegments({
        apiKey: 'test-key',
        temperature: 0.8
      });
      
      expect(vseg.temperature).toBe(0.8);
    });

    it('should accept temperature of 0', () => {
      const vseg = new VSegments({
        apiKey: 'test-key',
        temperature: 0
      });
      
      expect(vseg.temperature).toBe(0);
    });

    it('should accept custom maxObjects', () => {
      const vseg = new VSegments({
        apiKey: 'test-key',
        maxObjects: 50
      });
      
      expect(vseg.maxObjects).toBe(50);
    });

    it('should have safety settings configured', () => {
      const vseg = new VSegments({ apiKey: 'test-key' });
      
      expect(vseg.safetySettings).toBeInstanceOf(Array);
      expect(vseg.safetySettings.length).toBeGreaterThan(0);
    });
  });

  describe('_getMimeType', () => {
    let vseg;

    beforeEach(() => {
      vseg = new VSegments({ apiKey: 'test-key' });
    });

    it('should return correct MIME type for jpg', () => {
      expect(vseg._getMimeType('image.jpg')).toBe('image/jpeg');
      expect(vseg._getMimeType('IMAGE.JPG')).toBe('image/jpeg');
    });

    it('should return correct MIME type for jpeg', () => {
      expect(vseg._getMimeType('image.jpeg')).toBe('image/jpeg');
    });

    it('should return correct MIME type for png', () => {
      expect(vseg._getMimeType('image.png')).toBe('image/png');
    });

    it('should return correct MIME type for gif', () => {
      expect(vseg._getMimeType('image.gif')).toBe('image/gif');
    });

    it('should return correct MIME type for webp', () => {
      expect(vseg._getMimeType('image.webp')).toBe('image/webp');
    });

    it('should return correct MIME type for svg', () => {
      expect(vseg._getMimeType('image.svg')).toBe('image/svg+xml');
    });

    it('should default to jpeg for unknown extensions', () => {
      expect(vseg._getMimeType('image.bmp')).toBe('image/jpeg');
      expect(vseg._getMimeType('image.tiff')).toBe('image/jpeg');
    });

    it('should handle paths with multiple dots', () => {
      expect(vseg._getMimeType('/path/to/my.image.png')).toBe('image/png');
    });
  });

  describe('_getSystemInstructions', () => {
    let vseg;

    beforeEach(() => {
      vseg = new VSegments({ apiKey: 'test-key', maxObjects: 10 });
    });

    it('should return default instructions when no custom instructions', () => {
      const instructions = vseg._getSystemInstructions();
      
      expect(instructions).toContain('JSON array');
      expect(instructions).toContain('10 objects');
    });

    it('should append custom instructions', () => {
      const custom = 'Focus on vehicles only';
      const instructions = vseg._getSystemInstructions(custom);
      
      expect(instructions).toContain('JSON array');
      expect(instructions).toContain(custom);
    });

    it('should include maxObjects in instructions', () => {
      const vseg25 = new VSegments({ apiKey: 'test-key', maxObjects: 25 });
      const instructions = vseg25._getSystemInstructions();
      
      expect(instructions).toContain('25 objects');
    });
  });

  // Integration tests with mocked API would go here
  // These would test detectBoxes, segment, and visualize methods
  // but require mocking the Google Generative AI SDK

  describe('API methods (require mocking)', () => {
    it('should have detectBoxes method', () => {
      const vseg = new VSegments({ apiKey: 'test-key' });
      expect(typeof vseg.detectBoxes).toBe('function');
    });

    it('should have segment method', () => {
      const vseg = new VSegments({ apiKey: 'test-key' });
      expect(typeof vseg.segment).toBe('function');
    });

    it('should have visualize method', () => {
      const vseg = new VSegments({ apiKey: 'test-key' });
      expect(typeof vseg.visualize).toBe('function');
    });
  });
});
