import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
// import tailwindcss from 'eslint-plugin-tailwindcss'

export default {
  ignores: ['dist'],
  files: ['**/*.{js,jsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
      React: 'readonly',
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    react: {
      version: 'detect',
      runtime: 'automatic',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
      },
    },
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    'prettier': prettier,
    'react': react,
    'jsx-a11y': jsxA11y,
    'import': importPlugin,
    // 'tailwindcss': tailwindcss
  },
  rules: {
    ...js.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'error',
    'arrow-body-style': 'warn',
    'prefer-arrow-callback': 'warn',
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-unused-vars': 'error',
    'eqeqeq': ['error', 'always'],
    'func-style': ['error', 'expression'],
    // 'tailwindcss/classnames-order': 'warn',    
    // 'tailwindcss/no-custom-classname': 'off'
  },
}