/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

/* eslint-disable */

import "tsconfig-paths/register";

import jestModuleNameMapper from "jest-module-name-mapper";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      diagnostics: {
        exclude: ["**"],
      },
    },
  },
  rootDir: ".",
  globalSetup: "<rootDir>/scripts/setup.ts",
  globalTeardown: "<rootDir>/scripts/teardown.ts",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testRegex: "/__tests__/.*\\.test\\.ts",
  moduleNameMapper: jestModuleNameMapper(),
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.(ts|tsx|js)$": [
      "ts-jest",
      {
        diagnostics: false,
      },
    ],
  },
};
