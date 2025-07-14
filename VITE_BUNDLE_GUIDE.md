# TypeScript 使用 Vite 打包为 Bundle 指南

## 概述

你的 VSCode 扩展项目现在已经成功配置为使用 Vite 将 TypeScript 代码打包为单个 bundle 文件。

## 配置文件

### 1. `vite.config.ts`
- 配置了 Node.js 环境的构建设置
- 将所有源码打包为单个 `extension.js` 文件
- 外部化了 Node.js 内置模块和 VSCode API
- 生成 source map 用于调试

### 2. `package.json` 脚本更新
- `build`: 使用 Vite 构建生产版本
- `build:watch`: 监听文件变化并自动重新构建
- `vscode:prepublish`: 发布前自动构建

## 构建命令

```bash
# 构建生产版本
pnpm run build

# 监听模式构建
pnpm run build:watch

# 打包为 VSCode 扩展
pnpm run package

# 清理输出目录
pnpm run clean
```

## 构建结果

构建后会在 `out/` 目录生成：
- `extension.js` - 完整打包的主文件（412.46 kB，包含所有第三方依赖）
- `extension.js.map` - Source map 文件（1,005.00 kB）

## 优势

### 使用 Vite 打包的好处：
1. **更快的构建速度** - Vite 使用 esbuild 进行快速转换
2. **单文件输出** - 所有模块打包为一个文件，减少文件数量
3. **更小的包体积** - 通过 tree-shaking 移除未使用的代码
4. **更好的加载性能** - 减少模块加载开销
5. **现代化工具链** - 支持最新的 JavaScript/TypeScript 特性

### 与传统 tsc 编译的对比：
- **传统方式**: 每个 `.ts` 文件对应一个 `.js` 文件，保持目录结构
- **Vite 打包**: 所有代码打包为单个 `extension.js` 文件

## 兼容性

- ✅ VSCode 扩展 API 完全兼容
- ✅ Node.js 内置模块正确外部化
- ✅ TypeScript 类型检查正常
- ✅ Source map 支持调试
- ✅ 生产环境优化

## 注意事项

1. **外部依赖**: `vscode` 和 Node.js 内置模块被标记为外部依赖，不会被打包
2. **调试**: 生成的 source map 支持在 VSCode 中调试
3. **发布**: `vscode:prepublish` 脚本会自动构建，无需手动操作

## 回退到传统编译

如果需要回退到传统的 tsc 编译方式，可以：

```bash
# 修改 package.json 中的 vscode:prepublish 脚本
"vscode:prepublish": "npm run compile"

# 使用传统编译
pnpm run compile
```

## 总结

你的项目现在可以使用 Vite 将 TypeScript 代码高效地打包为单个 bundle 文件，这提供了更好的性能和更现代化的开发体验。
