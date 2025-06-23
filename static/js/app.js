class EssayGraderApp {
    constructor() {
        this.examples = [];
        this.exampleCounter = 0;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.updateAnalyzeButton();
    }

    bindEvents() {
        document.getElementById('newSessionBtn').addEventListener('click', () => {
            this.clearSession();
        });

        document.getElementById('addExampleBtn').addEventListener('click', () => {
            this.addExample();
        });

        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeEssay();
        });

        document.getElementById('rubricInput').addEventListener('input', () => {
            this.saveToStorage();
            this.updateAnalyzeButton();
        });

        document.getElementById('essayInput').addEventListener('input', () => {
            this.saveToStorage();
            this.updateAnalyzeButton();
        });
    }

    toggleCard(cardId) {
        const card = document.getElementById(cardId);
        card.classList.toggle('collapsed');
    }

    addExample() {
        this.exampleCounter++;
        const exampleId = `example-${this.exampleCounter}`;
        
        const exampleHtml = `
            <div class="example-item" id="${exampleId}">
                <div class="example-header">
                    <span class="example-number">Example ${this.exampleCounter}</span>
                    <button type="button" class="remove-example" onclick="app.removeExample('${exampleId}')">Remove</button>
                </div>
                <div class="example-fields">
                    <div class="field-group">
                        <label>Grade Received:</label>
                        <input type="text" class="example-grade" placeholder="e.g., B+" data-example-id="${exampleId}">
                    </div>
                    <div class="field-group">
                        <label>Teacher Feedback:</label>
                        <textarea class="example-feedback" placeholder="Optional: Teacher's comments..." data-example-id="${exampleId}"></textarea>
                    </div>
                </div>
                <div class="field-group">
                    <label>Rubric for this Example (Optional):</label>
                    <textarea class="example-rubric" rows="3" placeholder="Enter the specific rubric used for this example if different from main rubric..." data-example-id="${exampleId}"></textarea>
                </div>
                <div class="field-group">
                    <label>Essay Text:</label>
                    <textarea class="example-essay" rows="4" placeholder="Paste the essay text here..." data-example-id="${exampleId}"></textarea>
                </div>
            </div>
        `;

        document.getElementById('examplesList').insertAdjacentHTML('beforeend', exampleHtml);

        const gradeInput = document.querySelector(`[data-example-id="${exampleId}"].example-grade`);
        const feedbackInput = document.querySelector(`[data-example-id="${exampleId}"].example-feedback`);
        const rubricInput = document.querySelector(`[data-example-id="${exampleId}"].example-rubric`);
        const essayInput = document.querySelector(`[data-example-id="${exampleId}"].example-essay`);

        [gradeInput, feedbackInput, rubricInput, essayInput].forEach(input => {
            input.addEventListener('input', () => {
                this.saveToStorage();
            });
        });
    }

    removeExample(exampleId) {
        const element = document.getElementById(exampleId);
        if (element) {
            element.remove();
            this.saveToStorage();
        }
    }

    getExamplesData() {
        const examples = [];
        const exampleItems = document.querySelectorAll('.example-item');
        
        exampleItems.forEach(item => {
            const exampleId = item.id.split('-')[1];
            const grade = document.querySelector(`[data-example-id="${item.id}"].example-grade`).value.trim();
            const feedback = document.querySelector(`[data-example-id="${item.id}"].example-feedback`).value.trim();
            const rubric = document.querySelector(`[data-example-id="${item.id}"].example-rubric`).value.trim();
            const essay = document.querySelector(`[data-example-id="${item.id}"].example-essay`).value.trim();
            
            if (grade && essay) {
                examples.push({
                    grade: grade,
                    feedback: feedback,
                    rubric: rubric,
                    essay: essay
                });
            }
        });
        
        return examples;
    }

    updateAnalyzeButton() {
        const rubric = document.getElementById('rubricInput').value.trim();
        const essay = document.getElementById('essayInput').value.trim();
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        analyzeBtn.disabled = !rubric || !essay;
    }

    async analyzeEssay() {
        const rubric = document.getElementById('rubricInput').value.trim();
        const essay = document.getElementById('essayInput').value.trim();
        const examples = this.getExamplesData();

        if (!rubric || !essay) {
            this.showError('Please provide both a rubric and an essay.');
            return;
        }

        // Disable button and show loading state
        const analyzeBtn = document.getElementById('analyzeBtn');
        const originalText = analyzeBtn.textContent;
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analyzing...';
        
        this.showLoading(true);
        this.hideError();
        this.hideResults();
        this.hideDebugInfo();

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rubric: rubric,
                    examples: examples,
                    essay: essay
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Analysis failed');
            }

            if (result.error) {
                throw new Error(result.error);
            }

            this.displayResults(result);
            this.collapseInputSections();
        } catch (error) {
            this.showError(`Analysis failed: ${error.message}`);
        } finally {
            this.showLoading(false);
            // Re-enable button
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = originalText;
        }
    }

    displayResults(result) {
        this.displayGradePrediction(result);
        this.displayStrategicAdvice(result.strategic_advice || []);
        this.displayLineFeedback(result.line_feedback || []);
        this.displayDebugInfo(result.debug);
        this.showResults();
    }

    displayGradePrediction(result) {
        const container = document.getElementById('gradePrediction');
        const reasoning = Array.isArray(result.reasoning) ? result.reasoning : [result.reasoning];
        const breakdown = result.breakdown || {};
        
        const confidenceClass = `confidence-${(result.confidence || 'low').toLowerCase()}`;
        
        let breakdownHtml = '';
        if (Object.keys(breakdown).length > 0) {
            breakdownHtml = `
                <div class="rubric-breakdown">
                    <h4>Breakdown by rubric criteria:</h4>
                    ${Object.entries(breakdown).map(([criterion, grade]) => `
                        <div class="breakdown-item">
                            <span class="criterion-name">${criterion}:</span>
                            <span class="criterion-grade">${grade}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        container.innerHTML = `
            <div class="predicted-grade">${result.grade || 'N/A'}</div>
            <div class="grade-reasoning">
                <h4>Why this grade:</h4>
                <ul>
                    ${reasoning.map(reason => `<li>${reason}</li>`).join('')}
                </ul>
            </div>
            <div class="confidence-level ${confidenceClass}">
                Confidence: ${result.confidence || 'Low'}
            </div>
            ${breakdownHtml}
        `;
    }

    displayStrategicAdvice(advice) {
        const container = document.getElementById('strategicAdvice');
        let adviceArray = [];
        
        if (Array.isArray(advice)) {
            adviceArray = advice.filter(item => item && typeof item === 'string');
        } else if (advice && typeof advice === 'string') {
            adviceArray = [advice];
        } else if (advice && typeof advice === 'object') {
            // Handle object format with possible arrays
            adviceArray = Object.entries(advice).flatMap(([key, value]) => {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                if (Array.isArray(value)) {
                    // Handle array values
                    return [`${formattedKey}:`, ...value.map(item => `  • ${item}`)];
                } else {
                    // Handle string values
                    return [`${formattedKey}: ${value}`];
                }
            });
        } else {
            adviceArray = ['No strategic advice available'];
        }
        
        if (adviceArray.length === 0) {
            adviceArray = ['No strategic advice available'];
        }
        
        container.innerHTML = `
            <ul class="advice-list">
                ${adviceArray.map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
            </ul>
        `;
    }

    displayLineFeedback(feedback) {
        const container = document.getElementById('lineFeedback');
        let feedbackArray = [];
        
        if (Array.isArray(feedback)) {
            feedbackArray = feedback.filter(item => item && typeof item === 'string');
        } else if (feedback && typeof feedback === 'string') {
            feedbackArray = [feedback];
        } else if (feedback && typeof feedback === 'object') {
            // Handle object format like {"paragraph_1": "feedback text", "mechanics": ["item1", "item2"], ...}
            feedbackArray = Object.entries(feedback).flatMap(([key, value]) => {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                if (Array.isArray(value)) {
                    // Handle array values like mechanics: ["item1", "item2"]
                    return [`${formattedKey}:`, ...value.map(item => `  • ${item}`)];
                } else {
                    // Handle string values
                    return [`${formattedKey}: ${value}`];
                }
            });
        } else {
            feedbackArray = ['No line-by-line feedback available'];
        }
        
        if (feedbackArray.length === 0) {
            feedbackArray = ['No line-by-line feedback available'];
        }
        
        container.innerHTML = `
            <ul class="feedback-list">
                ${feedbackArray.map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
            </ul>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    displayDebugInfo(debug) {
        if (!debug) {
            this.hideDebugInfo();
            return;
        }

        const queryElement = document.getElementById('debugQuery');
        const responseElement = document.getElementById('debugResponse');
        
        queryElement.textContent = debug.query || 'No query data available';
        responseElement.textContent = debug.response || 'No response data available';
        
        this.showDebugInfo();
    }

    showDebugInfo() {
        document.getElementById('debugSection').style.display = 'block';
    }

    hideDebugInfo() {
        document.getElementById('debugSection').style.display = 'none';
    }

    collapseInputSections() {
        const rubricCard = document.getElementById('rubricCard');
        const examplesCard = document.getElementById('examplesCard');
        
        if (!rubricCard.classList.contains('collapsed')) {
            rubricCard.classList.add('collapsed');
        }
        if (!examplesCard.classList.contains('collapsed')) {
            examplesCard.classList.add('collapsed');
        }
    }

    showResults() {
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    hideResults() {
        document.getElementById('resultsSection').style.display = 'none';
    }

    showLoading(show) {
        document.getElementById('loadingState').style.display = show ? 'block' : 'none';
    }

    showError(message) {
        const errorEl = document.getElementById('errorMessage');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    saveToStorage() {
        const data = {
            rubric: document.getElementById('rubricInput').value,
            essay: document.getElementById('essayInput').value,
            examples: this.getExamplesData(),
            exampleCounter: this.exampleCounter
        };
        
        sessionStorage.setItem('essayGraderData', JSON.stringify(data));
    }

    loadFromStorage() {
        const stored = sessionStorage.getItem('essayGraderData');
        if (!stored) return;

        try {
            const data = JSON.parse(stored);
            
            if (data.rubric) {
                document.getElementById('rubricInput').value = data.rubric;
            }
            
            if (data.essay) {
                document.getElementById('essayInput').value = data.essay;
            }
            
            if (data.exampleCounter) {
                this.exampleCounter = data.exampleCounter;
            }

            if (data.examples && Array.isArray(data.examples)) {
                data.examples.forEach(example => {
                    this.addExample();
                    const currentId = `example-${this.exampleCounter}`;
                    document.querySelector(`[data-example-id="${currentId}"].example-grade`).value = example.grade || '';
                    document.querySelector(`[data-example-id="${currentId}"].example-feedback`).value = example.feedback || '';
                    document.querySelector(`[data-example-id="${currentId}"].example-rubric`).value = example.rubric || '';
                    document.querySelector(`[data-example-id="${currentId}"].example-essay`).value = example.essay || '';
                });
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    async clearSession() {
        if (confirm('Are you sure you want to start a new session? This will clear all your data.')) {
            sessionStorage.removeItem('essayGraderData');
            
            try {
                await fetch('/clear_session', { method: 'POST' });
            } catch (error) {
                console.error('Error clearing server session:', error);
            }
            
            location.reload();
        }
    }
}

function toggleCard(cardId) {
    const card = document.getElementById(cardId);
    card.classList.toggle('collapsed');
}

const app = new EssayGraderApp();

window.app = app;