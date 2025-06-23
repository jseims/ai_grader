# Essay Grade Predictor - Product Requirements Document

## Executive Summary

A web application that helps high school students predict their essay grades and receive improvement suggestions based on their teacher's rubric and previous graded examples. The app uses AI to analyze essays and provide both strategic advice and line-by-line feedback.

## Product Overview

### Vision
Enable high school students to improve their essay writing by providing AI-powered grade predictions and actionable feedback based on their specific teacher's grading criteria.

### Target Users
- Primary: High school students writing essays or research papers
- Use case: Individual students seeking to improve their grades before submission

### Core Value Proposition
- Predict grades before submission
- Provide specific improvement suggestions
- Learn from teacher's actual grading patterns
- Allow iterative improvement through resubmission

## Functional Requirements

### 1. Session Management
- **New Session**: Clear all data button to start fresh
- **Session Persistence**: Data persists within browser session only
- **No Authentication**: No user accounts required

### 2. Input Management

#### 2.1 Rubric Input
- Text area for entering teacher's grading rubric
- Accepts plain text format
- Stored for the duration of the session
- Required before essay analysis

#### 2.2 Example Submissions (Optional)
- Add previous essay examples with:
  - Essay text (plain text)
  - Grade received (letter grade)
  - Teacher's general feedback comments
- Support multiple examples (0 to many)
- Examples improve prediction accuracy

#### 2.3 Essay Submission
- Large text area for student's current essay
- Plain text input only
- Submit button to trigger analysis
- Ability to edit and resubmit

### 3. Analysis & Output

#### 3.1 Grade Prediction
Display format:
```
Predicted Grade: B+

Why this grade:
- Strong thesis but needs more evidence
- Good paragraph structure
- Some grammatical errors affecting clarity

Confidence: High (based on 3 previous examples)

Breakdown by rubric criteria:
- Thesis Statement: A-
- Evidence & Support: B
- Organization: B+
- Grammar & Style: B
```

#### 3.2 Improvement Suggestions

**Strategic Advice Section:**
- High-level recommendations
- Prioritized list of most impactful improvements
- Specific to rubric requirements

**Line-by-Line Feedback Section:**
- Specific suggestions for sentences/paragraphs
- Grammar and style corrections
- Content improvement recommendations
- Clear indication of which parts need work

### 4. User Interface

#### 4.1 Layout
- Single-page application
- Chat-like interface similar to Claude
- Student input at top, AI response below
- Clean, simple design without visual clutter

#### 4.2 Flow
1. Header with app title and "New Session" button
2. Rubric input section (collapsible after entry)
3. Optional examples section (collapsible)
4. Essay input area with submit button
5. Results display area showing:
   - Predicted grade box
   - Strategic advice section
   - Line-by-line feedback section

#### 4.3 Design Principles
- Minimal, distraction-free interface
- Clear typography for readability
- Desktop-first (optimized for laptop/desktop screens)
- Sufficient spacing between sections
- Clear visual hierarchy

## Technical Requirements

### Frontend
- Single-page application (SPA)
- HTML/CSS/JavaScript
- Responsive for desktop screens
- Browser session storage for data persistence
- No external dependencies required

### AI Integration
- Use Claude API for analysis
- Send rubric, examples, and essay for analysis
- Process response into structured feedback

### Data Flow
1. All data stored in browser session storage
2. No server-side storage required
3. Data cleared on "New Session" or browser close
4. No personal data collection

## User Stories

### Story 1: First-Time User
As a student, I want to input my teacher's rubric and my essay draft so that I can see what grade I might receive.

### Story 2: Improving Accuracy
As a student, I want to add my previous essays and grades so that the predictions become more accurate for my specific teacher.

### Story 3: Iterative Improvement
As a student, I want to revise my essay based on feedback and resubmit to see if my predicted grade improves.

### Story 4: Starting Fresh
As a student, I want to clear all data and start a new session for a different class or assignment.

## Success Metrics
- Students can successfully input all required information
- Grade predictions align with teacher's grading patterns
- Feedback is actionable and specific
- Students can improve their predicted grade through revision

## Future Enhancements (Not in MVP)
- Support for different document formats (PDF, DOCX)
- Multiple session management
- Export functionality
- Mobile optimization
- Inline annotation system
- Historical tracking of improvements

## Implementation Notes for Claude Code

### Key Components Needed
1. **Input Forms**: Rubric, examples, and essay input
2. **State Management**: Session storage for all data
3. **API Integration**: Claude API for analysis
4. **UI Components**: Grade display, feedback sections
5. **Session Control**: New session functionality

### Suggested Implementation Order
1. Basic UI structure and layout
2. Input forms and session storage
3. Claude API integration
4. Grade prediction display
5. Feedback formatting and display
6. New session functionality
7. Polish and error handling

### API Prompt Structure
The app should construct prompts that include:
- The teacher's rubric
- Any previous examples with grades
- The current essay
- Request for grade prediction with reasoning
- Request for strategic and line-by-line feedback