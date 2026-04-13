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

// Array of motivational quotes
const quotes = [
    "Success is the sum of small efforts, repeated day in and day out.",
    "The secret of getting ahead is getting started.",
    "Don't let what you cannot do interfere with what you can do.",
    "Strive for progress, not perfection."
];
document.getElementById('motivational-quote').textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;

// Load tasks on startup
document.addEventListener('DOMContentLoaded', fetchTasks);

// Form Submit (Create/Update)
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskData = {
        subject: subjectInput.value,
        description: descriptionInput.value,
        date: dateInput.value,
        status: 'pending'
    };
    const editingId = taskIdInput.value;

    if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        showToast('Task updated successfully!', 'success');
        resetForm();
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        showToast('Task added successfully!', 'success');
        taskForm.reset();
    }
    fetchTasks();
});

// Fetch Tasks
async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    renderTasks(tasks);
}

// Render Tasks to DOM
function renderTasks(tasks) {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
        taskList.innerHTML = '<p style="text-align:center; color: var(--text-muted); padding: 2rem;">No tasks yet. Plan your next study session above!</p>';
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
                <button class="btn-ml" onclick="analyzeMood('${task.description}')" title="Use AI to analyze your mood about this task">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Analyze Mood
                </button>
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

// --- Machine Learning Sentiment Feature ---
async function analyzeMood(description) {
    showToast("🧠 AI is analyzing your text...", "info");
    
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: description })
        });
        
        const result = await response.json();
        
        // Change toast color based on sentiment
        let colorType = 'info';
        if (result.sentiment === 'Positive') colorType = 'success';
        if (result.sentiment === 'Negative') colorType = 'danger';
        
        showToast(`Mood: ${result.emoji} ${result.sentiment} (Score: ${result.score.toFixed(2)})`, colorType);
    } catch (error) {
        showToast("Error analyzing sentiment.", "danger");
    }
}

// Delete Task
async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        showToast('Task deleted.', 'info');
        fetchTasks();
    }
}

// Toggle Complete
async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const task = tasks.find(t => t.id === id);
    task.status = newStatus;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    fetchTasks();
}

// Edit Mode
function editTask(id, subject, description, date) {
    taskIdInput.value = id;
    subjectInput.value = subject;
    descriptionInput.value = description;
    dateInput.value = date;
    formTitle.textContent = 'Edit Task';
    submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Update Task';
    cancelBtn.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    taskIdInput.value = '';
    taskForm.reset();
    formTitle.textContent = 'Add New Study Task';
    submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Task';
    cancelBtn.classList.add('hidden');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Dynamic styling based on type
    let icon = 'fa-circle-info';
    let borderColor = 'var(--accent)';
    
    if(type === 'success') { icon = 'fa-check-circle'; borderColor = 'var(--success)'; }
    if(type === 'danger') { icon = 'fa-triangle-exclamation'; borderColor = 'var(--danger)'; }
    
    toast.style.borderLeftColor = borderColor;
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: ${borderColor}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
}