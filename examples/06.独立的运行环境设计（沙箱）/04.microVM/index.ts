/**
 * @file 方案：microVM
 * @description 本机无法落地 Firecracker。运行只打印方案、边界和注意点。
 * 运行：`npm run 06:04`
 */
import { SCHEME } from './scheme'

function main() {
  console.log(`=== 方案：${SCHEME.name} ===`)
  console.log(`能提供的边界: ${SCHEME.boundary}`)
  console.log(`使用时要注意: ${SCHEME.notes}`)
  console.log(`\n本示例为何不执行:\n${SCHEME.whyNotHere}`)
  console.log('\n若要落地:')
  for (const step of SCHEME.howToImplement) {
    console.log(`- ${step}`)
  }
  console.log('\n=== skipped ===')
  console.log('未配置 KVM / Firecracker，不启动虚拟机，不回退宿主执行。')
}

main()
