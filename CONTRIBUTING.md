# Contributing to Create Stack App

First off, thank you for considering contributing to Create Stack App! 🎉

## 🌟 How Can I Contribute?

### 1. Add New Templates

We're always looking for new templates! Here's how to add one:

#### Step 1: Define the Template

Add your template configuration to `src/config/templates.js`:

```javascript
'your-template-id': {
  name: 'Your Template Name',
  description: 'Short description of what it does',
  language: 'TypeScript', // or Python, Rust, Go, etc.
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  popularity: 'growing', // or 'high', 'medium'
  difficulty: 'intermediate' // or 'beginner', 'advanced'
}
```

Also add it to the appropriate category and language arrays.

#### Step 2: Create the Generator

Add a generator function in `src/generators/index.js`:

```javascript
async function generateYourTemplate(projectPath, features) {
  // Create package.json or equivalent
  const packageJson = {
    name: path.basename(projectPath),
    version: '1.0.0',
    // ... your dependencies
  };
  
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create main application file
  const mainFile = `// Your starter code here`;
  await fs.writeFile(path.join(projectPath, 'src/index.js'), mainFile);
  
  // Add more files as needed
}
```

#### Step 3: Wire It Up

Add a case to the switch statement in `generateProject()`:

```javascript
case 'your-template-id':
  await generateYourTemplate(projectPath, features);
  break;
```

#### Step 4: Test It

```bash
npm start new test-project
# Select your new template
# Verify all files are generated correctly
# Test that the generated project works
```

### 2. Improve Existing Templates

- Update dependencies to latest versions
- Add missing best practices
- Improve documentation in generated READMEs
- Fix bugs in generated code

### 3. Enhance the CLI Experience

- Improve prompts and messages
- Add new features to the CLI
- Better error handling
- Performance improvements

### 4. Documentation

- Improve README
- Add more examples
- Create video tutorials
- Write blog posts

## 📋 Development Setup

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/create-stack-app.git
cd create-stack-app

# 3. Add upstream remote
git remote add upstream https://github.com/original/create-stack-app.git

# 4. Install dependencies
npm install

# 5. Create a branch
git checkout -b feature/your-feature-name

# 6. Make your changes

# 7. Test locally
npm start new test-project

# 8. Commit your changes
git add .
git commit -m "Add: your feature description"

# 9. Push to your fork
git push origin feature/your-feature-name

# 10. Open a Pull Request
```

## ✅ Pull Request Guidelines

### Before Submitting

- [ ] Test your changes thoroughly
- [ ] Update documentation if needed
- [ ] Follow the existing code style
- [ ] Add comments for complex logic
- [ ] Ensure all files are properly formatted

### PR Title Format

Use conventional commits:

- `Add: new template for X`
- `Fix: bug in Y generator`
- `Improve: Z template dependencies`
- `Docs: update README for X`

### PR Description Template

```markdown
## Description
Brief description of your changes

## Type of Change
- [ ] New template
- [ ] Bug fix
- [ ] Feature enhancement
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have tested my changes
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
```

## 🎨 Code Style

### JavaScript/Node.js

- Use ES6+ features
- Use `async/await` over callbacks
- Use template literals for strings
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names

### File Organization

- Keep files under 500 lines
- One main export per file
- Group related functionality together
- Use descriptive file names

### Comments

```javascript
// ❌ Bad
// Loop through items
for (const item of items) { ... }

// ✅ Good
// Calculate total price including tax and shipping
const totalPrice = calculateTotal(items, taxRate, shippingCost);
```

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

- Check existing issues
- Try the latest version
- Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Run command '...'
2. Select option '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Node Version: [e.g. 18.0.0]
 - CLI Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context or screenshots.
```

## 📝 Template Quality Standards

All templates must meet these criteria:

### Must Have
- ✅ Working `package.json` / `requirements.txt` / `Cargo.toml` / etc.
- ✅ Clear README with setup instructions
- ✅ At least one working endpoint/page
- ✅ Proper error handling
- ✅ Environment variable examples (`.env.example`)

### Should Have
- ⭐ Type safety (TypeScript, type hints, etc.)
- ⭐ Testing setup
- ⭐ Linting/formatting configuration
- ⭐ Docker support
- ⭐ CI/CD workflow

### Nice to Have
- 🎁 Authentication example
- 🎁 Database integration
- 🎁 API documentation
- 🎁 Logging setup
- 🎁 Health check endpoint

## 🏗️ Architecture Decisions

When adding features, consider:

1. **Simplicity First** - Easy to use is more important than feature-complete
2. **Sensible Defaults** - Most users should just be able to accept defaults
3. **Progressive Enhancement** - Advanced users can opt-in to complexity
4. **Fast Feedback** - Show progress, don't make users wait silently
5. **Beautiful Output** - CLI should be pleasant to use

## 🎯 Priorities

### High Priority
- New popular framework templates
- Bug fixes in existing templates
- Performance improvements
- Better error messages

### Medium Priority
- Additional features for existing templates
- Documentation improvements
- New optional features

### Low Priority
- Experimental templates
- Nice-to-have features
- Cosmetic improvements

## 🤝 Community

- Be respectful and inclusive
- Help others in issues and discussions
- Share your projects built with create-stack-app
- Spread the word if you like it!

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙋 Questions?

- Open a [Discussion](https://github.com/yourusername/create-stack-app/discussions)
- Join our [Discord](https://discord.gg/your-invite) (coming soon)
- Tweet at us [@yourusername](https://twitter.com/yourusername)

---

Thank you for contributing! 🎉
