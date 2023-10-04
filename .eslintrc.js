module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: 'standard-with-typescript',
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
    }
  ],
  ignorePatterns: [
    'dist',
    'vite.config.ts',
    'jest.config.ts',
    'jest.setup.ts',
    'playwright.config.ts',
    'coverage',
    '.eslintrc.js'
  ]
}
