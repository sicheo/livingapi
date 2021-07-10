module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@App/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: [
        '**/**/__test__/*.test.ts'
    ]

};