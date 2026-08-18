# Job Application Tracker

A full-stack web application that helps users manage and track their job applications in one place.

The application allows users to store important job information such as company name, job position, application status, application date, expected salary, job URL, and notes.

## Features

- Add new job applications
- View all job applications
- Track application status
- Store application date
- Store expected salary
- Save job posting URL
- Add notes for each application
- REST API using FastAPI
- MySQL database integration
- React-based frontend
- Axios API integration
- CORS configuration for frontend-backend communication
- SQLAlchemy ORM for database operations
- Pydantic validation for API data

## Tech Stack

### Frontend

- React.js
- JavaScript
- Axios
- Bootstrap
- HTML5
- CSS3

### Backend

- Python
- FastAPI
- Pydantic
- SQLAlchemy

### Database

- MySQL

### Tools

- Git
- GitHub
- VS Code
- Postman

## Project Architecture

```text
React Frontend
      |
      | Axios / HTTP Requests
      ↓
FastAPI Backend
      |
      | Pydantic Validation
      ↓
CRUD Layer
      |
      | SQLAlchemy ORM
      ↓
MySQL Database
