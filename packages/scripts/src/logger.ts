export const { log } = console

export const { error } = console

export const errorExit = (...args: any[]) => {
  error(...args)
  process.exit(1)
}
