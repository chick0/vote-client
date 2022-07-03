import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { execSync } from "child_process";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "src/variables.scss" as *;',
            },
        },
    },

    define: {
        GIT_HASH: JSON.stringify(
            execSync("git rev-parse HEAD").toString().trim()
        ),
        GIT_REMOTE: JSON.stringify(
            execSync("git remote get-url origin").toString().trim()
        ),

        APP_VERSION: JSON.stringify(process.env.npm_package_version),

        STATUS_URL: JSON.stringify("https://status.ch1ck.xyz"),
    },
});
