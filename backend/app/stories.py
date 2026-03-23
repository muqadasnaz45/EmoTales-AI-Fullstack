from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List, Literal
from groq import Groq
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import get_db
from app.models import User, Story
from app.schemas import StoryResponse
from app.auth import get_current_user

try:
    from app.utils.ai_prompts import get_story_prompt
except ImportError:
    def get_story_prompt(title: str, category: str, age_group: str) -> str:
        return f'Write a {category} story for {age_group} about: "{title}". Make it engaging and age-appropriate (400-600 words).'

router = APIRouter(prefix="/story", tags=["Stories"])

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def format_story_content(content: str) -> str:
    """
    Format story content by properly handling newlines and paragraphs
    """
    # Replace escaped newlines with actual newlines
    content = content.replace('\\n', '\n')
    
    # Split into paragraphs
    paragraphs = content.split('\n')
    
    # Clean up each paragraph (remove extra whitespace)
    paragraphs = [p.strip() for p in paragraphs if p.strip()]
    
    # Join with double newlines for proper paragraph separation
    formatted_content = '\n\n'.join(paragraphs)
    
    return formatted_content

def generate_story_with_groq(title: str, category: str, age_group: str) -> str:
    """Generate story using Groq API with predefined prompts"""
    prompt = get_story_prompt(title, category, age_group)
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system", 
                    "content": "You are a creative and skilled storyteller who writes engaging, age-appropriate stories. Write stories with clear paragraphs separated by blank lines."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.8,
            max_tokens=1500,
            top_p=0.9,
        )
        
        # Get the raw content
        raw_content = chat_completion.choices[0].message.content
        
        # Format the content properly
        formatted_content = format_story_content(raw_content)
        
        return formatted_content
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Story generation failed: {str(e)}")

@router.post("/text", response_model=StoryResponse, status_code=201)
async def create_text_story(
    title: str = Form(..., description="Story title", example="The Brave Knight's Quest"),
    category: Literal["adventure", "fantasy", "mystery", "comedy", "horror", "romance", "sci-fi", "fairy-tale"] = Form(..., description="Story category"),
    age_group: Literal["children", "teens", "adults"] = Form(..., description="Target age group"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a story from title, category, and age group using FORM DATA"""
    # Generate story using predefined prompts
    generated_content = generate_story_with_groq(title, category, age_group)
    
    # Save to database
    db_story = Story(
        user_id=current_user.user_id,
        title=title,
        content=generated_content,
        category=category,
        age_group=age_group,
        prompt_type="text"
    )
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

@router.get("", response_model=List[StoryResponse])
def get_all_stories(
    category: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all stories for current user"""
    query = db.query(Story).filter(Story.user_id == current_user.user_id)
    if category:
        query = query.filter(Story.category == category)
    return query.order_by(Story.created_at.desc()).all()

@router.get("/{story_id}", response_model=StoryResponse)
def get_story(
    story_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific story by ID"""
    story = db.query(Story).filter(
        Story.story_id == story_id,
        Story.user_id == current_user.user_id
    ).first()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

@router.delete("/{story_id}", status_code=204)
def delete_story(
    story_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a story"""
    story = db.query(Story).filter(
        Story.story_id == story_id,
        Story.user_id == current_user.user_id
    ).first()
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    db.delete(story)
    db.commit()
    return None