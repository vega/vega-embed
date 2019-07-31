module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  env: {
    browser: true
  },
  parserOptions: {
    project: "tsconfig.json",
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  rules: {
    "prettier/prettier": "warn",

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
    "@typescript-eslint/no-non-null-assertion": "off", //this is useful for DOM manipulation
    "@typescript-eslint/explicit-function-return-type": "off", // this is just annoying to have
    "@typescript-eslint/no-explicit-any": "off",

    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-require-imports": "error",

    // https://eslint.org/docs/rules/
    "no-console": ["error", { allow: ["warn"] }],
    "no-restricted-syntax": "off", // I disagree with the rule, for..of is better
    "no-undef": "off", // TS takes care of this
    "import/no-unresolved": "off", // TS takes care of this
    "import/no-duplicates": "off" // we sometimes import * as individual things
  }
};
