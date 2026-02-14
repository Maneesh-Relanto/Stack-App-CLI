# Developer Quick Start Guide

Get started with Stack-App-CLI in 60 seconds.

## Installation

```bash
npm install -g create-stack-app
# or
npx create-stack-app
```

---

## Usage Pattern #1: Interactive Mode (Recommended)

```bash
npx create-stack-app new my-awesome-app
```

This launches an interactive menu where you can:

1. **Choose your stack**
   - Browse by Language (TypeScript, Python, Rust, Go, .NET, Elixir)
   - Browse by Category (Frontend, Backend, Full-Stack, AI/ML, Mobile)
   - See all 15 templates

2. **Select additional features**
   - ✅ Docker & Docker Compose (default: on)
   - ✅ GitHub Actions CI/CD (default: on)
   - ✅ Linting/Formatting (default: on)
   - ✅ Testing Setup (default: on)
   - ✅ Pre-commit Hooks (default: off)
   - ✅ VS Code Settings (default: on)

3. **Review configuration**
   - Project name
   - Template choice
   - Selected features
   - Confirm or cancel

4. **Done** → Your project is ready!

---

## Usage Pattern #2: Direct Template Selection

```bash
npx create-stack-app new my-app --template nextjs-saas
```

### Available Templates

| ID | Template | Language |
|----|----------|----------|
| `react-vite` | React + Vite Starter | TypeScript |
| `nextjs-saas` | Next.js 15 SaaS | TypeScript |
| `node-express-api` | Node.js Express API | TypeScript |
| `ai-saas-nextjs` | AI SaaS with OpenAI | TypeScript |
| `react-native-expo` | React Native Expo | TypeScript |
| `fastapi-modern` | FastAPI Modern Starter | Python |
| `django-pro` | Django Professional | Python |
| `flask-api` | Flask REST API | Python |
| `python-ml-api` | Python ML API | Python |
| `rust-axum` | Rust Axum Web Service | Rust |
| `rust-fullstack` | Rust Full-Stack (Axum + Leptos) | Rust |
| `go-fiber` | Go Fiber Web API | Go |
| `go-htmx` | Go + HTMX Hypermedia | Go |
| `dotnet-minimal-api` | .NET Minimal API | C# |
| `elixir-phoenix` | Elixir Phoenix API | Elixir |

---

## Usage Pattern #3: Browse by Language

```bash
npx create-stack-app new my-app --language Python
```

Lists all Python templates, select one interactively.

**Supported languages:**
- TypeScript
- Python
- Rust
- Go
- C# (.NET)
- Elixir

---

## Usage Pattern #4: Browse by Category

```bash
npx create-stack-app new my-app --category backend
```

Lists all templates in that category.

**Categories:**
- **frontend** - UI libraries and SPAs
- **backend** - APIs and servers
- **fullstack** - End-to-end solutions
- **ai** - AI/ML focused
- **mobile** - Mobile apps
- **api** - Pure API servers

---

## Usage Pattern #5: Skip Installation

```bash
npx create-stack-app new my-app --skip-install
```

Generates project structure without installing dependencies. Install manually later with:

```bash
cd my-app
npm install          # TypeScript/JavaScript
# or
python -m venv venv  # Python
# or
cargo build          # Rust
# etc.
```

---

## After Generation

### 1. Navigate to your project

```bash
cd my-awesome-app
```

### 2. Install dependencies

**Node.js/TypeScript:**
```bash
npm install
npm run dev
```

**Python:**
```bash
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py                # or uvicorn/flask
```

**Rust:**
```bash
cargo run
```

**Go:**
```bash
go mod download
go run main.go
```

**.NET:**
```bash
dotnet restore
dotnet run
```

**Elixir:**
```bash
mix deps.get
mix phx.server
```

### 3. Open in your editor

```bash
# VS Code (already configured!)
code .

# Or your favorite editor
vim main.go
nano app.py
```

### 4. Start building

The generated project includes:
- ✅ Pre-configured project structure
- ✅ Ready-to-use boilerplate code
- ✅ Example API endpoints
- ✅ Docker files for deployment
- ✅ GitHub Actions CI/CD workflows
- ✅ Linting/Formatting configured
- ✅ Testing setup included

---

## Common Commands (by Template)

### React + Vite

```bash
npm run dev              # Development server
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # Run ESLint
npm test                 # Run tests
```

### Next.js

