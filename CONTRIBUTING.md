# Contributing to DoktorAi

Thank you for your interest in contributing to DoktorAi! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs or request features
- Provide detailed information about the issue
- Include steps to reproduce the problem
- Specify the platform (iOS, Android, Web) and version

### Suggesting Enhancements
- Open an issue with the "enhancement" label
- Describe the feature in detail
- Explain why it would be beneficial
- Consider the impact on existing functionality

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📋 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Git

### Environment Setup
1. Copy `env.example` to `.env` and fill in your API keys
2. Set up Supabase project and run migrations
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

### Code Style Guidelines

#### TypeScript
- Use TypeScript for all new code
- Define proper types for all functions and variables
- Avoid `any` type unless absolutely necessary
- Use interfaces for object shapes

#### React Native
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations

#### Styling
- Use StyleSheet.create() for all styles
- Follow the existing design system
- Use consistent spacing and colors
- Ensure responsive design

#### File Organization
- Keep components small and focused
- Use descriptive file and function names
- Group related functionality together
- Follow the existing project structure

### Testing Guidelines
- Write tests for new functionality
- Test on multiple platforms (iOS, Android, Web)
- Test error scenarios
- Ensure accessibility compliance

## 🏗️ Architecture Guidelines

### State Management
- Use React Context for global state
- Keep local state in components when possible
- Use custom hooks for reusable logic

### API Integration
- Implement proper error handling
- Add loading states
- Use TypeScript interfaces for API responses
- Handle network failures gracefully

### Security
- Never commit API keys or secrets
- Use environment variables for configuration
- Implement proper input validation
- Follow security best practices

## 📝 Commit Message Guidelines

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(chat): add voice input functionality
fix(auth): resolve login issue on Android
docs(readme): update installation instructions
style(ui): improve button styling consistency
```

## 🚀 Pull Request Process

### Before Submitting
1. Ensure your code follows the style guidelines
2. Run tests and ensure they pass
3. Test on multiple platforms
4. Update documentation if needed
5. Rebase your branch on the latest main

### PR Description
- Provide a clear description of changes
- Include screenshots for UI changes
- Reference related issues
- Explain any breaking changes

### Review Process
- All PRs require review before merging
- Address feedback promptly
- Keep PRs focused and small when possible
- Respond to review comments constructively

## 🐛 Bug Reports

When reporting bugs, please include:

### Required Information
- Platform (iOS/Android/Web)
- App version
- Device/OS version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or videos if applicable

### Optional Information
- Console logs
- Network requests
- Device specifications
- Previous working version

## 💡 Feature Requests

When suggesting features:

### Required Information
- Clear description of the feature
- Use case and benefits
- Potential implementation approach
- Impact on existing functionality

### Considerations
- Alignment with project goals
- Technical feasibility
- User experience impact
- Maintenance requirements

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document API interfaces
- Include usage examples
- Keep README updated

### User Documentation
- Update user-facing documentation
- Add screenshots for new features
- Provide clear instructions
- Include troubleshooting guides

## 🎯 Areas for Contribution

### High Priority
- Voice input functionality
- Image analysis features
- Performance optimizations
- Accessibility improvements
- Error handling enhancements

### Medium Priority
- Additional language support
- UI/UX improvements
- Testing coverage
- Documentation updates
- Code refactoring

### Low Priority
- Advanced features
- Integrations
- Analytics
- Monitoring
- DevOps improvements

## 📞 Getting Help

### Community
- GitHub Discussions for questions
- Issue tracker for bugs and features
- Code review for implementation help

### Resources
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

By contributing to DoktorAi, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Project documentation

Thank you for contributing to DoktorAi! 🌿
