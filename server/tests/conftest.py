"""
Test environment bootstrap.

src.config intentionally has no defaults for the required settings, so importing
the app without them raises. pytest loads conftest before collecting test
modules, which makes this the right place to supply throwaway values.
"""

import os
import secrets

# setdefault so a caller can still override any of these.
os.environ.setdefault("MONGODB_URL", "mongodb://localhost:27017")
os.environ.setdefault("DATABASE_NAME", "testdb")
os.environ.setdefault("JWT_HASH_KEY", secrets.token_hex(32))
# Skip the local logs/ directory and file handler during tests.
os.environ.setdefault("VERCEL", "1")
