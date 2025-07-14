#!/bin/bash

# Git Intelligence 发布脚本
# 用于构建和发布 VS Code 扩展

set -e

echo "🚀 开始 Git Intelligence 发布流程..."

# 检查是否安装了必要的工具
check_dependencies() {
    echo "📋 检查依赖..."
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm 未安装，请先安装 Node.js"
        exit 1
    fi
    
    if ! command -v vsce &> /dev/null; then
        echo "📦 安装 vsce (Visual Studio Code Extension Manager)..."
        npm install -g vsce
    fi
    
    echo "✅ 依赖检查完成"
}

# 清理和构建
build_extension() {
    echo "🔨 构建扩展..."
    
    # 清理旧的构建文件
    rm -rf out/
    rm -f *.vsix
    
    # 安装依赖
    echo "📦 安装依赖..."
    npm install
    
    # 编译 TypeScript
    echo "⚙️ 编译 TypeScript..."
    npm run compile
    
    echo "✅ 构建完成"
}

# 验证扩展
validate_extension() {
    echo "🔍 验证扩展..."
    
    # 检查必要文件
    if [ ! -f "package.json" ]; then
        echo "❌ package.json 文件不存在"
        exit 1
    fi
    
    if [ ! -f "README.md" ]; then
        echo "❌ README.md 文件不存在"
        exit 1
    fi
    
    if [ ! -f "LICENSE" ]; then
        echo "❌ LICENSE 文件不存在"
        exit 1
    fi
    

    if [ ! -d "out" ]; then
        echo "❌ 编译输出目录不存在"
        exit 1
    fi
    
    echo "✅ 扩展验证通过"
}

# 打包扩展
package_extension() {
    echo "📦 打包扩展..."
    
    # 使用 vsce 打包
    vsce package
    
    # 获取生成的 .vsix 文件名
    VSIX_FILE=$(ls *.vsix | head -n 1)
    
    if [ -z "$VSIX_FILE" ]; then
        echo "❌ 打包失败，未找到 .vsix 文件"
        exit 1
    fi
    
    echo "✅ 扩展已打包: $VSIX_FILE"
}

# 发布到 VS Code Marketplace
publish_to_marketplace() {
    echo "🌐 发布到 VS Code Marketplace..."
    
    # 检查是否设置了发布令牌
    if [ -z "$VSCE_PAT" ]; then
        echo "⚠️ 未设置 VSCE_PAT 环境变量"
        echo "请设置您的 Visual Studio Marketplace Personal Access Token"
        echo "export VSCE_PAT=your_token_here"
        echo ""
        echo "或者手动发布："
        echo "vsce publish -p YOUR_TOKEN"
        return 1
    fi
    
    # 发布扩展
    vsce publish -p "$VSCE_PAT"
    
    echo "✅ 扩展已发布到 VS Code Marketplace"
}

# 创建 GitHub Release
create_github_release() {
    echo "📋 准备 GitHub Release..."
    
    VERSION=$(node -p "require('./package.json').version")
    VSIX_FILE=$(ls *.vsix | head -n 1)
    
    echo "版本: v$VERSION"
    echo "文件: $VSIX_FILE"
    echo ""
    echo "请手动创建 GitHub Release："
    echo "1. 访问: https://github.com/Mrxyy/git-intelligence/releases/new"
    echo "2. 标签: v$VERSION"
    echo "3. 标题: Git Intelligence v$VERSION"
    echo "4. 上传文件: $VSIX_FILE"
    echo "5. 发布说明请参考 CHANGELOG.md"
}

# 主函数
main() {
    echo "Git Intelligence 发布脚本 v1.0"
    echo "=========================="
    echo ""
    
    check_dependencies
    build_extension
    validate_extension
    package_extension
    
    echo ""
    echo "🎉 打包完成！"
    echo ""
    
    # 询问是否发布
    read -p "是否要发布到 VS Code Marketplace? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if publish_to_marketplace; then
            echo "🎉 发布成功！"
        else
            echo "⚠️ 发布跳过，请手动发布"
        fi
    fi
    
    create_github_release
    
    echo ""
    echo "🎉 发布流程完成！"
    echo "感谢使用 Git Intelligence！"
}

# 运行主函数
main "$@"
