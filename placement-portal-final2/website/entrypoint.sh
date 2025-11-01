#!/bin/sh
set -e
cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  VITE_SERVER: "${VITE_SERVER}"
};
EOF
nginx -g 'daemon off;'