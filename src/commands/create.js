import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import fs from 'fs-extra';
import path from 'node:path';
import { execa } from 'execa';
import { templates, categories, languages } from '../config/templates.js';
import { generateProject } from '../generators/index.js';

export async function createProject(projectName, options = {}) {
  try {
    // Step 1: Get project name
    let finalProjectName = projectName;
    if (!finalProjectName) {
      const nameAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project name?',
          default: 'my-awesome-app',
          validate: (input) => {
            if (/^[a-z0-9-_]+$/.test(input)) return true;
            return 'Project name may only include lowercase letters, numbers, dashes, and underscores';
          }
        }
      ]);
      finalProjectName = nameAnswer.projectName;
    }

    // Step 2: Choose selection method
    const { selectionMethod } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectionMethod',
        message: 'How would you like to choose your stack?',
        choices: [
          { name: '🎯 Browse by Language', value: 'language' },
          { name: '📦 Browse by Category', value: 'category' },
          { name: '📋 See All Templates', value: 'all' }
        ]
      }
    ]);

    let selectedTemplate;

    // Step 3: Template selection based on method
    if (selectionMethod === 'language') {
      const { language } = await inquirer.prompt([
        {
          type: 'list',
          name: 'language',
          message: 'Choose your programming language:',
          choices: Object.keys(languages).map(lang => ({
            name: `${lang} (${languages[lang].length} templates)`,
            value: lang
          }))
        }
      ]);

      const languageTemplates = languages[language].map(templateId => ({
        name: `${templates[templateId].name} - ${templates[templateId].description}`,
        value: templateId
      }));

      const { template } = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: `Choose a ${language} template:`,
          choices: languageTemplates
        }
      ]);

      selectedTemplate = template;
    } else if (selectionMethod === 'category') {
      const { category } = await inquirer.prompt([
        {
          type: 'list',
          name: 'category',
          message: 'Choose a category:',
          choices: [
            { name: '🎨 Frontend', value: 'frontend' },
            { name: '⚙️  Backend API', value: 'backend' },
            { name: '🔄 Full-Stack', value: 'fullstack' },
            { name: '🤖 AI/ML', value: 'ai' },
            { name: '📱 Mobile', value: 'mobile' }
          ]
        }
      ]);

      const categoryTemplates = categories[category].map(templateId => ({
        name: `${templates[templateId].name} (${templates[templateId].language}) - ${templates[templateId].description}`,
        value: templateId
      }));

      const { template } = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: `Choose a ${category} template:`,
          choices: categoryTemplates
        }
      ]);

      selectedTemplate = template;
    } else {
      // Show all templates
      const allTemplates = Object.keys(templates).map(templateId => ({
        name: `${templates[templateId].name} (${templates[templateId].language}) - ${templates[templateId].description}`,
        value: templateId
      }));

      const { template } = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Choose a template:',
          choices: allTemplates,
          pageSize: 15
        }
      ]);

      selectedTemplate = template;
    }

    const templateConfig = templates[selectedTemplate];

    // Step 4: Additional options
    const { features } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select additional features (optional):',
        choices: [
          { name: 'Docker & Docker Compose', value: 'docker', checked: true },
          { name: 'GitHub Actions CI/CD', value: 'ci', checked: true },
          { name: 'ESLint/Prettier (if applicable)', value: 'linting', checked: true },
          { name: 'Testing Setup (Jest/Pytest/etc)', value: 'testing', checked: true },
          { name: 'Pre-commit Hooks', value: 'hooks', checked: false },
          { name: 'VS Code Settings', value: 'vscode', checked: true }
        ]
      }
    ]);

    // Step 5: Confirm
    console.log('\n' + boxen(
      chalk.bold('📦 Project Configuration\n\n') +
      chalk.cyan('Name: ') + chalk.white(finalProjectName) + '\n' +
      chalk.cyan('Template: ') + chalk.white(templateConfig.name) + '\n' +
      chalk.cyan('Language: ') + chalk.white(templateConfig.language) + '\n' +
      chalk.cyan('Features: ') + chalk.white(features.join(', ') || 'None') + '\n',
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
      }
    ));

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Proceed with project creation?',
        default: true
      }
    ]);

    if (!confirm) {
      console.log(chalk.yellow('\n✋ Project creation cancelled.'));
      return;
    }

    // Step 6: Generate project
    const spinner = ora('Creating your project...').start();

    const projectPath = path.join(process.cwd(), finalProjectName);

    // Check if directory exists
    if (await fs.pathExists(projectPath)) {
      spinner.fail();
      console.log(chalk.red(`\n❌ Directory "${finalProjectName}" already exists!`));
      return;
    }

    // Create project directory
    await fs.ensureDir(projectPath);
    spinner.text = 'Generating project files...';

    // Generate project based on template
    await generateProject(projectPath, selectedTemplate, templateConfig, features);

    spinner.succeed(chalk.green('Project created successfully!'));

    // Step 7: Install dependencies (unless skipped)
    if (!options.skipInstall) {
      const installSpinner = ora('Installing dependencies...').start();
      
      try {
        const packageManager = await detectPackageManager();
        
        if (templateConfig.language === 'TypeScript' || templateConfig.language === 'JavaScript') {
          await execa(packageManager, ['install'], { cwd: projectPath });
        } else if (templateConfig.language === 'Python') {
          await execa('python', ['-m', 'venv', 'venv'], { cwd: projectPath });
          // Additional pip install commands would go here
        } else if (templateConfig.language === 'Rust') {
          await execa('cargo', ['build'], { cwd: projectPath });
        } else if (templateConfig.language === 'Go') {
          await execa('go', ['mod', 'tidy'], { cwd: projectPath });
        }
        
        installSpinner.succeed(chalk.green('Dependencies installed!'));
      } catch (error) {
        installSpinner.warn(chalk.yellow('Could not install dependencies automatically. Please install them manually.'));
      }
    }

    // Step 8: Success message
    displaySuccessMessage(finalProjectName, templateConfig, features);

  } catch (error) {
    if (error.isTtyError) {
      console.log(chalk.red('Prompt could not be rendered in this environment'));
    } else {
      console.log(chalk.red('\n❌ Error:'), error.message);
    }
    process.exit(1);
  }
}

