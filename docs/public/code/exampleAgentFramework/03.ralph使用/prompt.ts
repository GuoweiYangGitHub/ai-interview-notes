/**
 * @file 默认任务
 * @description 对照 ralph_demo.py 的计算器任务，改成 Node 可直接跑。
 */
export const DEFAULT_PROMPT = `
# 任务：构建一个计算器模块

创建 calc.js（CommonJS，module.exports），要求：
1. 导出 add、subtract、multiply、divide 四个函数
2. 除数为零时必须抛出 Error，信息里包含「zero」
3. 两个参数都是 number，返回 number

同时创建 calc.test.js，使用 node:test 和 node:assert/strict。
覆盖正常情况和边界（除以零、负数、浮点数）。

测试全部通过后，才能 LOOP_COMPLETE。
`.trim()
