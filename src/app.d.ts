// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface ImportMetaEnv {
		PUBLIC_SUPABASE_URL: string;
		PUBLIC_SUPABASE_ANON_KEY: string;
		VITE_GITHUB_TOKEN: string;
		VITE_GITHUB_REPO_OWNER: string;
		VITE_GITHUB_REPO_NAME: string;
		VITE_GOOGLE_AI_API_KEY: string;
	}
}

export {};
