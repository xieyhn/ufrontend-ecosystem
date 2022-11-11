export function replacePublicPath(value: string, publicPath: string) {
  return value.replace(/^\//, publicPath)
}

export const hasQuery = (url: string, key: string) => {
  const search = url.split('?').pop()
  if (!search) return false
  return search.split('&').some((item) => new RegExp(`^${key}=?`).test(item))
}

export const withQuery = (url: string, key: string) => `${url}${url.includes('?') ? '&' : '?'}${key}`

export const isExternalUrl = (url: string) => /^https?/.test(url)

export const isPublicPath = (url: string) => hasQuery(url, 'public')

export const isCSSUrlRequest = (url: string) => hasQuery(url, 'url')
