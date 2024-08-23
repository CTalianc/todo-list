#!/bin/bash

cd backend
pipenv shell
python manage.py runserver &

cd ../frontend
npm start &

wait
