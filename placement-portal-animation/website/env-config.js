const runtimeEnv =
  typeof window !== 'undefined' ? window.__ENV__?.VITE_SERVER : undefined;
const viteEnv = import.meta.env.VITE_SERVER;
export const API_URL = runtimeEnv || viteEnv;
if (!API_URL) {
  throw new Error("❌ Missing VITE_SERVER. Define in .env or inject env-config.js.");
}