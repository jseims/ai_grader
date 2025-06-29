from flask import Flask, render_template, request, jsonify, session
import os
import anthropic
from typing import Dict, List, Optional
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)

class EssayGrader:
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.getenv('ANTHROPIC_API_KEY')
        )
    
    def analyze_essay(self, rubric: str, examples: List[Dict], essay: str) -> Dict:
        prompt = self._build_prompt(rubric, examples, essay)
        
        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            raw_response = message.content[0].text
            parsed_result = self._parse_response(raw_response)
            
            # Add debug information
            parsed_result["debug"] = {
                "query": prompt,
                "response": raw_response
            }
            
            return parsed_result
        except Exception as e:
            return {"error": f"Analysis failed: {str(e)}"}
    
    def _build_prompt(self, rubric: str, examples: List[Dict], essay: str) -> str:
        prompt = f"""You are an AI essay grader that helps students predict their grades based on their teacher's rubric and grading patterns.

MAIN RUBRIC:
{rubric}

"""
        if examples:
            prompt += "PREVIOUS EXAMPLES:\n"
            for i, example in enumerate(examples, 1):
                prompt += f"Example {i}:\n"
                prompt += f"Grade: {example['grade']}\n"
                if example.get('rubric'):
                    prompt += f"Rubric for this example: {example['rubric']}\n"
                prompt += f"Essay: {example['essay'][:500]}...\n"
                if example.get('feedback'):
                    prompt += f"Teacher Feedback: {example['feedback']}\n"
                prompt += "\n"
        
        prompt += f"""ESSAY TO GRADE:
{essay}

Please provide:
1. PREDICTED GRADE: Give a letter grade (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, F)
2. REASONING: Explain why this grade in 3-4 bullet points
3. CONFIDENCE: High/Medium/Low based on examples provided
4. RUBRIC BREAKDOWN: Grade each rubric criteria separately
5. STRATEGIC ADVICE: 3-4 high-level improvements for biggest impact
6. LINE-BY-LINE FEEDBACK: Specific suggestions for sentences/paragraphs that need work

Format your response as JSON with these keys: grade, reasoning, confidence, breakdown, strategic_advice, line_feedback"""
        
        return prompt
    
    def _parse_response(self, response: str) -> Dict:
        try:
            import json
            if response.strip().startswith('{'):
                return json.loads(response)
            else:
                return {"error": "Invalid response format"}
        except json.JSONDecodeError:
            return {
                "grade": "Unable to parse",
                "reasoning": [response[:200] + "..."],
                "confidence": "Low",
                "breakdown": {},
                "strategic_advice": [response[:200] + "..."],
                "line_feedback": [response[:200] + "..."]
            }

grader = EssayGrader()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    
    rubric = data.get('rubric', '').strip()
    examples = data.get('examples', [])
    essay = data.get('essay', '').strip()
    
    if not rubric:
        return jsonify({"error": "Rubric is required"}), 400
    
    if not essay:
        return jsonify({"error": "Essay is required"}), 400
    
    result = grader.analyze_essay(rubric, examples, essay)
    return jsonify(result)

@app.route('/clear_session', methods=['POST'])
def clear_session():
    session.clear()
    return jsonify({"success": True})

if __name__ == '__main__':
    if not os.getenv('ANTHROPIC_API_KEY'):
        print("Warning: ANTHROPIC_API_KEY environment variable not set")
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=True, host='0.0.0.0', port=port)