#!/bin/bash
echo "Starting service"
docker-compose -f docker-compose-dev.yml up -d --build

echo "Recreating users database"
docker-compose -f docker-compose-dev.yml run users python manage.py recreate-db
echo "Seeding users database"
docker-compose -f docker-compose-dev.yml run users python manage.py seed-db

echo "Recreating scores database"
docker-compose -f docker-compose-dev.yml run scores python manage.py recreate-db
echo "Loading stops"
docker-compose -f docker-compose-dev.yml run scores python manage.py load-stops
echo "Seeding stops"
docker-compose -f docker-compose-dev.yml run scores python manage.py seed-stops
echo "Seeding vehicles"
docker-compose -f docker-compose-dev.yml run scores python manage.py seed-vehicles

echo "Service started"
