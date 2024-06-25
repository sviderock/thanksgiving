import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

const ReactCompilerConfig = {
  /* ... */
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
});
