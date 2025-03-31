from flask import Flask, jsonify, request, render_template
from models import init_db, add_high_score, get_high_scores

app = Flask(__name__)

# Initialize database
init_db()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/highscore', methods=['GET', 'POST'])
def highscore():
    if request.method == 'POST':
        data = request.json
        name = data.get('name')
        score = data.get('score')
        if name and score:
            add_high_score(name, score)
            return jsonify({'status': 'success', 'high_scores': get_high_scores()})
    return jsonify({'high_scores': get_high_scores()})

if __name__ == '__main__':
    app.run(debug=True)
