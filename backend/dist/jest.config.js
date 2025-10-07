module.exports = {
    "testEnvironment": "node",
    "collectCoverage": true,
    "collectCoverageFrom": [
        "**/*.ts"
    ],
    "moduleNameMapper": {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    "coverageDirectory": "coverage",
    "verbose": true,
    "preset": "ts-jest"
};
export {};
//# sourceMappingURL=jest.config.js.map