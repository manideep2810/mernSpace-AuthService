/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageProvider: 'v8',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/tests/**',
        '!**/node_modules/**',
    ],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}
