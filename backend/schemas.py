from pydantic import BaseModel
from datetime import date


class JobApplicationCreate(BaseModel):
    company: str
    position: str
    status: str = "Applied"
    application_date: date
    salary: int | None = None
    job_url: str | None = None
    notes: str | None = None


class JobApplicationResponse(BaseModel):
    id: int
    company: str
    position: str
    status: str
    application_date: date
    salary: int | None = None
    job_url: str | None = None
    notes: str | None = None

    class Config:
        from_attributes = True