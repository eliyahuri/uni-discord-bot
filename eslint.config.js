// Simple ESLint flat config for TypeScript
module.exports = [
    {
        ignores: ["node_modules", "dist"],
    },
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: require("@typescript-eslint/parser"),
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
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" },
            ],
            indent: ["error", 4],
        },
    },
];
