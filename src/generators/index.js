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
      case 'go-fiber':
        await generateGoFiber(projectPath, features);
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
    
    PROJECT_NAME: str = "${path.basename(projectPath).replace(/-/g, '_')}"
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
DATABASE_URL=postgresql://user:password@localhost:5432/${path.basename(projectPath).replace(/-/g, '_')}
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
      slug: path.basename(projectPath).toLowerCase().replace(/[^a-z0-9-]/g, ''),
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
        bundleIdentifier: `com.${path.basename(projectPath).replace(/[-]/g, '')}`
      },
      android: {
        adaptiveIcon: {
          foregroundImage: './assets/adaptive-icon.png',
          backgroundColor: '#ffffff'
        },
        package: `com.${path.basename(projectPath).replace(/[-]/g, '')}`
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

async function generateBasicStructure(projectPath, templateConfig) {
  // Fallback for templates without specific generators
  await fs.writeFile(
    path.join(projectPath, 'SETUP.md'),
    `# Setup Instructions\n\nThis template is under construction.\nPlease refer to the README.md for more information.`
  );
}
