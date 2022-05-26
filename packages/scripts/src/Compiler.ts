import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { createWebpackConfig } from './webpack.config'
import { createDevServerConfig } from './webpack.devServer.config'

export type Command  = 'dev' | 'release'

class Compiler {
  run(command: Command, debug: boolean) {
    const compiler = webpack(createWebpackConfig(command, { debug }))

    if (command === 'dev') {
      const server = new WebpackDevServer(
        createDevServerConfig(),
        compiler
      )
      server.start()
      return
    }

    compiler.run((err, stats) => {
      if (err) {
        console.error(err)
        return
      }
      if (stats) {
        console.log(stats.toString({ colors: true }))
      }
    })
  }
}

export default Compiler
