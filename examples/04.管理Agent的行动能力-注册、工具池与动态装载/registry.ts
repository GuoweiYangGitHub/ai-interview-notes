/**
 * @file Action 注册表
 * @description 对齐课07 ActionManager：register / list / load / call。
 */

/** 一条可登记的 Action：声明 + 执行函数。 */
export type ActionSpec = {
  name: string
  description: string
  args: Record<string, string>
  execute: (args: Record<string, unknown>) => unknown
}

/** 保存全部 Action，但模型只能看见 `load` 装上的那一批。 */
export class ActionRegistry {
  private readonly all = new Map<string, ActionSpec>()
  private loaded = new Set<string>()

  /**
   * 登记一条 Action。
   *
   * @param spec 名称、说明、参数与执行函数
   * @returns {@link getInfo} 的公开信息
   * @throws {Error} 同名已注册
   */
  register(spec: ActionSpec) {
    if (this.all.has(spec.name)) {
      throw new Error(`Action 已注册: ${spec.name}`)
    }
    this.all.set(spec.name, spec)
    return this.getInfo(spec.name)
  }

  /**
   * 读取已注册 Action 的公开信息（不含 execute）。
   *
   * @param name Action 名
   * @throws {Error} 未注册
   */
  getInfo(name: string) {
    const action = this.all.get(name)
    if (!action) {
      throw new Error(`未注册 Action: ${name}`)
    }
    return { name: action.name, description: action.description, args: action.args }
  }

  /**
   * 装载当前场景可见的工具子集。
   *
   * @param names 要暴露给模型的名称
   * @returns 当前已装载列表
   */
  load(names: string[]) {
    this.loaded = new Set(names.map((name) => this.getInfo(name).name))
    return this.listLoaded()
  }

  /** @returns 当前装载批次的公开信息 */
  listLoaded() {
    return [...this.loaded].map((name) => this.getInfo(name))
  }

  /** @returns 仅含已装载 Action 的 OpenAI tools */
  toOpenAITools() {
    return this.listLoaded().map((info) => ({
      type: 'function' as const,
      function: {
        name: info.name,
        description: info.description,
        parameters: {
          type: 'object',
          properties: Object.fromEntries(
            Object.entries(info.args).map(([key, description]) => [
              key,
              { type: 'string', description },
            ]),
          ),
          required: Object.keys(info.args),
        },
      },
    }))
  }

  /**
   * 执行已装载的 Action。
   *
   * @param name Action 名
   * @param args 模型参数
   * @throws {Error} 未装载或未注册
   */
  call(name: string, args: Record<string, unknown>) {
    if (!this.loaded.has(name)) {
      throw new Error(`未装载 Action: ${name}`)
    }
    const action = this.all.get(name)
    if (!action) {
      throw new Error(`未注册 Action: ${name}`)
    }
    return action.execute(args)
  }
}
