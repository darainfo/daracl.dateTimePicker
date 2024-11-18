const esbuild = require("esbuild");

const { sassPlugin } = require("esbuild-sass-plugin");

const packageJson = require("./package.json");

const baseConfig = {
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  bundle: true,
  sourcemap: true,
  define: {
    APP_VERSION: `"${packageJson.version}"`, // 'production' 값으로 설정
  },
  plugins: [sassPlugin()],
};

Promise.all([
  // 한번은 cjs
  esbuild.build({
    ...baseConfig,
    format: "cjs",
    outExtension: {
      ".js": ".cjs",
    },
  }),

  // 한번은 esm
  esbuild.build({
    ...baseConfig,
    format: "esm",
  }),
]).catch(() => {
  console.log("Build failed");
  process.exit(1);
});