async function detectPackageManager() {
  // Check for lock files to detect package manager
  const cwd = process.cwd();
  
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (await fs.pathExists(path.join(cwd, 'bun.lockb'))) return 'bun';
  
  return 'npm'; // default
}

function displaySuccessMessage(projectName, templateConfig, features) {
  const nextSteps = [
    `cd ${projectName}`,
    templateConfig.language === 'TypeScript' || templateConfig.language === 'JavaScript' 
      ? 'npm run dev' 
      : templateConfig.language === 'Python'
      ? 'source venv/bin/activate && python main.py'
      : templateConfig.language === 'Rust'
      ? 'cargo run'
      : templateConfig.language === 'Go'
      ? 'go run main.go'
      : 'See README.md for instructions'
  ];

  console.log('\n' + boxen(
    chalk.bold.green('🎉 Success! Your project is ready!\n\n') +
    chalk.bold('Next Steps:\n\n') +
    nextSteps.map((step, i) => chalk.cyan(`${i + 1}. `) + chalk.white(step)).join('\n') + '\n\n' +
    chalk.dim('💡 Check out the README.md for detailed documentation'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'green'
    }
  ));

  console.log(chalk.cyan('\n📚 Documentation: ') + chalk.white('README.md'));
  console.log(chalk.cyan('🐛 Issues: ') + chalk.white('https://github.com/yourusername/create-stack-app/issues'));
  console.log(chalk.cyan('⭐ Star us: ') + chalk.white('https://github.com/yourusername/create-stack-app\n'));
}
