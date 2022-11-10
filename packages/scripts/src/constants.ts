export const cssPrefix = 'css/'
export const jsPrefix = 'js/'
export const transformAssetUrls: {
  tags: Record<string, string[]>
} = {
  tags: {
    video: ['src', 'poster'],
    source: ['src'],
    img: ['src'],
    image: ['xlink:href', 'href'],
    use: ['xlink:href', 'href'],
  },
}
