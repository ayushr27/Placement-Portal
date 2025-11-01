const runtimeEnv =
  typeof window !== 'undefined' ? window.__ENV__?.VITE_SERVER : undefined;
const viteEnv = import.meta.env.VITE_SERVER;
export const API_URL = runtimeEnv || viteEnv;
if (!API_URL) {
  throw new Error("❌ Missing VITE_SERVER. Define in .env or inject env-config.js.");
}

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dgsbvayag',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default'
};