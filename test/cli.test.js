/**
 * Tests for CLI functionality
 * These are basic smoke tests to ensure the CLI can be loaded
 */

const fs = require('fs');
const path = require('path');

describe('CLI', () => {
  const cliPath = path.join(__dirname, '../bin/cli.js');

  it('should have a CLI file', () => {
    expect(fs.existsSync(cliPath)).toBe(true);
  });

  it('should be executable (have shebang)', () => {
    const content = fs.readFileSync(cliPath, 'utf8');
    expect(content.startsWith('#!/usr/bin/env node')).toBe(true);
  });

  it('should require commander for CLI parsing', () => {
    const content = fs.readFileSync(cliPath, 'utf8');
    expect(content).toContain('commander');
  });

  it('should require the main VSegments module', () => {
    const content = fs.readFileSync(cliPath, 'utf8');
    expect(content).toContain('../src/index');
  });
});

// Note: Full CLI integration tests would require spawning child processes
// and providing test images, which is beyond the scope of basic unit tests
