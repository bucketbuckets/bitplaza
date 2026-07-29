import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(cleanup);

// jsdom implements neither of these, and both are read on first paint by the
// motion wrappers and the plaza canvas. Without them every component test that
// renders a section throws before it reaches an assertion.
// Guarded on `window` existing at all: API integration tests run under
// `@vitest-environment node`, where there is no window to patch.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

if (typeof window !== "undefined" && !window.IntersectionObserver) {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = "";
      thresholds = [];
    },
  });
}
