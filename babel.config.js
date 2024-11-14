module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
    [
      '@babel/plugin-transform-class-properties',
      {
        loose: true, // set 'loose' mode to true
      },
    ],
    [
      '@babel/plugin-transform-private-methods',
      {
        loose: true, // set 'loose' mode to true
      },
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      {
        loose: true, // set 'loose' mode to true
      },
    ],
  ],
};
