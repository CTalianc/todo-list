#!/bin/bash

cd backend
pipenv run python manage.py runserver &

cd ../frontend
npm start &

wait
