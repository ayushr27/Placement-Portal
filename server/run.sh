#!/bin/bash -e

python -V

python -m src.worker &

gunicorn -c gunicorn_conf.py