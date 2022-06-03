module.exports = {
  // Stop ESLint from looking for a configuration file in parent folders
  root: true,
  extends: [
    'eslint:recommended',
    // Use after eslint:recommended. It disables rules that are already checked by TS compiler and enables rules that promote using the more modern TS features
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/configs#eslint-recommended
    'plugin:@typescript-eslint/eslint-recommended',
    // The recommended set is an opinionated set of rules
    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/configs#recommended
    'plugin:@typescript-eslint/recommended',
    // Enables eslint-plugin-prettier and eslint-config-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array
    // https://github.com/prettier/eslint-plugin-prettier#readme
    'plugin:prettier/recommended',
  ],
  // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['test/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
