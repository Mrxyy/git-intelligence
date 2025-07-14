import { GitCopilotConfig } from './configService';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export class AIService {
  private config: GitCopilotConfig;

  constructor(config: GitCopilotConfig) {
    this.config = config;
  }

  async generateCommitMessage(diff: string): Promise<string> {
    try {
      const prompt = this.buildPrompt(diff);
      const model = this.getModel();

      const { text } = await generateText({
        model,
        prompt,
        maxTokens: 200,
        temperature: 0.3,
      });

      return this.cleanupCommitMessage(text);
    } catch (error) {
      console.error('Error generating commit message:', error);
      throw new Error(
        `AI服务调用失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }
  }

  private getModel() {
    switch (this.config.aiProvider) {
      case 'openai': {
        const openaiProvider = createOpenAI({
          apiKey: this.config.apiKey,
        });
        return openaiProvider(this.config.modelName);
      }
      case 'anthropic': {
        const anthropicProvider = createAnthropic({
          apiKey: this.config.apiKey,
        });
        return anthropicProvider(this.config.modelName);
      }
      case 'google': {
        const googleProvider = createGoogleGenerativeAI({
          apiKey: this.config.apiKey,
        });
        return googleProvider(this.config.modelName);
      }
      default:
        throw new Error(`不支持的AI提供商: ${this.config.aiProvider}`);
    }
  }

  private buildPrompt(diff: string): string {
    // 限制diff长度，避免token超限
    const maxDiffLength = 8000;
    const truncatedDiff =
      diff.length > maxDiffLength
        ? `${diff.substring(0, maxDiffLength)}\n\n... (内容被截断)`
        : diff;

    return this.config.promptTemplate.replace('${diff}', truncatedDiff);
  }

  private cleanupCommitMessage(message: string): string {
    // 清理AI返回的内容
    let cleaned = message.trim();

    // 移除可能的markdown格式
    cleaned = cleaned.replace(/^```.*\n/, '').replace(/\n```$/, '');

    // 移除多余的引号
    cleaned = cleaned.replace(/^["']/, '').replace(/["']$/, '');

    // 移除常见的AI回复前缀
    const prefixesToRemove = [
      '提交信息：',
      '提交信息:',
      'Commit message:',
      'Commit:',
      '建议的提交信息：',
      '建议的提交信息:',
    ];

    for (const prefix of prefixesToRemove) {
      if (cleaned.startsWith(prefix)) {
        cleaned = cleaned.substring(prefix.length).trim();
      }
    }

    // 确保不超过推荐长度
    const lines = cleaned.split('\n');
    if (lines.length > 0 && lines[0].length > 72) {
      lines[0] = `${lines[0].substring(0, 69)}...`;
      cleaned = lines.join('\n');
    }

    return cleaned;
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const testPrompt = "请回复'连接成功'";
      const model = this.getModel();

      await generateText({
        model,
        prompt: testPrompt,
        maxTokens: 10,
        temperature: 0,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '连接测试失败',
      };
    }
  }

  static getDefaultModelForProvider(provider: string): string {
    switch (provider) {
      case 'openai':
        return 'gpt-4o-mini';
      case 'anthropic':
        return 'claude-3-haiku-20240307';
      case 'google':
        return 'gemini-2.0-flash-exp';
      default:
        return 'gpt-4o-mini';
    }
  }

  static validateApiKey(apiKey: string, _provider: string): boolean {
    if (!apiKey || apiKey.trim().length === 0) {
      return false;
    }

    return true;
  }
}
