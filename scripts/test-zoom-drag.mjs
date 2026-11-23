const endpoint = 'http://localhost:9223/json'
const pageUrl = 'http://localhost:4178/03-项目实战/架构图'

const targets = await (await fetch(endpoint)).json()
const page = targets.find((target) => target.type === 'page')
if (!page) throw new Error('no page target')

const ws = new WebSocket(page.webSocketDebuggerUrl)
let nextId = 0
const pending = new Map()

ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  if (!message.id || !pending.has(message.id)) return
  const { resolve, reject } = pending.get(message.id)
  pending.delete(message.id)
  if (message.error) reject(new Error(JSON.stringify(message.error)))
  else resolve(message.result)
}

await new Promise((resolve, reject) => {
  ws.onopen = resolve
  ws.onerror = reject
})

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  return result.result.value
}

const viewportState = `(() => {
  const el = document.querySelector('.zoomable-figure__viewport')
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return {
    left: el.scrollLeft,
    top: el.scrollTop,
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  }
})()`

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: 1400,
  height: 1200,
  deviceScaleFactor: 1,
  mobile: false,
})
await send('Page.navigate', { url: pageUrl })
await new Promise((resolve) => setTimeout(resolve, 4000))

const before = await evaluate(viewportState)
if (!before) throw new Error('zoomable viewport not found')
console.log('before', before)

await evaluate(
  `document.querySelector('.zoomable-figure [aria-label="放大"]').click()`,
)
await new Promise((resolve) => setTimeout(resolve, 400))

const zoomed = await evaluate(viewportState)
console.log('after zoom', zoomed)

const x = Math.round(zoomed.x + zoomed.width / 2)
const y = Math.round(zoomed.y + zoomed.height / 2)

await send('Input.dispatchMouseEvent', {
  type: 'mousePressed',
  x,
  y,
  button: 'left',
  buttons: 1,
  clickCount: 1,
})
await send('Input.dispatchMouseEvent', {
  type: 'mouseMoved',
  x: x - 200,
  y: y - 120,
  button: 'left',
  buttons: 1,
})
await send('Input.dispatchMouseEvent', {
  type: 'mouseReleased',
  x: x - 200,
  y: y - 120,
  button: 'left',
  buttons: 0,
  clickCount: 1,
})
await new Promise((resolve) => setTimeout(resolve, 300))

const after = await evaluate(viewportState)
console.log('after drag', after)

const moved = after.left !== zoomed.left || after.top !== zoomed.top
console.log(moved ? 'MOUSE DRAG OK' : 'MOUSE DRAG FAILED')

await evaluate(
  `(() => { const el = document.querySelector('.zoomable-figure__viewport'); el.scrollLeft = 0; el.scrollTop = 0; })()`,
)
await send('Emulation.setTouchEmulationEnabled', {
  enabled: true,
  maxTouchPoints: 1,
})
const touchX = Math.round(zoomed.x + zoomed.width / 2)
const touchY = Math.round(zoomed.y + Math.min(zoomed.height, 400) / 2)
await send('Input.dispatchTouchEvent', {
  type: 'touchStart',
  touchPoints: [{ x: touchX, y: touchY }],
})
await send('Input.dispatchTouchEvent', {
  type: 'touchMove',
  touchPoints: [{ x: touchX - 160, y: touchY - 80 }],
})
await send('Input.dispatchTouchEvent', {
  type: 'touchEnd',
  touchPoints: [],
})
await new Promise((resolve) => setTimeout(resolve, 300))
const afterTouch = await evaluate(viewportState)
console.log('after touch', afterTouch)
const touchMoved = afterTouch.left > 0 || afterTouch.top > 0
console.log(touchMoved ? 'TOUCH DRAG OK' : 'TOUCH DRAG FAILED')

ws.close()
process.exit(moved && touchMoved ? 0 : 1)
