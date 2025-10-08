# Contributing to PocketSafar

Thank you for your interest in contributing to PocketSafar! This document provides comprehensive guidelines for contributing to both our backend (FastAPI, ML, data processing) and frontend (React, UI/UX) systems.

## 🌟 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **🐛 Bug Reports**: Help us identify and fix issues in backend APIs or frontend UI
- **💡 Feature Requests**: Suggest new functionality for ML pipelines, API endpoints, or user features
- **📝 Documentation**: Improve guides, API docs, component documentation, and examples
- **🧪 Testing**: Add test coverage for backend endpoints, ML models, or frontend components
- **🔧 Code**: Implement features, fix bugs, optimize performance in either stack
- **🎨 Design**: UI/UX improvements and accessibility enhancements
- **🌍 Translation**: Multi-language support
- **📊 Research**: ML model improvements and data analysis

## 🚀 Getting Started

### 1. Fork the Repository

```bash
git clone https://github.com/YOUR_USERNAME/PocketSafar.git
cd PocketSafar
```

### 2. Set Up Development Environment

#### Backend Setup (FastAPI + ML)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install pytest pytest-cov black flake8 mypy

# Set up environment variables
cp .env.example .env
# Edit .env with your AWS credentials and MongoDB connection string
```

**Backend Tech Stack:**
- FastAPI (Web framework)
- scikit-learn (Machine learning - Isolation Forest for GPS outlier detection)
- pandas (Data processing)
- TextBlob (Sentiment analysis for reviews)
- boto3 (AWS S3 integration)
- MongoDB (Database)
- Python 3.8+

#### Frontend Setup (React 19)

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env
# Configure API endpoints
```

**Frontend Tech Stack:**
- React 19
- Tailwind CSS (Styling)
- Radix UI (Accessible component primitives)
- TypeScript (Type safety)
- Vite (Build tool)

### 3. Create a Feature Branch

```bash
# For new features
git checkout -b feature/backend-your-feature-name
git checkout -b feature/frontend-your-feature-name

# For bug fixes
git checkout -b fix/backend-issue-description
git checkout -b fix/frontend-issue-description

# For ML improvements
git checkout -b ml/model-improvement-description
```

## 📋 Development Guidelines

### Backend Development (FastAPI + ML)

#### Code Standards

- **Style**: Follow PEP 8 with Black formatting
- **Type Hints**: Use type annotations for all functions
- **Documentation**: Docstrings for all public functions and classes
- **Testing**: Minimum 80% test coverage for new code

#### API Design Principles

- Use RESTful conventions
- Provide clear error messages with appropriate HTTP status codes
- Include request/response models using Pydantic
- Document all endpoints with OpenAPI/Swagger descriptions
- Implement proper authentication and authorization

#### ML Pipeline Guidelines

Our ML pipeline includes:

1. **GPS Outlier Removal**: Isolation Forest algorithm to detect and remove anomalous GPS coordinates
2. **Activity Recognition**: Classification of user activities from sensor data
3. **Review Sentiment Analysis**: TextBlob-based sentiment scoring for user reviews

When contributing to ML components:

- Document model parameters and hyperparameters
- Include performance metrics (accuracy, precision, recall, F1-score)
- Provide data preprocessing steps
- Test with edge cases and outliers
- Consider computational efficiency for production deployment

#### Backend Testing

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_ml_pipeline.py

# Run with verbose output
pytest -v
```

#### Backend Code Formatting

```bash
# Format code with Black
black .

# Check linting
flake8 .

# Type checking
mypy .
```

### Frontend Development (React 19)

#### Code Standards

- **Style**: Follow Airbnb React style guide
- **TypeScript**: Use TypeScript for all components
- **Components**: Create reusable, accessible components
- **State Management**: Use React hooks and context appropriately
- **Performance**: Optimize re-renders and bundle size

#### UI/UX Guidelines

- Follow responsive design principles (mobile-first)
- Ensure WCAG 2.1 AA accessibility compliance
- Use Tailwind CSS utility classes consistently
- Leverage Radix UI for accessible primitives
- Test on multiple devices and browsers
- Maintain consistent spacing, typography, and color schemes

#### Component Structure

```typescript
// Use functional components with TypeScript
import React from 'react';

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onAction }) => {
  return (
    <div className="container">
      {/* Component content */}
    </div>
  );
};
```

#### Frontend Testing

```bash
cd frontend

