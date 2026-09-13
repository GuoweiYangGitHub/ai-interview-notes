/**
 * @file 方案卡：托管沙盒
 */
export const SCHEME = {
  name: '托管沙盒',
  boundary: '由云服务管理隔离、回收和配额。',
  notes: '需要评估成本、数据驻留和供应商约束。',
  whyNotHere:
    '托管沙盒要接第三方 API（例如 E2B、云厂商 Code Interpreter）。本仓库不绑定供应商，也不在示例里写入付费密钥。',
  howToImplement: [
    'Host 只提交代码文本、超时和资源配额，不在本机 spawn。',
    '供应商负责隔离、回收和并发上限；Host 只验收 stdout/stderr/退出码。',
    '合同里写清数据驻留、日志是否出境、镜像是否可自定义。',
    '供应商不可用时跳过，禁止回退到本机进程执行同一段代码。',
  ],
} as const
