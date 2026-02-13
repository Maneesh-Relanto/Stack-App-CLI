#!/bin/bash

echo "🚀 Setting up Create Stack App for local development..."

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required. You have: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Make CLI executable
echo ""
echo "🔧 Making CLI executable..."
chmod +x src/index.js

echo "✅ CLI is now executable"

# Test the CLI
echo ""
echo "🧪 Testing CLI..."
node src/index.js list > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ CLI test passed"
else
    echo "⚠️  CLI test had some issues but setup is complete"
fi

# Create symlink for local testing
echo ""
echo "🔗 Creating local symlink..."
npm link > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Symlink created - you can now run: create-stack-app"
else
    echo "⚠️  Could not create symlink (may need sudo)"
    echo "   You can still test with: npm start"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Quick Start:"
echo "  - Run CLI: npm start"
echo "  - List templates: npm start list"
echo "  - Create project: npm start new my-test-project"
echo "  - With symlink: create-stack-app new my-project"
echo ""
echo "📚 Next steps:"
echo "  1. Read CONTRIBUTING.md"
echo "  2. Check docs/LAUNCH_STRATEGY.md"
echo "  3. Test creating a project"
echo "  4. Start building! 🎉"
echo ""
