// Setup file for vitest
import { beforeEach } from 'vitest';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});
