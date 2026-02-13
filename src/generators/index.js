import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateProject(projectPath, templateId, templateConfig, features) {
  try {
    console.log(`\n📝 Generating ${templateConfig.name} (${templateId})...`);
    
    // Generate common files
    console.log('  → Creating common files (README, .gitignore, config)...');
    await generateReadme(projectPath, templateConfig, features);
    await generateGitignore(projectPath, templateConfig.language);
    
    if (features.includes('docker')) {
      console.log('  → Creating Docker files...');
      await generateDockerFiles(projectPath, templateConfig.language);
    }
    
    if (features.includes('ci')) {
      console.log('  → Creating GitHub Actions CI/CD...');
      await generateGitHubActions(projectPath, templateConfig.language);
    }

    if (features.includes('vscode')) {
      console.log('  → Creating VS Code settings...');
      await generateVSCodeSettings(projectPath, templateConfig.language);
    }

    // Generate template-specific files
    console.log(`  → Creating ${templateId}-specific files...`);
    switch (templateId) {
      case 'nextjs-saas':
        await generateNextJsSaas(projectPath, features);
        break;
      case 'react-vite':
        await generateReactVite(projectPath, features);
        break;
      case 'node-express-api':
        await generateNodeExpressAPI(projectPath, features);
        break;
      case 'fastapi-modern':
        await generateFastAPI(projectPath, features);
        break;
      case 'rust-axum':
        await generateRustAxum(projectPath, features);
        break;
      case 'go-fiber':
        await generateGoFiber(projectPath, features);
        break;
      // Add more template generators as needed
      default:
        console.log(`  ⚠️  No specific generator for ${templateId}, using basic structure...`);
        await generateBasicStructure(projectPath, templateConfig);
    }
    
    console.log('  ✅ Project generation complete!\n');
  } catch (error) {
    console.error(`  ❌ Error generating project: ${error.message}`);
    console.error(error.stack);
    throw error;
  }
}

async function generateReadme(projectPath, templateConfig, features) {
  const readme = `# ${path.basename(projectPath)}

## 📖 Overview

${templateConfig.description}

**Stack:** ${templateConfig.language}  
**Template:** ${templateConfig.name}

## ✨ Features

${templateConfig.features.map(f => `- ${f}`).join('\n')}

${features.length > 0 ? `\n## 🔧 Additional Features\n\n${features.map(f => `- ${f}`).join('\n')}` : ''}

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for TypeScript/JavaScript projects)
- Python 3.11+ (for Python projects)
- Rust 1.70+ (for Rust projects)
- Go 1.21+ (for Go projects)

### Installation

\`\`\`bash
# Clone the repository
cd ${path.basename(projectPath)}

# Install dependencies
${templateConfig.language === 'TypeScript' || templateConfig.language === 'JavaScript' 
  ? 'npm install'
  : templateConfig.language === 'Python'
  ? 'python -m venv venv\nsource venv/bin/activate  # On Windows: venv\\Scripts\\activate\npip install -r requirements.txt'
  : templateConfig.language === 'Rust'
  ? 'cargo build'
  : templateConfig.language === 'Go'
  ? 'go mod download'
  : 'See documentation'}
\`\`\`

### Running the Application

\`\`\`bash
${templateConfig.language === 'TypeScript' || templateConfig.language === 'JavaScript'
  ? 'npm run dev'
  : templateConfig.language === 'Python'
  ? 'python main.py  # or uvicorn main:app --reload for FastAPI'
  : templateConfig.language === 'Rust'
  ? 'cargo run'
  : templateConfig.language === 'Go'
  ? 'go run main.go'
  : '# See documentation'}
\`\`\`

${features.includes('docker') ? `
### Running with Docker

\`\`\`bash
docker-compose up
\`\`\`
` : ''}

## 📁 Project Structure

