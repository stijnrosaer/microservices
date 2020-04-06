#!/bin/sh

echo "Waiting for postgres scores..."

while ! nc -z scores-db 5433; do
  sleep 0.1
done

echo "PostgreSQL scores started"

python manage.py run -h 0.0.0.0