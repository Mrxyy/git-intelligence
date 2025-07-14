import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'node16',
    lib: {
      entry: resolve(__dirname, 'src/extension.ts'),
      name: 'extension',
      fileName: 'extension',
      formats: ['cjs']
    },
    rollupOptions: {
      external: (id) => {
        // 只外部化 vscode 和 Node.js 内置模块
        if (id === 'vscode') return true;
        
        // Node.js 内置模块
        const builtins = [
          'child_process', 'util', 'fs', 'path', 'os', 'crypto',
          'stream', 'events', 'buffer', 'url', 'querystring',
          'http', 'https', 'net', 'tls', 'zlib', 'assert',
          'constants', 'module', 'process', 'timers'
        ];
        
        return builtins.includes(id);
      },
      output: {
        dir: 'out',
        entryFileNames: 'extension.js',
        format: 'cjs',
        exports: 'named',
        interop: 'auto'
      }
    },
    sourcemap: true,
    minify: false,
    outDir: 'out'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  define: {
    global: 'globalThis'
  },
  // 确保不会自动外部化 node_modules 中的包
  ssr: {
    noExternal: true
  }
});
