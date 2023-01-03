/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    // eslint 가 vue 파일도 linting 가능하게 하는 플러그인 (https://eslint.vuejs.org/)
    "plugin:vue/vue3-essential",
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
    // 함수 파라미터 변경 금지 for pure function (https://eslint.org/docs/latest/rules/no-param-reassign)
    "no-param-reassign": "error",
    "no-unused-vars": "error"
  }
};
