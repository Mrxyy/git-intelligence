import * as vscode from 'vscode';
import { GitExtension, Repository, GitAPI } from '../types/git';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitService {
    private gitExtension: GitExtension | undefined;
    private gitApi: GitAPI | undefined;

    constructor() {
        this.initializeGitExtension();
    }

    private initializeGitExtension() {
        try {
            this.gitExtension = {gitApi: vscode.extensions.getExtension('vscode.git')?.exports.model};
            this.gitApi = this.gitExtension?.gitApi;
        } catch (error) {
            console.error('Failed to initialize Git extension:', error);
        }
    }

    async getRepository(): Promise<Repository | null> {
        if (!this.gitApi) {
            this.initializeGitExtension();
        }

        if (!this.gitApi || this.gitApi.repositories.length === 0) {
            return null;
        }

        // 返回第一个仓库，或者当前工作区的仓库
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder) {
            const repo = this.gitApi.getRepository(workspaceFolder.uri);
            if (repo) {
                return repo;
            }
        }

        return this.gitApi.repositories[0] || null;
    }

    async getStagedChanges(repository: Repository): Promise<string> {
        try {
            // 首先尝试使用VS Code Git API
            if (repository.diff) {
                const diff = await repository.diff(true); // true表示获取staged changes
                if (diff && diff.trim().length > 0) {
                    return diff;
                }
            }

            // 如果Git API不可用，使用命令行
            return await this.getStagedChangesViaCommand(repository.rootUri.fsPath);
        } catch (error) {
            console.error('Error getting staged changes:', error);
            // 回退到命令行方式
            return await this.getStagedChangesViaCommand(repository.rootUri.fsPath);
        }
    }

    private async getStagedChangesViaCommand(repositoryPath: string): Promise<string> {
        try {
            const { stdout } = await execAsync('git diff --staged', {
                cwd: repositoryPath,
                maxBuffer: 1024 * 1024 * 10 // 10MB buffer
            });
            return stdout;
        } catch (error) {
            console.error('Error executing git diff --staged:', error);
            throw new Error('无法获取暂存区变更，请确保当前目录是Git仓库且有暂存的文件。');
        }
    }

    async setCommitMessage(repository: Repository, message: string): Promise<void> {
        try {
            if (repository.inputBox) {
                repository.inputBox.value = message;
                return;
            }

            // 如果inputBox不可用，直接抛出错误，让用户手动复制
            throw new Error('无法自动设置提交信息，请手动复制生成的提交信息');
        } catch (error) {
            console.error('Error setting commit message:', error);
            throw new Error('设置提交信息失败，请手动复制生成的提交信息。');
        }
    }

    async getRepositoryInfo(repository: Repository): Promise<{
        branch: string;
        hasStaged: boolean;
        stagedCount: number;
    }> {
        try {
            const branch = repository.state.HEAD?.name || 'unknown';
            const stagedChanges = repository.state.indexChanges || [];
            
            return {
                branch,
                hasStaged: stagedChanges.length > 0,
                stagedCount: stagedChanges.length
            };
        } catch (error) {
            console.error('Error getting repository info:', error);
            return {
                branch: 'unknown',
                hasStaged: false,
                stagedCount: 0
            };
        }
    }

    async validateRepository(): Promise<{ isValid: boolean; error?: string }> {
        try {
            const repository = await this.getRepository();
            if (!repository) {
                return { 
                    isValid: false, 
                    error: '未找到Git仓库，请确保当前工作区包含Git仓库。' 
                };
            }

            const info = await this.getRepositoryInfo(repository);
            if (!info.hasStaged) {
                return { 
                    isValid: false, 
                    error: '暂存区没有变更，请先暂存要提交的文件。' 
                };
            }

            return { isValid: true };
        } catch (error) {
            return { 
                isValid: false, 
                error: error instanceof Error ? error.message : '验证Git仓库时发生未知错误' 
            };
        }
    }
}
