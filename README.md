# Create Stack App

> A modern CLI tool to generate production-ready boilerplates across multiple programming languages and frameworks

[![npm version](https://img.shields.io/npm/v/create-stack-app.svg)](https://www.npmjs.com/package/create-stack-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-15%2F15%20PASS-success)](./VALIDATION_REPORT.md)
[![Security](https://img.shields.io/badge/security-0%20vulnerabilities-success)](./confidential/SECURITY_CODE_REVIEW.md)
[![Code Quality](https://img.shields.io/badge/code%20quality-SonarQube%20PASS-success)](./confidential/SECURITY_CODE_REVIEW.md)
[![Templates](https://img.shields.io/badge/templates-15%20supported-blue)]()
[![Languages](https://img.shields.io/badge/languages-6%20supported-blue)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](http://makeapullrequest.com)
[![GitHub](https://img.shields.io/badge/github-Maneesh--Relanto-blue)](https://github.com/Maneesh-Relanto/create-stack-app)

## ✨ Features

- 🎯 **15 Production-Ready Templates** across TypeScript, Python, Rust, Go, .NET, and Elixir
- 🎨 **Interactive CLI** with beautiful prompts and animations
- ⚡ **Fast Setup** - Get coding in seconds
- 🐳 **Docker Ready** - Optional Docker & Docker Compose configs
- 🔧 **GitHub Actions** - Built-in CI/CD workflows
- 📦 **Best Practices** - Following industry standards
- 🔍 **Multiple Selection Methods** - Browse by language, category, or all templates

## 📦 Quick Start

```bash
# Using npx (recommended - no installation needed)
npx create-stack-app new my-awesome-app

# Or install globally
npm install -g create-stack-app
create-stack-app new my-project

# List all available templates
npx create-stack-app list
```

## 📚 Documentation

Start here:
- **[ABOUT.md](ABOUT.md)** - What this project is about and why it exists
- **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** - 60-second setup guide
- **[TEMPLATES_GUIDE.md](TEMPLATES_GUIDE.md)** - All 15 templates explained
- **[generated-samples/](generated-samples/)** - Real working code examples
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

## ✅ Quality & Testing

### Test Coverage
- ✓ **15/15 Templates Tested** - All templates generated and verified working
- ✓ **All Languages Verified** - TypeScript, Python, Rust, Go, .NET, Elixir tested
- ✓ **SonarQube Analysis** - Code quality checks passed on all generators
- ✓ **Generated Code Scanned** - All sample code passes quality checks
- ✓ **Syntax Validation** - Generated project structures verified

### Quality Metrics
| Metric | Status |
|--------|--------|
| **Generator Tests** | 15/15 PASS ✓ |
| **Security Vulnerabilities** | 0 (npm audit) ✓ |
| **Code Quality Issues** | 0 (SonarQube) ✓ |
| **Generated Sample Code** | 11 working examples ✓ |
| **Documentation** | 100% complete ✓ |
| **Production Ready** | YES ✓ |

### Test Results Details
- **Generator Validation**: All 15 templates successfully generate working projects
- **Fresh Project Testing**: FastAPI, Django, Flask, Go Fiber tested and verified
- **Code Quality**: SonarQube passed on generators and generated samples
- **Security**: Zero known vulnerabilities in dependencies
- **Samples**: 11 reference implementations tracked and tested

## 🏗️ Available Templates

### Frontend
- React + Vite - Lightning-fast React development
- Next.js 15 SaaS Starter - Full-stack SaaS with Auth & Payments

### Backend APIs
- Node.js Express API - RESTful API with authentication
- FastAPI Modern - Production async Python
- Django Professional - Enterprise Python web
- Flask REST API - Lightweight Flask API
- Rust Axum - High-performance web service
- Go Fiber - Fast minimalist framework
- .NET Minimal API - Modern .NET API

### Full-Stack
- Rust Full-Stack (Axum + Leptos)
- Go + HTMX - Server-side rendering
- Elixir Phoenix - Real-time capable

### AI/ML Focused
- AI SaaS (Next.js + OpenAI) - LLM integration
- Python ML API - Machine Learning API

### Mobile
- React Native Expo - Cross-platform mobile app

## 🎯 Usage

### Interactive Mode (Recommended)

```bash
npx create-stack-app new my-project
```

Follow the interactive prompts to choose your stack and features.

### Direct Template Selection

```bash
npx create-stack-app new my-project --template nextjs-saas
```

### Skip Dependency Installation

```bash
npx create-stack-app new my-project --skip-install
```

## 🔧 Template Options

Each template comes with optional features:
- Docker & Docker Compose
- GitHub Actions CI/CD
- Code linting & formatting
- Testing setup
- Pre-commit hooks
- VS Code settings

## 🛠️ Development

Want to contribute or customize templates?

```bash
git clone https://github.com/yourusername/create-stack-app.git
cd create-stack-app
npm install
npm start
```

### Project Structure

```
create-stack-app/
├── src/
│   ├── commands/         # CLI commands
│   │   ├── create.js     # Project creation
│   │   └── list.js       # Template listing
│   ├── config/
│   │   └── templates.js  # Template definitions
│   ├── generators/
│   │   └── index.js      # Generation logic
│   └── index.js          # CLI entry point
├── generated-samples/    # Reference implementations
├── package.json
└── README.md
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Ways to help:
- Add new templates
- Improve existing templates
- Fix bugs or improve docs
- Report issues

## 📄 License

MIT License - see [LICENSE](LICENSE) for details
