# 更新日志

所有重要的项目更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.0.1] - 2025-01-14

### 新增
- 🎉 首次发布 Git Intelligence VS Code 扩展
- ✨ AI智能提交信息生成功能
- 🤖 支持多个AI服务提供商：
  - OpenAI (GPT-4o, GPT-4o-mini, GPT-3.5-turbo)
  - Anthropic (Claude-3-Haiku, Claude-3-Sonnet)
  - Google AI (Gemini-Pro)
- 📝 自动分析Git暂存区变更内容
- 🎯 一键生成描述性提交信息
- ⚙️ 灵活的配置系统：
  - 项目级 `git-message-prompt.md` 文件支持
  - `commitlint.config.js` 集成
  - VS Code 用户设置
  - 默认配置模板
- 🌍 多语言支持（中文/英文）
- 🔒 安全的API密钥本地存储
- ⚡ 基于Vercel AI SDK的高性能实现
- 📁 项目示例文件 `git-message-prompt.example.md`
- 🔧 与commitlint规则的智能集成

### 技术特性
- TypeScript 开发，类型安全
- 统一的AI SDK接口，支持多种模型
- 智能的配置优先级系统
- 完整的错误处理和用户反馈
- VS Code原生集成，无缝用户体验

### 文档
- 完整的README.md使用指南
- 详细的配置说明和示例
- 故障排除指南
- 开发者贡献指南

## [未来计划]

### 即将推出
- 🔄 提交信息历史记录和模板管理
- 📊 使用统计和分析
- 🎨 自定义UI主题支持
- 🔌 更多AI服务提供商支持
- 📱 移动端Git客户端集成

### 考虑中的功能
- 🤝 团队协作功能
- 📈 提交质量评分
- 🔍 智能代码审查建议
- 🌐 云端配置同步
- 🎯 项目特定的AI训练

---

有关每个版本的详细信息，请查看 [GitHub Releases](https://github.com/Mrxyy/git-intelligence/releases)。
