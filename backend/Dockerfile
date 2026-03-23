FROM python:3.10-slim

# System dependencies for PostgreSQL (agar use ho raha hai)
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# FastAPI ko run karne ki command (main.py check kar lijiyega)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]