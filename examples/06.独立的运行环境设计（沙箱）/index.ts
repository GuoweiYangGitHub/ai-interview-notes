/**
 * @file 06. 独立的运行环境设计（沙箱）
 * @description 课10 五种执行环境方案。登记表和名单过滤管入口，不在这里。
 * 运行：`npm run 06`
 */
const SCHEMES = [
  {
    id: '01',
    dir: '01.受限进程/',
    run: 'npm run 06:01',
    name: '受限进程 / OS 账户',
    status: '可运行',
    boundary: '进程权限、账户权限和部分资源限制。',
    notes: '仍与宿主共享较多系统环境，边界取决于操作系统配置。',
  },
  {
    id: '02',
    dir: '02.Docker/',
    run: 'npm run 06:02',
    name: 'Docker',
    status: '可运行（缺 daemon/镜像则跳过）',
    boundary: '文件挂载、网络、运行账户、capabilities 和资源限制。',
    notes: '需要正确配置；默认容器参数不等于完整执行边界。',
  },
  {
    id: '03',
    dir: '03.gVisor/',
    run: 'npm run 06:03',
    name: 'gVisor',
    status: '本机无法落地，只打印方案卡',
    boundary: '在容器与宿主内核之间增加用户态内核层。',
    notes: '兼容性和性能需要按工作负载验证。',
  },
  {
    id: '04',
    dir: '04.microVM/',
    run: 'npm run 06:04',
    name: 'microVM',
    status: '本机无法落地，只打印方案卡',
    boundary: '使用轻量虚拟机提供更强的内核隔离。',
    notes: '启动、镜像和运维成本更高。',
  },
  {
    id: '05',
    dir: '05.托管沙盒/',
    run: 'npm run 06:05',
    name: '托管沙盒',
    status: '本机无法落地，只打印方案卡与 Host 合同',
    boundary: '由云服务管理隔离、回收和配额。',
    notes: '需要评估成本、数据驻留和供应商约束。',
  },
] as const

console.log('06 按课10 五种执行环境方案分目录。入口过滤不在这里。\n')
for (const item of SCHEMES) {
  console.log(`${item.id}  ${item.name}  [${item.status}]`)
  console.log(`    dir: ${item.dir}`)
  console.log(`    run: ${item.run}`)
  console.log(`    边界: ${item.boundary}`)
  console.log(`    注意: ${item.notes}\n`)
}
