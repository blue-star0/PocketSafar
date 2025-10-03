# Contributing to PocketSafar

Thank you for your interest in contributing to PocketSafar! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **🐛 Bug Reports**: Help us identify and fix issues
- **💡 Feature Requests**: Suggest new functionality
- **📝 Documentation**: Improve guides, APIs docs, and examples
- **🧪 Testing**: Add test coverage or improve existing tests
- **🔧 Code**: Implement features, fix bugs, optimize performance
- **🎨 Design**: UI/UX improvements and accessibility enhancements
- **🌍 Translation**: Multi-language support
- **📊 Research**: ML model improvements and data analysis

### Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/pocketsafar.git
   cd pocketsafar
   ```

2. **Set Up Development Environment**
   ```bash
   # Backend setup
   cd backend
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   
   # Frontend setup
   cd ../frontend
   yarn install
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

## 📋 Development Guidelines

### Code Standards

#### Python (Backend)
- **Style**: Follow PEP 8 with Black formatting
- **Type Hints**: Use type annotations for all functions
- **Documentation**: Docstrings for all public functions and classes
- **Testing**: Minimum 80% test coverage for new code

```python
# Good example
async def create_travel_entry(
    user_id: str, 
    travel_data: Dict[str, Any]
) -> TravelEntryResponse:
    """
    Create a new travel entry with ML validation.
    
    Args:
        user_id: Unique identifier for the user
        travel_data: Dictionary containing travel information
        
    Returns:
        TravelEntryResponse with entry details and quality metrics
        
    Raises:
        ValidationError: If travel data is invalid
        StorageError: If database operation fails
    """
```

#### JavaScript/React (Frontend)
- **Style**: Use Prettier with ESLint configuration
- **Components**: Functional components with hooks
- **TypeScript**: Gradually migrating to TypeScript
- **Testing**: React Testing Library for component tests

```javascript
// Good example
const TravelEntryForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({});
  
  const handleSubmit = useCallback(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit travel entry:', error);
    }
  }, [onSubmit]);
  
  // Component implementation...
};
```

### Git Workflow

#### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(ml): add GPS outlier detection algorithm

Implement Isolation Forest-based outlier detection for GPS coordinates
to improve data quality in travel entries.

Closes #123
```

```
fix(api): handle missing user_id in travel entry creation

- Add validation for required user_id parameter
- Return 400 Bad Request with descriptive error message
- Add test coverage for error scenario

Fixes #456
```

#### Branch Naming
- `feature/feature-name`: New features
- `fix/issue-number` or `fix/bug-description`: Bug fixes
- `docs/update-description`: Documentation updates
- `test/test-description`: Test additions/improvements

### Code Review Process

1. **Self-Review**: Review your own changes before submitting
2. **Automated Checks**: Ensure all CI checks pass
3. **Peer Review**: At least one maintainer review required
4. **Testing**: All tests must pass, coverage maintained
5. **Documentation**: Update relevant documentation

## 🧪 Testing Guidelines

### Backend Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=./ --cov-report=html

# Run specific test file
pytest tests/test_travel_service.py -v

# Run tests with markers
pytest -m "unit" # Unit tests only
pytest -m "integration" # Integration tests only
```

#### Test Structure
```python
# tests/test_travel_service.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from services.travel_service import TravelDataService

class TestTravelDataService:
    @pytest.fixture
    async def service(self):
        mock_storage = AsyncMock()
        return TravelDataService(mock_storage)
    
    @pytest.mark.asyncio
    async def test_create_travel_entry_success(self, service):
        # Test implementation
        pass
    
    @pytest.mark.asyncio
    async def test_create_travel_entry_invalid_data(self, service):
        # Test error handling
        pass
```

### Frontend Testing

```bash
# Run all tests
yarn test

# Run with coverage
yarn test --coverage --watchAll=false

# Run specific test
yarn test TravelEntryForm.test.js
```

#### Test Structure
```javascript
// src/components/__tests__/TravelEntryForm.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TravelEntryForm } from '../TravelEntryForm';

describe('TravelEntryForm', () => {
  test('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    render(<TravelEntryForm onSubmit={mockOnSubmit} />);
    
    // Test implementation
  });
  
  test('displays validation errors', () => {
    // Test error handling
  });
});
```

## 📊 Machine Learning Guidelines

### Data Processing
- **Data Privacy**: Never log or store sensitive user information
- **Quality Metrics**: All ML models must report confidence/quality scores
- **Performance**: Models should process data in < 5 seconds
- **Validation**: Cross-validation required for model changes

### Model Development
```python
# Example ML model contribution
class NewActivityClassifier:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        
    def train(self, training_data: pd.DataFrame) -> Dict[str, float]:
        """
        Train the activity classification model.
        
        Returns:
            Dictionary with training metrics (accuracy, precision, recall)
        """
        # Implementation with proper validation
        
    def predict(self, features: np.ndarray) -> Tuple[str, float]:
        """
        Predict activity type with confidence score.
        
        Returns:
            Tuple of (activity_type, confidence_score)
        """
        # Implementation
```

## 🔒 Security Guidelines

### Security Best Practices
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries/ORM
- **Authentication**: Never commit API keys or secrets
- **Data Sanitization**: Sanitize data before processing
- **Error Handling**: Don't expose internal details in error messages

