const API_URL = '/tasks';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const subjectInput = document.getElementById('subject');
const descriptionInput = document.getElementById('description');
const dateInput = document.getElementById('date');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const taskList = document.getElementById('task-list');

// Load tasks on startup
document.addEventListener('DOMContentLoaded', fetchTasks);

// Handle Form Submission (Add or Update)
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taskData = {
        subject: subjectInput.value,
        description: descriptionInput.value,
        date: dateInput.value,
        status: 'pending' // Default status
    };

    const editingId = taskIdInput.value;

    if (editingId) {
        // UPDATE Existing Task
        await fetch(`${API_URL}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        showToast('Task updated successfully!');
        resetForm();
    } else {
        // ADD New Task
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        showToast('Task added successfully!');
        taskForm.reset();
    }
    
    fetchTasks();
});

// Fetch all tasks from FastAPI
async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
}

// Render tasks to the DOM
function renderTasks(tasks) {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 2rem;">No tasks yet. Add one above!</p>';
        return;
    }

    tasks.forEach(task => {
        const isCompleted = task.status === 'completed';
        const card = document.createElement('div');
        card.className = `task-card ${isCompleted ? 'completed' : ''}`;
        
        card.innerHTML = `
            <div class="task-info">
                <h3 class="task-title">${task.subject}</h3>
                <p class="task-desc">${task.description}</p>
                <span class="task-date"><i class="fa-regular fa-calendar"></i> ${task.date}</span>
            </div>
            <div class="task-actions">
                <button class="icon-btn complete" onclick="toggleStatus(${task.id}, '${task.status}')" title="${isCompleted ? 'Mark Pending' : 'Mark Complete'}">
                    <i class="fa-solid ${isCompleted ? 'fa-rotate-left' : 'fa-check'}"></i>
                </button>
                <button class="icon-btn edit" onclick="editTask(${task.id}, '${task.subject}', '${task.description}', '${task.date}')" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="icon-btn delete" onclick="deleteTask(${task.id})" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(card);
    });
}

// Delete Task
async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        showToast('Task deleted.');
        fetchTasks();
    }
}

// Toggle Complete/Pending Status
async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    
    // We need to fetch the existing task first to send all required Pydantic fields
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const task = tasks.find(t => t.id === id);

    task.status = newStatus;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    
    showToast(`Task marked as ${newStatus}.`);
    fetchTasks();
}

// Populate Form for Editing
function editTask(id, subject, description, date) {
    taskIdInput.value = id;
    subjectInput.value = subject;
    descriptionInput.value = description;
    dateInput.value = date;

    formTitle.textContent = 'Edit Task';
    submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update Task';
    cancelBtn.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cancel Edit Mode
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    taskIdInput.value = '';
    taskForm.reset();
    formTitle.textContent = 'Add New Task';
    submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Task';
    cancelBtn.classList.add('hidden');
}

// Toast Notification System
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
    
    container.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}