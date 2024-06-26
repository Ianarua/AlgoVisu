import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
// 支持装饰器
import { swcPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin(), swcPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@': resolve('src/renderer/src'),
                '@resources': resolve('./resources')
            }
        },
        plugins: [react()],
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                }
            }
        }
    }
});
