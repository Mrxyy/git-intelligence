import * as vscode from 'vscode';

export interface GitExtension {
    readonly gitApi: GitAPI;
}

export interface GitAPI {
    readonly repositories: Repository[];
    getRepository(uri: vscode.Uri): Repository | null;
}

export interface Repository {
    readonly rootUri: vscode.Uri;
    readonly state: RepositoryState;
    readonly inputBox: SourceControlInputBox;
    diff(cached?: boolean): Promise<string>;
    show(ref: string, path: string): Promise<string>;
    getCommit(ref: string): Promise<Commit>;
}

export interface RepositoryState {
    readonly HEAD: Branch | undefined;
    readonly refs: Ref[];
    readonly remotes: Remote[];
    readonly submodules: Submodule[];
    readonly rebaseCommit: Commit | undefined;
    readonly mergeChanges: Change[];
    readonly indexChanges: Change[];
    readonly workingTreeChanges: Change[];
}

export interface SourceControlInputBox {
    value: string;
    placeholder: string;
    readonly enabled: boolean;
    readonly visible: boolean;
}

export interface Change {
    readonly uri: vscode.Uri;
    readonly originalUri: vscode.Uri;
    readonly renameUri: vscode.Uri | undefined;
    readonly status: Status;
}

export interface Branch {
    readonly name: string;
    readonly commit?: string;
    readonly upstream?: UpstreamRef;
    readonly type: RefType;
}

export interface Ref {
    readonly type: RefType;
    readonly name?: string;
    readonly commit?: string;
    readonly remote?: string;
}

export interface Remote {
    readonly name: string;
    readonly fetchUrl?: string;
    readonly pushUrl?: string;
    readonly isReadOnly: boolean;
}

export interface Submodule {
    readonly name: string;
    readonly path: string;
    readonly url: string;
}

export interface Commit {
    readonly hash: string;
    readonly message: string;
    readonly parents: string[];
    readonly authorDate?: Date;
    readonly authorName?: string;
    readonly authorEmail?: string;
    readonly commitDate?: Date;
}

export interface UpstreamRef {
    readonly remote: string;
    readonly name: string;
}

export enum RefType {
    Head,
    RemoteHead,
    Tag
}

export enum Status {
    INDEX_MODIFIED,
    INDEX_ADDED,
    INDEX_DELETED,
    INDEX_RENAMED,
    INDEX_COPIED,
    MODIFIED,
    DELETED,
    UNTRACKED,
    IGNORED,
    INTENT_TO_ADD,
    ADDED_BY_US,
    ADDED_BY_THEM,
    DELETED_BY_US,
    DELETED_BY_THEM,
    BOTH_ADDED,
    BOTH_DELETED,
    BOTH_MODIFIED
}