### Reporting Security Issues
- **DO NOT** create public issues for security vulnerabilities
- Email security@pocketsafar.org with details
- Use encrypted communication when possible
- Allow reasonable time for fix before disclosure

## 📚 Documentation Guidelines

### Code Documentation
- **Docstrings**: All public functions and classes
- **Comments**: Explain complex logic, not obvious code
- **Type Hints**: Use for all function parameters and returns
- **Examples**: Include usage examples in docstrings

### API Documentation
- **OpenAPI**: Keep FastAPI schema documentation updated
- **Examples**: Provide request/response examples
- **Error Codes**: Document all possible error responses
- **Rate Limits**: Document any API limitations

### User Documentation
- **Clear Instructions**: Step-by-step setup guides
- **Screenshots**: Visual guides for UI features
- **Troubleshooting**: Common issues and solutions
- **FAQ**: Frequently asked questions

## 🚀 Performance Guidelines

### Backend Performance
- **Database Queries**: Optimize queries, use appropriate indexes
- **Async Operations**: Use async/await for I/O operations
- **Caching**: Implement caching for frequently accessed data
- **Resource Management**: Properly close connections and clean up

### Frontend Performance
- **Bundle Size**: Monitor and optimize bundle size
- **Lazy Loading**: Use React.lazy for code splitting
- **State Management**: Avoid unnecessary re-renders
- **Image Optimization**: Compress and lazy load images

### ML Performance
- **Model Size**: Keep models under 100MB
- **Inference Time**: Target < 1 second for real-time processing
- **Memory Usage**: Monitor and optimize memory consumption
- **Batch Processing**: Use batching for bulk operations

## 🎯 Issue Guidelines

### Bug Reports
Use the bug report template and include:
- **Environment**: OS, Python/Node versions, browser
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Logs**: Relevant error messages or logs

### Feature Requests
Use the feature request template and include:
- **Problem**: What problem does this solve?
- **Solution**: Proposed solution or approach
- **Alternatives**: Other approaches considered
- **Impact**: Who would benefit and how?
- **Implementation**: Technical considerations

### Enhancement Proposals
For significant changes, create an RFC (Request for Comments):
1. Create an issue with `[RFC]` prefix
2. Describe the problem and proposed solution
3. Include technical design and implementation plan
4. Gather community feedback before implementation

## 👥 Community Guidelines

### Code of Conduct
We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

### Communication Channels
- **GitHub Issues**: Technical discussions and bug reports
- **GitHub Discussions**: General questions and community chat
- **Discord**: Real-time collaboration (link in README)
- **Email**: Maintainer contact and security issues

### Getting Help
- **Documentation**: Check existing docs first
- **Search Issues**: Look for existing discussions
- **Ask Questions**: Use GitHub Discussions for help
- **Be Patient**: Maintainers are volunteers

## 🏅 Recognition

### Contributor Levels
- **Contributor**: Made accepted contributions
- **Regular Contributor**: 5+ merged PRs
- **Core Contributor**: 20+ PRs, helps with reviews
- **Maintainer**: Commit access, release management

### Hall of Fame
Contributors who make significant impacts are recognized in:
- README acknowledgments
- Annual contributor highlights
- Conference presentations (with permission)

## 📈 Release Process

### Versioning
We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Cycle
- **Major Releases**: Quarterly (with beta period)
- **Minor Releases**: Monthly
- **Patch Releases**: As needed for critical bugs

### Changelog
All changes are documented in [CHANGELOG.md](CHANGELOG.md) following [Keep a Changelog](https://keepachangelog.com/) format.

## 💻 Development Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB 4.4+
- Git
- Docker (optional)

### IDE Configuration

#### VS Code Settings
```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "eslint.autoFixOnSave": true
}
```

#### Recommended Extensions
- Python
- Pylance
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- GitLens
- MongoDB for VS Code

### Local Development

```bash
# Start MongoDB
mongod --dbpath ./data/db

# Backend development
cd backend
source venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Frontend development
cd frontend
yarn start

# Run tests continuously
# Terminal 1:
cd backend && pytest --watch

# Terminal 2:
cd frontend && yarn test --watch
```

## 🔄 Continuous Integration

### GitHub Actions
Our CI pipeline includes:
- **Linting**: Code style and quality checks
- **Testing**: Unit and integration tests
- **Security**: Dependency vulnerability scanning
- **Build**: Docker image creation
- **Deploy**: Automatic deployment to staging

### Pre-commit Hooks
Install pre-commit hooks to catch issues early:

```bash
pip install pre-commit
pre-commit install
```

This will run:
- Black (Python formatting)
- Flake8 (Python linting)
- Prettier (JavaScript formatting)
- ESLint (JavaScript linting)
- Tests (fast unit tests only)

## 📞 Contact

### Maintainers
- **Lead Developer**: @username (email@example.com)
- **ML Lead**: @username (email@example.com)
- **Frontend Lead**: @username (email@example.com)

### Project Links
- **Repository**: https://github.com/yourusername/pocketsafar
- **Documentation**: https://PocketSafar.org/docs
- **Discord**: https://discord.gg/PocketSafar
- **Website**: https://PocketSafar.org

---

Thank you for contributing to PocketSafar! Together, we're building the future of intelligent travel data collection. 🚀