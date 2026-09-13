/**
 * @file 方案：托管沙盒
 * @description 本机没有供应商。打印方案卡和 Host 合同，不执行代码。
 * 运行：`npm run 06:05`
 */
import { skipManagedSandbox } from './contract'
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

  const job = {
    code: 'print(4 * 4)',
    timeoutMs: 8_000,
    memoryMb: 128,
  }
  console.log('\n=== host contract ===')
  console.log(JSON.stringify(job, null, 2))
  console.log('验收字段: exitCode / stdout / stderr / recycled')

  const skipped = skipManagedSandbox(job)
  console.log('\n=== skipped ===')
  console.log(skipped.reason)
}

main()
