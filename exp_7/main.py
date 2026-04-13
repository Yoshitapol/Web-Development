from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field
from typing import List
from textblob import TextBlob

app = FastAPI(title="Smart Study Planner API")

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# --- Pydantic Models ---
class TaskBase(BaseModel):
    subject: str = Field(..., min_length=1, description="Subject of the study task")
    description: str = Field(..., description="Details about the task")
    date: str = Field(..., description="Due date")
    status: str = Field(default="pending", description="Task status: pending or completed")

class Task(TaskBase):
    id: int

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str
    score: float
    emoji: str

# --- In-Memory Database ---
tasks_db = {}
current_id = 1

# --- Routes ---

@app.get("/")
def serve_homepage(request: Request):
    """Serves the main HTML interface."""
    return templates.TemplateResponse(request=request, name="index.html")

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    """Returns all study tasks."""
    return list(tasks_db.values())

@app.post("/tasks", response_model=Task)
def create_task(task_in: TaskBase):
    """Creates a new study task."""
    global current_id
    new_task = Task(id=current_id, **task_in.model_dump())
    tasks_db[current_id] = new_task
    current_id += 1
    return new_task

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_in: TaskBase):
    """Updates an existing task."""
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    updated_task = Task(id=task_id, **task_in.model_dump())
    tasks_db[task_id] = updated_task
    return updated_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    """Deletes a task."""
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    del tasks_db[task_id]
    return {"message": "Task deleted successfully"}

# --- Machine Learning Endpoint ---
@app.post("/analyze", response_model=SentimentResponse)
def analyze_sentiment(request: SentimentRequest):
    """Analyzes the sentiment of the task description using TextBlob."""
    analysis = TextBlob(request.text)
    polarity = analysis.sentiment.polarity
    
    # Determine sentiment category based on polarity score (-1.0 to 1.0)
    if polarity > 0.1:
        return SentimentResponse(sentiment="Positive", score=polarity, emoji="😊")
    elif polarity < -0.1:
        return SentimentResponse(sentiment="Negative", score=polarity, emoji="😟")
    else:
        return SentimentResponse(sentiment="Neutral", score=polarity, emoji="😐")