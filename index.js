#!/usr/bin/env node

import inquirer from 'inquirer'
import { createApp } from './createApp.js'

const questions = [
  {
    name: 'projectName',
    type: 'input',
    message: 'Project name:',
    default: 'express-ts-app',
  },
  {
    name: 'useESLint',
    type: 'confirm',
    message: 'Use ESLint?',
  },
  {
    name: 'usePrettier',
    type: 'confirm',
    message: 'Use Prettier?',
  },
  {
    name: 'useHusky',
    type: 'confirm',
    message: 'Use Husky + Lint-staged?',
  },
  {
    name: 'packageManager',
    type: 'list',
    message: 'Which package manager would you like to use?',
    choices: ['npm', 'yarn'],
    default: 'npm',
  },
]

inquirer.prompt(questions).then(createApp)
