/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
  ],
  preset: 'ts-jest',
};
