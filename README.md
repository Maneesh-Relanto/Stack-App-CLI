# Create Stack App

> A modern CLI tool to generate production-ready boilerplates across multiple programming languages and frameworks

[![npm version](https://img.shields.io/npm/v/create-stack-app.svg)](https://www.npmjs.com/package/create-stack-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
- **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** - 60-second setup guide
- **[TEMPLATES_GUIDE.md](TEMPLATES_GUIDE.md)** - All 15 templates explained
- **[generated-samples/](generated-samples/)** - Real working code examples
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

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
