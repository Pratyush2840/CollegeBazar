import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

let llm = null;
let embeddings = null;

if (process.env.GOOGLE_API_KEY) {
  llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'gemini-2.0-flash',
    temperature: 0.4,
  });

  embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'text-embedding-004',
  });
} else {
  console.warn('GOOGLE_API_KEY not set — GenAI endpoints will return 503 until it is configured.');
}

export { llm, embeddings };
