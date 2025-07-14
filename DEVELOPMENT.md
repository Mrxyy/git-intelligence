# 开发指南

## 代码质量工具

本项目使用 ESLint 和 Prettier 来确保代码质量和一致的代码风格。

### 工具配置

- **ESLint**: 使用 `eslint.config.js` 配置文件（ESLint 9.x 新格式）
- **Prettier**: 使用 `.prettierrc` 配置文件
- **VSCode**: 使用 `.vscode/settings.json` 配置编辑器集成

### 可用脚本

```bash
# 检查代码规范
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check

# 运行所有检查（lint + format check）
npm run check

# 自动修复所有问题（lint fix + format）
npm run fix
```

### 开发工作流

1. **开发时**: VSCode 会在保存时自动格式化代码并修复 ESLint 问题
2. **提交前**: 运行 `npm run check` 确保代码符合规范
3. **修复问题**: 运行 `npm run fix` 自动修复大部分问题

### ESLint 规则

项目配置了以下主要规则：

- **TypeScript 规则**: 使用 `@typescript-eslint` 推荐配置
- **代码风格**: 集成 Prettier 格式化
- **最佳实践**: 
  - 禁止使用 `var`
  - 优先使用 `const`
  - 禁止使用 `debugger`
  - 警告 `console` 语句
  - 要求使用模板字符串

### Prettier 配置

- 使用单引号
- 行尾分号
- 每行最大 80 字符
- 2 空格缩进
- 尾随逗号（ES5）

### VSCode 集成

安装推荐的扩展：
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)

编辑器会自动：
- 保存时格式化代码
- 显示 ESLint 错误和警告
- 提供快速修复建议

### 忽略文件

- `.prettierignore`: 配置 Prettier 忽略的文件
- ESLint 配置中的 `ignores`: 配置 ESLint 忽略的文件

### 故障排除

如果遇到问题：

1. **依赖问题**: 删除 `node_modules` 和 `package-lock.json`，重新安装
2. **配置冲突**: 确保没有旧的 `.eslintrc.*` 文件
3. **VSCode 问题**: 重启 VSCode 或重新加载窗口
4. **格式化问题**: 检查 VSCode 设置中的默认格式化程序

### 持续集成

建议在 CI/CD 流程中添加：

```bash
npm run check  # 检查代码质量
npm run build  # 构建项目
