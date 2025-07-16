import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface GitCopilotConfig {
  aiProvider: 'openai' | 'anthropic' | 'google';
  apiKey: string;
  baseUrl?: string;
  modelName: string;
  promptTemplate: string;
  language: 'zh-CN' | 'en-US';
  commitlintRules?: any;
}

export interface CommitlintConfig {
  rules?: any;
  extends?: string[];
  prompt?: {
    template?: string;
    format?: string;
  };
  gitCopilot?: {
    promptTemplate?: string;
    language?: 'zh-CN' | 'en-US';
  };
}

export class ConfigService {
  private static readonly CONFIG_SECTION = 'gitCopilot';

  static async getConfig(): Promise<GitCopilotConfig> {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    const commitlintConfig = await this.loadCommitlintConfig();

    // 优先级顺序: git-message-prompt.md > commitlint配置 > VS Code设置 > 默认值
    let promptTemplate = await this.getDefaultPromptTemplate();

    // 1. 从VS Code设置获取
    promptTemplate = config.get<string>('promptTemplate', promptTemplate);
    // 3. 从git-message-prompt.md文件获取（最高优先级）
    const customPrompt = await this.loadCustomPromptFile();
    if (customPrompt) {
      promptTemplate = customPrompt;
    }

    const language =
      commitlintConfig?.gitCopilot?.language ||
      config.get<'zh-CN' | 'en-US'>('language', 'zh-CN');

    return {
      aiProvider: config.get<'openai' | 'anthropic' | 'google'>(
        'aiProvider',
        'openai'
      ),
      apiKey: config.get<string>('apiKey', ''),
      baseUrl: config.get<string>('baseUrl'),
      modelName: config.get<string>('modelName', 'gpt-4o-mini'),
      promptTemplate: promptTemplate
        .replace(/\${lintStyles}/g, await this.generateLintPrompt())
        .trim(),
      language,
      commitlintRules: commitlintConfig?.rules,
    };
  }

  static async updateConfig(
    key: keyof GitCopilotConfig,
    value: any
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }

  private static async getDefaultPromptTemplate() {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    return config.inspect<string>('promptTemplate')?.defaultValue || '';
  }

  static async loadCommitlintConfig(): Promise<CommitlintConfig | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return null;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const commitlintConfigPath = path.join(
      workspacePath,
      'commitlint.config.js'
    );

    try {
      if (fs.existsSync(commitlintConfigPath)) {
        // 读取文件内容
        const configContent = fs.readFileSync(commitlintConfigPath, 'utf8');

        // 简单的配置解析（避免使用eval，安全考虑）
        const config = this.parseCommitlintConfig(configContent);
        return config;
      }
    } catch (error) {
      console.error('Failed to load commitlint config:', error);
    }

