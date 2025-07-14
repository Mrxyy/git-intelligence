# Git Commit Message Prompt Template

这是一个自定义的Git提交信息生成模板文件。将此文件重命名为 `git-message-prompt.md` 并放在项目根目录下即可使用。

请根据以下Git差异内容生成一个符合项目规范的提交信息：

## 提交信息规范
1. 使用中文描述
2. 格式：`<类型>(<范围>): <描述>`
3. 类型包括：feat, fix, docs, style, refactor, test, chore
4. 描述简洁明了，不超过50个字符
5. 如果有重大变更，需要添加详细说明

## 示例格式
```
feat(auth): 添加用户登录功能

- 实现JWT token验证
- 添加登录表单验证
- 集成第三方OAuth登录
```

## 规范说明
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

请严格按照上述规范生成提交信息：
