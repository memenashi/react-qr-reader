import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import copy from "rollup-plugin-copy";
import { terser } from 'rollup-plugin-terser';

import packageJson from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: packageJson.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ browser: true }),
      commonjs(),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            declarationDir: "dist",
          },
          include: ["src/**/*.ts", "src/**/*.tsx"],
          exclude: ["**/*.test.ts", "**/*.test.tsx"],
        }
      }),
      terser(),
      copy({
        targets: [{ src: "src/type/type.d.ts", dest: "dist/type" }],
      }),
    ],
  },
];
