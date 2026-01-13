import { beforeEach } from 'bun:test';
import { configure } from '@testing-library/react';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Setup happy-dom before each test
beforeEach(() => {
  // Ensure global document is available
  if (typeof global.document === 'undefined') {
    global.document = new DOMParser().parseFromString('<!DOCTYPE html><html><body></body></html>', 'text/html');
  }
});