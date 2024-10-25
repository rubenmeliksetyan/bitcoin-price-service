import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    rootDir: '../',
    testMatch: [
        '**/tests/**/*.[tj]s?(x)',
        '**/?(*.)+(spec|test).[tj]s?(x)'
    ],
    clearMocks: true,
};

export default config;