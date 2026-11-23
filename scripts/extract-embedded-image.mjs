import { readFile, writeFile } from 'node:fs/promises'
import { extname } from 'node:path'

const [input, output] = process.argv.slice(2)
if (!input || !output) {
  console.error('usage: node scripts/extract-embedded-image.mjs <svg> <output>')
  process.exit(1)
}

const source = await readFile(input, 'utf8')
const match = source.match(/data:image\/(png|jpeg|webp);base64,([^"']+)/)
if (!match) {
  console.error('no embedded raster image found')
  process.exit(1)
}

const buffer = Buffer.from(match[2], 'base64')
await writeFile(output, buffer)
console.log(
  `extracted ${match[1]} ${buffer.length} bytes -> ${output}`,
  extname(output),
)
