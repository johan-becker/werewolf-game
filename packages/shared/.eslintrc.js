module.exports = {
  root: true,
  extends: [
    '../../.eslintrc.js',
    'plugin:jest/recommended'
  ],
  env: {
    jest: true,
    node: true
  },
  plugins: ['jest'],
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.ts', '**/*.spec.ts', '**/setup.ts'],
      env: {
        jest: true
      },
      globals: {
        jest: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        test: 'readonly'
      },
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
};