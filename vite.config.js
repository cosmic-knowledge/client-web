import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => ['ion-icon'].includes(tag),
                },
            },
        }),
        (function filterStdImportsPlugin() {
            /**
             * Inserts file contents into the module tree for specified import paths. This fixes
             * issues on Vite halting when it encounters Deno-specific import paths. Code inspired
             * from alex-kinokon/rollup-plugin-ignore.
             */
            const defaultFileContent = 'export default {}';
            const placeholderFilename = '\0_____rollup_plugin_filter_std_imports_placeholder_____';
            return {
                name: 'filter-std-imports',
                resolveId(source) {
                    if (source?.startsWith('std/')) {
                        return placeholderFilename;
                    }
                    return null;
                },
                load(id) {
                    if (id === placeholderFilename) {
                        return defaultFileContent;
                    }
                    return null;
                },
            };
        })(),
    ],
    server: {
        port: 15801,
        proxy: {
            '^/(api|trpc)': {
                target: 'http://localhost:15800',
            },
        },
    },
    build: {
        target: 'ES2022',
    },
    resolve: {
        alias: {
            '@client': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
