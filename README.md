# Essay Grade Predictor

testing...

A web application that helps high school students predict their essay grades and receive improvement suggestions based on their teacher's rubric and previous graded examples.

## Features

- **Grade Prediction**: AI-powered grade prediction based on teacher's rubric
- **Strategic Advice**: High-level improvement recommendations
- **Line-by-Line Feedback**: Specific suggestions for sentences and paragraphs
- **Example Learning**: Improves accuracy by learning from previous graded essays
- **Session Management**: Data persists within browser session, easy to start fresh

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Anthropic API key
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

## Usage

1. **Enter Teacher's Rubric**: Input your teacher's grading criteria (required)
2. **Add Examples** (optional): Include previous essays with grades to improve accuracy
3. **Submit Essay**: Paste your essay and click "Analyze Essay"
4. **Review Results**: Get grade prediction, strategic advice, and line-by-line feedback
5. **Iterate**: Revise your essay based on feedback and resubmit

## API Key Setup

You'll need an Anthropic API key to use this application:

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Generate an API key
4. Add it to your `.env` file

## File Structure

```
essay-grader/
├── app.py                 # Flask application
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Styling
│   └── js/
│       └── app.js        # Frontend JavaScript
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Development

The application uses:
- **Backend**: Python Flask
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **AI**: Anthropic Claude API
- **Storage**: Browser session storage (no database required)

## Security Notes

- Never commit your `.env` file containing API keys
- The application doesn't store personal data server-side
- All data is cleared when starting a new session
