// `@/` 경로는 tsconfig paths(Expo 기본 지원), worklets 플러그인은 babel-preset-expo가 자동으로 추가
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
