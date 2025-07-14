 # git-copilot
 > 这个项目是一个vs code 插件,Git集成将人工智能辅助直接引入您的版本控制工作流程。无需离开编辑器即可生成提交信息。。

+ 功能流程：
1. 在Git中进行更改并暂存它们
2. 点击“源代码管理”视图中的图标。
4. 分析暂存区更改内容，并生成一条描述性的提交信息。
5. 消息会自动插入到提交消息输入框中。

+ 功能实现细节

```markdown
核心功能与AI模型集成
Diffing和内容提取:

插件需要能够获取Git暂存区中所有文件的修改内容（diff）。这包括新增、修改和删除的文件，以及这些文件内部的具体代码变动。

利用VS Code内置的Git扩展API或执行git diff --staged命令来获取这些信息。

AI模型选择与接口 (Vercel AI SDK):

选择合适的AI模型: 插件将支持通过配置选择不同的AI服务提供商，例如OpenAI、Anthropic、Google等。

Vercel AI SDK 集成:

使用 Vercel AI SDK 来简化与各种大型语言模型（LLMs）的交互。

根据用户在配置页面选择的AI模型和API密钥，初始化Vercel AI SDK。例如，如果是OpenAI模型：import { OpenAI } from 'openai'; const openai = new OpenAI({ apiKey: 'YOUR_API_KEY' });。

利用SDK提供的统一接口（如model.chat.completions.create）发送Prompt并接收AI的回复。

SDK将处理底层API调用、流式传输（如果需要）和错误处理。

Prompt工程: 这是AI生成质量的关键。您需要根据用户在配置页面定义的Prompt模板，结合实际的Git Diff内容来构建最终发送给AI的Prompt。

Prompt模板: 允许用户在插件设置中自定义Prompt模板，其中包含一个占位符（例如${diff}），插件在发送给AI之前会用实际的diff内容替换它。

Prompt内容: 确保Prompt清晰地向AI传达以下信息：

格式化后的Git Diff内容。

提交信息的要求：总结性、简洁性、包含主要改动点、遵循Git提交信息规范（如：主题行、空行、正文）、避免冗余信息、指定生成语言（根据用户VS Code语言设置或插件配置）。

上下文信息（可选）: 考虑是否需要包含当前分支名、项目类型、历史提交信息等，以进一步提高生成质量，但需权衡信息量和API调用成本。

2. VS Code 插件开发与Git集成
使用VS Code Extension API:

注册命令: 创建一个VS Code命令，用户可以通过点击“源代码管理”视图中的特定图标或快捷键触发。

Git扩展集成:

获取Git仓库状态：vscode.scm.repositories。

访问暂存区：repo.state.stagedChanges。

获取每个暂存文件的具体diff内容（可能需要通过git diff --staged命令或相关API）。

修改提交输入框: 获取并设置“源代码管理”视图中的提交信息输入框内容。

UI交互:

加载指示: 在AI生成提交信息期间，显示加载状态，防止用户误解或重复操作。

错误提示: 清晰地向用户展示AI生成失败或API调用出错时的错误信息。

用户反馈: 考虑添加一个选项，允许用户对AI生成的提交信息进行评分，以便后续优化prompt或模型。

3. 插件配置页面
为了让用户能够自定义AI模型和Prompt，需要一个VS Code插件的配置页面。

VS Code 配置 API: 使用 vscode.workspace.getConfiguration() 来读取和写入插件的配置项。

配置项定义 (package.json): 在 package.json 的 contributes.configuration 中定义插件的配置项，至少应包括：

aiCommit.aiProvider: AI 服务提供商（例如：openai, anthropic, google 等的下拉选择）。

aiCommit.apiKey: AI 服务的 API Key。这是一个敏感信息，需要提醒用户风险。

aiCommit.modelName: 具体使用的模型名称（例如：gpt-4o-mini, claude-3-opus-20240229, gemini-pro）。

aiCommit.promptTemplate: 用于生成提交信息的Prompt模板，包含${diff}占位符。

配置读取与应用:

插件启动时，读取这些配置。

当用户更改配置时，插件应该能够检测到这些更改并相应地更新其行为（例如，重新初始化AI SDK）。

4. 技术栈与工具
语言: TypeScript (VS Code插件开发的推荐语言)。

包管理: npm 或 yarn。

Git集成库: 如果VS Code内置API不足，可能需要借助外部Git库（例如 simple-git）来执行更复杂的Git命令。

HTTP客户端: Vercel AI SDK 会内部处理HTTP请求，您无需直接使用axios或node-fetch。

5. 关键挑战与考虑
性能: 处理大型diff时的性能优化，避免阻塞VS Code UI。

API成本与速率限制: 优化API调用，减少不必要的请求，并处理好速率限制。

AI生成质量: 持续优化Prompt以提高提交信息的准确性和描述性。

用户隐私: 如果选择云端AI模型，需要明确告知用户代码内容会被发送到第三方AI服务。

可配置性: 确保所有关键参数都可通过配置页面进行调整。

6. 详细步骤（AI Agent执行流程）
用户触发命令: 用户点击“源代码管理”视图中的特定图标或执行插件命令。

读取插件配置: 插件首先读取用户在VS Code设置中配置的AI服务提供商、API Key、模型名称和Prompt模板。

获取暂存区内容:

插件调用Git API获取当前仓库暂存区的所有更改。

遍历暂存文件列表，并获取每个文件的diff内容。

将所有diff内容合并并格式化。

构建AI请求Prompt:

使用从配置中读取的Prompt模板，将格式化后的diff内容替换模板中的${diff}占位符。

确保最终的Prompt字符串能够清晰地向AI传达所有必要的上下文和要求。

初始化AI模型: 根据配置中选择的AI提供商和API Key，使用Vercel AI SDK初始化相应的AI模型实例。

调用AI模型API:

使用初始化后的AI模型实例，调用Vercel AI SDK提供的统一接口（如model.chat.completions.create），发送构建好的Prompt。

处理API响应，包括成功的数据和可能的错误（网络错误、API限制等）。

解析AI响应:

从AI模型的响应中提取生成的提交信息文本。

处理AI可能返回的额外信息或格式。

更新VS Code提交输入框:

获取VS Code中“源代码管理”视图的提交信息输入框实例。

将AI生成的文本插入到该输入框中。

状态与错误反馈:

在整个过程中显示加载指示。

如果出现任何错误（Git命令失败、API调用失败、AI生成内容为空等），向用户显示适当的错误通知。
```