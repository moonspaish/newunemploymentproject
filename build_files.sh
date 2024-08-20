#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if python3.9 is installed
if ! command -v python3.9 &> /dev/null
then
    echo "Python3.9 could not be found"
    exit 1
fi

# Create and activate virtual environment
python3.9 -m venv venv
source venv/bin/activate

# Upgrade pip to ensure we have the latest version
pip install --upgrade pip

# Install dependencies with increased verbosity
pip install -r requirements.txt --verbose

# Run Django commands
python3.9 manage.py collectstatic --noinput
python3.9 manage.py migrate --noinput