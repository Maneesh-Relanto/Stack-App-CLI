export const templates = {
  // JavaScript/TypeScript Stacks
  'nextjs-saas': {
    name: 'Next.js 15 SaaS Starter',
    description: 'Full-stack SaaS with Auth, Payments, Database',
    language: 'TypeScript',
    features: ['Authentication', 'Stripe Integration', 'Supabase', 'Tailwind CSS', 'shadcn/ui'],
    popularity: 'high',
    difficulty: 'intermediate'
  },
  'react-vite': {
    name: 'React + Vite Starter',
    description: 'Lightning-fast React development with Vite',
    language: 'TypeScript',
    features: ['Vite', 'React Router', 'TanStack Query', 'Tailwind CSS'],
    popularity: 'high',
    difficulty: 'beginner'
  },
  'node-express-api': {
    name: 'Node.js Express API',
    description: 'RESTful API with authentication and database',
    language: 'TypeScript',
    features: ['Express', 'PostgreSQL', 'JWT Auth', 'Prisma ORM', 'OpenAPI Docs'],
    popularity: 'high',
    difficulty: 'intermediate'
  },

  // Python Stacks
  'fastapi-modern': {
    name: 'FastAPI Modern Starter',
    description: 'Production-ready FastAPI with async support',
    language: 'Python',
    features: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'Docker', 'OpenAPI'],
    popularity: 'high',
    difficulty: 'intermediate'
  },
  'django-pro': {
    name: 'Django Professional',
    description: 'Enterprise Django with best practices',
    language: 'Python',
    features: ['Django', 'PostgreSQL', 'Celery', 'Redis', 'Docker', 'DRF'],
    popularity: 'high',
    difficulty: 'advanced'
  },
  'flask-api': {
    name: 'Flask REST API',
    description: 'Lightweight Flask API with SQLAlchemy',
    language: 'Python',
    features: ['Flask', 'SQLAlchemy', 'JWT', 'Marshmallow', 'pytest'],
    popularity: 'medium',
    difficulty: 'beginner'
  },

  // Rust Stacks
  'rust-axum': {
    name: 'Rust Axum Web Service',
    description: 'High-performance web service with Axum',
    language: 'Rust',
    features: ['Axum', 'PostgreSQL', 'SQLx', 'JWT', 'Docker', 'OpenAPI'],
    popularity: 'growing',
    difficulty: 'advanced'
  },
  'rust-fullstack': {
    name: 'Rust Full-Stack (Axum + Leptos)',
    description: 'Complete Rust web app with frontend and backend',
    language: 'Rust',
    features: ['Axum', 'Leptos', 'PostgreSQL', 'Tailwind', 'WASM'],
    popularity: 'growing',
    difficulty: 'advanced'
  },

  // Go Stacks
  'go-fiber': {
    name: 'Go Fiber Web API',
    description: 'Fast and minimalist Go web framework',
    language: 'Go',
    features: ['Fiber', 'PostgreSQL', 'GORM', 'JWT', 'Swagger', 'Docker'],
    popularity: 'high',
    difficulty: 'intermediate'
  },
  'go-htmx': {
    name: 'Go + HTMX Hypermedia',
    description: 'Modern server-side rendering with HTMX',
    language: 'Go',
    features: ['Chi Router', 'HTMX', 'Templ', 'PostgreSQL', 'Tailwind'],
    popularity: 'growing',
    difficulty: 'intermediate'
  },

  // AI/ML Focused
  'ai-saas-nextjs': {
    name: 'AI SaaS (Next.js + OpenAI)',
    description: 'AI-powered SaaS with LangChain and vector DB',
    language: 'TypeScript',
    features: ['Next.js', 'LangChain', 'Pinecone', 'OpenAI', 'Stripe', 'Auth'],
    popularity: 'high',
    difficulty: 'advanced'
  },
  'python-ml-api': {
    name: 'Python ML API',
    description: 'Machine Learning API with FastAPI',
    language: 'Python',
    features: ['FastAPI', 'TensorFlow/PyTorch', 'MLflow', 'Docker', 'Redis Cache'],
    popularity: 'high',
    difficulty: 'advanced'
  },

  // Mobile
  'react-native-expo': {
    name: 'React Native Expo',
    description: 'Cross-platform mobile app with Expo',
    language: 'TypeScript',
    features: ['Expo', 'React Navigation', 'NativeWind', 'Zustand', 'Supabase'],
    popularity: 'high',
    difficulty: 'intermediate'
  },

  // Other Languages
  'dotnet-minimal-api': {
    name: '.NET Minimal API',
    description: 'Modern .NET API with minimal overhead',
    language: 'C#',
    features: ['ASP.NET Core', 'EF Core', 'PostgreSQL', 'JWT', 'Swagger'],
    popularity: 'medium',
    difficulty: 'intermediate'
  },
  'elixir-phoenix': {
    name: 'Elixir Phoenix API',
    description: 'Real-time capable Phoenix application',
    language: 'Elixir',
    features: ['Phoenix', 'Ecto', 'PostgreSQL', 'LiveView', 'Channels'],
    popularity: 'medium',
    difficulty: 'advanced'
  }
};

export const categories = {
  frontend: ['react-vite', 'nextjs-saas'],
  backend: ['node-express-api', 'fastapi-modern', 'django-pro', 'flask-api', 'go-fiber', 'rust-axum'],
  fullstack: ['nextjs-saas', 'rust-fullstack', 'go-htmx', 'elixir-phoenix'],
  ai: ['ai-saas-nextjs', 'python-ml-api'],
  mobile: ['react-native-expo'],
  api: ['node-express-api', 'fastapi-modern', 'go-fiber', 'rust-axum', 'dotnet-minimal-api']
};

export const languages = {
  TypeScript: ['nextjs-saas', 'react-vite', 'node-express-api', 'ai-saas-nextjs', 'react-native-expo'],
  Python: ['fastapi-modern', 'django-pro', 'flask-api', 'python-ml-api'],
  Rust: ['rust-axum', 'rust-fullstack'],
  Go: ['go-fiber', 'go-htmx'],
  'C#': ['dotnet-minimal-api'],
  Elixir: ['elixir-phoenix']
};
