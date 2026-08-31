import { access, readFile } from 'node:fs/promises'

const SITE = 'https://worthgo.pages.dev'
const sitemap = await readFile('sitemap.xml', 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
let failed = false
const titles = new Map()

function fail(message) {
  failed = true
  console.error(`FAIL ${message}`)
}

function count(source, regex) {
  return [...source.matchAll(regex)].length
}

function metaContent(html, name) {
  const doubleQuoted = html.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i'))?.[1]
  if (doubleQuoted !== undefined) return doubleQuoted.trim()
  return html.match(new RegExp(`<meta\\s+name='${name}'\\s+content='([^']*)'`, 'i'))?.[1]?.trim() || ''
}

async function localFileFor(pathname) {
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '')
  const candidates = pathname === '/'
    ? ['index.html']
    : pathname.endsWith('/')
      ? [`${clean}/index.html`]
      : [`${clean}.html`, `${clean}/index.html`]
  for (const candidate of candidates) {
    try {
      await access(candidate)
      return candidate
    } catch (_) {}
  }
  return candidates[0]
}

if (!urls.length) fail('sitemap.xml has no URLs')
if (new Set(urls).size !== urls.length) fail('sitemap.xml contains duplicate URLs')
if (urls.some(url => /[?&]/.test(url))) fail('sitemap.xml contains parameter URLs')

for (const url of urls) {
  if (!url.startsWith(`${SITE}/`)) {
    fail(`sitemap URL is outside production origin: ${url}`)
    continue
  }

  const pathname = new URL(url).pathname
  const localPath = await localFileFor(pathname)
  let html
  try {
    html = await readFile(localPath, 'utf8')
  } catch (_) {
    fail(`missing sitemap page ${localPath}`)
    continue
  }

  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || ''
  const description = metaContent(html, 'description')
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1] || ''
  const robots = metaContent(html, 'robots')

  if (title.length < 20 || title.length > 75) fail(`${localPath}: title length should be 20-75 characters`)
  if (description.length < 60 || description.length > 200) fail(`${localPath}: description length should be 60-200 characters`)
  if (canonical !== url) fail(`${localPath}: canonical mismatch; expected ${url}`)
  if (!/index/.test(robots) || !/follow/.test(robots)) fail(`${localPath}: page must be index,follow`)
  if (!/max-image-preview:large/.test(robots)) fail(`${localPath}: allow large image previews`)
  if (count(html, /<h1\b/gi) !== 1) fail(`${localPath}: expected exactly one H1`)
  if (!html.includes('type="application/ld+json"')) fail(`${localPath}: structured data missing`)

  for (const marker of [
    'property="og:title"',
    'property="og:description"',
    'property="og:url"',
    'property="og:image"',
    'name="twitter:card"',
    'name="twitter:image"',
  ]) {
    if (!html.includes(marker)) fail(`${localPath}: missing ${marker}`)
  }

  if (count(html, /<link\s+rel=["']canonical["']/gi) !== 1) fail(`${localPath}: duplicate or missing canonical`)
  if (count(html, /<meta\s+property=["']og:image["']/gi) !== 1) fail(`${localPath}: duplicate or missing og:image`)
  if (titles.has(title)) fail(`${localPath}: duplicate title also used by ${titles.get(title)}`)
  else titles.set(title, localPath)

  console.log(`PASS ${localPath}`)
}

const robotsTxt = await readFile('robots.txt', 'utf8')
if (!/User-agent:\s*\*/i.test(robotsTxt) || !/Allow:\s*\//i.test(robotsTxt)) fail('robots.txt must allow public crawling')
if (!robotsTxt.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail('robots.txt must reference the exact production sitemap')

if (failed) process.exit(1)
console.log(`WorthGo SEO audit passed for ${urls.length} indexable pages.`)
