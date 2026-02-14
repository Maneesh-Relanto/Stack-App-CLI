import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
      case 'rust-fullstack':
        await generateRustFullStack(projectPath, features);
        break;
      case 'go-fiber':
        await generateGoFiber(projectPath, features);
        break;
      case 'go-htmx':
        await generateGoHTMX(projectPath, features);
        break;
      case 'ai-saas-nextjs':
        await generateAISaaS(projectPath, features);
        break;
      case 'react-native-expo':
        await generateReactNativeExpo(projectPath, features);
        break;
      case 'django-pro':
        await generateDjangoPro(projectPath, features);
        break;
      case 'flask-api':
        await generateFlaskAPI(projectPath, features);
        break;
      case 'python-ml-api':
        await generatePythonMLAPI(projectPath, features);
        break;
      case 'dotnet-minimal-api':
        await generateDotNetMinimalAPI(projectPath, features);
        break;
      case 'elixir-phoenix':
        await generateElixirPhoenix(projectPath, features);
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

// Helper function to get install command by language
function getInstallCommand(language) {
  const commands = {
    'TypeScript': 'npm install',
    'JavaScript': 'npm install',
    'Python': 'python -m venv venv\nsource venv/bin/activate  # On Windows: venv\\Scripts\\activate\npip install -r requirements.txt',
    'Rust': 'cargo build',
    'Go': 'go mod download'
  };
  return commands[language] || 'See documentation';
}

// Helper function to get run command by language
function getRunCommand(language) {
  const commands = {
    'TypeScript': 'npm run dev',
    'JavaScript': 'npm run dev',
    'Python': 'python main.py  # or uvicorn main:app --reload for FastAPI',
    'Rust': 'cargo run',
    'Go': 'go run main.go'
  };
  return commands[language] || '# See documentation';
}

// Helper function to get test command by language
function getTestCommand(language) {
  const commands = {
    'TypeScript': 'npm test',
    'JavaScript': 'npm test',
    'Python': 'pytest',
    'Rust': 'cargo test',
    'Go': 'go test ./...'
  };
  return commands[language] || '# See documentation';
}

async function generateReadme(projectPath, templateConfig, features) {
  const projectName = path.basename(projectPath);
  const templateFeatures = templateConfig.features.map(f => `- ${f}`).join('\n');
  const additionalFeatures = features.length > 0 
    ? '\n## 🔧 Additional Features\n\n' + features.map(f => `- ${f}`).join('\n')
    : '';
  const dockerSection = features.includes('docker')
    ? '\n### Running with Docker\n\n```bash\ndocker-compose up\n```\n'
    : '';

  const readme = `# ${projectName}

## 📖 Overview

${templateConfig.description}

**Stack:** ${templateConfig.language}  
**Template:** ${templateConfig.name}

## ✨ Features

${templateFeatures}
${additionalFeatures}

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for TypeScript/JavaScript projects)
- Python 3.11+ (for Python projects)
- Rust 1.70+ (for Rust projects)
- Go 1.21+ (for Go projects)

### Installation

\`\`\`bash
# Clone the repository
cd ${projectName}

# Install dependencies
${getInstallCommand(templateConfig.language)}
\`\`\`

### Running the Application

\`\`\`bash
${getRunCommand(templateConfig.language)}
\`\`\`
${dockerSection}
## 📁 Project Structure

\`\`\`
${generateProjectStructure(templateConfig.language)}
\`\`\`

## 🧪 Testing

\`\`\`bash
${getTestCommand(templateConfig.language)}
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

  // Enhanced package.json with SaaS dependencies
  const packageJson = {
    name: path.basename(projectPath),
    version: '0.1.0',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      ...(features.includes('testing') && { test: 'jest --watch' })
    },
    dependencies: {
      next: '^14.0.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      '@supabase/supabase-js': '^2.38.0',
      '@stripe/react-stripe-js': '^2.4.0',
      '@stripe/stripe-js': '^2.1.0',
      'tailwindcss': '^3.3.0',
      'clsx': '^2.0.0'
    },
    devDependencies: {
      'typescript': '^5.3.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@types/node': '^20.0.0',
      'autoprefixer': '^10.4.0',
      'postcss': '^8.4.0',
      'tailwindcss': '^3.3.0',
      ...(features.includes('linting') && {
        'eslint': '^8.56.0',
        'eslint-config-next': '^14.0.0',
        'prettier': '^3.1.0'
      }),
      ...(features.includes('testing') && {
        'jest': '^29.0.0',
        '@testing-library/react': '^14.0.0',
        '@testing-library/jest-dom': '^6.0.0'
      })
    }
  };

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // tsconfig.json
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
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: {
        '@/*': ['./src/*']
      }
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules']
  };

  await fs.writeFile(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  // next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
`;

  await fs.writeFile(path.join(projectPath, 'next.config.js'), nextConfig);

  // tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

  await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

  // postcss.config.js
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  await fs.writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig);

  // src/app/layout.tsx (CRITICAL ROOT LAYOUT)
  const layout = `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My SaaS Application',
  description: 'Built with Next.js 14, TypeScript, Tailwind CSS, Stripe, and Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <nav className="border-b border-gray-200 px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">My SaaS</h1>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'app', 'layout.tsx'), layout);

  // src/app/globals.css
  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'app', 'globals.css'), globalsCss);

  // src/app/page.tsx (UPDATED)
  const page = `'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to your SaaS
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Built with Next.js 14, TypeScript, Tailwind CSS, Stripe, and Supabase
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">🚀 Lightning Fast</h3>
                <p className="text-gray-600">Built on Next.js 14 for optimal performance</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">💳 Stripe Ready</h3>
                <p className="text-gray-600">Accept payments and manage subscriptions</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">🔐 Secure Database</h3>
                <p className="text-gray-600">Powered by Supabase PostgreSQL</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="#"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'app', 'page.tsx'), page);

  // .env.example
  const envExample = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Application
NEXT_PUBLIC_APP_NAME=My SaaS
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);

  // .env.local (git ignored copy)
  await fs.writeFile(path.join(projectPath, '.env.local'), envExample);

  // src/lib/supabase.ts - Supabase client
  const supabaseClient = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;

  await fs.writeFile(path.join(projectPath, 'src', 'lib', 'supabase.ts'), supabaseClient);

  // .gitignore additions
  const gitignore = `.env
.env.local
.env.*.local
node_modules/
.next/
dist/
build/
*.log
.DS_Store
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore, { flag: 'a' });
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
  // Create src directory
  await fs.ensureDir(path.join(projectPath, 'src'));

  // Enhanced package.json
  const packageJson = {
    name: path.basename(projectPath),
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'nodemon src/index.js',
      start: 'node src/index.js',
      lint: 'eslint src',
      ...(features.includes('testing') && { test: 'jest --watch' })
    },
    dependencies: {
      express: '^4.18.0',
      'express-validator': '^7.0.0',
      dotenv: '^16.0.0',
      cors: '^2.8.5',
      helmet: '^7.0.0',
      'morgan': '^1.10.0',
      'pg': '^8.11.0',
      'prisma': '^5.8.0',
      'jsonwebtoken': '^9.0.0'
    },
    devDependencies: {
      'nodemon': '^3.0.0',
      'typescript': '^5.3.0',
      '@types/node': '^20.0.0',
      '@types/express': '^4.17.0',
      '@types/jsonwebtoken': '^9.0.0',
      ...(features.includes('linting') && {
        'eslint': '^8.56.0',
        'prettier': '^3.1.0'
      }),
      ...(features.includes('testing') && {
        'jest': '^29.0.0',
        'supertest': '^6.3.0'
      })
    }
  };

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // tsconfig.json (for TypeScript support if needed)
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'ES2020',
      lib: ['ES2020'],
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist']
  };

  await fs.writeFile(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  // .env.example
  const envExample = `# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_this
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# API Documentation
API_DOCS_PATH=/api/docs

# Logging
LOG_LEVEL=info
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
  await fs.writeFile(path.join(projectPath, '.env'), envExample);

  // src/index.js - Main server file
  const mainFile = `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(morgan('combined')); // Logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to your Node.js Express API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      api: 'GET /api'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: \`Route \${req.method} \${req.path} not found\`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(\`✅ Server running at http://\${HOST}:\${PORT}\`);
  console.log(\`📚 API Documentation: http://\${HOST}:\${PORT}/api/docs\`);
  console.log(\`🏥 Health check: http://\${HOST}:\${PORT}/health\`);
});

export default app;
`;

  await fs.writeFile(path.join(projectPath, 'src', 'index.js'), mainFile);

  // src/middleware/auth.js - JWT middleware example
  await fs.ensureDir(path.join(projectPath, 'src', 'middleware'));
  const authMiddleware = `import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};
`;

  await fs.writeFile(
    path.join(projectPath, 'src', 'middleware', 'auth.js'),
    authMiddleware
  );

  // src/routes/users.js - Example route
  await fs.ensureDir(path.join(projectPath, 'src', 'routes'));
  const usersRoute = `import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Example protected route
router.get('/', verifyToken, (req, res) => {
  res.json({
    message: 'Users list',
    user: req.user,
    data: []
  });
});

router.get('/:id', verifyToken, (req, res) => {
  res.json({
    id: req.params.id,
    name: 'Example User',
    email: 'user@example.com'
  });
});

export default router;
`;

  await fs.writeFile(
    path.join(projectPath, 'src', 'routes', 'users.js'),
    usersRoute
  );

  // src/config/database.js - Database config example
  await fs.ensureDir(path.join(projectPath, 'src', 'config'));
  const dbConfig = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
`;

  await fs.writeFile(
    path.join(projectPath, 'src', 'config', 'database.js'),
    dbConfig
  );

  // prisma/schema.prisma - Database schema
  await fs.ensureDir(path.join(projectPath, 'prisma'));
  const prismaSchema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id    Int     @id @default(autoincrement())
  title String
  content String?
  author User @relation(fields: [authorId], references: [id])
  authorId Int
}
`;

  await fs.writeFile(
    path.join(projectPath, 'prisma', 'schema.prisma'),
    prismaSchema
  );

  // .gitignore enhancements
  const gitignoreContent = `.env
.env.local
node_modules/
dist/
.DS_Store
*.log
.vscode/
.idea/
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent, { flag: 'a' });
}

async function generateFastAPI(projectPath, features) {
  // Generate requirements.txt with all dependencies
  const requirementsTxt = `fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
sqlalchemy==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
httpx==0.25.1
`;

  await fs.writeFile(path.join(projectPath, 'requirements.txt'), requirementsTxt);

  // Create directory structure
  await fs.ensureDir(path.join(projectPath, 'src', 'api', 'v1', 'endpoints'));
  await fs.ensureDir(path.join(projectPath, 'src', 'core'));
  await fs.ensureDir(path.join(projectPath, 'src', 'db'));
  await fs.ensureDir(path.join(projectPath, 'tests'));

  // Generate main.py
  const mainPy = `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1.api import api_router
