import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// 定义所有应用
const apps = ['template', 'test']

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 获取应用名称，支持通过环境变量指定
  const appName = process.env.APP_NAME
  const env = loadEnv(mode, process.cwd())
  const appUrls = {
    template: {
      v1: env.VITE_V1_TEMPLATE_API || '',
      health: env.VITE_HEALTH_TEMPLATE_API || '',
    },
    test: {
      v1: env.VITE_V1_TEST_API || '',
      health: env.VITE_HEALTH_TEST_API || '',
    },
  }
  const v1ApiUrl = appUrls[appName as keyof typeof appUrls].v1
  const healthApiUrl = appUrls[appName as keyof typeof appUrls].health
  // 如果指定了应用名称，只构建该应用
  if (appName && apps.includes(appName)) {
    const appHtmlPath = path.resolve(
      __dirname,
      `src/pages/${appName}/index.html`
    )
    const appRoot = path.resolve(__dirname, `src/pages/${appName}`)
    const srcRoot = path.resolve(__dirname, './src')

    return {
      // 在开发模式下，将 root 设置为应用目录，这样 Vite 只会处理该应用的 HTML
      root: appRoot,
      plugins: [react()],
      resolve: {
        alias: {
          // 保持 @ 指向 src 目录，这样应用代码中的 @/ 别名仍然可以正常工作
          '@': srcRoot,
        },
      },
      optimizeDeps: {
        exclude: ['lucide-react'],
      },
      build: {
        rollupOptions: {
          input: appHtmlPath,
        },
        outDir: path.resolve(__dirname, `dist/${appName}`),
      },
      server: {
        proxy: {
          '/v1': {
            target: v1ApiUrl,
            changeOrigin: true,
          },
          '/health': {
            target: healthApiUrl,
            changeOrigin: true,
          },
        },
      },
    }
  }

  // 统一构建所有应用
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, `/index.html`),
        output: {
          entryFileNames: (chunkInfo) => {
            // 根据入口名称确定输出路径
            const name = chunkInfo.name
            return `assets/${name}-[hash].js`
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      // 使用自定义插件来调整 HTML 输出路径
      outDir: path.resolve(__dirname, 'dist'),
    },
    server: {
      proxy: {
        '/v1': {
          target: v1ApiUrl,
          changeOrigin: true,
        },
        '/health': {
          target: healthApiUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
