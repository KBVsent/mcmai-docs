export const siteOrigin = 'https://mcmai.moev.cc'
export const docsIndexFile = 'llms.txt'

export function publicPath(relativePath: string) {
  const normalizedPath = relativePath.replace(/\\/g, '/')

  if (normalizedPath === 'index.md') return '/'
  if (normalizedPath.endsWith('/index.md')) {
    return `/${normalizedPath.slice(0, -'index.md'.length)}`
  }

  return `/${normalizedPath.replace(/\.md$/, '.html')}`
}
