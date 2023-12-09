import {Config} from '@jest/types'

const baseTestDir = '<rootDir>/test/infrastructure';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        `${baseTestDir}/**/*test.ts`
    ]
}

// puting all the test is the test directory
// good practice for the test dir to mimic the source dir

export default config;

