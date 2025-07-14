import * as vscode from 'vscode';
import { GitExtension, Repository } from './types/git';
import { AIService } from './services/aiService';
import { GitService } from './services/gitService';
import { ConfigService } from './services/configService';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('Git Copilot');
    outputChannel.appendLine('Git Copilot 插件已激活');

    const disposable = vscode.commands.registerCommand('git-copilot.generateCommitMessage', async () => {
        try {
            await generateCommitMessage();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            vscode.window.showErrorMessage(`生成提交信息失败: ${errorMessage}`);
            outputChannel.appendLine(`错误: ${errorMessage}`);
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(outputChannel);
}

async function generateCommitMessage() {
    // 显示加载状态
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "正在生成AI提交信息...",
        cancellable: true
    }, async (progress, token) => {
        try {
            // 检查配置
            const config = await ConfigService.getConfig();
            if (!config.apiKey) {
                const result = await vscode.window.showWarningMessage(
                    '未配置AI服务API密钥，请先在设置中配置。',
                    '打开设置'
                );
                if (result === '打开设置') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'gitCopilot');
                }
                return;
            }

            progress.report({ increment: 5, message: "检测配置文件..." });

            // 显示prompt配置来源信息
            const promptSourceInfo = await ConfigService.getPromptSourceInfo();
            outputChannel.appendLine(promptSourceInfo);

            // 显示commitlint配置信息
            const hasCommitlint = await ConfigService.hasCommitlintConfig();
            if (hasCommitlint) {
                const commitlintInfo = await ConfigService.getCommitlintInfo();
                outputChannel.appendLine(commitlintInfo);
            }

            progress.report({ increment: 10, message: "获取Git仓库信息..." });

            // 获取Git仓库和暂存区变更
            const gitService = new GitService();
            const repository = await gitService.getRepository();
            
            if (!repository) {
                vscode.window.showWarningMessage('未找到Git仓库，请确保当前工作区包含Git仓库。');
                return;
            }

            progress.report({ increment: 30, message: "分析暂存区变更..." });

            const stagedChanges = await gitService.getStagedChanges(repository);
            
            if (!stagedChanges || stagedChanges.trim().length === 0) {
                vscode.window.showWarningMessage('暂存区没有变更，请先暂存要提交的文件。');
                return;
            }

            // 检查token取消
            if (token.isCancellationRequested) {
                return;
            }

            progress.report({ increment: 50, message: "调用AI服务生成提交信息..." });

            // 使用AI服务生成提交信息
            const aiService = new AIService(config);
            const commitMessage = await aiService.generateCommitMessage(stagedChanges);

            if (!commitMessage || commitMessage.trim().length === 0) {
                vscode.window.showWarningMessage('AI服务返回空的提交信息，请检查配置或重试。');
                return;
            }

            progress.report({ increment: 80, message: "更新提交信息输入框..." });

            // 将生成的提交信息设置到SCM输入框
            await gitService.setCommitMessage(repository, commitMessage.trim());

            progress.report({ increment: 100, message: "完成" });

            vscode.window.showInformationMessage('AI提交信息生成成功！');
            outputChannel.appendLine(`生成的提交信息: ${commitMessage.trim()}`);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            outputChannel.appendLine(`生成提交信息时发生错误: ${errorMessage}`);
            throw error;
        }
    });
}

export function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}
