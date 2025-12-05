/**
 * Mock API responses for testing
 */

const mockBoundingBoxResponse = JSON.stringify([
  {
    label: 'person',
    box_2d: [100, 150, 450, 600]
  },
  {
    label: 'car',
    box_2d: [500, 200, 800, 700]
  }
]);

const mockBoundingBoxResponseWithFencing = `\`\`\`json
${mockBoundingBoxResponse}
\`\`\``;

const mockSegmentationResponse = JSON.stringify([
  {
    label: 'object1',
    box_2d: [100, 100, 200, 200],
    mask: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  }
]);

const mockEmptyResponse = JSON.stringify([]);

const mockInvalidResponse = 'This is not valid JSON';

module.exports = {
  mockBoundingBoxResponse,
  mockBoundingBoxResponseWithFencing,
  mockSegmentationResponse,
  mockEmptyResponse,
  mockInvalidResponse
};
