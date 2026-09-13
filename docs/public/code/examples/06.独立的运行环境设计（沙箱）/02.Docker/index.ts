/**
 * @file 方案：Docker
 * @description 边界在容器。Host 写死 create 参数；缺 Docker 则跳过，不回退本机。
 * 运行：`npm run 06:02`
 */
import { DEFAULT_IMAGE, runDockerExecutionEnvironment } from './dockerSandbox'
import { SCHEME } from './scheme'

async function main() {
  console.log(`=== 方案：${SCHEME.name} ===`)
  console.log(`能提供的边界: ${SCHEME.boundary}`)
  console.log(`使用时要注意: ${SCHEME.notes}`)
  console.log(
    `固定镜像 ${DEFAULT_IMAGE}。create 参数由 Host 写死，模型不能拼 docker 命令。`,
  )

  const result = await runDockerExecutionEnvironment()
  if (result.skipped) {
    console.log('\n=== skipped ===')
    console.log(result.reason)
    return
  }

  console.log('\n=== container output ===')
  console.log(result.stdout)
  console.log('=== evidence ===')
  console.log(
    JSON.stringify(
      {
        inspect: result.inspect,
        hostFileUnchanged: result.hostFileUnchanged,
        containerRemoved: result.containerRemoved,
        containerId: result.containerId,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  throw error
})
