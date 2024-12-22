const { FlatCompat } = require("@eslint/eslintrc");
const compat = new FlatCompat();

module.exports = [
    {
        ignores: ["node_modules", "dist"],
    },
    ...compat.extends(
        "airbnb-base",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended"
    ),
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
        },
        rules: {
            indent: ["error", 4],
            // Additional rules can be added here
        },
    },
];
