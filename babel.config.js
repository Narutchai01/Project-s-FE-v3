const plugin = require("tailwindcss");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
        }
      ],
      'react-native-reanimated/plugin',
    ]
  };
};