```bash
npm run dev              # Development server
npm run build            # Production build
npm start                # Start production server
npm run lint             # ESLint
npm test                 # Jest tests
```

### FastAPI

```bash
uvicorn src.main:app --reload    # Development (auto-reload)
# Visit http://localhost:8000/docs for API docs
python -m pytest tests/           # Run tests
```

### Django

```bash
python manage.py runserver       # Development server
python manage.py migrate         # Apply migrations
python manage.py createsuperuser # Create admin user
python manage.py test            # Run tests
```

### Go Fiber

```bash
go run main.go          # Run application
go test ./...           # Run tests
go build -o app         # Build binary
```

### .NET

```bash
dotnet run              # Run application
dotnet test             # Run tests
dotnet publish          # Release build
# Browse to https://localhost:5001/swagger for API docs
```

---

## Docker Development

All templates include Docker files:

### Run in Docker

```bash
docker-compose up
```

### Build & Deploy

```bash
docker-compose up --build     # Rebuild image
docker-compose down           # Stop containers
docker push your-registry/app # Push to registry
```

---

## Project Structure

Every generated project includes:

```
your-project/
├── src/                    # Source code
├── public/                 # Static files (if applicable)
├── tests/                  # Test files
├── .github/
│   └── workflows/          # CI/CD pipelines
├── Dockerfile              # Container image
├── docker-compose.yml      # Multi-container setup
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── .vscode/
│   └── settings.json       # VS Code config
├── package.json / go.mod / Cargo.toml / etc.
└── README.md               # Documentation
```

---

## Learning Resources

1. **Understand your template**
   - Read generated `README.md`
   - Check `.env.example` for configuration
   - See `Dockerfile` for deployment

2. **API documentation**
   - Most templates include Swagger/OpenAPI
   - Visit `/swagger` or `/docs` endpoint
   - Interactive API exploration

3. **Example code**
   - Study the generated handlers/controllers
   - Copy patterns to your endpoints
   - Modify for your use case

4. **See all templates**
   - Check `generated-samples/` in this repo
   - Real working examples
   - Reference implementations

---

## Environment Configuration

Each generated project has `.env.example`:

```bash
# Copy the template
cp .env.example .env

# Edit with your values
nano .env
```

Common variables:
- `DATABASE_URL` - PostgreSQL connection string
- `API_KEY` - Your API keys
- `SECRET_KEY` - Session/auth secrets
- `DEBUG` - Development mode (true/false)
- `PORT` - Server port (default: 3000/8000)

---

## Deployment

### Docker

All templates are Docker-ready:

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

### Platform Specific

**Vercel** (Next.js)
- Push to GitHub
- Connect in Vercel dashboard
- Auto-deploys on push

**Railway/Render** (Any template)
- Connect Git repo
- Select template type
- Auto-configures and deploys

**AWS/Azure/GCP**
- Use Dockerfile
- Push Docker image to registry
- Deploy using container services

**Local/Self-hosted**
- See Dockerfile
- Docker Compose included
- Run: `docker-compose up -d`

---

## Troubleshooting

### "Port already in use"
```bash
# Change PORT in .env
PORT=3001

# or kill existing process
# macOS/Linux: lsof -ti:3000 | xargs kill -9
# Windows: netstat -ano | findstr :3000, then taskkill /PID <PID> /F
```

### "Dependencies fail to install"
```bash
# Clear cache and retry
npm cache clean --force
npm install

# Or Python:
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### ".env not found"
```bash
cp .env.example .env
# Edit .env with your values
```

### "Cannot connect to database"
```bash
# Check DATABASE_URL in .env
# Verify database is running
# Check credentials are correct
```

---

## Get Help

1. **CLI Help:**
   ```bash
   npx create-stack-app --help
   npx create-stack-app new --help
   ```

2. **See all templates:**
   ```bash
   npx create-stack-app list
   ```

3. **Template documentation:**
   - Read [TEMPLATES_GUIDE.md](TEMPLATES_GUIDE.md)
   - Check generated project's README.md
   - Explore `generated-samples/` folder

4. **Repository:**
   - GitHub: [your-repo-url]
   - Issues: Report bugs
   - Discussions: Ask questions

---

## Next Steps

✅ Choose a template  
✅ Generate your project  
✅ Install dependencies  
✅ Start `dev` server  
✅ Modify source code  
✅ Commit to Git  
✅ Deploy when ready  

**Happy building!** 🚀