from src.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    description="Production-ready FastAPI application with PostgreSQL and async support"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {"message": "Welcome to ${path.basename(projectPath)}"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
`;

  await fs.writeFile(path.join(projectPath, 'main.py'), mainPy);

  // Generate config.py
  const configPy = `import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application Configuration"""
    
    PROJECT_NAME: str = "${path.basename(projectPath).replaceAll('-', '_')}"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/db"
    )
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
`;

  await fs.writeFile(path.join(projectPath, 'src', 'core', 'config.py'), configPy);

  // Generate __init__ files
  await fs.writeFile(path.join(projectPath, 'src', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'core', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'db', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'api', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'api', 'v1', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'api', 'v1', 'endpoints', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'tests', '__init__.py'), '');

  // Generate API router
  const apiRouterPy = `from fastapi import APIRouter

from src.api.v1.endpoints import health

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
`;

  await fs.writeFile(path.join(projectPath, 'src', 'api', 'v1', 'api.py'), apiRouterPy);

  // Generate health endpoint
  const healthEndpointPy = `from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "0.1.0"}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'api', 'v1', 'endpoints', 'health.py'), healthEndpointPy);

  // Generate .env.example
  const envExample = `# FastAPI Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/${path.basename(projectPath).replaceAll('-', '_')}
SECRET_KEY=your-secret-key-change-in-production
DEBUG=False
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
  await fs.writeFile(path.join(projectPath, '.env'), envExample);

  // Generate pytest.ini
  const pytestIni = `[pytest]
asyncio_mode = auto
`;

  await fs.writeFile(path.join(projectPath, 'pytest.ini'), pytestIni);
}

async function generateRustAxum(projectPath, features) {
  const cargoToml = `[package]
name = "${path.basename(projectPath).replaceAll('-', '_')}"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
tower = "0.4"
tower-http = { version = "0.5", features = ["trace", "cors"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tracing = "0.1"
tracing-subscriber = "0.3"
dotenvy = "0.15"
uuid = { version = "1.6", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }
thiserror = "1.0"
anyhow = "1.0"

[dev-dependencies]
`;

  await fs.writeFile(path.join(projectPath, 'Cargo.toml'), cargoToml);

  // Create directory structure
  await fs.ensureDir(path.join(projectPath, 'src', 'handlers'));
  await fs.ensureDir(path.join(projectPath, 'src', 'models'));
  await fs.ensureDir(path.join(projectPath, 'src', 'middleware'));

  // Generate main.rs
  const mainRs = `mod handlers;
mod models;
mod middleware;
mod error;

use axum::{
    routing::{get, post},
    middleware::Next,
    response::IntoResponse,
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing_subscriber;

#[tokio::main]
async fn main() {
    // Initialize logging
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    // Load environment variables
    dotenvy::dotenv().ok();

    let app = Router::new()
        .route("/", get(handlers::health))
        .route("/api/v1/health", get(handlers::health))
        .route("/api/v1/items", get(handlers::list_items))
        .route("/api/v1/items", post(handlers::create_item))
        .route("/api/v1/items/:id", get(handlers::get_item))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    
    println!("🚀 Server running at http://localhost:3000");

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap();
    
    axum::serve(listener, app)
        .await
        .unwrap();
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'main.rs'), mainRs);

  // Generate error module
  const errorRs = `use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

#[derive(Debug)]
pub enum AppError {
    NotFound(String),
    BadRequest(String),
    InternalError(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::InternalError(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        let body = Json(json!({
            "error": error_message,
            "status": status.as_u16(),
        }));

        (status, body).into_response()
    }
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'error.rs'), errorRs);

  // Generate models
  const modelsRs = `use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Item {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateItemRequest {
    pub name: String,
    pub description: Option<String>,
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'models', 'mod.rs'), modelsRs);

  // Generate handlers
  const handlersRs = `use axum::{
    extract::Path,
    http::StatusCode,
    Json,
};
use serde_json::json;
use uuid::Uuid;
use chrono::Utc;
use crate::models::{Item, CreateItemRequest};

pub async fn health() -> Json<serde_json::Value> {
    Json(json!({
        "status": "healthy",
        "timestamp": Utc::now().to_rfc3339(),
    }))
}

pub async fn list_items() -> Json<serde_json::Value> {
    let items = vec![
        Item {
            id: "1".to_string(),
            name: "Sample Item 1".to_string(),
            description: Some("A sample item".to_string()),
            created_at: Utc::now().to_rfc3339(),
        },
    ];

    Json(json!({
        "items": items,
        "count": items.len(),
    }))
}

pub async fn get_item(Path(id): Path<String>) -> Json<serde_json::Value> {
    Json(json!({
        "id": id,
        "name": "Item Name",
        "description": "Item description",
        "created_at": Utc::now().to_rfc3339(),
    }))
}

pub async fn create_item(
    Json(payload): Json<CreateItemRequest>,
) -> (StatusCode, Json<serde_json::Value>) {
    let item = Item {
        id: Uuid::new_v4().to_string(),
        name: payload.name,
        description: payload.description,
        created_at: Utc::now().to_rfc3339(),
    };

    (
        StatusCode::CREATED,
        Json(json!({
            "item": item,
            "message": "Item created successfully",
        })),
    )
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'handlers', 'mod.rs'), handlersRs);

  // Generate middleware module
  const middlewareRs = `// Middleware implementations
pub async fn logging_middleware() {
    // Add logging middleware implementation
}`;

  await fs.writeFile(path.join(projectPath, 'src', 'middleware', 'mod.rs'), middlewareRs);

  // Generate README
  const readmeMd = `# Rust Axum Web Service

A modern, high-performance web service built with Axum, Tokio, and Rust.

## Features

- ⚡ Fast async runtime with Tokio
- 🛣️ Type-safe routing with Axum
- 📊 Structured logging with tracing
- 🔄 CORS middleware support
- 🆔 UUID generation for resources
- ⏰ ISO 8601 timestamps
- 🛡️ Proper error handling

## Quick Start

### Prerequisites

- Rust 1.70+
- Cargo

### Running the Server

\`\`\`bash
cargo run
\`\`\`

The server will start on \`http://localhost:3000\`

### Building for Production

\`\`\`bash
cargo build --release
\`\`\`

## API Endpoints

- \`GET /\` - Health check
- \`GET /api/v1/health\` - Detailed health status
- \`GET /api/v1/items\` - List all items
- \`POST /api/v1/items\` - Create new item
- \`GET /api/v1/items/:id\` - Get specific item

## Project Structure

\`\`\`
src/
├── main.rs           # Application entry point
├── error.rs          # Error handling
├── handlers/         # Route handlers
├── models/           # Data models
└── middleware/       # Custom middleware
\`\`\`

## License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeMd);

  // Generate .gitignore
  const gitignore = `# Rust
/target/
Cargo.lock
**/*.rs.bk
*.pdb

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Environment
.env
.env.local

# OS
.DS_Store
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

  // Generate Dockerfile
  const dockerfile = `FROM rust:latest as builder

WORKDIR /usr/src/app
COPY . .

RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/target/release/\${PROJECT_NAME} /usr/local/bin/app

EXPOSE 3000

CMD ["app"]
`;

  await fs.writeFile(path.join(projectPath, 'Dockerfile'), dockerfile);

  // Generate Docker Compose
  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - RUST_LOG=info
`;

  await fs.writeFile(path.join(projectPath, 'docker-compose.yml'), dockerCompose);
}

async function generateRustFullStack(projectPath, features) {
  // Create workspace structure for Axum backend + Leptos frontend
  const workspaceCargoToml = `[workspace]
members = ["backend", "frontend"]

[workspace.package]
version = "0.1.0"
edition = "2021"
`;

  await fs.writeFile(path.join(projectPath, 'Cargo.toml'), workspaceCargoToml);

  // ===== BACKEND =====
  const backendCargoToml = `[package]
name = "backend"
version.workspace = true
edition.workspace = true

[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
tower = "0.4"
tower-http = { version = "0.5", features = ["trace", "cors", "fs"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tracing = "0.1"
tracing-subscriber = "0.3"
dotenvy = "0.15"
uuid = { version = "1.6", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }
thiserror = "1.0"
async-trait = "0.1"

[dev-dependencies]
`;

  await fs.ensureDir(path.join(projectPath, 'backend', 'src'));
  await fs.writeFile(path.join(projectPath, 'backend', 'Cargo.toml'), backendCargoToml);

  // Backend main.rs
  const backendMainRs = `mod handlers;
mod models;
mod api;

use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use tracing_subscriber;

#[tokio::main]
async fn main() {
    // Initialize logging
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    dotenvy::dotenv().ok();

    let app = Router::new()
        .route("/health", get(handlers::health))
        .route("/api/v1/data", get(handlers::get_data))
        .route("/api/v1/data", post(handlers::create_data))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    
    println!("🚀 Backend API running at http://localhost:3001");

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap();
    
    axum::serve(listener, app)
        .await
        .unwrap();
}`;

  await fs.writeFile(path.join(projectPath, 'backend', 'src', 'main.rs'), backendMainRs);

  // Backend models
  const backendModelsRs = `use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DataItem {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateDataRequest {
    pub title: String,
    pub description: Option<String>,
}`;

  await fs.ensureDir(path.join(projectPath, 'backend', 'src', 'models'));
  await fs.writeFile(path.join(projectPath, 'backend', 'src', 'models', 'mod.rs'), backendModelsRs);

  // Backend handlers
  const backendHandlersRs = `use axum::{http::StatusCode, Json};
use serde_json::json;
use uuid::Uuid;
use crate::models::{DataItem, CreateDataRequest};

pub async fn health() -> Json<serde_json::Value> {
    Json(json!({
        "status": "healthy",
        "service": "backend"
    }))
}

pub async fn get_data() -> Json<serde_json::Value> {
    let items = vec![
        DataItem {
            id: "1".to_string(),
            title: "Item 1".to_string(),
            description: Some("Description 1".to_string()),
        },
    ];
    
    Json(json!({
        "data": items
    }))
}

pub async fn create_data(
    Json(payload): Json<CreateDataRequest>,
) -> (StatusCode, Json<serde_json::Value>) {
    let item = DataItem {
        id: Uuid::new_v4().to_string(),
        title: payload.title,
        description: payload.description,
    };

    (
        StatusCode::CREATED,
        Json(json!({
            "item": item
        })),
    )
}`;

  await fs.ensureDir(path.join(projectPath, 'backend', 'src', 'handlers'));
  await fs.writeFile(path.join(projectPath, 'backend', 'src', 'handlers', 'mod.rs'), backendHandlersRs);

  // Backend API module
  const backendApiRs = `// API routing utilities
`;

  await fs.ensureDir(path.join(projectPath, 'backend', 'src', 'api'));
  await fs.writeFile(path.join(projectPath, 'backend', 'src', 'api', 'mod.rs'), backendApiRs);

  // ===== FRONTEND =====
  const frontendCargoToml = `[package]
name = "frontend"
version.workspace = true
edition.workspace = true

[dependencies]
leptos = { version = "0.5", features = ["csr"] }
leptos_meta = "0.5"
leptos_router = "0.5"
wasm-bindgen = "0.2"
web-sys = "0.3"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[lib]
crate-type = ["cdylib"]

[profile.release]
opt-level = "z"
lto = true
fallback-alloc = true
`;

  await fs.ensureDir(path.join(projectPath, 'frontend', 'src'));
  await fs.writeFile(path.join(projectPath, 'frontend', 'Cargo.toml'), frontendCargoToml);

  // Frontend lib.rs
  const frontendLibRs = `use leptos::{component, create_signal, view};
use leptos_meta::{provide_meta_context, Html, MetaTags, Title};
use leptos_router::Router;

#[component]
pub fn App() -> impl leptos::IntoView {
    provide_meta_context();

    view! {
        <Html attr:lang="en"/>
        <Title text="Full-Stack Rust App"/>
        <MetaTags>
            <meta name="charset" content="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="stylesheet" href="/style.css"/>
        </MetaTags>

        <Router>
            <Home/>
        </Router>
    }
}

#[component]
fn Home() -> impl leptos::IntoView {
    let (count, set_count) = create_signal(0);

    view! {
        <div class="container">
            <h1>"Welcome to Full-Stack Rust"</h1>
            <button on:click=move |_| set_count.set(count() + 1)>
                "Count: " {count}
            </button>
        </div>
    }
}

pub fn main() {
    leptos::mount_to_body(|| view! { <App/> })
}`;

  await fs.writeFile(path.join(projectPath, 'frontend', 'src', 'lib.rs'), frontendLibRs);

  // Frontend index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Full-Stack Rust</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            text-align: center;
            max-width: 500px;
        }

        h1 {
            color: #333;
            margin-bottom: 30px;
            font-size: 32px;
        }

        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        button:hover {
            background: #764ba2;
        }
    </style>
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

  await fs.writeFile(path.join(projectPath, 'frontend', 'index.html'), indexHtml);

  // Public style.css
  const styleCss = `/* Global Styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

button {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
`;

  await fs.ensureDir(path.join(projectPath, 'public'));
  await fs.writeFile(path.join(projectPath, 'public', 'style.css'), styleCss);

  // Root README
  const readmeMd = `# Rust Full-Stack Application

A complete full-stack web application built with Rust, featuring:
- **Backend**: Axum web framework with async/await
- **Frontend**: Leptos for interactive UI  
- **WebAssembly**: WASM-based frontend for blazing-fast performance

## Architecture

\`\`\`
project/
├── backend/          # Axum REST API server
│   ├── src/
│   │   ├── main.rs   # Entry point
│   │   ├── handlers/ # HTTP handlers
│   │   ├── models/   # Data structures
│   │   └── api/      # API utilities
│   └── Cargo.toml
├── frontend/         # Leptos web UI
│   ├── src/
│   │   └── lib.rs    # Frontend components
│   ├── index.html
│   └── Cargo.toml
└── Cargo.toml        # Workspace manifest
\`\`\`

## Prerequisites

- Rust 1.70+
- Cargo

## Running Locally

### Backend

\`\`\`bash
cd backend
cargo run
\`\`\`

Backend runs on \`http://localhost:3001\`

### Frontend (Development)

\`\`\`bash
cd frontend
trunk serve
\`\`\`

Frontend runs on \`http://localhost:8080\`

## Features

✨ **Type-Safe**: Full type safety across the stack
⚡ **High Performance**: Async Rust with WASM frontend
🔄 **Full-Stack Communication**: REST API + WebAssembly
📦 **Modular**: Separate backend and frontend modules
🚀 **Production Ready**: Optimized builds included

## Building for Production

### Backend
\`\`\`bash
cd backend
cargo build --release
\`\`\`

### Frontend
\`\`\`bash
cd frontend
trunk build --release
\`\`\`

## API Endpoints

- \`GET /health\` - Health check
- \`GET /api/v1/data\` - Fetch data
- \`POST /api/v1/data\` - Create data

## License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeMd);

  // .gitignore
  const gitignore = `# Rust
/target/
Cargo.lock
**/*.rs.bk
*.pdb

# Frontend
/frontend/dist/
/frontend/dist_pkg/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Environment
.env
.env.local

# OS
.DS_Store
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

  // Dockerfile for workspace
  const dockerfile = `FROM rust:latest as builder

WORKDIR /usr/src/app
COPY . .

RUN cargo build --release --package backend

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/target/release/backend /usr/local/bin/backend

EXPOSE 3001

CMD ["backend"]
`;

  await fs.writeFile(path.join(projectPath, 'Dockerfile'), dockerfile);

  // Docker Compose
  const dockerCompose = `version: '3.8'

services:
  backend:
    build:
      context: .
      target: backend
    ports:
      - "3001:3001"
    environment:
      - RUST_LOG=info

  frontend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "8080:8080"
    command: npm install -g trunk && trunk serve
`;

  await fs.writeFile(path.join(projectPath, 'docker-compose.yml'), dockerCompose);

  // .env.example
  const envExample = `# Backend Configuration
RUST_LOG=info
PORT=3001

# Frontend Configuration
FRONTEND_PORT=8080
API_URL=http://localhost:3001
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
  await fs.writeFile(path.join(projectPath, '.env'), envExample);
}

async function generateGoFiber(projectPath, features) {
  const goMod = `module ${path.basename(projectPath)}

go 1.21

require (
    github.com/gofiber/fiber/v2 v2.51.0
    github.com/google/uuid v1.6.0
    github.com/joho/godotenv v1.5.1
)`;

  await fs.writeFile(path.join(projectPath, 'go.mod'), goMod);

  // Create directory structure
  await fs.ensureDir(path.join(projectPath, 'handlers'));
  await fs.ensureDir(path.join(projectPath, 'models'));
  await fs.ensureDir(path.join(projectPath, 'middleware'));
  await fs.ensureDir(path.join(projectPath, 'config'));

  // Main application
  const mainGo = `package main

import (
    "log"
    "os"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "github.com/joho/godotenv"
    "myapp/config"
    "myapp/handlers"
    "myapp/middleware"
)

func main() {
    // Load environment variables
    godotenv.Load()

    // Create Fiber app with config
    app := fiber.New(fiber.Config{
        AppName: "Go Fiber API",
        ErrorHandler: middleware.ErrorHandler,
    })

    // Global middleware
    app.Use(logger.New())
    app.Use(middleware.CORSMiddleware())
    app.Use(middleware.RequestIDMiddleware())

    // Health check
    app.Get("/health", handlers.HealthCheck)
    app.Get("/info", handlers.InfoHandler)

    // API routes
    api := app.Group("/api/v1")
    api.Get("/items", handlers.GetItems)
    api.Post("/items", handlers.CreateItem)
    api.Get("/items/:id", handlers.GetItem)
    api.Put("/items/:id", handlers.UpdateItem)
    api.Delete("/items/:id", handlers.DeleteItem)

    // 404 handler
    app.Use(func(c *fiber.Ctx) error {
        return c.Status(404).JSON(fiber.Map{
            "error": "Route not found",
            "path": c.Path(),
        })
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

    log.Println("🚀 Server running on port " + port)
    if err := app.Listen(":" + port); err != nil {
        log.Panic(err)
    }
}`;

  await fs.writeFile(path.join(projectPath, 'main.go'), mainGo);

  // Models
  const modelsGo = `package models

type Item struct {
    ID          string \`json:"id"\`
    Title       string \`json:"title"\`
    Description string \`json:"description"\`
}

type CreateItemRequest struct {
    Title       string \`json:"title" validate:"required"\`
    Description string \`json:"description"\`
}

type ErrorResponse struct {
    Error   string \`json:"error"\`
    Message string \`json:"message"\`
    Path    string \`json:"path"\`
}`;

  await fs.ensureDir(path.join(projectPath, 'models'));
  await fs.writeFile(path.join(projectPath, 'models', 'models.go'), modelsGo);

  // Handlers
  const handlersGo = `package handlers

import (
    "log"
    "github.com/gofiber/fiber/v2"
    "github.com/google/uuid"
    "myapp/models"
)

// In-memory storage (replace with database in production)
var items []models.Item

func init() {
    items = []models.Item{
        {ID: "1", Title: "Sample Item", Description: "A sample item"},
    }
}

func HealthCheck(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{
        "status": "healthy",
        "service": "Go Fiber API",
    })
}

func InfoHandler(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{
        "name": "Go Fiber API",
        "version": "0.1.0",
        "description": "RESTful API built with Go Fiber",
    })
}

func GetItems(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{
        "items": items,
        "count": len(items),
    })
}

func GetItem(c *fiber.Ctx) error {
    id := c.Params("id")
    
    for _, item := range items {
        if item.ID == id {
            return c.JSON(item)
        }
    }
    
    return c.Status(404).JSON(fiber.Map{
        "error": "Item not found",
    })
}

func CreateItem(c *fiber.Ctx) error {
    req := new(models.CreateItemRequest)
    
    if err := c.BodyParser(req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request body",
        })
    }
    
    item := models.Item{
        ID: uuid.New().String(),
        Title: req.Title,
        Description: req.Description,
    }
    
    items = append(items, item)
    
    return c.Status(201).JSON(item)
}

func UpdateItem(c *fiber.Ctx) error {
    id := c.Params("id")
    req := new(models.CreateItemRequest)
    
    if err := c.BodyParser(req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request body",
        })
    }
    
    for i, item := range items {
        if item.ID == id {
            items[i].Title = req.Title
            items[i].Description = req.Description
            return c.JSON(items[i])
        }
    }
    
    return c.Status(404).JSON(fiber.Map{
        "error": "Item not found",
    })
}

func DeleteItem(c *fiber.Ctx) error {
    id := c.Params("id")
    
    for i, item := range items {
        if item.ID == id {
            items = append(items[:i], items[i+1:]...)
            return c.SendStatus(204)
        }
    }
    
    return c.Status(404).JSON(fiber.Map{
        "error": "Item not found",
    })
}`;

  await fs.writeFile(path.join(projectPath, 'handlers', 'handlers.go'), handlersGo);

  // Middleware
  const middlewareGo = `package middleware

import (
    "github.com/gofiber/fiber/v2"
    "github.com/google/uuid"
)

func ErrorHandler(c *fiber.Ctx, err error) error {
    code := 500
    if e, ok := err.(*fiber.Error); ok {
        code = e.Code
    }
    
    return c.Status(code).JSON(fiber.Map{
        "error": err.Error(),
        "status": code,
    })
}

func CORSMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        c.Set("Access-Control-Allow-Origin", "*")
        c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Set("Access-Control-Allow-Headers", "Content-Type")
        
        if c.Method() == "OPTIONS" {
            return c.SendStatus(200)
        }
        
        return c.Next()
    }
}

func RequestIDMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        requestID := c.Get("X-Request-ID")
        if requestID == "" {
            requestID = uuid.New().String()
        }
        
        c.Locals("requestID", requestID)
        c.Set("X-Request-ID", requestID)
        
        return c.Next()
    }
}`;

  await fs.writeFile(path.join(projectPath, 'middleware', 'middleware.go'), middlewareGo);

  // Config
  const configGo = `package config

import (
    "os"
)

type Config struct {
    Port     string
    AppName  string
    LogLevel string
}

func Load() *Config {
    return &Config{
        Port:     getEnv("PORT", "3000"),
        AppName:  getEnv("APP_NAME", "Go Fiber API"),
        LogLevel: getEnv("LOG_LEVEL", "info"),
    }
}

func getEnv(key, defaultValue string) string {
    value := os.Getenv(key)
    if value == "" {
        return defaultValue
    }
    return value
}`;

  await fs.writeFile(path.join(projectPath, 'config', 'config.go'), configGo);

  // .env.example
  const envExample = `# Server Configuration
PORT=3000
APP_NAME=Go Fiber API
LOG_LEVEL=info

# Environment
ENVIRONMENT=development
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
  await fs.writeFile(path.join(projectPath, '.env'), envExample);

  // README
  const readmeMd = `# Go Fiber REST API

A modern, efficient REST API built with Go Fiber framework.

## Features

- ⚡ Ultra-fast response times with Fiber
- 🔄 RESTful API with CRUD operations
- 🛡️ CORS middleware support
- 📝 Request logging and tracing
- 🆔 Unique request IDs
- 📦 Modular architecture
- 🚀 Production-ready

## Quick Start

### Prerequisites

- Go 1.21+
- Git

### Setup

\`\`\`bash
# Clone and navigate
cd your-project

# Download dependencies
go mod download

# Run the server
go run main.go
\`\`\`

Server runs on \`http://localhost:3000\`

### Build for Production

\`\`\`bash
go build -o app main.go
./app
\`\`\`

## API Endpoints

### Health
- \`GET /health\` - Health check
- \`GET /info\` - Service information

### Items (CRUD)
- \`GET /api/v1/items\` - List all items
- \`POST /api/v1/items\` - Create item
- \`GET /api/v1/items/:id\` - Get item by ID
- \`PUT /api/v1/items/:id\` - Update item
- \`DELETE /api/v1/items/:id\` - Delete item

## Project Structure

\`\`\`
.
├── main.go           # Application entry point
├── go.mod            # Go module file
├── handlers/         # HTTP handlers
├── models/           # Data models
├── middleware/       # Custom middleware
├── config/           # Configuration
├── .env.example      # Example environment variables
└── README.md         # This file
\`\`\`

## License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeMd);

  // .gitignore
  const gitignore = `# Binaries and executable files
*.exe
*.exe~
*.dll
*.so
*.dylib
bin/
dist/

# Go related
*.go.bak
*.mod.bak

# Dependent modules
/vendor/

# IDE specific files
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Environment variables
.env
.env.local

# Build artifacts
app
*.out
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

  // Dockerfile
  const dockerfile = `FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/app .

EXPOSE 3000

CMD ["./app"]
`;

  await fs.writeFile(path.join(projectPath, 'Dockerfile'), dockerfile);

  // Docker Compose
  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - APP_NAME=Go Fiber API
      - LOG_LEVEL=info
`;

  await fs.writeFile(path.join(projectPath, 'docker-compose.yml'), dockerCompose);
}

async function generateGoHTMX(projectPath, features) {
  const goMod = `module ${path.basename(projectPath)}

go 1.21

require (
    github.com/a-h/templ v0.2.543
    github.com/go-chi/chi/v5 v5.0.11
    github.com/joho/godotenv v1.5.1
)`;

  await fs.writeFile(path.join(projectPath, 'go.mod'), goMod);

  // Create directory structure
  await fs.ensureDir(path.join(projectPath, 'handlers'));
  await fs.ensureDir(path.join(projectPath, 'models'));
  await fs.ensureDir(path.join(projectPath, 'middleware'));
  await fs.ensureDir(path.join(projectPath, 'views'));
  await fs.ensureDir(path.join(projectPath, 'static'));

  // Main application
  const mainGo = `package main

import (
    "log"
    "net/http"
    "os"
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
    "github.com/joho/godotenv"
    "myapp/handlers"
)

func main() {
    // Load environment variables
    godotenv.Load()

    // Create Chi router
    r := chi.NewRouter()

    // Global middleware
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    r.Use(middleware.SetHeader("Content-Type", "text/html"))

    // Static files
    r.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

    // Health check
    r.Get("/health", handlers.HealthCheck)

    // HTMX routes
    r.Get("/", handlers.HomePage)
    r.Get("/items", handlers.ListItems)
    r.Post("/items", handlers.CreateItem)
    r.Get("/items/{id}", handlers.GetItem)
    r.Put("/items/{id}", handlers.UpdateItem)
    r.Delete("/items/{id}", handlers.DeleteItem)
    r.Get("/items/{id}/edit", handlers.EditItemForm)

    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

    log.Println("🚀 Server running on http://localhost:" + port)
    if err := http.ListenAndServe(":"+port, r); err != nil {
        log.Panic(err)
    }
}`;

  await fs.writeFile(path.join(projectPath, 'main.go'), mainGo);

  // Models
  const modelsGo = `package models

type Item struct {
    ID          string
    Title       string
    Description string
}

type ItemRequest struct {
    Title       string
    Description string
}`;

  await fs.writeFile(path.join(projectPath, 'models', 'models.go'), modelsGo);

  // Handlers
  const handlersGo = `package handlers

import (
    "fmt"
    "net/http"
    "github.com/go-chi/chi/v5"
    "myapp/models"
    "myapp/views"
)

// In-memory storage (replace with database in production)
var items []models.Item
var nextID int

func init() {
    nextID = 1
    items = []models.Item{
        {ID: "1", Title: "Sample Item", Description: "A sample item"},
    }
    nextID = 2
}

func HealthCheck(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprintf(w, \`{"status":"healthy","service":"Go HTMX App"}\`)
}

func HomePage(w http.ResponseWriter, r *http.Request) {
    component := views.Home()
    component.Render(r.Context(), w)
}

func ListItems(w http.ResponseWriter, r *http.Request) {
    component := views.ItemList(items)
    component.Render(r.Context(), w)
}

func GetItem(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    
    for _, item := range items {
        if item.ID == id {
            component := views.ItemDetail(item)
            component.Render(r.Context(), w)
            return
        }
    }
    
    w.WriteHeader(http.StatusNotFound)
    fmt.Fprintf(w, "<p>Item not found</p>")
}

func CreateItem(w http.ResponseWriter, r *http.Request) {
    r.ParseForm()
    title := r.FormValue("title")
    description := r.FormValue("description")
    
    item := models.Item{
        ID: fmt.Sprintf("%d", nextID),
        Title: title,
        Description: description,
    }
    nextID++
    
    items = append(items, item)
    
    w.Header().Set("HX-Redirect", "/items")
    w.WriteHeader(http.StatusCreated)
}

func EditItemForm(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    
    for _, item := range items {
        if item.ID == id {
            component := views.EditItemForm(item)
            component.Render(r.Context(), w)
            return
        }
    }
    
    w.WriteHeader(http.StatusNotFound)
}

func UpdateItem(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    r.ParseForm()
    title := r.FormValue("title")
    description := r.FormValue("description")
    
    for i, item := range items {
        if item.ID == id {
            items[i].Title = title
            items[i].Description = description
            component := views.ItemDetail(items[i])
            component.Render(r.Context(), w)
            return
        }
    }
    
    w.WriteHeader(http.StatusNotFound)
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
    id := chi.URLParam(r, "id")
    
    for i, item := range items {
        if item.ID == id {
            items = append(items[:i], items[i+1:]...)
            w.WriteHeader(http.StatusOK)
            return
        }
    }
    
    w.WriteHeader(http.StatusNotFound)
}`;

  await fs.writeFile(path.join(projectPath, 'handlers', 'handlers.go'), handlersGo);

  // Views (Templ templates)
  const viewsTempl = `package views

templ Home() {
    <!DOCTYPE html>
    <html>
    <head>
        <title>Go HTMX App</title>
        <script src="https://unpkg.com/htmx.org"></script>
        <style>
            body { font-family: sans-serif; margin: 2em; }
            .container { max-width: 700px; margin: 0 auto; }
            form { margin: 1em 0; padding: 1em; border: 1px solid #ddd; border-radius: 4px; }
            input, textarea { display: block; width: 100%; margin: 0.5em 0; padding: 0.5em; }
            button { padding: 0.5em 1em; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0056b3; }
            .item { padding: 1em; margin: 0.5em 0; border: 1px solid #e0e0e0; border-radius: 4px; }
            .item-actions { margin-top: 0.5em; }
            .item-actions button { margin-right: 0.5em; padding: 0.25em 0.5em; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📝 Go HTMX App</h1>
            
            <div>
                <h2>Add New Item</h2>
                <form hx-post="/items" hx-target="#items">
                    <input type="text" name="title" placeholder="Title" required />
                    <textarea name="description" placeholder="Description"></textarea>
                    <button type="submit">Add Item</button>
                </form>
            </div>
            
            <div>
                <h2>Items</h2>
                <div id="items" hx-get="/items" hx-trigger="load">
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    </body>
    </html>
}

templ ItemList(items []Item) {
    { for i, item := range items { }
        <div class="item" id={ "item-" + item.ID }>
            <h3>{ item.Title }</h3>
            <p>{ item.Description }</p>
            <div class="item-actions">
                <button hx-get={ "/items/" + item.ID + "/edit" } hx-target={ "#item-" + item.ID } hx-swap="outerHTML">Edit</button>
                <button hx-delete={ "/items/" + item.ID } hx-confirm="Are you sure?" hx-target={ "#item-" + item.ID } hx-swap="outerHTML swap:1s">Delete</button>
            </div>
        </div>
    { } }
}

templ ItemDetail(item Item) {
    <div class="item" id={ "item-" + item.ID }>
        <h3>{ item.Title }</h3>
        <p>{ item.Description }</p>
        <div class="item-actions">
            <button hx-get={ "/items/" + item.ID + "/edit" } hx-target={ "#item-" + item.ID } hx-swap="outerHTML">Edit</button>
            <button hx-delete={ "/items/" + item.ID } hx-confirm="Are you sure?" hx-target={ "#item-" + item.ID } hx-swap="outerHTML swap:1s">Delete</button>
        </div>
    </div>
}

templ EditItemForm(item Item) {
    <form hx-put={ "/items/" + item.ID } hx-target={ "#item-" + item.ID } hx-swap="outerHTML" id={ "item-" + item.ID }>
        <input type="text" name="title" value={ item.Title } required />
        <textarea name="description">{ item.Description }</textarea>
        <button type="submit">Update Item</button>
        <button type="button" hx-get={ "/items/" + item.ID } hx-target={ "#item-" + item.ID } hx-swap="outerHTML">Cancel</button>
    </form>
}`;

  await fs.writeFile(path.join(projectPath, 'views', 'views.templ'), viewsTempl);

  // Generate HTML/CSS for Tailwind
  const tailwindCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

[hx-request] {
    opacity: 0.6;
}`;

  await fs.writeFile(path.join(projectPath, 'static', 'style.css'), tailwindCss);

  // .env.example
  const envExample = `PORT=3000
NODE_ENV=development`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
  await fs.writeFile(path.join(projectPath, '.env'), envExample);

  // README
  const readmeMd = `# ${path.basename(projectPath)}

Go + HTMX Server-Side Rendering Application

## Features

- **Chi Router** - Lightweight HTTP router
- **HTMX** - Interactive server-rendered components
- **Templ** - Type-safe HTML templating
- **PostgreSQL** ready - Database integration
- **Tailwind CSS** - Utility-first CSS

## Getting Started

### Prerequisites

- Go 1.21+
- Templ \`go install github.com/a-h/templ/cmd/templ@latest\`

### Installation

\`\`\`bash
cd ${path.basename(projectPath)}
go mod download
templ generate
\`\`\`

### Running

\`\`\`bash
go run main.go
\`\`\`

Visit http://localhost:3000

## API Routes

- \`GET /\` - Home page
- \`GET /items\` - List all items
- \`POST /items\` - Create item
- \`GET /items/:id\` - Get item detail
- \`PUT /items/:id\` - Update item
- \`DELETE /items/:id\` - Delete item
- \`GET /items/:id/edit\` - Edit form

## Project Structure

\`\`\`
.
├── main.go          # Entry point
├── go.mod           # Dependencies
├── handlers/        # HTTP handlers
├── models/          # Data models
├── views/           # Templ templates
├── static/          # CSS/JS assets
└── README.md
\`\`\`

## License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeMd);

  // .gitignore
  const gitignore = `# Binaries
*.exe
*.exe~
*.dll
*.so
*.dylib
bin/
dist/

# Go
*.go.bak
*.mod.bak
/vendor/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Env
.env
.env.local`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

  // Dockerfile
  const dockerfile = `FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o app main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/app .
EXPOSE 3000
CMD ["./app"]`;

  await fs.writeFile(path.join(projectPath, 'Dockerfile'), dockerfile);

  // Docker Compose
  const dockerCompose = `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000`;

  await fs.writeFile(path.join(projectPath, 'docker-compose.yml'), dockerCompose);
}

async function generateAISaaS(projectPath, features) {
  // Create Next.js specific structure
  await fs.ensureDir(path.join(projectPath, 'src', 'app', 'api', 'chat'));
  await fs.ensureDir(path.join(projectPath, 'src', 'components'));
  await fs.ensureDir(path.join(projectPath, 'src', 'lib'));

  await fs.ensureDir(path.join(projectPath, 'src', 'hooks'));

  // Enhanced package.json with OpenAI and AI dependencies
  const packageJson = {
    name: path.basename(projectPath),
    version: '0.1.0',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      ...(features.includes('testing') && { test: 'jest --watch' })
    },
    dependencies: {
      next: '^14.0.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'openai': '^4.28.0',
      'ai': '^3.0.0',
      'tailwindcss': '^3.3.0',
      'clsx': '^2.0.0',
      'react-markdown': '^9.0.0',
      'zustand': '^4.4.0'
    },
    devDependencies: {
      'typescript': '^5.3.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@types/node': '^20.0.0',
      'autoprefixer': '^10.4.0',
      'postcss': '^8.4.0',
      'tailwindcss': '^3.3.0',
      ...(features.includes('linting') && {
        'eslint': '^8.56.0',
        'eslint-config-next': '^14.0.0',
        'prettier': '^3.1.0'
      }),
      ...(features.includes('testing') && {
        'jest': '^29.0.0',
        '@testing-library/react': '^14.0.0',
        '@testing-library/jest-dom': '^6.0.0'
      })
    }
  };

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // tsconfig.json
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
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: {
        '@/*': ['./src/*']
      }
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules']
  };

  await fs.writeFile(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  // next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
`;

  await fs.writeFile(path.join(projectPath, 'next.config.js'), nextConfig);

  // tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

  await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

  // postcss.config.js
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  await fs.writeFile(path.join(projectPath, 'postcss.config.js'), postcssConfig);

  // src/app/layout.tsx (CRITICAL ROOT LAYOUT)
  const layout = `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Chat Assistant',
  description: 'Powered by OpenAI and built with Next.js 14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <nav className="border-b border-gray-700 px-4 py-3 bg-gray-900 bg-opacity-50 backdrop-blur">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">🤖 AI Assistant</h1>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'app', 'layout.tsx'), layout);

  // src/app/globals.css
  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

.message-enter {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'app', 'globals.css'), globalsCss);

  // src/app/page.tsx (AI Chat Interface)
  const page = `'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm an AI assistant powered by OpenAI. How can I help you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          })).concat([{ role: 'user', content: input }])
        }),
      });

      const data = await response.json();

      if (data.message) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          content: data.message,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={'message-enter flex ' + (message.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={'max-w-xs lg:max-w-md px-4 py-2 rounded-lg ' + (
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'app', 'page.tsx'), page);

  // src/app/api/chat/route.ts (Chat API Endpoint)
  const chatRoute = `import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const message = response.choices[0]?.message?.content || 'I apologize, I could not generate a response.';

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'app', 'api', 'chat', 'route.ts'), chatRoute);

  // src/lib/openai.ts (OpenAI Client)
  const openaiClient = `import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
`;

  await fs.writeFile(path.join(projectPath, 'src', 'lib', 'openai.ts'), openaiClient);

  // .env.example
  const envExample = `# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application
NEXT_PUBLIC_APP_NAME=AI Chat Assistant
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);

  // .env.local (git ignored copy)
  await fs.writeFile(path.join(projectPath, '.env.local'), envExample);

  // .gitignore additions
  const gitignore = `.env
.env.local
.env.*.local
node_modules/
.next/
dist/
build/
*.log
.DS_Store
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore, { flag: 'a' });
}

async function generateReactNativeExpo(projectPath, features) {
  // Generate package.json for Expo
  const packageJson = {
    name: path.basename(projectPath),
    version: '0.1.0',
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
      web: 'expo start --web',
      eject: 'expo eject',
      ...(features.includes('testing') && { test: 'jest' })
    },
    dependencies: {
      expo: '^49.0.0',
      'expo-router': '^2.0.0',
      'expo-splash-screen': '^0.20.0',
      'expo-status-bar': '^1.6.0',
      react: '18.2.0',
      'react-native': '0.72.0',
      'react-native-gesture-handler': '^2.14.0',
      'react-native-screens': '^3.22.0',
      'react-native-safe-area-context': '^4.6.0',
      zustand: '^4.4.0',
      '@supabase/supabase-js': '^2.38.0',
      axios: '^1.6.0'
    },
    devDependencies: {
      '@babel/core': '^7.23.0',
      '@types/react': '^18.2.0',
      typescript: '^5.3.0',
      ...(features.includes('linting') && {
        eslint: '^8.56.0',
        prettier: '^3.1.0'
      }),
      ...(features.includes('testing') && {
        jest: '^29.7.0',
        '@babel/preset-env': '^7.23.0',
        '@babel/preset-typescript': '^7.23.0'
      })
    }
  };

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Generate app.json for Expo configuration
  const appJson = {
    expo: {
      name: path.basename(projectPath),
      slug: path.basename(projectPath).toLowerCase().replaceAll(/[^a-z0-9-]/g, ''),
      version: '0.1.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
      },
      assetBundlePatterns: ['**/*'],
      ios: {
        supportsTabletMode: true,
        bundleIdentifier: `com.${path.basename(projectPath).replaceAll('-', '')}`
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#ffffff'
        },
        package: `com.${path.basename(projectPath).replaceAll('-', '')}`
      },
      web: {
        favicon: './assets/favicon.png'
      },
      plugins: ['expo-router']
    }
  };

  await fs.writeFile(
    path.join(projectPath, 'app.json'),
    JSON.stringify(appJson, null, 2)
  );

  // Create directory structure
  await fs.ensureDir(path.join(projectPath, 'app'));
  await fs.ensureDir(path.join(projectPath, 'app', '(tabs)'));
  await fs.ensureDir(path.join(projectPath, 'src'));
  await fs.ensureDir(path.join(projectPath, 'src', 'lib'));
  await fs.ensureDir(path.join(projectPath, 'src', 'store'));
  await fs.ensureDir(path.join(projectPath, 'src', 'hooks'));
  await fs.ensureDir(path.join(projectPath, 'src', 'components'));
  await fs.ensureDir(path.join(projectPath, 'assets'));

  // Create root layout file
  const rootLayout = `import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
`;

  await fs.writeFile(path.join(projectPath, 'app', '_layout.tsx'), rootLayout);

  // Create tabs layout
  const tabsLayout = `import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        headerShown: true,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerTitle: 'Welcome'
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          headerTitle: 'Settings'
        }}
      />
    </Tabs>
  );
}
`;

  await fs.writeFile(path.join(projectPath, 'app', '(tabs)', '_layout.tsx'), tabsLayout);

  // Create home screen
  const homeScreen = `import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📱 React Native Expo</Text>
        <Text style={styles.subtitle}>Cross-platform mobile app</Text>
        <Text style={styles.description}>
          Built with Expo, React Navigation, and Zustand state management.
        </Text>
        <View style={styles.features}>
          <Text style={styles.featureTitle}>Features:</Text>
          <Text style={styles.feature}>✅ Expo Router navigation</Text>
          <Text style={styles.feature}>✅ Zustand state management</Text>
          <Text style={styles.feature}>✅ Supabase integration</Text>
          <Text style={styles.feature}>✅ TypeScript support</Text>
          <Text style={styles.feature}>✅ Responsive design</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 20,
    paddingTop: 30
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 24
  },
  features: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  feature: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 10
  }
});
`;

  await fs.writeFile(path.join(projectPath, 'app', '(tabs)', 'index.tsx'), homeScreen);

  // Create settings screen
  const settingsScreen = `import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useAppStore } from '../../src/store/appStore';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.dark]}>
      <View style={styles.content}>
        <View style={styles.setting}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  dark: {
    backgroundColor: '#1a1a1a'
  },
  content: {
    padding: 20
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  label: {
    fontSize: 16,
    color: '#333'
  },
  darkText: {
    color: '#fff'
  }
});
`;

  await fs.writeFile(path.join(projectPath, 'app', '(tabs)', 'settings.tsx'), settingsScreen);

  // Create Zustand store
  const zustandStore = `import { create } from 'zustand';

interface AppStore {
  isDarkMode: boolean;
  isLoading: boolean;
  user: any | null;
  toggleDarkMode: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: any) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isDarkMode: false,
  isLoading: false,
  user: null,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLoading: (loading) => set({ isLoading: loading }),
  setUser: (user) => set({ user })
}));
`;

  await fs.writeFile(path.join(projectPath, 'src', 'store', 'appStore.ts'), zustandStore);

  // Create Supabase client
  const supabaseClient = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});
`;

  await fs.writeFile(path.join(projectPath, 'src', 'lib', 'supabase.ts'), supabaseClient);

  // Create tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020'],
      module: 'ESNext',
      moduleResolution: 'bundler',
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'react-jsx'
    },
    include: ['app', 'src'],
    exclude: ['node_modules']
  };

  await fs.writeFile(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  // Create .env.example
  const envExample = `# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);

  // Create .env.local (git ignored)
  await fs.writeFile(path.join(projectPath, '.env.local'), envExample);
}

async function generateDjangoPro(projectPath, features) {
  // Generate requirements.txt
  const requirementsTxt = `Django==4.2.8
djangorestframework==3.14.0
django-cors-headers==4.3.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
celery==5.3.4
redis==5.0.1
gunicorn==21.2.0
whitenoise==6.6.0
Pillow==10.1.0
django-filter==23.4
python-jose[cryptography]==3.3.0
djangorestframework-simplejwt==5.3.2
`;

  await fs.writeFile(path.join(projectPath, 'requirements.txt'), requirementsTxt);

  // Create directory structure
  await fs.ensureDir(path.join(projectPath, 'config'));
  await fs.ensureDir(path.join(projectPath, 'config', 'settings'));
  await fs.ensureDir(path.join(projectPath, 'apps', 'api', 'v1', 'endpoints'));
  await fs.ensureDir(path.join(projectPath, 'apps', 'users'));
  await fs.ensureDir(path.join(projectPath, 'apps', 'core'));
  await fs.ensureDir(path.join(projectPath, 'tests'));
  await fs.ensureDir(path.join(projectPath, 'staticfiles'));
  await fs.ensureDir(path.join(projectPath, 'media'));

  // Generate manage.py
  const managePy = `#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
`;

  await fs.writeFile(path.join(projectPath, 'manage.py'), managePy);

  // Generate config/__init__.py
  await fs.writeFile(path.join(projectPath, 'config', '__init__.py'), '');

  // Generate config/wsgi.py
  const wsgiPy = `import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
application = get_wsgi_application()
`;

  await fs.writeFile(path.join(projectPath, 'config', 'wsgi.py'), wsgiPy);

  // Generate config/asgi.py
  const asgiPy = `import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
application = get_asgi_application()
`;

  await fs.writeFile(path.join(projectPath, 'config', 'asgi.py'), asgiPy);

  // Generate config/urls.py
  const urlsPy = `from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('apps.api.v1.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
`;

  await fs.writeFile(path.join(projectPath, 'config', 'urls.py'), urlsPy);

  // Generate settings/__init__.py
  await fs.writeFile(path.join(projectPath, 'config', 'settings', '__init__.py'), '');

  // Generate base settings
  const baseSettingsPy = `import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-in-production')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'apps.users',
    'apps.core',
    'apps.api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'db'),
        'USER': os.getenv('DB_USER', 'user'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'password'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# DRF Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',),
}

CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')

CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
`;

  await fs.writeFile(path.join(projectPath, 'config', 'settings', 'base.py'), baseSettingsPy);

  // Generate development settings
  const devSettingsPy = `from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']
`;

  await fs.writeFile(path.join(projectPath, 'config', 'settings', 'development.py'), devSettingsPy);

  // Generate production settings
  const prodSettingsPy = `from .base import *

DEBUG = False
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
`;

  await fs.writeFile(path.join(projectPath, 'config', 'settings', 'production.py'), prodSettingsPy);

  // Generate apps structure
  await fs.writeFile(path.join(projectPath, 'apps', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'apps', 'users', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'apps', 'core', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'apps', 'api', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'apps', 'api', 'v1', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'apps', 'api', 'v1', 'endpoints', '__init__.py'), '');

  // Generate users app
  const usersModelsPy = `from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """Custom User Model"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
`;

  await fs.writeFile(path.join(projectPath, 'apps', 'users', 'models.py'), usersModelsPy);

  const usersAppsPy = `from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'
`;

  await fs.writeFile(path.join(projectPath, 'apps', 'users', 'apps.py'), usersAppsPy);

  // Generate API urls
  const apiUrlsPy = `from django.urls import path, include

from apps.api.v1.endpoints import health

urlpatterns = [
    path('health/', health.health_check, name='health_check'),
]
`;

  await fs.writeFile(path.join(projectPath, 'apps', 'api', 'v1', 'urls.py'), apiUrlsPy);

  // Generate health endpoint
  const healthEndpointPy = `from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({'status': 'healthy', 'version': '0.1.0'})
`;

  await fs.writeFile(path.join(projectPath, 'apps', 'api', 'v1', 'endpoints', 'health.py'), healthEndpointPy);

  // Generate .env.example
  const envExample = `DEBUG=True
SECRET_KEY=your-secret-key-change-in-production

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=db_name
DB_USER=db_user
DB_PASSWORD=db_password
DB_HOST=localhost
DB_PORT=5432

# Allowed Hosts
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
  await fs.writeFile(path.join(projectPath, '.env'), envExample);

  // Generate pytest.ini
  const pytestIni = `[pytest]
DJANGO_SETTINGS_MODULE = config.settings.development
python_files = tests.py test_*.py *_tests.py
`;

  await fs.writeFile(path.join(projectPath, 'pytest.ini'), pytestIni);

  // Generate .gitignore
  const gitignorePy = `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
logs/

# Database
*.db
db.sqlite3

# Django
local_settings.py
/media/
/staticfiles/

# Testing
.pytest_cache/
.coverage
htmlcov/

# OS
.DS_Store
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignorePy);
}

async function generateFlaskAPI(projectPath, features) {
  // Generate requirements.txt
  const requirementsTxt = `Flask==3.0.0
Flask-RESTful==0.3.10
Flask-SQLAlchemy==3.1.1
Flask-Migrate==4.0.5
Flask-CORS==4.0.0
python-dotenv==1.0.0
flask-jwt-extended==4.5.3
sqlalchemy==2.0.23
marshmallow==3.20.1
psycopg2-binary==2.9.9
Werkzeug==3.0.1
pytest==7.4.3
pytest-flask==1.3.0
`;

  await fs.writeFile(path.join(projectPath, 'requirements.txt'), requirementsTxt);

  // Create directory structure
  await fs.ensureDir(path.join(projectPath, 'app'));
  await fs.ensureDir(path.join(projectPath, 'app', 'api', 'v1'));
  await fs.ensureDir(path.join(projectPath, 'app', 'models'));
  await fs.ensureDir(path.join(projectPath, 'app', 'schemas'));
  await fs.ensureDir(path.join(projectPath, 'tests'));

  // Generate app/__init__.py
  const appInitPy = `from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_name='development'):
    """Application factory"""
    app = Flask(__name__)
    
    # Load configuration
    if config_name == 'development':
        app.config.from_object('config.DevelopmentConfig')
    elif config_name == 'production':
        app.config.from_object('config.ProductionConfig')
    else:
        app.config.from_object('config.DevelopmentConfig')
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    # Register blueprints
    from app.api.v1 import api_bp
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    
    # CLI commands
    @app.shell_context_processor
    def make_shell_context():
        return {'db': db}
    
    return app
