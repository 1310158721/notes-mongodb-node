module.exports = {
  root: true,
  env: {
    browser: true
  },
  "extends": [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // 允许使用 console
    'no-console': 'off',
    // 允许使用 debugger
    'no-debugger': 'off',
    // 必须使用分号结尾
    'semi': [2, 'always'],
    // 允许声明变量未使用
    'no-unused-vars': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}