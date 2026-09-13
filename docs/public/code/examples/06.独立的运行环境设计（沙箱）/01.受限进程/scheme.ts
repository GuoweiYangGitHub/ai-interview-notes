/**
 * @file 方案卡：受限进程 / OS 账户
 */
export const SCHEME = {
  name: '受限进程 / OS 账户',
  boundary: '进程权限、账户权限和部分资源限制。',
  notes: '仍与宿主共享较多系统环境，边界取决于操作系统配置。',
} as const
