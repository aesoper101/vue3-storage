import fs from "fs";
import path from "path";
import vue from "rollup-plugin-vue";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import auto from "@rollup/plugin-auto-install";
import minimist from "minimist";
import pkg from "../package.json";

const deps = Object.keys(pkg.dependencies);

const projectRoot = path.resolve(__dirname, "..");
const browserPath = path.resolve(projectRoot, ".browserslistrc");

const esbrowserslist = fs
  .readFileSync(browserPath)
  .toString()
  .split("\n")
  .filter(entry => entry && entry.substring(0, 2) !== "ie");

const argv = minimist(process.argv.slice(2));

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
// const external = [
//   // list external dependencies, exactly the way it is written in the import statement.
//   // eg. 'jquery'
//   "vue"
// ];

const external = function(id) {
  return (
    /^vue/.test(id) ||
    deps.some(k => new RegExp("^" + k).test(id)) ||
    "storage" === id
  );
};

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: "vue"
};

const buildFormats = [];

if (!argv.format || argv.format === "es") {
  const esConfig = {
    input: path.resolve(projectRoot, "packages/index.ts"),
    external,
    output: {
      file: pkg.module,
      format: "esm",
      exports: "named"
    },
    plugins: [
      auto(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.ES_BUILD": JSON.stringify("false")
      }),
      alias({
        resolve: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        entries: {
          "@": path.resolve(projectRoot, "packages")
        }
      }),
      nodeResolve(),
      vue({
        target: "browser",
        css: false,
        exposeFilename: false
      }),
      typescript({
        tsconfigOverride: {
          include: ["src", "typings/vue-shim.d.ts"],
          exclude: ["node_modules"]
        },
        abortOnError: false
      }),
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: esbrowserslist
            }
          ],
          ["@babel/preset-typescript"]
        ],
        // babelHelpers: "bundled",

        babelHelpers: "runtime",
        exclude: ["node_modules/**"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        comments: false,
        sourceMap: false
      }),
      commonjs()
    ]
  };

  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === "cjs") {
  const umdConfig = {
    input: path.resolve(__dirname, "../packages/index.ts"),
    external,
    output: {
      compact: true,
      file: pkg.main,
      format: "cjs",
      name: "Vue3Storage",
      exports: "named",
      globals
    },
    plugins: [
      auto(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.ES_BUILD": JSON.stringify("false")
      }),
      alias({
        resolve: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        entries: {
          "@": path.resolve(projectRoot, "packages")
        }
      }),
      nodeResolve(),
      vue({
        target: "browser",
        css: false,
        exposeFilename: false,
        optimizeSSR: true
      }),
      typescript({
        tsconfigOverride: {
          include: ["src", "typings/vue-shim.d.ts"],
          exclude: ["node_modules"]
        },
        abortOnError: false
      }),
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: esbrowserslist
            }
          ],
          ["@babel/preset-typescript"]
        ],
        babelHelpers: "runtime",
        exclude: ["node_modules/**"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        comments: false,
        sourceMap: false
      })
    ]
  };
  buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === "iife") {
  const unpkgConfig = {
    input: path.resolve(__dirname, "../packages/index.ts"),
    external,
    output: {
      compact: true,
      file: pkg.unpkg,
      format: "iife",
      name: "Vue3Storage",
      exports: "named",
      globals
    },
    plugins: [
      auto(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.ES_BUILD": JSON.stringify("false")
      }),
      alias({
        resolve: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        entries: {
          "@": path.resolve(projectRoot, "packages")
        }
      }),
      nodeResolve(),
      vue({
        css: false,
        exposeFilename: false
      }),
      typescript({
        tsconfigOverride: {
          include: ["src", "typings/vue-shim.d.ts"],
          exclude: ["node_modules"]
        },
        abortOnError: false
      }),
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: esbrowserslist
            }
          ],
          ["@babel/preset-typescript"]
        ],
        babelHelpers: "runtime",
        exclude: ["node_modules/**"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        comments: false,
        sourceMap: false
      }),
      commonjs(),
      terser({
        output: {
          ecma: 5
        }
      })
    ]
  };

  buildFormats.push(unpkgConfig);
}

export default buildFormats;
