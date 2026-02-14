import chalk from 'chalk';
import { templates, languages } from '../config/templates.js';

// Helper: Get popularity indicator emoji
function getPopularityIcon(popularity) {
  if (popularity === 'high') return '🔥';
  if (popularity === 'growing') return '📈';
  return '⭐';
}

export function listTemplates() {
  console.log(chalk.bold.cyan('\n📦 Available Templates\n'));

  // Group by language
  Object.entries(languages).forEach(([language, templateIds]) => {
    console.log(chalk.bold.yellow(`\n${language}:`));
    console.log(chalk.dim('─'.repeat(50)));
    
    templateIds.forEach(templateId => {
      const template = templates[templateId];
      console.log(`\n  ${chalk.bold(template.name)}`);
      console.log(`  ${chalk.dim(template.description)}`);
      console.log(`  ${chalk.cyan('Features:')} ${template.features.join(', ')}`);
      console.log(`  ${chalk.green('ID:')} ${templateId}`);
      
      // Popularity indicator
      const popularityEmoji = getPopularityIcon(template.popularity);
      console.log(`  ${popularityEmoji} ${template.popularity} | ${template.difficulty}`);
    });
  });

  console.log(chalk.bold.cyan('\n\n💡 Usage:'));
  console.log(chalk.white('  npx create-stack-app new my-project\n'));
}
