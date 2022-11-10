export function replacePublicPath(value: string, publicPath: string, nestedPath: string = '') {
  const prefix = publicPath.startsWith('/')
    ? '/'
    : nestedPath.split('/').filter(Boolean).map(() => '../').join('')

  return value.replace(/^\//, `${prefix}${publicPath.replace(/^\//, '')}`)
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
