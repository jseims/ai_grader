# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Essay Grade Predictor** web application that helps high school students predict essay grades and receive improvement suggestions based on their teacher's rubric and previous graded examples. The app uses AI (Claude API) to analyze essays and provide feedback.

## Key Project Details

### Architecture
- **Frontend**: Single-page application (SPA) using HTML/CSS/JavaScript
- **Storage**: Browser session storage only (no backend database)
- **AI Integration**: Claude API for essay analysis and grade prediction
- **Authentication**: None required (no user accounts)

### Core Components Needed
1. **Input Forms**: Rubric input, example submissions, essay submission
2. **State Management**: Session storage for rubric, examples, and essay drafts
3. **API Integration**: Claude API client for analysis requests
4. **UI Components**: Grade prediction display, strategic advice, line-by-line feedback
5. **Session Control**: New session functionality to clear all data

### Data Flow
- All data stored in browser session storage
- No server-side persistence required
- Data cleared on "New Session" button or browser close
- No personal data collection

## Implementation Guidelines

### Suggested Development Order
1. Basic UI structure and layout (chat-like interface similar to Claude)
2. Input forms with session storage integration
3. Claude API integration with proper prompt construction
4. Grade prediction display formatting
5. Strategic advice and line-by-line feedback sections
6. New session functionality and error handling

### API Prompt Structure
Construct prompts that include:
- Teacher's grading rubric
- Previous essay examples with grades and feedback
- Current essay for analysis
- Request for grade prediction with detailed reasoning
- Request for both strategic and line-by-line improvement suggestions

### UI Requirements
- Desktop-first design (optimized for laptop/desktop screens)
- Chat-like interface with clean typography
- Collapsible sections for rubric and examples after input
- Clear visual separation between grade prediction, strategic advice, and line-by-line feedback
- Minimal, distraction-free interface without visual clutter

## Development Notes

### Session Management
- Implement "New Session" button that clears all session storage
- Persist rubric, examples, and current essay draft across page refreshes
- Handle session expiration gracefully

### Grade Display Format
Follow the specified format from PRD:
- Predicted grade with confidence level
- Reasoning for the grade
- Breakdown by rubric criteria
- Strategic advice section
- Line-by-line feedback section

### No External Dependencies
The project should use vanilla HTML/CSS/JavaScript without requiring external frameworks or build processes.