import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
// import tailwindcss from 'eslint-plugin-tailwindcss'

export default {
  ignores: ['dist'],
  files: ['**/*.{js,jsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
      React: 'readonly'
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  settings: {
    react: {
      version: 'detect',
      runtime: 'automatic'
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css']
      }
    }
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    'prettier': prettier,
    'react': react,
    'jsx-a11y': jsxA11y,
    'import': importPlugin,
    // 'tailwindcss': tailwindcss
    '@stylistic/js': stylisticJs
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
      { allowConstantExport: true }
    ],
    'no-unused-vars': 'error',
    'eqeqeq': ['error', 'always'],
    'react/function-component-definition': ['error', { 
      namedComponents: ['function-expression', `arrow-function`], 
      unnamedComponents: 'arrow-function', 
    }],
    'func-style': ['error', 'expression'],
    'operator-linebreak': ['error', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
    'object-curly-newline': ['error', {
      'ObjectExpression': { 'multiline': true, 'consistent': true },
      'ObjectPattern': { 'multiline': true, 'consistent': true },
      'ImportDeclaration': { 'multiline': true, 'consistent': true },
      'ExportDeclaration': { 'multiline': true, 'consistent': true }
    }],
    "react/jsx-uses-vars": "error",
    // "comma-dangle": ["error", "never"]
    // 'tailwindcss/classnames-order': 'warn',    
    // 'tailwindcss/no-custom-classname': 'off'
    'import/order': [
      'error',
      {
        groups: [
          'builtin',  
          'external', 
          'internal', 
          'parent',   
          'sibling',  
          'index',    
          'object',   
          'type',     
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '{react-*,react-*/**, react/*}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: './routes/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: './pages{,/**}',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '{./store/**,../store/**,../../store/**}',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '{./context/**,../context/**,../../context/**}',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: './**/*Provider, ./*Provider',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: './components/**',
            group: 'internal',
            position: 'before',
          },
          // Hooks
          {
            pattern: './hooks/**',
            group: 'internal',
            position: 'before',
          },
          // Firebase
          {
            pattern: '{./firebase/**,../firebase/**,../../firebase/**}',
            group: 'internal',
            position: 'before',
          },
          // Utils
          {
            pattern: './utils/**',
            group: 'internal',
            position: 'before',
          },
          // Style
          {
            pattern: './**/*.css',
            group: 'sibling',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        // "consolidateIslands": 'inside-groups',
        'newlines-between': 'always',
        "distinctGroup": true,
      },
    ],
  }
}