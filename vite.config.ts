import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			// サーバーサイドでのみ使用するモジュールを外部化
			external: [
				'@google-cloud/secret-manager'
			]
		}
	}
});
