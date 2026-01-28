# Contributing to Fixapp

Thank you for your interest in contributing to Fixapp! We welcome contributions from the community and are grateful for your support.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How to Contribute

There are many ways to contribute to Fixapp:

- Report bugs
- Suggest new features
- Write or improve documentation
- Submit bug fixes
- Implement new features
- Review pull requests
- Help others in discussions

## Reporting Bugs

Before creating a bug report, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible:

1. **Use the bug report template** - We provide an issue template to help you structure your report
2. **Clear title** - Use a clear and descriptive title
3. **Reproduction steps** - Provide detailed steps to reproduce the issue
4. **Expected behavior** - Describe what you expected to happen
5. **Actual behavior** - Describe what actually happened
6. **Environment details** - Include your OS, browser, Node.js version, etc.
7. **Screenshots** - If applicable, add screenshots to help explain the problem
8. **Error messages** - Include any error messages or logs

## Suggesting Features

We love to receive feature suggestions! Before suggesting a feature:

1. **Check existing issues** - Your idea might already be suggested
2. **Use the feature request template** - This helps us understand your proposal
3. **Be specific** - Clearly describe the feature and its use case
4. **Explain the benefits** - Why would this feature be useful?
5. **Consider alternatives** - Have you considered any alternative solutions?

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for database and authentication)
- Razorpay account (for payment processing)

### Setting Up the Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Fixapp.git
   cd Fixapp
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   
   # Install admin dependencies
   cd ../admin
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in the root directory
   - Fill in your Supabase, Razorpay, and other credentials
   - Refer to the README.md for detailed environment variable information

4. **Run the development servers**
   ```bash
   # From the root directory
   npm run dev
   
   # Or run services individually:
   cd backend && npm run dev
   cd frontend && npm run dev
   cd admin && npm run dev
   ```

5. **Run tests**
   ```bash
   # Run all tests
   npm test
   
   # Run tests in watch mode
   npm run test:watch
   
   # Run specific test suites
   cd backend && npm test
   cd frontend && npm test
   ```

## Code Style Guidelines

We follow consistent coding standards to maintain code quality:

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the principle of single responsibility
- Keep functions small and focused
- Use meaningful variable and function names
- Comment complex logic, but prefer self-documenting code
- Write tests for new features and bug fixes

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow ESLint rules configured in the project
- Use async/await instead of callbacks or raw promises
- Prefer functional programming patterns where appropriate
- Use proper error handling with try-catch blocks

### React/Frontend

- Use functional components with hooks
- Keep components small and reusable
- Use Tailwind CSS for styling (avoid inline styles)
- Follow the existing folder structure
- Implement proper loading and error states
- Make components accessible (ARIA labels, semantic HTML)

### Backend/API

- Follow RESTful API conventions
- Validate all input data using Zod or similar
- Use proper HTTP status codes
- Implement proper error handling middleware
- Add appropriate logging
- Secure all endpoints appropriately

### Git Commit Messages

Write clear, descriptive commit messages:

- Use the imperative mood ("Add feature" not "Added feature")
- Keep the first line under 50 characters
- Provide additional details in the commit body if needed
- Reference issues and pull requests when relevant

Example:
```
Add appointment reminder feature

- Implement email notifications for upcoming appointments
- Add cron job for checking appointments
- Include user preferences for notification timing

Fixes #123
```

## Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Follow the code style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use our pull request template
   - Provide a clear description of the changes
   - Link any related issues
   - Add screenshots for UI changes
   - Ensure all CI checks pass

7. **Code Review**
   - Address any feedback from reviewers
   - Make requested changes promptly
   - Keep the discussion focused and professional
   - Be open to suggestions and learning

8. **Merge**
   - Once approved, a maintainer will merge your PR
   - Delete your branch after merging

## Pull Request Checklist

Before submitting your pull request, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Tests have been added/updated and all pass
- [ ] Documentation has been updated (if applicable)
- [ ] No console.log or debug code remains
- [ ] Environment variables are documented
- [ ] The build process completes successfully
- [ ] No security vulnerabilities introduced
- [ ] Breaking changes are clearly documented

## Testing Guidelines

- Write unit tests for utility functions and services
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for good test coverage (70%+ is ideal)
- Test edge cases and error conditions
- Use meaningful test descriptions

## Documentation

When adding new features:

- Update the README.md if needed
- Add inline code comments for complex logic
- Update API documentation
- Add JSDoc comments for public functions
- Include usage examples

## Community

- Be respectful and constructive
- Help others when you can
- Ask questions if you're unsure
- Share your knowledge and experience
- Celebrate others' contributions

## Getting Help

If you need help:

- Check the README.md and existing documentation
- Search existing issues and discussions
- Ask in the GitHub Discussions
- Reach out to maintainers if needed

## Recognition

Contributors will be recognized in our README.md and release notes. Thank you for making Fixapp better!

---

Thank you for contributing to Fixapp! Your efforts help make healthcare more accessible and efficient for everyone. 🎉
