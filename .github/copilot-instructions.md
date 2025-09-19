# AI Agent Instructions for optimized-irctc

This document provides essential guidance for AI agents working with the optimized-irctc codebase.

## Project Overview

This is an Angular-based application aimed at optimizing IRCTC (Indian Railway Catering and Tourism Corporation) related functionality. The project uses modern Angular practices and follows standard Angular project structure.

## Key Technologies & Dependencies

- Angular (latest version)
- TypeScript
- Node.js environment

## Project Structure

The project follows standard Angular architecture:

- `/src` - Main application source code (not yet implemented)
- `/dist` - Build output directory
- `/e2e` - End-to-end test files
- `/.angular` - Angular cache and workspace files

## Development Workflow

### Setting Up the Development Environment

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
ng serve
```

### Build Process

Production build:

```bash
ng build --prod
```

## Code Conventions & Patterns

### Angular Best Practices

- Follow Angular style guide for component, service, and module organization
- Use TypeScript's strict mode for better type safety
- Keep components small and focused on a single responsibility
- Implement lazy loading for feature modules

### Project-Specific Patterns

- Component-based architecture
- Feature-based module organization
- Use of Angular's dependency injection system

## Important Notes

- The project is in early development stage
- Environment variables should be properly configured in `.env` file (not checked into git)
- Node modules and build artifacts are excluded from version control

## Future Development

When implementing new features or making changes:

1. Follow the established Angular project structure
2. Maintain TypeScript strict mode compliance
3. Update tests accordingly
4. Ensure proper error handling for IRCTC API integrations
