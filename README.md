# Git Copilot

🚀 一个AI驱动的VS Code插件，自动生成Git提交信息。

## 功能特性

- 🤖 **AI智能生成**: 基于Vercel AI SDK，支持OpenAI、Anthropic、Google等多个AI服务提供商
- 📝 **自动分析**: 自动分析Git暂存区的变更内容
- 🎯 **一键生成**: 点击按钮即可生成描述性的提交信息
- ⚙️ **可配置**: 支持自定义Prompt模板和AI模型
- 🌍 **多语言**: 支持中文和英文提交信息生成
- 🔒 **安全**: API密钥本地存储，保护隐私
- ⚡ **高性能**: 使用统一的AI SDK接口，提供一致的体验

## 使用方法

### 1. 配置方式（优先级从高到低）

#### 方式1：git-message-prompt.md（最高优先级）
在项目根目录创建 `git-message-prompt.md` 文件，定义自定义prompt模板：

```markdown
# Git Commit Message Prompt Template

请根据以下Git差异内容生成一个符合项目规范的提交信息：

## 规范要求
1. 使用中文描述
2. 格式：`<类型>(<范围>): <描述>`
3. 类型包括：feat, fix, docs, style, refactor, test, chore
4. 描述简洁明了，不超过50个字符

## Git差异内容
${diff}

请严格按照上述规范生成提交信息：
```

#### 方式2：commitlint.config.js
在项目根目录创建 `commitlint.config.js`，支持gitCopilot配置：

```javascript
module.exports = {
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],
    'subject-max-length': [2, 'always', 50]
  },
  gitCopilot: {
    promptTemplate: '根据commitlint规则生成提交信息...',
    language: 'zh-CN'
  }
}
```

#### 方式3：VS Code设置
在VS Code设置中配置：
- **AI Provider**: 选择AI服务提供商 (OpenAI/Anthropic/Google)
- **API Key**: 输入对应AI服务的API密钥
- **Model Name**: 选择AI模型 (如 gpt-4o-mini)
- **Prompt Template**: 自定义提示词模板

### 2. 生成提交信息

1. 在Git仓库中进行代码更改
2. 将更改添加到暂存区 (`git add .` 或通过VS Code界面)
3. 打开"源代码管理"视图
4. 点击工具栏中的✨ **Generate AI Commit Message** 按钮
5. AI将自动分析变更并生成提交信息
6. 提交信息会自动填入提交消息输入框

## 支持的AI服务

### OpenAI
- 模型示例: `gpt-4o-mini`, `gpt-4o`, `gpt-3.5-turbo`
- API密钥格式: `sk-...`

### Anthropic
- 模型示例: `claude-3-haiku-20240307`, `claude-3-sonnet-20240229`
- API密钥格式: `sk-ant-...`

### Google
- 模型示例: `gemini-pro`, `gemini-pro-vision`
- 需要Google Cloud API密钥

## 配置示例

```json
{
  "gitCopilot.aiProvider": "openai",
  "gitCopilot.apiKey": "sk-your-api-key-here",
  "gitCopilot.modelName": "gpt-4o-mini",
  "gitCopilot.language": "zh-CN",
  "gitCopilot.promptTemplate": "请根据以下Git差异内容生成一个简洁、描述性的提交信息。提交信息应该：\n1. 使用中文\n2. 简洁明了，不超过50个字符的标题\n3. 如果需要，可以包含详细描述\n4. 遵循常见的Git提交规范\n\nGit差异内容：\n${diff}\n\n请只返回提交信息，不要包含其他解释文字："
}
```

## 开发

### 构建项目

```bash
# 安装依赖
npm install

# 编译TypeScript
npm run compile

# 监听文件变化自动编译
npm run watch
```

### 项目结构

```
git-copilot/
├── src/
│   ├── extension.ts          # 插件主入口
│   ├── services/
│   │   ├── aiService.ts      # AI服务集成
│   │   ├── gitService.ts     # Git集成服务
│   │   └── configService.ts  # 配置管理
│   └── types/
│       └── git.ts           # Git类型定义
├── package.json             # 插件配置和依赖
└── tsconfig.json           # TypeScript配置
```

## 安全注意事项

⚠️ **重要提醒**: 
- API密钥会存储在VS Code的用户设置中
- 代码差异内容会发送给第三方AI服务进行处理
- 请确保您信任所使用的AI服务提供商
- 建议在私有或敏感项目中谨慎使用

## 故障排除

### 常见问题

1. **"未找到Git仓库"**
   - 确保当前工作区是一个Git仓库
   - 运行 `git init` 初始化仓库

2. **"暂存区没有变更"**
   - 使用 `git add .` 添加文件到暂存区
   - 或通过VS Code源代码管理界面暂存文件

3. **"AI服务调用失败"**
   - 检查API密钥是否正确
   - 确认网络连接正常
   - 验证选择的AI模型是否可用

4. **"设置提交信息失败"**
   - 提交信息会显示在VS Code通知中
   - 可以手动复制粘贴到提交消息框

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

💡 **提示**: 使用合适的Prompt模板可以显著提高生成的提交信息质量。建议根据项目特点和团队规范调整提示词。
