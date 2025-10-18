const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

// Enable support for react-native-worklets
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Add support for react-native-worklets file extensions
config.resolver = {
  ...config.resolver,
  sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
  assetExts: ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'svg', 'webp'],
};

module.exports = config;