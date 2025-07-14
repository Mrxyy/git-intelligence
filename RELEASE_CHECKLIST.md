# Git Intelligence 发布检查清单

在发布新版本之前，请确保完成以下所有检查项：

## 📋 发布前检查

### 代码质量
- [ ] 所有TypeScript代码编译无错误
- [ ] 运行 `npm run compile` 成功
- [ ] 代码符合项目编码规范
- [ ] 所有TODO和FIXME已处理

### 功能测试
- [ ] 基本功能测试：生成提交信息
- [ ] 多AI服务提供商测试（OpenAI、Anthropic、Google）
- [ ] 配置系统测试：
  - [ ] VS Code设置配置
  - [ ] git-message-prompt.md文件配置
  - [ ] commitlint.config.js配置
- [ ] 错误处理测试：
  - [ ] 无API密钥时的错误提示
  - [ ] 网络错误处理
  - [ ] 无Git仓库时的错误提示
  - [ ] 暂存区为空时的提示

### 文档更新
- [ ] README.md 内容完整且准确
- [ ] CHANGELOG.md 已更新当前版本信息
- [ ] package.json 版本号已更新
- [ ] 所有示例代码和配置已验证
- [ ] 链接和徽章URL已更新

### 文件检查
- [ ] package.json 配置完整
  - [ ] 版本号正确
  - [ ] 发布者信息正确
  - [ ] 仓库URL正确
  - [ ] 关键词和分类合适
- [ ] LICENSE 文件存在
- [ ] 如需要logo，确保使用PNG格式（VS Code Marketplace不支持SVG）
- [ ] git-message-prompt.example.md 示例文件完整
- [ ] .vscodeignore 文件配置正确，排除不必要的文件

### 构建和打包
- [ ] `npm install` 成功
- [ ] `npm run compile` 成功
- [ ] `npm run package` 成功生成.vsix文件
- [ ] .vsix文件大小合理（通常<10MB）

### 发布准备
- [ ] VS Code Marketplace发布者账号已设置
- [ ] Personal Access Token (PAT) 已准备
- [ ] GitHub仓库已创建并推送代码
- [ ] 发布说明已准备（基于CHANGELOG.md）

## 🚀 发布流程

### 1. 自动发布（推荐）
```bash
npm run publish
```

### 2. 手动发布步骤
```bash
# 1. 清理和构建
npm run clean
npm run compile

# 2. 打包扩展
npm run package

# 3. 发布到Marketplace
vsce publish -p YOUR_PERSONAL_ACCESS_TOKEN

# 4. 创建GitHub Release
# 手动在GitHub上创建release并上传.vsix文件
```

## 📝 发布后检查

### Marketplace验证
- [ ] 扩展在VS Code Marketplace上可见
- [ ] 扩展信息显示正确
- [ ] 下载和安装功能正常
- [ ] 评分和评论功能可用

### GitHub Release
- [ ] GitHub Release已创建
- [ ] .vsix文件已上传
- [ ] Release说明完整
- [ ] 标签版本正确

### 功能验证
- [ ] 从Marketplace安装的扩展功能正常
- [ ] 所有配置选项工作正常
- [ ] 不同操作系统兼容性（Windows、macOS、Linux）

## 🔄 版本管理

### 版本号规则
- **补丁版本** (0.0.x): 错误修复
- **次要版本** (0.x.0): 新功能，向后兼容
- **主要版本** (x.0.0): 重大更改，可能不向后兼容

### 发布频率
- 补丁版本：根据需要
- 次要版本：每月一次
- 主要版本：每季度一次

## 📞 支持和反馈

发布后请关注：
- GitHub Issues中的用户反馈
- VS Code Marketplace的评论和评分
- 使用统计和下载量
- 社区讨论和建议

---

**注意**: 发布是不可逆的操作，请确保所有检查项都已完成！
