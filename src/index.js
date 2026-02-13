#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { createProject } from './commands/create.js';
import { listTemplates } from './commands/list.js';

const program = new Command();

// Display beautiful ASCII art banner
function displayBanner() {
  console.log(
    gradient.pastel.multiline(
      figlet.textSync('Create Stack', {
        font: 'Standard',
        horizontalLayout: 'default'
      })
    )
  );
  console.log(chalk.cyan('  🚀 Modern boilerplate generator for any stack\n'));
}

program
  .name('create-stack-app')
  .description('Generate production-ready boilerplates across multiple programming languages')
  .version('1.0.0');

program
  .command('new [project-name]')
  .description('Create a new project with interactive prompts')
  .option('-t, --template <template>', 'Use a specific template')
  .option('-s, --skip-install', 'Skip dependency installation')
  .action(async (projectName, options) => {
    displayBanner();
    await createProject(projectName, options);
  });

program
  .command('list')
  .description('List all available templates')
  .action(() => {
    displayBanner();
    listTemplates();
  });

// Default command (no subcommand)
if (process.argv.length === 2) {
  displayBanner();
  createProject();
} else {
  program.parse();
}
