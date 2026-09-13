/**
 * @file 托管沙盒的 Host 合同
 * @description 说明 Host 该提交什么、验收什么。没有供应商实现，不能当真执行。
 */

/** Host 交给供应商的任务。代码仍是候选文本，不是已执行证据。 */
export type ManagedSandboxJob = {
  code: string
  timeoutMs: number
  memoryMb: number
}

/** 只有供应商返回的这些字段才算执行证据。 */
export type ManagedSandboxEvidence = {
  exitCode: number
  stdout: string
  stderr: string
  recycled: boolean
}

/**
 * 托管沙盒执行器接口。本示例没有实现，调用即跳过。
 */
export type ManagedSandboxRunner = {
  submit(job: ManagedSandboxJob): Promise<ManagedSandboxEvidence>
}

/**
 * 未配置供应商时的占位。禁止在本机执行 `job.code`。
 *
 * @param _job 候选任务，此处故意不使用
 * @returns 跳过原因
 */
export function skipManagedSandbox(_job: ManagedSandboxJob) {
  return {
    skipped: true as const,
    reason: '未配置托管沙盒供应商，不在本机执行候选代码。',
  }
}
