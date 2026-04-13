from flask import Flask, render_template, request

app = Flask(__name__)

# --- Data Stores (Mocking a Database) ---
study_plan = [
    {'day': 'Monday', 'subject': 'Mathematics', 'time': '09:00 AM', 'duration': '2 hrs', 'type': 'Lecture'},
    {'day': 'Tuesday', 'subject': 'Physics', 'time': '10:00 AM', 'duration': '2 hrs', 'type': 'Lab'},
    {'day': 'Wednesday', 'subject': 'Computer Science', 'time': '02:00 PM', 'duration': '2 hrs', 'type': 'Coding'},
    {'day': 'Thursday', 'subject': 'Literature', 'time': '01:00 PM', 'duration': '2 hrs', 'type': 'Reading'},
    {'day': 'Friday', 'subject': 'Chemistry', 'time': '09:00 AM', 'duration': '2 hrs', 'type': 'Review'}
]

flashcards_data = [
    {'question': 'What is the powerhouse of the cell?', 'answer': 'Mitochondria'},
    {'question': 'What is the time complexity of Binary Search?', 'answer': 'O(log n)'},
    {'question': 'Who wrote "1984"?', 'answer': 'George Orwell'}
]

# --- Routes ---

@app.route('/')
def home():
    # Pass summary stats to the dashboard
    stats = {'total_classes': len(study_plan), 'flashcards': len(flashcards_data)}
    return render_template('index.html', stats=stats)

@app.route('/schedule')
def schedule():
    return render_template('schedule.html', schedule=study_plan)

@app.route('/timer')
def timer():
    return render_template('timer.html')

@app.route('/flashcards')
def flashcards():
    return render_template('flashcards.html', cards=flashcards_data)

@app.route('/tips')
def tips():
    study_tips = [
        {"title": "Pomodoro Technique", "desc": "Study for 25 minutes, then take a 5-minute break.", "icon": "fa-clock"},
        {"title": "Active Recall", "desc": "Test yourself instead of just re-reading notes.", "icon": "fa-brain"},
        {"title": "Stay Hydrated", "desc": "Drink water to keep your brain focused and energized.", "icon": "fa-glass-water"}
    ]
    return render_template('tips.html', tips=study_tips)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        user_name = request.form.get('name')
        return render_template('contact.html', success=True, name=user_name)
    return render_template('contact.html', success=False)

if __name__ == '__main__':
    app.run(debug=True)