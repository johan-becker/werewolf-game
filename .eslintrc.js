module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.base.json', './packages/*/tsconfig.json']
  },
  env: {
    node: true,
    es6: true
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.next/',
    'coverage/',
    '*.js',
    '*.d.ts'
  ],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    
    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Import organization
    'sort-imports': ['error', {
      'ignoreCase': false,
      'ignoreDeclarationSort': true,
      'ignoreMemberSort': false,
      'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single']
    }]
  },
  overrides: [
    // Backend specific rules
    {
      files: ['packages/backend/**/*.ts'],
      env: {
        node: true
      },
      rules: {
        'no-console': 'off' // Allow console logs in backend
      }
    },
    // Frontend specific rules
    {
      files: ['packages/frontend/**/*.{ts,tsx}'],
      extends: ['next/core-web-vitals'],
      env: {
        browser: true,
        node: true
      },
      rules: {
        'react/react-in-jsx-scope': 'off', // Next.js doesn't require React import
        'react/prop-types': 'off' // Using TypeScript for prop validation
      }
    },
    // Test files
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      env: {
        jest: true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
};