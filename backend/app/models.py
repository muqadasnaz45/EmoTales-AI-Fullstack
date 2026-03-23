from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    stories = relationship("Story", back_populates="user", cascade="all, delete-orphan")

class Story(Base):
    __tablename__ = "stories"
    
    story_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    age_group = Column(String, nullable=False)
    prompt_type = Column(String, default="text")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="stories")