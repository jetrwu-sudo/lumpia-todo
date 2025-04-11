# Lumpia To-Do List

A full-stack To-Do List with a Lumpia-themed React frontend and Django REST API backend.

## API Endpoints
- GET /api/todos/: List all todos
- POST /api/todos/: Create a todo
- GET /api/todos/<id>/: Retrieve a todo
- PATCH /api/todos/<id>/: Update a todo
- DELETE /api/todos/<id>/: Delete a todo

## Setup
### Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`

## Deployment
- Backend: 
https://lumpia-todo.onrender.com
https://lumpia-todo.onrender.com/api/todos/
- Frontend: https://lumpia-todo.vercel.app
