import { Configuration } from 'webpack';
import { ConfigurationGetter } from './helper';
export interface ProjectConfig {
    publicPath?: string;
    configureWebpack?: Configuration | ConfigurationGetter;
    webpackConfigTransform?: (webpackConfig: Configuration) => Configuration | void;
    enableStylelint?: boolean;
    enableESlint?: boolean;
    transformAssetUrls?: {
        tags: Record<string, string[]>;
    };
}
export declare function defineProjectConfig(config: ProjectConfig): ProjectConfig;
