# Vocabulary Quiz

A React application for testing vocabulary knowledge.

## Development Setup

### VS Code Configuration

This project includes VS Code configuration to ensure consistent coding style and tools across team members:

1. Install the recommended extensions when prompted by VS Code
2. The project is pre-configured with:
   - ESLint for code quality
   - Prettier for code formatting
   - Tailwind CSS intellisense
   - Debug configurations for Chrome and tests

### Getting Started

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd vocabulary-quiz
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format-all` - Fix ESLint errors and format code

## Development Tools

### SCSS Color Generation

The project includes an automated script that generates SCSS color variables from the TypeScript color definitions. This ensures consistency between color definitions in TypeScript and SCSS.

#### How it works

1. The script reads color definitions from `src/theme/colors.ts`
2. It extracts each color name and value
3. It converts color names from camelCase to kebab-case for SCSS compatibility
4. It generates `src/styles/_colors.scss` with the proper SCSS variable definitions

#### Usage

To generate or update the SCSS color variables:

```bash
node scripts/generate-scss-colors.js
```

Run this script whenever you modify the colors in `src/theme/colors.ts` to keep the SCSS variables in sync.
