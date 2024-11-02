module.exports = {
  verbose: true, // Indicate whether each individual test should be reported during the run
  testEnvironment: 'node', // The test environment that will be used for testing (default: "node" for Node.js apps)
  globals: {}, // A set of global variables that need to be available in all test environments
  testMatch: [ // The glob patterns Jest uses to detect test files
    '**/tests/**/*.[jt]s?(x)', // Matches files in a 'tests' directory
    '**/*.test.js', // Matches any file ending in .test.js
  ],
  testTimeout: 10000,
};
