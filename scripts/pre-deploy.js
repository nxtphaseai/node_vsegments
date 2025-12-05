#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Run this before publishing to npm to ensure everything is ready
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deployment checks...\n');

let hasErrors = false;

// Check 1: Run tests
console.log('1️⃣  Running tests...');
try {
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ All tests passed\n');
} catch (error) {
  console.error('❌ Tests failed\n');
  hasErrors = true;
}

// Check 2: Check for required files
console.log('2️⃣  Checking required files...');
const requiredFiles = [
  'package.json',
  'README.md',
  'LICENSE',
  'src/index.js',
  'src/core.js',
  'src/models.js',
  'src/utils.js',
  'bin/cli.js'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(__dirname, '..', file))) {
    console.error(`❌ Missing required file: ${file}`);
    allFilesExist = false;
    hasErrors = true;
  }
}
if (allFilesExist) {
  console.log('✅ All required files present\n');
}

// Check 3: Verify package.json
console.log('3️⃣  Verifying package.json...');
const pkg = require('../package.json');
const requiredFields = ['name', 'version', 'description', 'main', 'author', 'license'];
let allFieldsPresent = true;

for (const field of requiredFields) {
  if (!pkg[field]) {
    console.error(`❌ Missing required field in package.json: ${field}`);
    allFieldsPresent = false;
    hasErrors = true;
  }
}
if (allFieldsPresent) {
  console.log('✅ package.json is valid\n');
}

// Check 4: Verify dependencies
console.log('4️⃣  Checking dependencies...');
const requiredDeps = ['@google/generative-ai', 'canvas', 'commander'];
let allDepsPresent = true;

for (const dep of requiredDeps) {
  if (!pkg.dependencies || !pkg.dependencies[dep]) {
    console.error(`❌ Missing required dependency: ${dep}`);
    allDepsPresent = false;
    hasErrors = true;
  }
}
if (allDepsPresent) {
  console.log('✅ All dependencies present\n');
}

// Check 5: Test coverage
console.log('5️⃣  Running test coverage...');
try {
  execSync('npm run test:coverage -- --silent', { stdio: 'pipe' });
  console.log('✅ Coverage report generated\n');
} catch (error) {
  console.error('❌ Coverage check failed\n');
  hasErrors = true;
}

// Final result
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (hasErrors) {
  console.log('❌ Pre-deployment checks failed!');
  console.log('Please fix the issues above before deploying.\n');
  process.exit(1);
} else {
  console.log('✅ All pre-deployment checks passed!');
  console.log('Your package is ready to deploy.\n');
  console.log('To publish to npm, run: npm publish\n');
  process.exit(0);
}
