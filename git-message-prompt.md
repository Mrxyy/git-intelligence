## Brief overview
本规则文件专门针对项目的 git commit message 编写规范，基于项目现有的 Conventional Commits 格式和 commitlint 配置，确保提交信息的一致性和规范性。

## Commit message 格式规范
- 严格遵循 Conventional Commits 格式：`<type>[optional scope]: <gitmoji> <description>`
- Type 必须为小写，从以下类型中选择：`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
- Scope 为可选项，必须为小写，用于描述受影响的模块或功能
- Description 必须使用中文，简明扼要地说明更改内容
- 引用代码或专有名词时使用反引号（`）包围
- Subject 不能以句号结尾，不能为空

## Gitmoji 使用指南
- 每个 commit message 必须包含相关的 gitmoji 表情
- 常用 gitmoji 对应关系：
  - 🎉 `:tada:` - 初始提交
  - ✨ `:sparkles:` - 新功能
  - 🐛 `:bug:` - 修复 bug
  - 📝 `:memo:` - 文档更新
  - 🎨 `:art:` - 改进代码结构/格式
  - ⚡️ `:zap:` - 性能优化
  - 🔧 `:wrench:` - 配置文件修改
  - 🚀 `:rocket:` - 部署相关

## Type 类型使用说明
- `feat`: 新功能开发
- `fix`: bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建系统或依赖变更
- `ci`: CI/CD 配置变更
- `chore`: 其他维护性工作
- `revert`: 回滚提交

## Body 编写规范
- 如需补充详细信息，在空行后添加 body 部分
- 使用星号（`*`）作为项目符号增强可读性
- 每行最大长度不超过 100 字符
- 清晰描述更改的动机、背景或技术细节
- 必须使用中文描述

## 示例格式
```
feat(auth): ✨ 添加用户登录功能

* 实现基于 JWT 的用户认证机制
* 添加登录表单验证逻辑
* 集成第三方登录接口
```

```
fix(cart): 🐛 修复购物车商品数量更新问题

* 解决商品数量为 0 时的显示异常
* 修复数量更新时的状态同步问题
```

## 注意事项
- 提交信息必须严格遵守格式，否则会导致 commitlint 检查失败
- Description 部分必须使用中文，保持简洁明了
- Scope 应该对应项目的具体模块，如：`auth`, `cart`, `console`, `api` 等
- 避免使用过于宽泛的描述，要具体说明改动内容
