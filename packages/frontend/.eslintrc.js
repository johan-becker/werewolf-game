module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    // Inherit most rules from Next.js defaults but customize for monorepo
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true
    }],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'no-case-declarations': 'off',
    '@typescript-eslint/ban-types': 'off' // Allow empty object types for flexibility
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-console': 'off'
      }
    },
    {
      files: ['*.config.*', '*.setup.*'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off'
      }
    }
  ]
};