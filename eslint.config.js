import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginEeactCompiler from "eslint-plugin-react-compiler";

console.log(eslintPluginEeactCompiler);

export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "react-compiler": eslintPluginEeactCompiler },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
];
