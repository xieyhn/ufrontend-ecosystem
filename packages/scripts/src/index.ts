import dotenv from 'dotenv'
import path from 'path'
import minimist from 'minimist'
import Compiler, { Command } from './Compiler'

const command = process.argv[2] as Command
const { mode = 'development', debug = command === 'dev' } = minimist(process.argv)

// 加载环境变量 .env*
// dotenv 在已存在变量名时，默认不会选择覆盖，因此这里的变量优先级为第一位最高
;[`.env.${mode}.local`, `.env.${mode}`,'.env.local', '.env'].forEach(i => {
  dotenv.config({ path: path.resolve(process.cwd(), i) })
})

// set NODE_ENV
if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = command === 'dev' ? 'development': 'production'
}

new Compiler({ command, debug }).run()
