from flask import Flask, render_template, request, jsonify
import datetime

app = Flask(__name__)

# --- Data Stores (Mocking a Database) ---
study_plan = [
    {'id': 1, 'day': 'Monday', 'subject': 'Mathematics', 'time': '09:00 AM', 'duration': '2 hrs', 'type': 'Lecture'},
    {'id': 2, 'day': 'Monday', 'subject': 'Physics', 'time': '11:30 AM', 'duration': '1.5 hrs', 'type': 'Lab'},
    {'id': 3, 'day': 'Tuesday', 'subject': 'Computer Science', 'time': '10:00 AM', 'duration': '2 hrs', 'type': 'Coding'},
    {'id': 4, 'day': 'Wednesday', 'subject': 'Literature', 'time': '01:00 PM', 'duration': '1 hr', 'type': 'Reading'},
    {'id': 5, 'day': 'Friday', 'subject': 'Chemistry', 'time': '09:00 AM', 'duration': '2 hrs', 'type': 'Review'}
]

flashcards_data = [
    {'question': 'What is the powerhouse of the cell?', 'answer': 'Mitochondria'},
    {'question': 'What is the time complexity of Binary Search?', 'answer': 'O(log n)'},
    {'question': 'Who wrote "1984"?', 'answer': 'George Orwell'}
]

study_tips = [
    {"title": "Pomodoro Technique", "desc": "Study for 25 minutes, then take a 5-minute break.", "icon": "fa-clock"},
    {"title": "Active Recall", "desc": "Test yourself instead of just re-reading notes.", "icon": "fa-brain"},
    {"title": "Stay Hydrated", "desc": "Drink water to keep your brain focused and energized.", "icon": "fa-glass-water"}
]

# ==========================================
# 1. FRONTEND WEB ROUTES 
# ==========================================

@app.route('/')
def home():
    # Mocking today as 'Monday' for demonstration purposes
    todays_classes = [s for s in study_plan if s['day'] == 'Monday']
    stats = {'total_classes': len(study_plan), 'flashcards': len(flashcards_data)}
    return render_template('index.html', stats=stats, todays_classes=todays_classes)

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
    return render_template('tips.html', tips=study_tips)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        user_name = request.form.get('name')
        return render_template('contact.html', success=True, name=user_name)
    return render_template('contact.html', success=False)


# ==========================================
# 2. RESTful API ROUTES 
# ==========================================

@app.route('/api/schedule', methods=['GET'])
def get_schedule_api():
    return jsonify({'status': 'success', 'count': len(study_plan), 'data': study_plan})

@app.route('/api/flashcards', methods=['GET'])
def get_flashcards_api():
    return jsonify({'status': 'success', 'count': len(flashcards_data), 'data': flashcards_data})

@app.route('/api/tips', methods=['GET'])
def get_tips_api():
    return jsonify({'status': 'success', 'count': len(study_tips), 'data': study_tips})

@app.route('/api/flashcards', methods=['POST'])
def add_flashcard_api():
    new_data = request.get_json()
    if not new_data or 'question' not in new_data or 'answer' not in new_data:
        return jsonify({'status': 'error', 'message': 'Missing question or answer'}), 400
    
    new_card = {'question': new_data['question'], 'answer': new_data['answer']}
    flashcards_data.append(new_card)
    return jsonify({'status': 'success', 'message': 'Flashcard added successfully!', 'data': new_card}), 201

if __name__ == '__main__':
    app.run(debug=True)