const extensions = ['.js', '.jsx', '.json', '.node', '.ts', '.tsx', '.d.ts'];

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', '@homer0'],
  extends: ['plugin:@homer0/node-with-prettier', 'plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
  },
  settings: {
    node: {
      tryExtensions: extensions,
    },
    'import/extensions': extensions,
    'import/resolver': {
      node: {
        extensions: extensions,
      },
    },
  },
};
