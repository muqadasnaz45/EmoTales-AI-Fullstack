from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Literal

# User Schemas
class UserCreate(BaseModel):
    name: str = Field(
        ..., 
        description="Your full name",
        json_schema_extra={"example": "John Doe"}
    )
    email: EmailStr = Field(
        ..., 
        description="Your email address",
        json_schema_extra={"example": "john@example.com"}
    )
    password: str = Field(
        ..., 
        min_length=4, 
        description="Your password",
        json_schema_extra={"example": "mypassword123"}
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "mypassword123"
            }
        }

class UserLogin(BaseModel):
    email: EmailStr = Field(
        ..., 
        description="Your email address",
        json_schema_extra={"example": "john@example.com"}
    )
    password: str = Field(
        ..., 
        description="Your password",
        json_schema_extra={"example": "mypassword123"}
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com",
                "password": "mypassword123"
            }
        }

class UserResponse(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Story Schemas
class StoryCreate(BaseModel):
    title: str = Field(
        ..., 
        min_length=3, 
        max_length=200, 
        description="Story title",
        json_schema_extra={"example": "The Brave Knight's Quest"}
    )
    category: Literal[
        "adventure", 
        "fantasy", 
        "mystery", 
        "comedy", 
        "horror", 
        "romance", 
        "sci-fi", 
        "fairy-tale"
    ] = Field(
        ..., 
        description="Story category",
        json_schema_extra={"example": "adventure"}
    )
    age_group: Literal["children", "teens", "adults"] = Field(
        ..., 
        description="Target age group",
        json_schema_extra={"example": "children"}
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "The Brave Knight's Quest",
                "category": "adventure",
                "age_group": "children"
            }
        }

class StoryResponse(BaseModel):
    story_id: int
    title: str
    content: str
    category: str
    age_group: str
    created_at: datetime
    
    class Config:
        from_attributes = True