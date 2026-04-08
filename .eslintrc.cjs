module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays Prettier errors as ESLint errors
    'prettier', // Extends prettier to disable ESLint rules that conflict with Prettier
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  ignorePatterns: ['*.config*.ts', '*.d*.ts'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }], // Ensure ESLint uses your Prettier configuration
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off', // Disable prop-types enforcement for TypeScript projects
    '@typescript-eslint/explicit-function-return-type': 'off',
    'simple-import-sort/imports': 'off',
    'simple-import-sort/exports': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'no-restricted-exports': 'off', // Allow more flexibility in exports
    'import/no-extraneous-dependencies': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'no-nested-ternary': 'off',
    'react/no-array-index-key': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'import/order': 'off',
    'no-param-reassign': ['error', { props: false }],
    '@typescript-eslint/no-use-before-define': 'off',
    'consistent-return': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/label-has-associated-control': 'off',
    'no-promise-executor-return': 'off',
    'react/button-has-type': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'no-return-assign': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/function-component-definition': [
      2,
      {
        namedComponents: ['function-declaration', 'arrow-function'],
        unnamedComponents: 'arrow-function',
      },
    ],
  },
};