\`\`\`
${generateProjectStructure(templateConfig.language)}
\`\`\`

## 🧪 Testing

\`\`\`bash
${templateConfig.language === 'TypeScript' || templateConfig.language === 'JavaScript'
  ? 'npm test'
  : templateConfig.language === 'Python'
  ? 'pytest'
  : templateConfig.language === 'Rust'
  ? 'cargo test'
  : templateConfig.language === 'Go'
  ? 'go test ./...'
  : '# See documentation'}
\`\`\`

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

Contributions are welcome! Please read the contributing guide.

## 📄 License

MIT License - feel free to use this project for anything!

## 🙏 Acknowledgments

Generated with [create-stack-app](https://github.com/yourusername/create-stack-app)

---

⭐ If you find this project useful, please consider giving it a star on GitHub!
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

function generateProjectStructure(language) {
  const structures = {
    TypeScript: `src/
├── components/     # React components
├── lib/           # Utility functions
├── pages/         # Page components
├── styles/        # CSS/styling
└── types/         # TypeScript types`,
    Python: `app/
├── api/           # API routes
├── core/          # Core functionality
├── models/        # Database models
├── services/      # Business logic
└── tests/         # Test files`,
    Rust: `src/
├── handlers/      # Request handlers
├── models/        # Data models
├── routes/        # API routes
└── utils/         # Utilities`,
    Go: `cmd/              # Application entry points
pkg/              # Public libraries
internal/         # Private code
├── handlers/     # HTTP handlers
├── models/       # Data models
└── services/     # Business logic`
  };
  
  return structures[language] || 'See documentation for project structure';
}

async function generateGitignore(projectPath, language) {
  const gitignoreContent = {
    TypeScript: `node_modules/
.next/
dist/
build/
.env
.env.local
*.log
.DS_Store
coverage/`,
    Python: `venv/
__pycache__/
*.pyc
.env
*.log
.pytest_cache/
dist/
build/
*.egg-info/`,
    Rust: `target/
Cargo.lock
.env
*.log`,
    Go: `bin/
*.exe
*.log
.env
vendor/`
  };

  await fs.writeFile(
    path.join(projectPath, '.gitignore'),
    gitignoreContent[language] || 'node_modules/\n.env\n*.log'
  );
}

async function generateDockerFiles(projectPath, language) {
  const dockerfiles = {
    TypeScript: `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]`,
    Python: `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
    Rust: `FROM rust:1.75 as builder

WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/app /usr/local/bin/app

EXPOSE 8080
CMD ["app"]`,
    Go: `FROM golang:1.21 as builder

WORKDIR /app
COPY go.* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o main .

FROM alpine:latest
COPY --from=builder /app/main /main

EXPOSE 8080
CMD ["/main"]`
  };

  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`;

  await fs.writeFile(path.join(projectPath, 'Dockerfile'), dockerfiles[language] || dockerfiles.TypeScript);
  await fs.writeFile(path.join(projectPath, 'docker-compose.yml'), dockerCompose);
}

async function generateGitHubActions(projectPath, language) {
  const workflow = `name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
`;

  await fs.ensureDir(path.join(projectPath, '.github', 'workflows'));
  await fs.writeFile(path.join(projectPath, '.github', 'workflows', 'ci.yml'), workflow);
}

async function generateVSCodeSettings(projectPath, language) {
  const settings = {
    'editor.formatOnSave': true,
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': true
    }
  };

  await fs.ensureDir(path.join(projectPath, '.vscode'));
  await fs.writeFile(
    path.join(projectPath, '.vscode', 'settings.json'),
    JSON.stringify(settings, null, 2)
  );
}

