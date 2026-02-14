# Create Stack App

> A modern CLI tool to generate production-ready boilerplates across multiple programming languages and frameworks

[![npm version](https://img.shields.io/npm/v/create-stack-app.svg)](https://www.npmjs.com/package/create-stack-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## ✨ Features

- 🎯 **15+ Production-Ready Templates** across TypeScript, Python, Rust, Go, and more
- 🎨 **Interactive CLI** with beautiful prompts and animations
- ⚡ **Fast Setup** - Get coding in seconds, not hours
- 🐳 **Docker Ready** - Optional Docker & Docker Compose configs
- 🔧 **GitHub Actions** - Built-in CI/CD workflows
- 📦 **Best Practices** - Following industry standards and conventions
- 🔍 **Multiple Selection Methods** - Browse by language, category, or see all templates

## 🎬 Demo

![Demo GIF](https://via.placeholder.com/800x400.png?text=Demo+Coming+Soon)

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

**New to Create Stack App?** Start here:
- 👉 **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** - 60-second setup guide
- 👉 **[TEMPLATES_GUIDE.md](TEMPLATES_GUIDE.md)** - All 15 templates explained
- 👉 **[generated-samples/](generated-samples/)** - Real working code examples

## 🏗️ Available Templates

### Frontend
- **React + Vite** - Lightning-fast React development with Vite
- **Next.js 15 SaaS Starter** - Full-stack SaaS with Auth, Payments, Database

### Backend APIs
- **Node.js Express API** - RESTful API with authentication and database
- **FastAPI Modern** - Production-ready FastAPI with async support
- **Django Professional** - Enterprise Django with best practices
- **Flask REST API** - Lightweight Flask API with SQLAlchemy
- **Rust Axum** - High-performance web service with Axum
- **Go Fiber** - Fast and minimalist Go web framework
- **.NET Minimal API** - Modern .NET API with minimal overhead

### Full-Stack
- **Rust Full-Stack** (Axum + Leptos) - Complete Rust web app
- **Go + HTMX** - Modern server-side rendering with HTMX
- **Elixir Phoenix API** - Real-time capable Phoenix application

### AI/ML Focused
- **AI SaaS (Next.js + OpenAI)** - AI-powered SaaS with LangChain and vector DB
- **Python ML API** - Machine Learning API with FastAPI

### Mobile
- **React Native Expo** - Cross-platform mobile app with Expo

## 🎯 Usage

### Interactive Mode (Recommended)

```bash
npx create-stack-app new my-project
```

Follow the interactive prompts to:
1. Choose your project name
2. Select browsing method (language, category, or all templates)
3. Pick your desired template
4. Select additional features (Docker, CI/CD, testing, etc.)
5. Confirm and generate!

### Direct Template Selection

```bash
npx create-stack-app new my-project --template nextjs-saas
```

### Skip Dependency Installation

```bash
npx create-stack-app new my-project --skip-install
```

## 🔧 Template Options

Each template comes with optional features you can enable:

- ✅ **Docker & Docker Compose** - Containerization setup
- ✅ **GitHub Actions CI/CD** - Automated testing and deployment
- ✅ **ESLint/Prettier** - Code quality and formatting
- ✅ **Testing Setup** - Jest/Pytest/Cargo test configurations
- ✅ **Pre-commit Hooks** - Git hooks for quality checks
- ✅ **VS Code Settings** - Editor configuration

## 📚 Template Details

### Next.js SaaS Starter
```
Language: TypeScript
Features: Authentication, Stripe Integration, Supabase, Tailwind CSS, shadcn/ui
Difficulty: Intermediate
Popularity: 🔥 High
```

### FastAPI Modern
```
Language: Python
Features: FastAPI, PostgreSQL, SQLAlchemy, Alembic, Docker, OpenAPI
Difficulty: Intermediate
Popularity: 🔥 High
```

### Rust Axum
```
Language: Rust
Features: Axum, PostgreSQL, SQLx, JWT, Docker, OpenAPI
Difficulty: Advanced
Popularity: 📈 Growing
```

### Go Fiber
```
Language: Go
Features: Fiber, PostgreSQL, GORM, JWT, Swagger, Docker
Difficulty: Intermediate
Popularity: 🔥 High
```

[See all templates →](./docs/TEMPLATES.md)

## 🏆 Why Choose Create Stack App?

### vs. Manual Setup
- ⏰ **Save Hours** - What takes 2-3 hours manually, done in 2 minutes
- ✅ **Zero Config Errors** - Pre-tested, working configurations
- 📖 **Best Practices** - Industry-standard project structure

### vs. Other Generators
- 🌐 **Multi-Language** - Not limited to one ecosystem
- 🎨 **Better DX** - Beautiful CLI with clear guidance
- 🔄 **Always Updated** - Templates follow latest framework versions
- 📦 **Production Ready** - Not just "hello world" starters

## 🛠️ Development

Want to contribute or customize templates?

```bash
# Clone the repository
git clone https://github.com/yourusername/create-stack-app.git
cd create-stack-app

# Install dependencies
npm install

# Run locally
npm start

# Run in development mode
npm run dev
```

### Project Structure

```
create-stack-app/
├── src/
│   ├── commands/         # CLI commands
│   │   ├── create.js    # Main project creation logic
│   │   └── list.js      # List templates command
│   ├── config/          # Configuration files
│   │   └── templates.js # Template definitions
│   ├── generators/      # Template generators
│   │   └── index.js     # Generation logic
│   └── index.js         # CLI entry point
├── templates/           # Template files (future)
├── docs/               # Documentation
├── package.json
└── README.md
```

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Add New Templates** - Create generators for new stacks
2. **Improve Existing Templates** - Enhance current implementations
3. **Fix Bugs** - Report and fix issues
4. **Documentation** - Improve guides and docs
5. **Feature Requests** - Suggest new features

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Adding a New Template

1. Add template config to `src/config/templates.js`
2. Create generator function in `src/generators/index.js`
3. Test thoroughly
4. Update documentation
5. Submit PR!

## 📖 Documentation

- [Complete Template List](./docs/TEMPLATES.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [FAQ](./docs/FAQ.md)

## 🗺️ Roadmap

- [ ] Add template previews/screenshots
- [ ] Support for custom template repositories
- [ ] Template update notifications
- [ ] Interactive template customization
- [ ] More language support (C#, Swift, Kotlin, Elixir)
- [ ] Project migration tools
- [ ] Template marketplace
- [ ] VS Code extension

## 📊 Stats

- **15+** Templates
- **6** Programming Languages
- **5** Categories
- **100%** Production Ready

## 🙏 Acknowledgments

This project was inspired by:
- [create-react-app](https://create-react-app.dev/)
- [create-next-app](https://nextjs.org/docs/api-reference/create-next-app)
- [cargo-generate](https://cargo-generate.github.io/cargo-generate/)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 💬 Community

- 🐛 [Report Issues](https://github.com/yourusername/create-stack-app/issues)
- 💡 [Feature Requests](https://github.com/yourusername/create-stack-app/discussions)
- 🌟 [Star on GitHub](https://github.com/yourusername/create-stack-app)
- 🐦 [Follow on Twitter](https://twitter.com/yourusername)

## ⭐ Show Your Support

If this project helped you, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ by developers, for developers**

[Get Started →](npx create-stack-app)
