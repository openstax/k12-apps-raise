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
      '@typescript-eslint/ban-tslint-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/max-params': 'off',
      '@typescript-eslint/init-declarations': 'off',
    }
  },
  {
    ignores: [
      'dist/**',
      'vite.config.ts',
      'playwright.config.ts',
      'coverage',
      'eslint.config.cjs'
    ]

  }
]