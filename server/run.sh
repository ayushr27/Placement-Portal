#!/bin/bash -e

python -V

gunicorn -c gunicorn_conf.py