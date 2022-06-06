export const log = console.log

export const error = console.error

export const errorExit = (...args: any[]) => {
  error(...args)
  process.exit(1)
}
