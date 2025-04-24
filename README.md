# Express TypeScript Scaffolder

This project provides a simple way to create an Express application using TypeScript with optional configurations for ESLint, Prettier, Husky, and Lint-staged. The tool scaffolds the project structure, installs dependencies, and sets up the necessary configurations.

## Features

- **Express**: The backend framework.
- **TypeScript**: TypeScript support out of the box.
- **ESLint**: Optional configuration for linting your TypeScript code.
- **Prettier**: Optional configuration for code formatting.
- **Husky**: Optional configuration for Git hooks (pre-commit) with Lint-staged to ensure code quality before commits.
- **Package Manager**: Choose between `npm` or `yarn`.

## Requirements

- **Node.js** (v14.x or above)
- **npm** (or **yarn**) package manager

## Installation

To get started, clone the repository or download the files:

```bash
git clone https://github.com/yourusername/express-ts-scaffolder.git
cd express-ts-scaffolder
```

## Then, run the scaffolder:

```bash
npx create-express-ts-app
```

## This command will prompt you with a few questions about your project:

- Project name: The name of the new project folder.

- Use ESLint: Whether to add ESLint configuration for linting.

- Use Prettier: Whether to add Prettier configuration for code formatting.

- Use Husky + Lint-staged: Whether to set up Husky and Lint-staged for pre-commit hooks.

- Package Manager: Choose between npm or yarn to install dependencies.

## Example

### If you choose to use all the features, your scaffolder will create a project with the following structure:

```bash
project-name/
├── .eslintrc.json
├── .husky/
│   └── pre-commit
├── .prettierrc
├── .prettierignore
├── node_modules/
├── package.json
├── src/
│   └── index.ts
└── tsconfig.json

```

## Scripts

### The generated package.json will include the following scripts:

- dev: Runs the application in development mode using ts-node-dev.

- build: Compiles the TypeScript code into JavaScript using the TypeScript compiler (tsc).

- start: Starts the application from the compiled dist folder.

### You can run the development server using the following command:

```bash
npm run dev
```

### Or build and start the server in production mode:

```bash
npm run build
npm start
```

## Configuration

- ESLint: The .eslintrc.json file configures ESLint for TypeScript with @typescript-eslint parser and plugin.

- Prettier: The .prettierrc file configures Prettier to use single quotes, no semicolons, and trailing commas.

- Husky & Lint-staged: A pre-commit hook is added to run eslint and prettier on staged .ts files before each commit.

## Troubleshooting

### If you encounter any issues, please check the following:

- Ensure that you have Node.js installed on your system.

- Ensure that you have npm or yarn installed.

# License

<!-- This project is licensed under the MIT License - see the LICENSE file for details. -->
