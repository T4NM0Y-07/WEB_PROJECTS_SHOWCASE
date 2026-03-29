// data.js - Holds the configuration for your showcased websites
const SHOWCASE_DATA = [];

// If we're in a common js environment (like Node) we'll export it, 
// but for standard browsers we just let it sit in the global window object.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SHOWCASE_DATA;
}
