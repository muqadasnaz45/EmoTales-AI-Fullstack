from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import hashlib

from app.database import get_db
from app.models import User
from app.schemas import UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/signup", response_model=UserResponse, status_code=201)
def signup(
    name: str = Form(..., description="Your full name", example="John Doe"),
    email: str = Form(..., description="Your email address", example="john@example.com"),
    password: str = Form(..., description="Your password", example="mypassword123"),
    db: Session = Depends(get_db)
):
    """Register a new user using FORM DATA"""
    email = email.lower()
    
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(
        name=name,
        email=email,
        password=hash_password(password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(
    email: str = Form(..., description="Your email address", example="john@example.com"),
    password: str = Form(..., description="Your password", example="mypassword123"),
    db: Session = Depends(get_db)
):
    """Login with email and password using FORM DATA"""
    email = email.lower()
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}