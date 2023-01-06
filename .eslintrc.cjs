/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  plugins: ["functional"],
  extends: [
    // eslint 가 vue 파일도 linting 가능하게 하는 플러그인 (https://eslint.vuejs.org/)
    "plugin:vue/vue3-essential",
    "plugin:functional/recommended",
    // preset(사전에 정의된 Rule set) ✅ (https://eslint.org/docs/latest/rules/)
    "eslint:recommended",
    // typescript Rule set (https://typescript-eslint.io/rules/)
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-unused-vars": "warn",
    // 순수 함수형으로 코드를 작성하도록 도움 (https://github.com/eslint-functional/eslint-plugin-functional)
    "functional/no-expression-statement": "off",
    "functional/functional-parameters": "off"
  }
};
