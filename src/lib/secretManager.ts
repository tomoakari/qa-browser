// クライアントサイドでも安全に使用できるインターフェース
// 実際の実装はサーバーサイドのみで行われる

/**
 * Secret Managerから機密情報を取得する関数のインターフェース
 * 注意: この関数はサーバーサイドでのみ実行される
 */
export async function getSecret(secretName: string, projectId?: string): Promise<string> {
  // クライアントサイドでは空の文字列を返す
  if (typeof window !== 'undefined') {
    console.warn('getSecret関数はクライアントサイドでは使用できません');
    return '';
  }
  
  // サーバーサイドでは実際の実装を使用
  const { getSecret: serverGetSecret } = await import('./server/secretManager');
  return serverGetSecret(secretName, projectId);
}

/**
 * 複数のシークレットを取得する関数のインターフェース
 * 注意: この関数はサーバーサイドでのみ実行される
 */
export async function getSecrets(secretNames: string[], projectId?: string): Promise<Record<string, string>> {
  // クライアントサイドでは空のオブジェクトを返す
  if (typeof window !== 'undefined') {
    console.warn('getSecrets関数はクライアントサイドでは使用できません');
    return {};
  }
  
  // サーバーサイドでは実際の実装を使用
  const { getSecrets: serverGetSecrets } = await import('./server/secretManager');
  return serverGetSecrets(secretNames, projectId);
}

/**
 * 環境変数をSecret Managerから取得して設定する関数のインターフェース
 * 注意: この関数はサーバーサイドでのみ実行される
 */
export async function loadSecretsToEnv(secretNames: string[], projectId?: string): Promise<void> {
  // クライアントサイドでは何もしない
  if (typeof window !== 'undefined') {
    console.warn('loadSecretsToEnv関数はクライアントサイドでは使用できません');
    return;
  }
  
  // サーバーサイドでは実際の実装を使用
  const { loadSecretsToEnv: serverLoadSecretsToEnv } = await import('./server/secretManager');
  return serverLoadSecretsToEnv(secretNames, projectId);
}
