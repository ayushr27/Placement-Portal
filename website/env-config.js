// Resolution order: a runtime value injected into window.__ENV__ (used by the
// Docker/nginx entrypoint) wins, otherwise the build-time Vite variable.
const runtimeEnv =
  typeof window !== 'undefined' ? window.__ENV__?.VITE_SERVER : undefined;
const viteEnv = import.meta.env.VITE_SERVER;

export const API_URL = (runtimeEnv || viteEnv || '').replace(/\/+$/, '');

// Deliberately not `throw`: this module is imported by every page, so throwing
// here aborted the whole bundle and rendered a blank white page with no clue as
// to why. Surface the misconfiguration instead, and let requests fail visibly.
export const API_URL_MISSING = !API_URL;

if (API_URL_MISSING && typeof window !== 'undefined') {
  const message =
    'Missing VITE_SERVER. Set it to your backend URL in the Vercel project ' +
    'settings (or website/.env for local dev) and redeploy.';
  console.error(`[config] ${message}`);
  window.addEventListener('DOMContentLoaded', () => {
    const banner = document.createElement('div');
    banner.setAttribute('role', 'alert');
    banner.style.cssText =
      'position:fixed;top:0;left:0;right:0;z-index:99999;padding:12px 16px;' +
      'background:#b91c1c;color:#fff;font:14px/1.5 system-ui,sans-serif;text-align:center';
    banner.textContent = `Configuration error: ${message}`;
    document.body.prepend(banner);
  });
}

// Cloudinary Configuration.
// No hardcoded fallback: the previous default pointed at another developer's
// Cloudinary account with an unsigned upload preset.
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
};

export const CLOUDINARY_CONFIGURED = Boolean(
  CLOUDINARY_CONFIG.cloudName && CLOUDINARY_CONFIG.uploadPreset,
);
