import '@testing-library/react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Native File System
jest.mock('react-native-fs', () => ({
  MainBundlePath: '/mock/bundle/path',
  readFile: jest.fn(),
  writeFile: jest.fn(),
  exists: jest.fn(),
}));

// Mock Axios
jest.mock('../src/config/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock the PD Schema loader
jest.mock('../src/services/field.services', () => ({
  getPDSchema: jest.fn(),
}));

// Suppress console errors during tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock timers
jest.useFakeTimers();

// Global test utilities
global.mockFn = jest.fn;

