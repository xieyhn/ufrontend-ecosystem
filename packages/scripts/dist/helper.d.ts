import type { Configuration } from 'webpack';
import type { Command } from './Compiler';
import type { ProjectConfig } from './defineProjectConfig';
export interface Options {
    command: Command;
    debug: boolean;
    projectConfig: ProjectConfig;
}
export interface ConfigurationGetter {
    (options: Options): Configuration;
}
export declare function resolveOptions(options: Partial<Options>): Options;
export declare function checkOptions(options: Options): void;
