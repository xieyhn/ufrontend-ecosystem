import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
export interface ProjectConfig {
    publicPath?: string;
    configureWebpack?: WebpackConfiguration;
    webpackConfigTransform?: (webpackConfig: WebpackConfiguration) => WebpackConfiguration | void;
    configureWebpackDevServer?: WebpackDevServerConfiguration;
    webpackDevServerConfigTransform?: (webpackDevServerConfig: WebpackDevServerConfiguration) => WebpackDevServerConfiguration | void;
    enableStylelint?: boolean;
    enableESlint?: boolean;
    transformAssetUrls?: {
        tags: Record<string, string[]>;
    };
}
export declare function defineProjectConfig(config: ProjectConfig): ProjectConfig;
