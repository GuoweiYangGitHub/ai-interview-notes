/**
 * @file 方案卡：microVM
 */
export const SCHEME = {
  name: 'microVM',
  boundary: '使用轻量虚拟机提供更强的内核隔离。',
  notes: '启动、镜像和运维成本更高。',
  whyNotHere:
    'Firecracker / Cloud Hypervisor 需要 Linux KVM（或等价虚拟化）。Windows 上既没有现成的 jailer 流水线，也不适合在教学示例里拉起嵌套虚拟机。',
  howToImplement: [
    'Host 创建一次性 microVM：只挂任务镜像、virtio 块设备和受限网卡。',
    '通过 vsock 或串口下发固定入口（例如只跑 /input/task.py），模型不能改内核或设备列表。',
    '任务结束销毁 VM；内核漏洞也落在客机里，不直接打到宿主内核。',
    '要单独做镜像构建、冷启动预算、设备白名单和宿主机上的虚拟化配额。',
  ],
} as const
