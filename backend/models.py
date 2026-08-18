from sqlalchemy import Column, Integer, String, Date, Text
from database import Base


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(100), nullable=False)
    position = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default="Applied")
    application_date = Column(Date, nullable=False)
    salary = Column(Integer, nullable=True)
    job_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)