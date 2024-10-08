module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
