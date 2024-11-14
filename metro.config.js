// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

// Get the default Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

// Define any custom configuration options if needed
const customConfig = {};

// Merge default configuration with custom configuration
const mergedConfig = mergeConfig(defaultConfig, customConfig);

// Wrap with Reanimated configuration
module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
