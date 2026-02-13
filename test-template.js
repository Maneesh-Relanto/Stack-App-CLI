#!/usr/bin/env node

import { generateProject } from './src/generators/index.js';
import { templates } from './src/config/templates.js';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testTemplate(templateId, projectName) {
  try {
    const testPath = path.join(__dirname, projectName);
    const template = templates[templateId];
    
    if (!template) {
      console.error(`❌ Template "${templateId}" not found!`);
      process.exit(1);
    }

    // Clean up if exists
    if (await fs.pathExists(testPath)) {
      await fs.remove(testPath);
    }

    // Create directory
    await fs.ensureDir(testPath);

    console.log(`\n🧪 Generating ${template.name}...`);
    console.log(`📁 Path: ${testPath}\n`);

    // Generate with default features
    const features = ['docker', 'ci', 'vscode', 'linting', 'testing'];
    await generateProject(testPath, templateId, template, features);

    console.log(`\n✅ Generation complete!\n`);

    // List files
    const files = await fs.readdir(testPath, { recursive: true });
    const fileCount = files.filter(f => !fs.statSync(path.join(testPath, f)).isDirectory()).length;

    console.log(`📋 Files created: ${fileCount}`);
    console.log(`\n📂 Project structure:\n`);
    
    files.sort().forEach(file => {
      const fullPath = path.join(testPath, file);
      const stat = fs.statSync(fullPath);
      if (!stat.isDirectory()) {
        console.log(`   ${file}`);
      }
    });

    return { success: true, fileCount, testPath };
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Get template from command line
const templateId = process.argv[2] || 'react-vite';
const projectName = process.argv[3] || `test-${templateId}-app`;

console.log(`\n${'='.repeat(60)}`);
console.log(`Testing Template: ${templateId}`);
console.log(`${'='.repeat(60)}`);

testTemplate(templateId, projectName);
