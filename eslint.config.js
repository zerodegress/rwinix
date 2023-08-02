import 'eslint'

export default {
  env: {
      browser: true,
      es2021: true,
      node: true,
  },
  extends: ['standard-with-typescript', 'plugin:prettier/recommended'],
  parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
  },
  plugins: ['prettier', 'eslint-plugin-jest'],
  rules: {
  },
}