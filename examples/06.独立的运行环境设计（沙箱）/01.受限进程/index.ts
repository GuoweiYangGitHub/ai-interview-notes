/**
 * @file 方案：受限进程 / OS 账户
 * @description 能落地的最小边界：新进程、超时、裁剪环境。文件和网络仍与宿主共享。
 * 运行：`npm run 06:01`
 */
import { SCHEME } from './scheme'
import { runRestrictedProcess } from './restrictedProcess'

async function main() {
  console.log(`=== 方案：${SCHEME.name} ===`)
  console.log(`能提供的边界: ${SCHEME.boundary}`)
  console.log(`使用时要注意: ${SCHEME.notes}`)
  console.log('本示例只做进程级约束，没有换 OS 账户，也没有容器。')

  process.env.DEMO_SECRET = 'should-not-reach-child'
  const result = await runRestrictedProcess()

  console.log('\n=== evidence ===')
  console.log(
    JSON.stringify(
      {
        calculation: result.calculation,
        timedOut: result.timedOut,
        envStripped: result.envStripped,
        secretVisible: result.secretVisible,
        outsideWrite: result.outsideWrite,
        hostFileChanged: result.hostFileChanged,
        stdout: result.stdout,
      },
      null,
      2,
    ),
  )
  console.log('\n结论：计算和环境裁剪生效；工作目录外的宿主文件仍被改写。')
  console.log('换独立 OS 账户、Job Object / ulimit 才能再收一层，但仍共享内核。')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  throw error
})
