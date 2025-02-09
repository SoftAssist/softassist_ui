// eslint-disable-next-line no-undef
require('@testing-library/jest-dom');

// Add TextEncoder/TextDecoder to global if they don't exist
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(text) {
      return new Uint8Array([...text].map(ch => ch.charCodeAt(0)));
    }
  };
}

if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = class TextDecoder {
    decode(buffer) {
      return String.fromCharCode(...new Uint8Array(buffer));
    }
  };
}

// Setup test environment
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    statusText: 'OK',
  })
); 