# 🚀 Getting Started with Create Stack App

## Installation

No installation needed! Just use `npx`:

```bash
npx create-stack-app new my-project
```

Or install globally if you prefer:

```bash
npm install -g create-stack-app
create-stack-app new my-project
```

## Your First Project

### Step 1: Run the Command

```bash
npx create-stack-app new my-awesome-app
```

### Step 2: Follow the Prompts

You'll see a beautiful ASCII banner and then be asked:

**What is your project name?**
- Enter a name for your project (lowercase, dashes, underscores)
- Press Enter to use the suggested name

**How would you like to choose your stack?**
- 🎯 Browse by Language - Pick your favorite programming language first
- 📦 Browse by Category - Choose by project type (frontend, backend, etc.)
- 📋 See All Templates - View everything at once

**Choose your template:**
- Browse available templates
- See description, features, and difficulty
- Use arrow keys to navigate, Enter to select

**Select additional features:**
- ✅ Docker & Docker Compose
- ✅ GitHub Actions CI/CD
- ✅ ESLint/Prettier
- ✅ Testing Setup
- ✅ Pre-commit Hooks
- ✅ VS Code Settings

**Confirm:**
- Review your selections
- Confirm to generate the project

### Step 3: Start Coding!

```bash
cd my-awesome-app

# For Node.js/TypeScript projects
npm install
npm run dev

# For Python projects
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py

# For Rust projects
cargo run

# For Go projects
go run main.go
```

## Quick Examples

### Create a Next.js SaaS App

```bash
npx create-stack-app new my-saas
# Select: Browse by Category → Full-Stack → Next.js SaaS
```

### Create a Python FastAPI

```bash
npx create-stack-app new my-api
# Select: Browse by Language → Python → FastAPI Modern
```

### Create a Rust Web Service

```bash
npx create-stack-app new rust-service
# Select: Browse by Language → Rust → Rust Axum
```

## Command Line Options

### List All Templates

```bash
npx create-stack-app list
```

Shows all available templates grouped by language.

### Use Specific Template

```bash
npx create-stack-app new my-project --template nextjs-saas
```

Skip the interactive selection and use a specific template directly.

### Skip Installation

```bash
npx create-stack-app new my-project --skip-install
```

Generate the project but don't install dependencies automatically.

## Next Steps

After creating your project:

1. **Read the README** - Generated README has specific instructions
2. **Configure Environment** - Copy `.env.example` to `.env`
3. **Start Development** - Run the dev server
4. **Customize** - Make it your own!
5. **Deploy** - Check deployment guides in docs

## Common Issues

### "Command not found"

Make sure Node.js 18+ is installed:
```bash
node --version
```

### "Permission denied"

Try with sudo (macOS/Linux):
```bash
sudo npm install -g create-stack-app
```

Or use npx (no installation needed):
```bash
npx create-stack-app new my-project
```

### "Port already in use"

Change the port in your project's configuration or kill the process using that port.

## Getting Help

- 📖 [Full Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/yourusername/create-stack-app/issues)
- 💬 [Discussions](https://github.com/yourusername/create-stack-app/discussions)
- 🐦 [Twitter](https://twitter.com/yourusername)

## Video Tutorials

Coming soon! Subscribe to our [YouTube channel](#) for updates.

---

Happy coding! 🎉