# Run tests
npm test
# or
yarn test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

#### Frontend Build & Linting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Build for production
npm run build
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch** with the latest main branch
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run all tests** and ensure they pass
   - Backend: `pytest`
   - Frontend: `npm test`

3. **Run linters and formatters**
   - Backend: `black .` and `flake8 .`
   - Frontend: `npm run lint:fix`

4. **Update documentation** if you've changed APIs or added features

5. **Test manually** to ensure your changes work as expected

### Submitting Your Pull Request

1. **Push your branch** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what changes were made and why
   - Reference to any related issues (e.g., "Fixes #123")
   - Screenshots/GIFs for UI changes
   - Test results and coverage reports
   - Performance impact (if applicable)

3. **PR Template** (use this format):
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix (backend)
   - [ ] Bug fix (frontend)
   - [ ] New feature (backend API/ML)
   - [ ] New feature (frontend UI)
   - [ ] Documentation update
   - [ ] Performance improvement
   - [ ] Code refactoring

   ## Testing
   - [ ] All tests pass
   - [ ] Added new tests for new functionality
   - [ ] Manual testing completed

   ## Screenshots (for UI changes)
   (Add screenshots here)

   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Documentation updated
   - [ ] No console warnings or errors
   - [ ] Responsive design tested (frontend)
   - [ ] API endpoints documented (backend)
   ```

### Code Review Process

- Maintainers will review your PR within 2-3 business days
- Address review comments promptly
- Be open to feedback and suggestions
- Update your PR based on review feedback
- Once approved, a maintainer will merge your PR

## 🧪 Testing Requirements

### Backend Testing

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test API endpoints end-to-end
- **ML Pipeline Tests**: Test data preprocessing and model predictions
- **Coverage**: Maintain >80% code coverage

### Frontend Testing

- **Component Tests**: Test individual React components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows
- **Accessibility Tests**: Ensure WCAG compliance

## 📝 Commit Message Guidelines

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature (backend or frontend)
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ml`: Machine learning model updates

**Scopes:**
- `backend`: Backend/API changes
- `frontend`: Frontend/UI changes
- `ml`: Machine learning pipeline
- `docs`: Documentation
- `tests`: Test files
- `ci`: CI/CD changes

**Examples:**
```bash
feat(backend): add GPS outlier detection endpoint
fix(frontend): resolve map rendering issue on mobile
ml(pipeline): improve sentiment analysis accuracy
docs(readme): update setup instructions
```

## 🏗️ Project Architecture

### Backend Architecture

```
backend/
├── server.py              # FastAPI application entry point
├── ml_pipeline.py         # ML models and data processing
├── requirements.txt       # Python dependencies
├── models/               # ML model definitions
├── routes/               # API route handlers
├── services/             # Business logic
├── utils/                # Helper functions
└── tests/                # Backend tests
```

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API client services
│   ├── utils/           # Helper functions
│   ├── styles/          # Global styles
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── tests/               # Frontend tests
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Environment**: OS, browser (for frontend), Python version (for backend)
2. **Steps to reproduce**: Clear, numbered steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots/Logs**: Visual evidence or error logs
6. **Component**: Backend API, ML pipeline, or Frontend UI

## 💡 Feature Requests

When requesting features:

1. **Use case**: Describe the problem you're trying to solve
2. **Proposed solution**: Your idea for implementing the feature
3. **Alternatives**: Other solutions you've considered
4. **Stack**: Which part of the system (backend/frontend/ML)
5. **Impact**: Who would benefit and how

## 📚 Resources

### Backend Resources
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [scikit-learn Documentation](https://scikit-learn.org/)
- [pandas Documentation](https://pandas.pydata.org/)
- [AWS SDK for Python (Boto3)](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)

### Frontend Resources
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### ML Resources
- [Isolation Forest for Anomaly Detection](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html)
- [TextBlob Documentation](https://textblob.readthedocs.io/)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🤝 Getting Help

If you need help:

1. Check existing [Issues](https://github.com/PocketSafar/PocketSafar/issues)
2. Read the [README](README.md) and [Setup Guide](PocketSafar_Setup_Guide.md)
3. Create a new issue with the `question` label
4. Be specific about what you're trying to do and what's not working

## 🎉 Recognition

All contributors will be recognized in our README. Thank you for making PocketSafar better!

---

**Happy Contributing! 🚀**
