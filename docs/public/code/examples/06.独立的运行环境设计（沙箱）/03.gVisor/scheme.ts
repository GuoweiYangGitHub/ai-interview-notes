/**
 * @file 方案卡：gVisor
 */
export const SCHEME = {
  name: 'gVisor',
  boundary: '在容器与宿主内核之间增加用户态内核层。',
  notes: '兼容性和性能需要按工作负载验证。',
  whyNotHere:
    'gVisor 的 runsc 只跑在 Linux。当前示例在 Windows 宿主上，没有 Linux 内核、也没有已安装的 runsc runtime。',
  howToImplement: [
    '在 Linux 上安装 gVisor runsc，并注册为 Docker / containerd runtime。',
    'Host 仍写死容器参数，只把 runtime 换成 runsc：`docker create --runtime=runsc ...`。',
    '系统调用由用户态内核拦截后再转给宿主，容器突破后仍多一层内核隔离。',
    '落地前用真实任务测 syscall 兼容性（部分内核能力不可用）和延迟。',
  ],
} as const