// Template-specific generators
async function generateNextJsSaas(projectPath, features) {
  // Create Next.js specific structure
  await fs.ensureDir(path.join(projectPath, 'src', 'app'));
  await fs.ensureDir(path.join(projectPath, 'src', 'components'));
  await fs.ensureDir(path.join(projectPath, 'src', 'lib'));

  // package.json
  const packageJson = {
    name: path.basename(projectPath),
    version: '0.1.0',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      next: '^14.0.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    }
  };

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Simple page
  const page = `export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold">Welcome to your SaaS!</h1>
    </main>
  );
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'app', 'page.tsx'), page);
}

async function generateReactVite(projectPath, features) {
  // Generate package.json
  const packageJson = {
    name: path.basename(projectPath),
    version: '0.1.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      ...(features.includes('testing') && { test: 'vitest' })
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.2.0',
      vite: '^5.0.0',
      typescript: '^5.3.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      ...(features.includes('linting') && {
        eslint: '^8.56.0',
        prettier: '^3.1.0'
      }),
      ...(features.includes('testing') && {
        vitest: '^1.1.0',
        '@testing-library/react': '^14.1.0'
      })
    }
  };

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Generate vite.config.js
  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
`;

  await fs.writeFile(path.join(projectPath, 'vite.config.js'), viteConfig);

  // Generate tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx'
    },
    include: ['src'],
    references: [{ path: './tsconfig.node.json' }]
  };

  await fs.writeFile(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  // Generate tsconfig.node.json
  const tsConfigNode = {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true
    },
    include: ['vite.config.ts']
  };

  await fs.writeFile(
    path.join(projectPath, 'tsconfig.node.json'),
    JSON.stringify(tsConfigNode, null, 2)
  );

  // Create src directory
  await fs.ensureDir(path.join(projectPath, 'src'));

  // Generate src/main.tsx
  const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

  await fs.writeFile(path.join(projectPath, 'src', 'main.tsx'), mainTsx);

  // Generate src/App.tsx
  const appTsx = `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>⚡ React + Vite + TypeScript</h1>
        <p>Lightning-fast React development</p>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
`;

  await fs.writeFile(path.join(projectPath, 'src', 'App.tsx'), appTsx);

  // Generate src/index.css
  const indexCss = `:root {
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'index.css'), indexCss);

  // Generate src/App.css
  const appCss = `.read-the-docs {
  color: #888;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

.card {
  padding: 2em;
}

button {
  background-color: #f0f0f0;
  color: #213547;
  border: 1px solid #ccc;
}

button:hover {
  background-color: #e0e0e0;
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'App.css'), appCss);

  // Generate index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React + Vite + TypeScript</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);

  // Generate .env.example
  const envExample = `VITE_API_URL=http://localhost:3000
VITE_APP_NAME=My React App
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
}

async function generateNodeExpressAPI(projectPath, features) {
  const packageJson = {
    name: path.basename(projectPath),
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'nodemon src/index.js',
      start: 'node src/index.js'
    },
    dependencies: {
      express: '^4.18.0',
      dotenv: '^16.0.0'
    }
  };

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
}

async function generateFastAPI(projectPath, features) {
  const requirements = `fastapi==0.104.0
uvicorn[standard]==0.24.0
sqlalchemy==2.0.0
alembic==1.12.0
pydantic==2.5.0
python-dotenv==1.0.0`;

  await fs.writeFile(path.join(projectPath, 'requirements.txt'), requirements);

  const mainPy = `from fastapi import FastAPI

app = FastAPI(title="My API")

@app.get("/")
def read_root():
    return {"message": "Welcome to your API!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
`;

  await fs.writeFile(path.join(projectPath, 'main.py'), mainPy);
}

async function generateRustAxum(projectPath, features) {
  const cargoToml = `[package]
name = "${path.basename(projectPath).replace(/-/g, '_')}"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
tower = "0.4"
serde = { version = "1.0", features = ["derive"] }
`;

  await fs.writeFile(path.join(projectPath, 'Cargo.toml'), cargoToml);

  await fs.ensureDir(path.join(projectPath, 'src'));
  const mainRs = `use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    
    println!("Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'main.rs'), mainRs);
}

async function generateGoFiber(projectPath, features) {
  const goMod = `module ${path.basename(projectPath)}

go 1.21

require (
    github.com/gofiber/fiber/v2 v2.51.0
    github.com/joho/godotenv v1.5.1
)`;

  await fs.writeFile(path.join(projectPath, 'go.mod'), goMod);

  const mainGo = `package main

import (
    "github.com/gofiber/fiber/v2"
    "log"
)

func main() {
    app := fiber.New()

    app.Get("/", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{
            "message": "Hello, World!",
        })
    })

    log.Fatal(app.Listen(":3000"))
}`;

  await fs.writeFile(path.join(projectPath, 'main.go'), mainGo);
}

async function generateBasicStructure(projectPath, templateConfig) {
  // Fallback for templates without specific generators
  await fs.writeFile(
    path.join(projectPath, 'SETUP.md'),
    `# Setup Instructions\n\nThis template is under construction.\nPlease refer to the README.md for more information.`
  );
}
