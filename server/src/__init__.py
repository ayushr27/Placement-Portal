import os
import sys
import logging


logger = logging.getLogger("placementlogger")

logging_str = "[%(asctime)s: %(levelname)s: %(module)s: %(message)s]"

handlers = [logging.StreamHandler(sys.stdout)]

# Serverless filesystems are read-only apart from /tmp, so creating a logs/
# directory at import time crashes the whole app on boot. Log to stdout there
# (the platform captures it) and keep file logging for local development.
if not os.environ.get("VERCEL"):
    try:
        log_dir = "logs"
        os.makedirs(log_dir, exist_ok=True)
        handlers.append(logging.FileHandler(os.path.join(log_dir, "logging.log")))
    except OSError:
        # Read-only or otherwise unwritable: stdout logging is enough.
        pass

logging.basicConfig(
    level=logging.INFO,
    format=logging_str,
    handlers=handlers,
)
logger.setLevel(logging.INFO)
