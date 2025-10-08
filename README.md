# PocketSafar 🌍
*A Smart Travel Diary with ML-Enhanced Data Collection and Real-Time Analytics*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/release/python-380/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009639.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=React&logoColor=black)](https://reactjs.org/)

## 🚀 Overview

PocketSafar is an innovative open-source travel diary application that transforms how travel data is collected, processed, and analyzed. Leveraging cutting-edge **machine learning algorithms** and a modern **full-stack architecture**, it provides both individual users and organizations with high-quality, validated travel insights for better transportation planning and personal journey tracking.

### 🎯 Key Features

#### Backend (FastAPI + ML)
- 🧠 **ML-Powered GPS Outlier Detection**: Isolation Forest algorithm removes anomalous GPS coordinates in real-time
- 🎯 **Activity Recognition**: Automated classification of travel modes (walking, driving, transit)
- 💬 **Sentiment Analysis**: TextBlob-based review sentiment scoring for user feedback
- ⚡ **High-Performance API**: FastAPI-based RESTful endpoints with automatic OpenAPI documentation
- ☁️ **Cloud Integration**: AWS S3 integration for scalable media storage with boto3
- 📊 **Data Processing**: Advanced pandas-based data pipelines for aggregation and analytics
- 🔒 **MongoDB Integration**: Flexible NoSQL database for travel data storage

#### Frontend (React 19)
- 📱 **Modern React 19**: Latest React features with server components support
- 🎨 **Beautiful UI**: Tailwind CSS for responsive, mobile-first design
- ♿ **Accessibility First**: Radix UI primitives ensuring WCAG 2.1 AA compliance
- 🗺️ **Interactive Maps**: Real-time GPS tracking and route visualization
- 📊 **Data Visualization**: Rich charts and analytics for travel patterns
- 💎 **Gamification**: Points system and achievements for user engagement
- 🔐 **Privacy Controls**: Granular user consent and data sharing management

## 🏛️ Architecture

PocketSafar uses a modern, scalable full-stack architecture:

```
┌───────────────────────┐
│ React 19 Frontend     │
│ + Tailwind + Radix UI │
│ (UI/UX, Visualization)│
└───────────┬───────────┘
            │ REST API
            │
┌───────────┴───────────┐
│  FastAPI Backend      │
│ + ML Pipeline + APIs  │
│ (Data Processing, ML) │
└───────┬────────┬───────┘
        │        │
        │        │
┌───────┴───────┐ ┌────┴─────┐
│   MongoDB     │ │  AWS S3  │
│   Database    │ │  Storage │
└───────────────┘ └──────────┘
```

## 🛠️ Tech Stack

### Backend
- • **FastAPI** - Modern, high-performance Python web framework
- • **scikit-learn** - Machine learning library (Isolation Forest for outlier detection)
- • **pandas** - Data manipulation and analysis
- • **TextBlob** - Natural language processing for sentiment analysis
- • **boto3** - AWS SDK for Python (S3 integration)
- • **MongoDB** - NoSQL database for flexible data storage
- • **Python 3.8+** - Programming language

### Frontend
- • **React 19** - Latest React with modern features
- • **Tailwind CSS** - Utility-first CSS framework
- • **Radix UI** - Unstyled, accessible component primitives
- • **TypeScript** - Type-safe JavaScript
- • **Vite** - Next-generation frontend build tool

### Cloud & Infrastructure
- • **AWS S3** - Object storage for media files
- • **MongoDB Atlas** - Cloud-hosted database (optional)

## 🧪 ML Pipeline

PocketSafar includes a sophisticated machine learning pipeline for data quality and insights:

### 1. GPS Outlier Removal
- • **Algorithm**: Isolation Forest (unsupervised anomaly detection)
- • **Purpose**: Identifies and removes erroneous GPS coordinates caused by signal issues
- • **Features**: Contamination parameter tuning, real-time processing
- • **Impact**: Improves route accuracy by 15-25%

### 2. Activity Recognition
- • **Purpose**: Classifies travel modes (walking, cycling, driving, public transit)
- • **Input**: GPS speed, acceleration patterns, location context
- • **Output**: Predicted activity type with confidence score

### 3. Review Sentiment Analysis
- • **Algorithm**: TextBlob sentiment analyzer
- • **Purpose**: Analyzes user reviews and feedback sentiment
- • **Output**: Polarity score (-1 to +1) and subjectivity rating
- • **Use Case**: Identifies popular destinations and user satisfaction

## ⚡ Quick Start

### Prerequisites
- • Python 3.8 or higher
- • Node.js 16+ and npm/yarn
- • MongoDB instance (local or Atlas)
- • AWS account (for S3, optional)

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/PocketSafar/PocketSafar.git
cd PocketSafar/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and AWS credentials

# Run the backend server
python server.py
# Server will start at http://localhost:8000

# API docs available at http://localhost:8000/docs
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install  # or yarn install

# Set up environment variables
cp .env.example .env
# Configure API endpoint (default: http://localhost:8000)

# Run development server
npm run dev  # or yarn dev
# Application will open at http://localhost:5173
```

### Running Tests

#### Backend Tests
```bash
cd backend
pytest  # Run all tests
pytest --cov=.  # With coverage report
pytest tests/test_ml_pipeline.py  # Specific test file
```

#### Frontend Tests
```bash
cd frontend
npm test  # Run all tests
npm run test:coverage  # With coverage
```

## 📚 Documentation

For detailed documentation, please refer to:

- • **[Setup Guide](PocketSafar_Setup_Guide.md)** - Complete setup instructions
- • **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (run backend first)
- • **[Contributing Guide](CONTRIBUTION.md)** - How to contribute to the project
- • **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines

## 🛣️ Roadmap

- [ ] Real-time collaborative trip planning
- [ ] Advanced ML models for predictive analytics
- [ ] Multi-language support
- [ ] Offline-first mobile apps (iOS/Android)
- [ ] Social features and trip sharing
- [ ] Integration with popular travel APIs
- [ ] Enhanced data visualization dashboards
- [ ] Government analytics portal

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Whether you're interested in:

- • 🔧 **Backend Development**: FastAPI, ML pipelines, data processing, API design
- • 🎨 **Frontend Development**: React components, UI/UX design, data visualization
- • 📝 **Documentation**: Tutorials, guides, API documentation
- • 🧪 **Testing**: Unit tests, integration tests, E2E tests
- • 🐛 **Bug Reports**: Help us identify and fix issues

Please read our [Contributing Guide](CONTRIBUTION.md) to get started.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes (backend or frontend)
4. Write tests for your changes
5. Run tests and linting
6. Commit your changes (`git commit -m 'feat(backend): add amazing feature'`)
7. Push to your fork (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand the expectations for collaborative behavior in both backend and frontend contributions.

## 📧 Contact & Support

- • **Issues**: [GitHub Issues](https://github.com/PocketSafar/PocketSafar/issues)
- • **Discussions**: [GitHub Discussions](https://github.com/PocketSafar/PocketSafar/discussions)
- • **Email**: PocketSafar.org@hotmail.com

## 🎉 Acknowledgments

- • FastAPI framework for excellent developer experience
- • React team for React 19 innovations
- • scikit-learn community for ML algorithms
- • Tailwind Labs for Tailwind CSS
- • Radix UI for accessible components
- • All our amazing contributors!

---

**Built with ❤️ by the PocketSafar community**

*Making travel data accessible, accurate, and actionable for everyone.*

