from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field
from typing import List
import os

app = FastAPI(title="Student Study Planner API")

# 🔥 Get absolute base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Correct static & template paths
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# --- Pydantic Models ---
class TaskBase(BaseModel):
    subject: str = Field(..., min_length=1, description="Subject of the study task")
    description: str = Field(..., description="Details about the task")
    date: str = Field(..., description="Due date")
    status: str = Field(default="pending", description="Task status")

class Task(TaskBase):
    id: int

# --- In-Memory Database ---
tasks_db = {}
current_id = 1

# --- Routes ---

@app.get("/")
def serve_homepage(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return list(tasks_db.values())

@app.post("/tasks", response_model=Task)
def create_task(task_in: TaskBase):
    global current_id
    new_task = Task(id=current_id, **task_in.model_dump())
    tasks_db[current_id] = new_task
    current_id += 1
    return new_task

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, task_in: TaskBase):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")

    updated_task = Task(id=task_id, **task_in.model_dump())
    tasks_db[task_id] = updated_task
    return updated_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")

    del tasks_db[task_id]
    return {"message": "Task deleted successfully"}