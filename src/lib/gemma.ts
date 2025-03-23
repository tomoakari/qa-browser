import { GoogleGenerativeAI } from '@google/generative-ai';

// 環境変数から値を取得（ブラウザとサーバーの両方で動作するように）
const getApiKey = () => {
  // サーバーサイドの場合
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_GOOGLE_AI_API_KEY;
  }
  // クライアントサイドの場合
  return import.meta.env.VITE_GOOGLE_AI_API_KEY;
};

const apiKey = getApiKey();

// 環境変数が設定されていない場合はエラーを表示
if (!apiKey) {
  console.error('Google AI API環境変数が設定されていません。');
  console.error('API_KEY:', apiKey ? '設定済み' : '未設定');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

/**
 * Gemma3モデルを使用して質問に回答する
 * @param question 質問内容
 * @param context コンテキスト情報（Githubから取得したデータなど）
 * @returns 回答内容
 */
export async function generateAnswer(question: string, context: string) {
  try {
    // Gemma3モデルを使用
    const model = genAI.getGenerativeModel({ model: 'gemma-3' });
    
    // プロンプトの作成
    const prompt = `
以下の情報を元に質問に回答してください。

## コンテキスト情報
${context}

## 質問
${question}

## 回答
`;
    
    // 回答の生成
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return { data: text, error: null };
  } catch (error) {
    console.error('Failed to generate answer:', error);
    return { data: null, error };
  }
}
