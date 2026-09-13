const { spawnSync } = require('node:child_process')
const { join } = require('node:path')

const here = __dirname
const python = join(here, '.venv', 'Scripts', 'python.exe')
const script = process.argv[2]
if (!script) {
  console.error('usage: node run.cjs <script.py> [args...]')
  process.exit(1)
}
const result = spawnSync(
  python,
  [join(here, script), ...process.argv.slice(3)],
  {
    stdio: 'inherit',
    cwd: here,
  },
)
process.exit(result.status === null ? 1 : result.status)
