from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
import crud

from database import engine, Base, SessionLocal


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Job Application Tracker API is running"
    }


@app.post("/jobs", response_model=schemas.JobApplicationResponse)
def create_job(
    job: schemas.JobApplicationCreate,
    db: Session = Depends(get_db)
):
    return crud.create_job(db, job)


@app.get("/jobs", response_model=list[schemas.JobApplicationResponse])
def get_jobs(db: Session = Depends(get_db)):
    return crud.get_jobs(db)


@app.get("/jobs/{job_id}", response_model=schemas.JobApplicationResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = crud.get_job(db, job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job application not found"
        )

    return job


@app.put("/jobs/{job_id}", response_model=schemas.JobApplicationResponse)
def update_job(
    job_id: int,
    job: schemas.JobApplicationCreate,
    db: Session = Depends(get_db)
):
    updated_job = crud.update_job(db, job_id, job)

    if updated_job is None:
        raise HTTPException(
            status_code=404,
            detail="Job application not found"
        )

    return updated_job


@app.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    deleted_job = crud.delete_job(db, job_id)

    if deleted_job is None:
        raise HTTPException(
            status_code=404,
            detail="Job application not found"
        )

    return {
        "message": "Job application deleted successfully"
    }