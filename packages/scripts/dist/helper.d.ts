import type { Command } from './Compiler';
import type { Configuration } from 'webpack';
import type { ProjectConfig } from './defineProjectConfig';
/**
 * Webpck Configuration getter options
 */
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