    return null;
  }

  private static parseCommitlintConfig(
    content: string
  ): CommitlintConfig | null {
    try {
      // 移除注释和清理内容
      const cleanContent = content
        .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
        .replace(/\/\/.*$/gm, ''); // 移除行注释

      // 尝试提取module.exports对象
      const exportMatch = cleanContent.match(
        /module\.exports\s*=\s*({[\s\S]*})/
      );
      if (exportMatch) {
        // 使用Function构造器安全地解析配置
        const configStr = exportMatch[1];
        const config = new Function(`return ${configStr}`)();
        return config as CommitlintConfig;
      }
    } catch (error) {
      console.error('Failed to parse commitlint config:', error);
    }

    return null;
  }

  static generatePromptFromCommitlintRules(
    rules: any,
    language: 'zh-CN' | 'en-US' = 'zh-CN'
  ): string {
    if (!rules) {
      return '';
    }

    const isZh = language === 'zh-CN';
    let prompt = '';

    // 解析常见的commitlint规则
    if (rules['type-enum']) {
      const types = rules['type-enum'][2];
      if (Array.isArray(types)) {
        prompt += isZh
          ? `允许的提交类型: ${types.join(', ')}\n`
          : `Allowed commit types: ${types.join(', ')}\n`;
      }
    }

    if (rules['type-case']) {
      const caseType = rules['type-case'][2];
      prompt += isZh ? `类型大小写: ${caseType}\n` : `Type case: ${caseType}\n`;
    }

    if (rules['subject-max-length']) {
      const maxLength = rules['subject-max-length'][2];
      prompt += isZh
        ? `主题最大长度: ${maxLength}个字符\n`
        : `Subject max length: ${maxLength} characters\n`;
    }

    if (rules['subject-case']) {
      const subjectCase = rules['subject-case'][2];
      prompt += isZh
        ? `主题大小写: ${subjectCase}\n`
        : `Subject case: ${subjectCase}\n`;
    }

    if (rules['subject-empty']) {
      const isEmpty = rules['subject-empty'][0] === 2; // 2 means error level
      if (isEmpty) {
        prompt += isZh ? '主题不能为空\n' : 'Subject cannot be empty\n';
      }
    }

    return prompt;
  }

  static async generateLintPrompt() {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    const commitlintConfig = await this.loadCommitlintConfig();
    // 2. 从commitlint配置获取（如果有）
    let lintTemplate = '';
    if (commitlintConfig?.gitCopilot?.promptTemplate) {
      lintTemplate = commitlintConfig.gitCopilot.promptTemplate;
    } else if (commitlintConfig?.rules) {
      // 如果有commitlint规则但没有自定义prompt，根据规则生成
      const language =
        commitlintConfig?.gitCopilot?.language ||
        config.get<'zh-CN' | 'en-US'>('language', 'zh-CN');
      lintTemplate = this.generatePromptFromCommitlintRules(
        commitlintConfig.rules,
        language
      );
    }
    return lintTemplate;
  }

  static validateConfig(config: GitCopilotConfig): string[] {
    const errors: string[] = [];

    if (!config.apiKey.trim()) {
      errors.push('API密钥不能为空');
    }

    if (config.baseUrl) {
      try {
        new URL(config.baseUrl);
      } catch {
        errors.push('Base URL不是一个合法的URL');
      }
    }

    if (!config.modelName.trim()) {
      errors.push('模型名称不能为空');
    }

    if (!config.promptTemplate.trim()) {
      errors.push('Prompt模板不能为空');
    }

    if (!config.promptTemplate.includes('${diff}')) {
      errors.push('Prompt模板必须包含${diff}占位符');
    }

    return errors;
  }

  static async loadCustomPromptFile(): Promise<string | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return null;
    }

    const workspacePath = workspaceFolders[0].uri.fsPath;
    const promptFilePath = path.join(workspacePath, 'git-message-prompt.md');

    try {
      if (fs.existsSync(promptFilePath)) {
        const promptContent = fs.readFileSync(promptFilePath, 'utf8');

        // 清理内容并自动添加diff占位符和返回要求
        let cleanContent = promptContent.trim();

        // 移除可能的${diff}占位符，因为我们会在末尾统一添加
        cleanContent = cleanContent.replace(/\${diff}/g, '').trim();

        // 确保内容不为空
        if (cleanContent.length > 0) {
          // 自动添加diff占位符和返回要求
          return `${cleanContent}\n\nGit差异内容：\n\${diff}\n\n请只返回提交信息，不要包含其他解释文字：`;
        }
      }
    } catch (error) {
      console.error('Failed to load custom prompt file:', error);
    }

    return null;
  }

  static async hasCustomPromptFile(): Promise<boolean> {
    const customPrompt = await this.loadCustomPromptFile();
    return customPrompt !== null;
  }

  static async getPromptSourceInfo(): Promise<string> {
    const hasCustomPrompt = await this.hasCustomPromptFile();
    const hasCommitlintConfig = await this.hasCommitlintConfig();

    let info = 'Prompt配置来源:\n';

    if (hasCustomPrompt) {
      info += '✅ git-message-prompt.md (最高优先级)\n';
    }

    if (hasCommitlintConfig) {
      const commitlintConfig = await this.loadCommitlintConfig();
      if (commitlintConfig?.gitCopilot?.promptTemplate) {
        info += '✅ commitlint.config.js (gitCopilot.promptTemplate)\n';
      } else if (commitlintConfig?.rules) {
        info += '✅ commitlint.config.js (根据规则自动生成)\n';
      }
    }

    if (!hasCustomPrompt && !hasCommitlintConfig) {
      info += '✅ VS Code设置或默认配置\n';
    }

    return info;
  }

  static async hasCommitlintConfig(): Promise<boolean> {
    const commitlintConfig = await this.loadCommitlintConfig();
    return commitlintConfig !== null;
  }

  static async getCommitlintInfo(): Promise<string> {
    const config = await this.loadCommitlintConfig();
    if (!config) {
      return '未检测到commitlint配置文件';
    }

    let info = '检测到commitlint配置:\n';

    if (config.extends) {
      info += `- 扩展配置: ${config.extends.join(', ')}\n`;
    }

    if (config.rules) {
      const ruleCount = Object.keys(config.rules).length;
      info += `- 自定义规则: ${ruleCount}条\n`;
    }

    if (config.gitCopilot) {
      info += '- 包含Git Intelligence专用配置\n';
    }

    return info;
  }
}
