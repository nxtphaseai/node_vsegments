# Tests for vsegments

This directory contains the test suite for the vsegments library.

## Test Structure

- `models.test.js` - Tests for BoundingBox, SegmentationMask, and SegmentationResult classes
- `utils.test.js` - Tests for utility functions (parseJson, parseBoundingBoxes, parseSegmentationMasks)
- `core.test.js` - Tests for the main VSegments class
- `integration.test.js` - Integration tests for library exports and usage
- `fixtures/` - Mock data and test fixtures

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite covers:

### Models (`models.test.js`)
- BoundingBox creation and coordinate conversion
- SegmentationMask creation
- SegmentationResult container functionality

### Utils (`utils.test.js`)
- JSON parsing with markdown fence removal
- Bounding box parsing from API responses
- Segmentation mask parsing validation

### Core (`core.test.js`)
- VSegments initialization with various configurations
- API key handling (options vs environment variables)
- MIME type detection for images
- System instruction generation
- Method availability checks

### Integration (`integration.test.js`)
- Library export validation
- Module integration
- Instance creation

## Notes

- Tests that require actual API calls or image files are mocked or stubbed
- The core segmentation functionality requires integration tests with actual images and API keys
- Coverage excludes TypeScript definition files

## Before Deploying

Run the full test suite with coverage:

```bash
npm run test:coverage
```

Ensure all tests pass and coverage is acceptable before deploying to production.
