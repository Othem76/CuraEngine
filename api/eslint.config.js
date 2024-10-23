export default [
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    rules: {
      camelcase: ["error", { properties: "always" }],
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: "error",
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "no-unused-vars": "warn",
      indent: ["error", 2],
      "no-console": "off",

      "padding-line-between-statements": [
        { blankLine: "always", prev: "class", next: "*" },
        { blankLine: "always", prev: "*", next: "return" },
      ],
    },
  },
];
