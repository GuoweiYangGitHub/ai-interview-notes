const targets = await (await fetch('http://localhost:9224/json')).json()
const page = targets.find((target) => target.type === 'page')
if (!page) throw new Error('no page target')
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  if (!message.id || !pending.has(message.id)) return
  const { resolve, reject } = pending.get(message.id)
  pending.delete(message.id)
  message.error ? reject(message.error) : resolve(message.result)
}
await new Promise((resolve, reject) => {
  ws.onopen = resolve
  ws.onerror = reject
})
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++id
    pending.set(requestId, { resolve, reject })
    ws.send(JSON.stringify({ id: requestId, method, params }))
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
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 3,
  mobile: true,
})
await send('Page.navigate', {
  url: 'http://localhost:4179/03-项目实战/01-THINGJS文档RAG/12-项目问答',
})
await new Promise((resolve) => setTimeout(resolve, 4000))
const result = await evaluate(`(() => {
  const c = document.querySelector('.VPDoc .content-container') || document.querySelector('.VPDoc .content') || document.querySelector('.vp-doc')
  const offenders = [...document.querySelectorAll('body *')]
    .map((el) => {
      const r = el.getBoundingClientRect()
      return {
        tag: el.tagName,
        cls: String(el.className || '').slice(0, 60),
        width: Math.round(r.width),
        right: Math.round(r.right),
        scrollWidth: el.scrollWidth,
        text: (el.textContent || '').trim().slice(0, 40),
      }
    })
    .filter((item) => item.right > window.innerWidth + 1 || item.scrollWidth > window.innerWidth + 1)
    .sort((a, b) => b.right - a.right)
    .slice(0, 12)
  return {
    innerWidth: window.innerWidth,
    docScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    contentWidth: c ? Math.round(c.getBoundingClientRect().width) : null,
    offenders,
  }
})()`)
console.log(JSON.stringify(result, null, 2))
ws.close()
