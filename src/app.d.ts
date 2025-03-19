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
		GITHUB_TOKEN: string;
		GITHUB_REPO_OWNER: string;
		GITHUB_REPO_NAME: string;
		GOOGLE_AI_API_KEY: string;
	}
}

export {};
