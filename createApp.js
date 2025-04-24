import path from 'path'
import fs from 'fs-extra'
import { execa } from 'execa'
// import { fileURLToPath } from 'url'
import chalk from 'chalk'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createApp(options) {
  const { projectName, useESLint, usePrettier, useHusky } = options
  const projectPath = path.join(process.cwd(), projectName)

  console.log(chalk.cyan(`\nCreating project in ${projectPath}...`))
  await fs.ensureDir(projectPath)

  await execa('npm', ['init', '-y'], { cwd: projectPath })

  // Install base deps
  const baseDeps = ['express', 'dotenv']
  const devDeps = ['typescript', 'ts-node-dev', '@types/node', '@types/express']

  await execa('npm', ['install', ...baseDeps], { cwd: projectPath })
  await execa('npm', ['install', '-D', ...devDeps], { cwd: projectPath })

  // Create tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES6',
      module: 'commonjs',
      rootDir: 'src',
      outDir: 'dist',
      strict: true,
      esModuleInterop: true,
    },
  }
  await fs.writeJson(path.join(projectPath, 'tsconfig.json'), tsconfig, { spaces: 2 })

  // Create basic folders and files
  await fs.outputFile(
    path.join(projectPath, 'src', 'index.ts'),
    `
    import express, { Request, Response } from 'express'
    import dotenv from 'dotenv'

    dotenv.config()

    const app = express()
    const port = process.env.PORT || 3000

    app.get('/', (_req: Request, res: Response) => {
      res.send('Hello, Express + TypeScript!')
    })

    app.listen(port, () => {
      console.log(\`Server is running on port \${port}\`);
    })`
  )

  // Package scripts
  const pkgPath = path.join(projectPath, 'package.json')
  const pkg = await fs.readJson(pkgPath)
  pkg.scripts = {
    dev: 'ts-node-dev src/index.ts',
    build: 'tsc',
    start: 'node dist/index.js',
  }
  await fs.writeJson(pkgPath, pkg, { spaces: 2 })

  if (useESLint) await addESLint(projectPath)
  if (usePrettier) await addPrettier(projectPath)
  if (useHusky) await addHusky(projectPath)

  console.log(chalk.green('\nDone! Happy coding! 🚀'))
}

async function addESLint(projectPath) {
  console.log(chalk.yellow('Adding ESLint...'))
  await execa('npm', ['install', '-D', 'eslint', '@typescript-eslint/parser', '@typescript-eslint/eslint-plugin'], {
    cwd: projectPath,
  })

  const eslintrc = {
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {},
  }

  await fs.writeJson(path.join(projectPath, '.eslintrc.json'), eslintrc, { spaces: 2 })
}

async function addPrettier(projectPath) {
  console.log(chalk.yellow('Adding Prettier...'))
  await execa('npm', ['install', '-D', 'prettier'], { cwd: projectPath })

  const config = {
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  }

  await fs.writeJson(path.join(projectPath, '.prettierrc'), config, { spaces: 2 })
  await fs.outputFile(path.join(projectPath, '.prettierignore'), 'dist\nnode_modules')
}

async function addHusky(projectPath) {
  console.log(chalk.yellow('Adding Husky + Lint-staged...'))

  // Install Husky and lint-staged
  await execa('npm', ['install', '-D', 'husky', 'lint-staged'], { cwd: projectPath })

  // Initialize Husky (this replaces the deprecated "husky add")
  await execa('npx', ['husky', 'install'], { cwd: projectPath })

  // Set up lint-staged configuration in package.json
  const pkgPath = path.join(projectPath, 'package.json')
  const pkg = await fs.readJson(pkgPath)

  pkg['lint-staged'] = {
    '**/*.ts': ['eslint --fix', 'prettier --write'],
  }

  // Adding prepare script for Husky to work correctly
  pkg.scripts.prepare = 'husky install'

  // Write the updated package.json file
  await fs.writeJson(pkgPath, pkg, { spaces: 2 })

  // Create the pre-commit hook manually
  const huskyDir = path.join(projectPath, '.husky')
  const preCommitHookPath = path.join(huskyDir, 'pre-commit')

  // Ensure the .husky directory exists
  await fs.ensureDir(huskyDir)

  // Write the pre-commit hook to run lint-staged
  const preCommitHookContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged
`

  await fs.outputFile(preCommitHookPath, preCommitHookContent)

  // Make the pre-commit hook executable
  await execa('chmod', ['+x', preCommitHookPath], { cwd: projectPath })

  console.log(chalk.green('Husky and lint-staged have been successfully added!'))
}