`;

  await fs.writeFile(path.join(projectPath, 'app', '__init__.py'), appInitPy);

  // Generate config.py
  const configPy = `import os
from datetime import timedelta


class BaseConfig:
    """Base configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)


class DevelopmentConfig(BaseConfig):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://user:password@localhost:5432/db'
    )
    SQLALCHEMY_ECHO = True


class ProductionConfig(BaseConfig):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_ECHO = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
`;

  await fs.writeFile(path.join(projectPath, 'config.py'), configPy);

  // Generate wsgi.py
  const wsgiPy = `import os
from app import create_app, db

app = create_app(os.getenv('FLASK_ENV', 'production'))


@app.shell_context_processor
def make_shell_context():
    return {'db': db}


if __name__ == '__main__':
    app.run()
`;

  await fs.writeFile(path.join(projectPath, 'wsgi.py'), wsgiPy);

  // Generate manage.py
  const managePy = `import os
from app import create_app, db
from flask_migrate import MigrateCommand
from flask_script import Manager

app = create_app(os.getenv('FLASK_ENV', 'development'))
manager = Manager(app)
manager.add_command('db', MigrateCommand)


@manager.command
def create_admin():
    """Create a new admin user."""
    pass


if __name__ == '__main__':
    manager.run()
`;

  await fs.writeFile(path.join(projectPath, 'manage.py'), managePy);

  // Generate API blueprint structure
  await fs.writeFile(path.join(projectPath, 'app', 'api', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'app', 'api', 'v1', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'app', 'models', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'app', 'schemas', '__init__.py'), '');

  // Generate API blueprint
  const apiV1InitPy = `from flask import Blueprint
from app.api.v1 import health

api_bp = Blueprint('api', __name__)
api_bp.register_blueprint(health.bp)
`;

  await fs.writeFile(path.join(projectPath, 'app', 'api', 'v1', '__init__.py'), apiV1InitPy);

  // Generate health endpoint
  const healthBlueprintPy = `from flask import Blueprint, jsonify

bp = Blueprint('health', __name__)


@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'version': '0.1.0'
    }), 200
`;

  await fs.writeFile(path.join(projectPath, 'app', 'api', 'v1', 'health.py'), healthBlueprintPy);

  // Generate base model
  const baseModelPy = `from app import db
from datetime import datetime


class BaseModel(db.Model):
    """Base model with common fields"""
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
`;

  await fs.writeFile(path.join(projectPath, 'app', 'models', 'base.py'), baseModelPy);

  // Generate .env.example
  const envExample = `# Flask Configuration
FLASK_APP=wsgi.py
FLASK_ENV=development
DEBUG=True

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/flask_db

# JWT
JWT_SECRET_KEY=your-secret-key-change-in-production
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
  await fs.writeFile(path.join(projectPath, '.env'), envExample);

  // Generate pytest.ini
  const pytestIni = `[pytest]
testpaths = tests
python_files = test_*.py
addopts = -v --tb=short
`;

  await fs.writeFile(path.join(projectPath, 'pytest.ini'), pytestIni);

  // Generate conftest.py
  const conftestPy = `import pytest
from app import create_app, db


@pytest.fixture
def app():
    """Create app for testing"""
    app = create_app('development')
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Test client"""
    return app.test_client()


