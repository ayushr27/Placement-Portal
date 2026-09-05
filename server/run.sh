#!/bin/bash -e

python -V

# `python -m src.worker &` used to run here, but src/worker.py does not exist.
# Because it was backgrounded, `set -e` did not catch the failure: the container
# started normally and only logged "No module named src.worker". Background
# email sending is handled by FastAPI BackgroundTasks inside the app, so there
# is no separate worker process to start.

gunicorn -c gunicorn_conf.py
