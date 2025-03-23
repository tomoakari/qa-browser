import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// Secret Managerクライアントを初期化
const client = new SecretManagerServiceClient();

/**
 * Secret Managerから機密情報を取得する
 * @param secretName シークレット名
 * @param projectId プロジェクトID（省略可）
 * @returns シークレットの値
 */
export async function getSecret(secretName: string, projectId?: string): Promise<string> {
  try {
    // プロジェクトIDが指定されていない場合は、環境変数から取得
    const project = projectId || process.env.GOOGLE_CLOUD_PROJECT || '';
    
    if (!project) {
      throw new Error('プロジェクトIDが指定されていません。');
    }
    
    // シークレットの最新バージョンへのパスを構築
    const name = `projects/${project}/secrets/${secretName}/versions/latest`;
    
    // シークレットにアクセス
    const [version] = await client.accessSecretVersion({ name });
    
    // シークレットの値を取得
    const payload = version.payload?.data?.toString() || '';
    
    return payload;
  } catch (error) {
    console.error(`シークレット「${secretName}」の取得に失敗しました:`, error);
    throw error;
  }
}

/**
 * 複数のシークレットを取得する
 * @param secretNames シークレット名の配列
 * @param projectId プロジェクトID（省略可）
 * @returns シークレット名と値のマップ
 */
export async function getSecrets(secretNames: string[], projectId?: string): Promise<Record<string, string>> {
  try {
    const secrets: Record<string, string> = {};
    
    // 並列で複数のシークレットを取得
    const results = await Promise.all(
      secretNames.map(name => getSecret(name, projectId).catch(err => {
        console.error(`シークレット「${name}」の取得に失敗しました:`, err);
        return null;
      }))
    );
    
    // 結果をマップに格納
    secretNames.forEach((name, index) => {
      if (results[index] !== null) {
        secrets[name] = results[index] as string;
      }
    });
    
    return secrets;
  } catch (error) {
    console.error('複数のシークレットの取得に失敗しました:', error);
    throw error;
  }
}

/**
 * 環境変数をSecret Managerから取得して設定する
 * @param secretNames 取得するシークレット名の配列
 * @param projectId プロジェクトID（省略可）
 */
export async function loadSecretsToEnv(secretNames: string[], projectId?: string): Promise<void> {
  try {
    const secrets = await getSecrets(secretNames, projectId);
    
    // 取得したシークレットを環境変数に設定
    Object.entries(secrets).forEach(([name, value]) => {
      process.env[name] = value;
    });
    
    console.log(`${Object.keys(secrets).length}個のシークレットを環境変数に設定しました。`);
  } catch (error) {
    console.error('シークレットの環境変数への設定に失敗しました:', error);
    throw error;
  }
}
