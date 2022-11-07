import minimist from 'minimist'
import { compile } from './compile'

import type { Command } from './compile'

const command = process.argv[2] as Command
const { mode } = minimist(process.argv)

compile({ command, mode })
