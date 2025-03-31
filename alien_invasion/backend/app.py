from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

# In-memory high score list
high_scores = []

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
            high_scores.append({'name': name, 'score': score})
            high_scores.sort(key=lambda x: x['score'], reverse=True)
            return jsonify({'status': 'success', 'high_scores': high_scores[:10]})
    return jsonify({'high_scores': high_scores[:10]})

if __name__ == '__main__':
    app.run(debug=True)
