from sqlalchemy.orm import Session
from models import JobApplication
from schemas import JobApplicationCreate


def create_job(db: Session, job: JobApplicationCreate):
    new_job = JobApplication(
        company=job.company,
        position=job.position,
        status=job.status,
        application_date=job.application_date,
        salary=job.salary,
        job_url=job.job_url,
        notes=job.notes
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


def get_jobs(db: Session):
    return db.query(JobApplication).all()


def get_job(db: Session, job_id: int):
    return db.query(JobApplication).filter(
        JobApplication.id == job_id
    ).first()


def update_job(
    db: Session,
    job_id: int,
    job: JobApplicationCreate
):
    existing_job = db.query(JobApplication).filter(
        JobApplication.id == job_id
    ).first()

    if existing_job is None:
        return None

    existing_job.company = job.company
    existing_job.position = job.position
    existing_job.status = job.status
    existing_job.application_date = job.application_date
    existing_job.salary = job.salary
    existing_job.job_url = job.job_url
    existing_job.notes = job.notes

    db.commit()
    db.refresh(existing_job)

    return existing_job


def delete_job(db: Session, job_id: int):
    existing_job = db.query(JobApplication).filter(
        JobApplication.id == job_id
    ).first()

    if existing_job is None:
        return None

    db.delete(existing_job)
    db.commit()

    return existing_job