module.exports = [
  {
    ...require('eslint-config-love')
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx'
    ],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      '@typescript-eslint/ban-tslint-comment': 'off'
    }
  },
  {
    ignores: [
      'dist/**',
      'vite.config.ts',
      'jest.config.ts',
      'jest.setup.ts',
      'jest.polyfills.js',
      'jest.resolver.js',
      'playwright.config.ts',
      'coverage',
      'eslint.config.js'
    ]

  }
]