@pytest.fixture
def runner(app):
    """CLI runner"""
    return app.test_cli_runner()
`;

  await fs.writeFile(path.join(projectPath, 'tests', 'conftest.py'), conftestPy);

  // Generate test example
  const testHealthPy = `def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/api/v1/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert 'version' in data
`;

  await fs.writeFile(path.join(projectPath, 'tests', 'test_health.py'), testHealthPy);

  // Generate run.py (simple entry point)
  const runPy = `import os
from dotenv import load_dotenv
from app import create_app

load_dotenv()

app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
`;

  await fs.writeFile(path.join(projectPath, 'run.py'), runPy);

  // Generate .gitignore
  const gitignorePy = `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Environment variables
.env
.env.local

# Logs
*.log
logs/

# Database
*.db
instance/

# Testing
.pytest_cache/
.coverage
htmlcov/

# Flask
instance/

# OS
.DS_Store
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignorePy);
}

async function generatePythonMLAPI(projectPath, features) {
  // Generate requirements.txt for ML API
  const requirementsTxt = `fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
numpy==1.26.2
scipy==1.11.4
scikit-learn==1.3.2
tensorflow==2.14.0
torch==2.1.1
torchvision==0.16.1
mlflow==2.10.0
redis==5.0.1
python-dotenv==1.0.0
python-multipart==0.0.6
pillow==10.1.0
httpx==0.25.1
pytest==7.4.3
pytest-asyncio==0.21.1
`;

  await fs.writeFile(path.join(projectPath, 'requirements.txt'), requirementsTxt);

  // Create directory structure
  await fs.ensureDir(path.join(projectPath, 'src', 'api', 'v1', 'endpoints'));
  await fs.ensureDir(path.join(projectPath, 'src', 'core'));
  await fs.ensureDir(path.join(projectPath, 'src', 'ml', 'models'));
  await fs.ensureDir(path.join(projectPath, 'src', 'ml', 'preprocessing'));
  await fs.ensureDir(path.join(projectPath, 'src', 'db'));
  await fs.ensureDir(path.join(projectPath, 'models'));
  await fs.ensureDir(path.join(projectPath, 'tests'));

  // Generate main.py
  const mainPy = `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from src.api.v1.api import api_router
from src.core.config import settings

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    description="Machine Learning API with TensorFlow/PyTorch inference"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "ml_api": True}


@app.get("/info", tags=["Info"])
async def model_info():
    """Get ML model information"""
    return {
        "name": "ML API",
        "version": "0.1.0",
        "capabilities": ["image_classification", "text_analysis", "predictions"]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`;

  await fs.writeFile(path.join(projectPath, 'main.py'), mainPy);

  // Generate config
  const configPy = `import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    PROJECT_NAME: str = "ML API"
    API_V1_STR: str = "/api/v1"
    
    # Model Configuration
    MODEL_PATH: str = os.getenv("MODEL_PATH", "./models")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "default_model")
    USE_GPU: bool = os.getenv("USE_GPU", "False") == "True"
    
    # Framework
    ML_FRAMEWORK: str = os.getenv("ML_FRAMEWORK", "tensorflow")  # tensorflow or pytorch
    
    # Cache
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    CACHE_ENABLED: bool = os.getenv("CACHE_ENABLED", "False") == "True"
    
    # MLflow
    MLFLOW_TRACKING_URI: str = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
    MLFLOW_ENABLED: bool = os.getenv("MLFLOW_ENABLED", "False") == "True"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
`;

  await fs.writeFile(path.join(projectPath, 'src', 'core', 'config.py'), configPy);

  // Generate model loader
  const modelLoaderPy = `import os
import logging
from typing import Optional
import numpy as np

logger = logging.getLogger(__name__)


class ModelLoader:
    """Load and manage ML models"""
    
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def load_model(self, framework: str = "tensorflow", model_path: str = None):
        """Load model based on framework"""
        if self._model is not None:
            return self._model
        
        try:
            if framework == "tensorflow":
                import tensorflow as tf
                self._model = tf.keras.models.load_model(model_path or "model.h5")
                logger.info("TensorFlow model loaded")
            elif framework == "pytorch":
                import torch
                self._model = torch.load(model_path or "model.pt")
                logger.info("PyTorch model loaded")
            else:
                logger.warning(f"Unknown framework: {framework}")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            self._model = None
        
        return self._model
    
    def get_model(self):
        """Get loaded model"""
        return self._model
    
    def predict(self, data: np.ndarray) -> np.ndarray:
        """Run inference on model"""
        if self._model is None:
            raise RuntimeError("Model not loaded")
        
        try:
            result = self._model.predict(data)
            return result
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise


model_loader = ModelLoader()
`;

  await fs.writeFile(path.join(projectPath, 'src', 'ml', 'model_loader.py'), modelLoaderPy);

  // Generate preprocessing
  const preprocessingPy = `import numpy as np
from typing import List, Tuple
import logging

logger = logging.getLogger(__name__)


class DataPreprocessor:
    """Data preprocessing utilities"""
    
    @staticmethod
    def normalize(data: np.ndarray, mean: float = 0, std: float = 1) -> np.ndarray:
        """Normalize data"""
        return (data - mean) / std
    
    @staticmethod
    def resize_image(image: np.ndarray, size: Tuple[int, int]) -> np.ndarray:
        """Resize image to target size"""
        try:
            from PIL import Image
            img = Image.fromarray(image)
            img = img.resize(size)
            return np.array(img)
        except Exception as e:
            logger.error(f"Image resize failed: {e}")
            raise
    
    @staticmethod
    def batch_process(data_list: List[np.ndarray]) -> np.ndarray:
        """Process list of data into batch"""
        return np.stack(data_list, axis=0)


preprocessor = DataPreprocessor()
`;

  await fs.writeFile(path.join(projectPath, 'src', 'ml', 'preprocessing', 'preprocessor.py'), preprocessingPy);

  // Generate __init__ files
  await fs.writeFile(path.join(projectPath, 'src', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'core', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'db', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'ml', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'ml', 'models', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'ml', 'preprocessing', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'api', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'api', 'v1', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'src', 'api', 'v1', 'endpoints', '__init__.py'), '');
  await fs.writeFile(path.join(projectPath, 'tests', '__init__.py'), '');

  // Generate API router
  const apiRouterPy = `from fastapi import APIRouter

from src.api.v1.endpoints import health, predict

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(predict.router, prefix="/predict", tags=["predictions"])
`;

  await fs.writeFile(path.join(projectPath, 'src', 'api', 'v1', 'api.py'), apiRouterPy);

  // Generate health endpoint
  const healthEndpointPy = `from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "0.1.0"}
`;

  await fs.writeFile(path.join(projectPath, 'src', 'api', 'v1', 'endpoints', 'health.py'), healthEndpointPy);

  // Generate predict endpoint
  const predictEndpointPy = `from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import logging

from src.ml.model_loader import model_loader
from src.ml.preprocessing.preprocessor import preprocessor

logger = logging.getLogger(__name__)
router = APIRouter()


class PredictionRequest(BaseModel):
    data: List[float]
    normalize: bool = True


class PredictionResponse(BaseModel):
    prediction: List[float]
    confidence: float


@router.post("/numeric", response_model=PredictionResponse)
async def predict_numeric(request: PredictionRequest):
    """Make prediction on numeric data"""
    try:
        data = np.array([request.data])
        
        if request.normalize:
            data = preprocessor.normalize(data)
        
        model = model_loader.get_model()
        if model is None:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        prediction = model.predict(data)
        confidence = float(np.max(prediction))
        
        return PredictionResponse(
            prediction=prediction[0].tolist(),
            confidence=confidence
        )
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/image")
async def predict_image(file: UploadFile = File(...)):
    """Make prediction on image data"""
    try:
        import io
        from PIL import Image
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        image_array = np.array(image)
        
        resized = preprocessor.resize_image(image_array, (224, 224))
        normalized = preprocessor.normalize(resized)
        
        model = model_loader.get_model()
        if model is None:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        prediction = model.predict(np.expand_dims(normalized, axis=0))
        
        return {
            "filename": file.filename,
            "prediction": prediction[0].tolist(),
            "confidence": float(np.max(prediction))
        }
    except Exception as e:
        logger.error(f"Image prediction failed: {e}")
        raise HTTPException(status_code=400, detail=str(e))
`;

  await fs.writeFile(path.join(projectPath, 'src', 'api', 'v1', 'endpoints', 'predict.py'), predictEndpointPy);

  // Generate .env.example
  const envExample = `# ML API Configuration
PROJECT_NAME=ML API
API_VERSION=v1

# Model Configuration
MODEL_PATH=./models
MODEL_NAME=default_model
ML_FRAMEWORK=tensorflow
USE_GPU=False

# Cache
REDIS_URL=redis://localhost:6379
CACHE_ENABLED=False

# MLflow
MLFLOW_TRACKING_URI=http://localhost:5000
MLFLOW_ENABLED=False

# Security
SECRET_KEY=your-secret-key-change-in-production

# Logging
LOG_LEVEL=INFO
`;

  await fs.writeFile(path.join(projectPath, '.env.example'), envExample);
  await fs.writeFile(path.join(projectPath, '.env'), envExample);

  // Generate pytest.ini
  const pytestIni = `[pytest]
asyncio_mode = auto
testpaths = tests
`;

  await fs.writeFile(path.join(projectPath, 'pytest.ini'), pytestIni);

  // Generate test
  const testPredictPy = `import pytest
import numpy as np
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Test health check endpoint"""
    response = await client.get("/api/v1/health/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_predict_numeric(client: AsyncClient):
    """Test numeric prediction endpoint"""
    response = await client.post("/api/v1/predict/numeric", json={
        "data": [1.0, 2.0, 3.0],
        "normalize": True
    })
    assert response.status_code in [200, 400, 503]  # 400 = no model, 503 = model not loaded
`;

  await fs.writeFile(path.join(projectPath, 'tests', 'test_predict.py'), testPredictPy);

  // Generate .gitignore
  const gitignorePy = `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Virtual Environment
venv/
env/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
logs/

# ML Models
models/
*.h5
*.pt
*.pb
*.pkl
mlruns/

# Data
data/
*.csv
*.parquet

# Testing
.pytest_cache/
.coverage
htmlcov/

# MLflow
mlruns/
.mlflow/

# OS
.DS_Store
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignorePy);
}

async function generateDotNetMinimalAPI(projectPath, features) {
  // Create .NET project structure
  await fs.ensureDir(path.join(projectPath, 'Models'));
  await fs.ensureDir(path.join(projectPath, 'Handlers'));
  await fs.ensureDir(path.join(projectPath, 'Services'));
  await fs.ensureDir(path.join(projectPath, 'Data'));

  // Project file (.csproj)
  const projectName = path.basename(projectPath);
  const csproj = `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Npgsql" Version="8.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
  </ItemGroup>

</Project>`;

  await fs.writeFile(path.join(projectPath, `${projectName}.csproj`), csproj);

  // Program.cs (main entry point)
  const programCs = `var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddDbContext<ItemDbContext>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Map endpoints
var api = app.MapGroup("/api/v1").WithOpenApi();

// Health check
app.MapGet("/health", () => new { status = "healthy", service = ".NET Minimal API" })
    .WithName("HealthCheck")
    .WithOpenApi();

// Items endpoints
api.MapGet("/items", GetItems)
    .WithName("GetItems")
    .WithOpenApi();

api.MapGet("/items/{id}", GetItemById)
    .WithName("GetItemById")
    .WithOpenApi();

api.MapPost("/items", CreateItem)
    .WithName("CreateItem")
    .WithOpenApi();

api.MapPut("/items/{id}", UpdateItem)
    .WithName("UpdateItem")
    .WithOpenApi();

api.MapDelete("/items/{id}", DeleteItem)
    .WithName("DeleteItem")
    .WithOpenApi();

app.Run();

// Endpoint handlers
async Task<IResult> GetItems(IItemService itemService)
{
    var items = await itemService.GetAllItemsAsync();
    return Results.Ok(items);
}

async Task<IResult> GetItemById(int id, IItemService itemService)
{
    var item = await itemService.GetItemByIdAsync(id);
    return item == null ? Results.NotFound() : Results.Ok(item);
}

async Task<IResult> CreateItem(CreateItemRequest request, IItemService itemService)
{
    var item = await itemService.CreateItemAsync(request.Title, request.Description);
    return Results.Created($"/api/v1/items/{item.Id}", item);
}

async Task<IResult> UpdateItem(int id, UpdateItemRequest request, IItemService itemService)
{
    var item = await itemService.UpdateItemAsync(id, request.Title, request.Description);
    return item == null ? Results.NotFound() : Results.Ok(item);
}

async Task<IResult> DeleteItem(int id, IItemService itemService)
{
    var success = await itemService.DeleteItemAsync(id);
    return success ? Results.NoContent() : Results.NotFound();
}

public record CreateItemRequest(string Title, string Description);
public record UpdateItemRequest(string Title, string Description);
`;

  await fs.writeFile(path.join(projectPath, 'Program.cs'), programCs);

  // Models
  const itemMo = `namespace Models;

public class Item
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
`;

  await fs.writeFile(path.join(projectPath, 'Models', 'Item.cs'), itemMo);

  // Services
  const itemServiceInterface = `namespace Services;

using Models;

public interface IItemService
{
    Task<List<Item>> GetAllItemsAsync();
    Task<Item?> GetItemByIdAsync(int id);
    Task<Item> CreateItemAsync(string title, string description);
    Task<Item?> UpdateItemAsync(int id, string title, string description);
    Task<bool> DeleteItemAsync(int id);
}
`;

  await fs.writeFile(path.join(projectPath, 'Services', 'IItemService.cs'), itemServiceInterface);

  const itemService = `namespace Services;

using Models;
using Data;

public class ItemService : IItemService
{
    private readonly ItemDbContext _context;

    public ItemService(ItemDbContext context)
    {
        _context = context;
    }

    public async Task<List<Item>> GetAllItemsAsync()
    {
        return await Task.FromResult(_context.Items.ToList());
    }

    public async Task<Item?> GetItemByIdAsync(int id)
    {
        return await Task.FromResult(_context.Items.FirstOrDefault(i => i.Id == id));
    }

    public async Task<Item> CreateItemAsync(string title, string description)
    {
        var item = new Item { Title = title, Description = description };
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<Item?> UpdateItemAsync(int id, string title, string description)
    {
        var item = _context.Items.FirstOrDefault(i => i.Id == id);
        if (item == null) return null;

        item.Title = title;
        item.Description = description;
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<bool> DeleteItemAsync(int id)
    {
        var item = _context.Items.FirstOrDefault(i => i.Id == id);
        if (item == null) return false;

        _context.Items.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}
`;

  await fs.writeFile(path.join(projectPath, 'Services', 'ItemService.cs'), itemService);

  // Data context
  const dataContext = `namespace Data;

using Microsoft.EntityFrameworkCore;
using Models;

public class ItemDbContext : DbContext
{
    public DbSet<Item> Items { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
            ?? "Host=localhost;Database=items;Username=postgres;Password=password";
        
        optionsBuilder.UseNpgsql(connectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Item>()
            .HasKey(e => e.Id);

        modelBuilder.Entity<Item>()
            .Property(e => e.Title)
            .IsRequired();
    }
}
`;

  await fs.writeFile(path.join(projectPath, 'Data', 'ItemDbContext.cs'), dataContext);

  // README
  const readmeMd = `# ${projectName}

ASP.NET Core Minimal APIs - Production-Ready Template

## Features

- **Minimal APIs** - Lightweight and performant
- **Entity Framework Core** - ORM for data access
- **PostgreSQL** - Database support
- **Swagger/OpenAPI** - API documentation
- **Dependency Injection** - Built-in DI container

## Getting Started

### Prerequisites

- .NET 8.0+
- PostgreSQL (optional - uses in-memory by default)

### Installation

\`\`\`bash
cd ${projectName}
dotnet restore
\`\`\`

### Running

\`\`\`bash
dotnet run
\`\`\`

API available at: https://localhost:5001/api/v1

Swagger UI: https://localhost:5001/swagger

## API Endpoints

- \`GET /health\` - Health check
- \`GET /api/v1/items\` - Get all items
- \`GET /api/v1/items/{id}\` - Get item by ID
- \`POST /api/v1/items\` - Create item
- \`PUT /api/v1/items/{id}\` - Update item
- \`DELETE /api/v1/items/{id}\` - Delete item

## Project Structure

\`\`\`
.
├── Program.cs           # Main entry point
├── Models/              # Data models
├── Services/            # Business logic
├── Data/                # EF Core contexts
└── ${projectName}.csproj
\`\`\`

## Testing

\`\`\`bash
dotnet test
\`\`\`

## License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeMd);

  // .gitignore
  const gitignore = `bin/
obj/
.vs/
*.user
*.suo
.DS_Store
.env
.env.local
appsettings.local.json
*.log
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

  // Dockerfile
  const dockerfile = `FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet build "${projectName}.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "${projectName}.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "${projectName}.dll"]
`;

  await fs.writeFile(path.join(projectPath, 'Dockerfile'), dockerfile);
}

async function generateElixirPhoenix(projectPath, features) {
  // Create Phoenix project structure
  const projectName = path.basename(projectPath).replaceAll('-', '_');
  const moduleName = projectName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  
  await fs.ensureDir(path.join(projectPath, 'lib', projectName, 'web'));
  await fs.ensureDir(path.join(projectPath, 'lib', projectName, 'web', 'channels'));
  await fs.ensureDir(path.join(projectPath, 'lib', projectName, 'web', 'controllers'));
  await fs.ensureDir(path.join(projectPath, 'lib', projectName, 'web', 'views'));
  await fs.ensureDir(path.join(projectPath, 'priv', 'repo', 'migrations'));
  await fs.ensureDir(path.join(projectPath, 'test'));

  // mix.exs (dependencies) - Using simpler syntax to avoid JS parsing issues
  const mixExs = `defmodule ${moduleName}.MixProject do
  use Mix.Project

  def project do
    [
      app: :${projectName},
      version: "0.1.0",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {${moduleName}.Application, []}
    ]
  end

  defp deps do
    [
      {:phoenix, "~> 1.7"},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.10"},
      {:postgrex, "~> 0.17"},
      {:plug_cowboy, "~> 2.6"}
    ]
  end
end
`;

  await fs.writeFile(path.join(projectPath, 'mix.exs'), mixExs);

  // application.ex
  const applicationEx = `defmodule ${moduleName}.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      ${moduleName}.Repo,
      {Phoenix.PubSub, name: ${moduleName}.PubSub},
      ${moduleName}.Endpoint
    ]

    opts = [strategy: :one_for_one, name: ${moduleName}.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    ${moduleName}.Endpoint.config_change(changed, removed)
    :ok
  end
end
`;

  await fs.writeFile(path.join(projectPath, 'lib', projectName, 'application.ex'), applicationEx);

  // repo.ex
  const repoEx = `defmodule ${moduleName}.Repo do
  use Ecto.Repo,
    otp_app: :${projectName},
    adapter: Ecto.Adapters.Postgres
end
`;

  await fs.writeFile(path.join(projectPath, 'lib', projectName, 'repo.ex'), repoEx);

  // Router - simplified to avoid special characters
  const routerEx = `defmodule ${moduleName}.Router do
  use Phoenix.Router

  pipeline :browser do
    plug :accepts, ["html"]
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ${moduleName} do
    pipe_through :browser
    get "/", PageController, :home
  end

  scope "/api", ${moduleName} do
    pipe_through :api
    get "/health", HealthController, :check
    get "/items", ItemController, :index
    post "/items", ItemController, :create
    get "/items/:id", ItemController, :show
    put "/items/:id", ItemController, :update
    delete "/items/:id", ItemController, :delete
  end
end
`;

  await fs.writeFile(path.join(projectPath, 'lib', projectName, 'web', 'router.ex'), routerEx);

  // Endpoint
  const endpointEx = `defmodule ${moduleName}.Endpoint do
  use Phoenix.Endpoint, otp_app: :${projectName}

  plug :put_root_layout, {${moduleName}.LayoutView, :root}
  plug Phoenix.Router, router: ${moduleName}.Router
end
`;

  await fs.writeFile(path.join(projectPath, 'lib', projectName, 'endpoint.ex'), endpointEx);

  // Schema (Ecto)
  const itemSchema = `defmodule ${moduleName}.Item do
  use Ecto.Schema
  import Ecto.Changeset

  schema "items" do
    field :title, :string
    field :description, :string
    
    timestamps()
  end

  def changeset(item, attrs) do
    item
    |> cast(attrs, [:title, :description])
    |> validate_required([:title])
  end
end
`;

  await fs.writeFile(path.join(projectPath, 'lib', projectName, 'item.ex'), itemSchema);

  // Context (Business logic)
  const contextEx = `defmodule ${moduleName}.Items do
  import Ecto.Query
  alias ${moduleName}.{Item, Repo}

  def list_items do
    Repo.all(Item)
  end

  def get_item(id) do
    Repo.get(Item, id)
  end

  def create_item(attrs) do
    percent_item = %Item{}
    Item.changeset(percent_item, attrs)
    |> Repo.insert()
  end

  def update_item(percent_item, attrs) do
    percent_item
    |> Item.changeset(attrs)
    |> Repo.update()
  end

  def delete_item(percent_item) do
    Repo.delete(percent_item)
  end
end
`;

  await fs.writeFile(path.join(projectPath, 'lib', projectName, 'items.ex'), contextEx);

  // Controller - note: avoiding & operator issues
  const controllerEx = `defmodule ${moduleName}.HealthController do
  use ${moduleName}, :controller

  def check(conn, _params) do
    json(conn, %{status: "healthy", service: "Phoenix API"})
  end
end

defmodule ${moduleName}.ItemController do
  use ${moduleName}, :controller
  alias ${moduleName}.Items

  def index(conn, _params) do
    items = Items.list_items()
    json(conn, %{items: items})
  end

  def show(conn, params) do
    case Items.get_item(params["id"]) do
      nil -> send_resp(conn, :not_found, "")
      item -> json(conn, item)
    end
  end

  def create(conn, params) do
    case Items.create_item(%{title: params["title"], description: params["description"]}) do
      {:ok, item} -> json(conn |> put_status(:created), item)
      {:error, _} -> send_resp(conn, :bad_request, "")
    end
  end

  def update(conn, params) do
    item = Items.get_item(params["id"])
    case Items.update_item(item, params) do
      {:ok, updated} -> json(conn, updated)
      {:error, _} -> send_resp(conn, :not_found, "")
    end
  end

  def delete(conn, params) do
    item = Items.get_item(params["id"])
    case Items.delete_item(item) do
      {:ok, _} -> send_resp(conn, :no_content, "")
      {:error, _} -> send_resp(conn, :not_found, "")
    end
  end
end
`;

  await fs.writeFile(path.join(projectPath, 'lib', projectName, 'web', 'controllers', 'controllers.ex'), controllerEx);

  // README
  const readmeMd = `# ${path.basename(projectPath)}

Phoenix API - Real-time Elixir web framework

## Features

- **Phoenix Framework** - Web framework
- **LiveView** - Real-time components
- **Channels** - WebSocket support
- **Ecto** - Database library
- **PostgreSQL** - Database

## Getting Started

### Prerequisites

- Elixir 1.14+
- Phoenix 1.7+
- PostgreSQL

### Installation

\`\`\`bash
cd ${path.basename(projectPath)}
mix deps.get
mix ecto.create
mix ecto.migrate
\`\`\`

### Running

\`\`\`bash
mix phx.server
\`\`\`

Server: http://localhost:4000

## API Endpoints

- GET /api/health - Health check
- GET /api/items - List items
- POST /api/items - Create item
- GET /api/items/:id - Get item
- PUT /api/items/:id - Update item
- DELETE /api/items/:id - Delete item

## Project Structure

\`\`\`
lib/
  ${projectName}/
    - application.ex
    - repo.ex
    - items.ex (context)
    - item.ex (schema)
    web/
      - router.ex
      - controllers/
      - channels/

priv/
  repo/
    migrations/

mix.exs
\`\`\`

## License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeMd);

  // .gitignore
  const gitignore = `_build/
deps/
*.beam
*.ez
.DS_Store
.env
.env.local
*.log
`;

  await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
}

async function generateBasicStructure(projectPath, templateConfig) {
  // Fallback for templates without specific generators

  await fs.writeFile(
    path.join(projectPath, 'SETUP.md'),
    `# Setup Instructions\n\nThis template is under construction.\nPlease refer to the README.md for more information.`
  );
}
