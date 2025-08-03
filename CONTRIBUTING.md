# Contributing to Infralyzer

Thank you for your interest in contributing to Infralyzer! We appreciate your help in making this FinOps platform better for everyone.

## 🌟 How to Contribute

### 🐛 Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and OS information

### 💡 Suggesting Features

1. **Check the roadmap** to see if it's already planned
2. **Open a feature request** with detailed description
3. **Explain the use case** and why it's valuable
4. **Consider the scope** - start with smaller features

### 🔧 Code Contributions

#### Prerequisites

- Node.js 18+
- Git
- Familiarity with Next.js, React, and TypeScript

#### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/infralyzer-app.git
   cd infralyzer-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

#### Development Guidelines

##### Code Style

- **TypeScript**: Use strict TypeScript with proper typing
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive names for variables and functions

##### Component Structure

```typescript
// components/ui/example-component.tsx
import { cn } from "@/lib/utils"

interface ExampleComponentProps {
  title: string
  children?: React.ReactNode
  className?: string
}

export function ExampleComponent({ 
  title, 
  children, 
  className 
}: ExampleComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  )
}
```

##### API Routes

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Handle GET request
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

#### Testing

- **Unit Tests**: Write tests for utility functions
- **Component Tests**: Test component behavior
- **Integration Tests**: Test API routes and features
- **E2E Tests**: Test critical user flows

```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

#### Documentation

- **Update README.md** if adding new features
- **Add JSDoc comments** for complex functions
- **Update API documentation** for new endpoints
- **Include examples** in your code

### 📝 Pull Request Process

#### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Follow commit conventions**:
   ```
   feat: add new AI recommendation feature
   fix: resolve dashboard loading issue
   docs: update installation guide
   style: improve button hover effects
   refactor: optimize cost calculation logic
   test: add tests for pricing API
   ```

#### Submitting a Pull Request

1. **Push your branch** to your fork
2. **Create a pull request** with:
   - Clear title and description
   - Reference related issues
   - Screenshots for UI changes
   - Testing instructions

3. **Address review feedback** promptly
4. **Keep your branch updated** with main

#### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for changes
- [ ] Manual testing completed

## Screenshots
Include screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### 🎨 UI/UX Contributions

#### Design Principles

1. **Consistency**: Follow existing design patterns
2. **Accessibility**: Ensure WCAG compliance
3. **Responsive**: Design for all screen sizes
4. **Performance**: Optimize for fast loading
5. **User-Centric**: Focus on user experience

#### Tailwind CSS Guidelines

- Use existing design tokens
- Prefer utility classes over custom CSS
- Use responsive breakpoints consistently
- Follow color scheme and spacing

### 🤝 Community Guidelines

#### Be Respectful

- Use inclusive language
- Be constructive in feedback
- Help newcomers get started
- Respect different perspectives

#### Best Practices

- **Search before asking** - check existing issues/discussions
- **Be specific** - provide clear, detailed information
- **Be patient** - maintainers are volunteers
- **Give back** - help review PRs and answer questions

### 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority-high` - Critical issues
- `priority-low` - Nice to have features

### 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### 💬 Getting Help

- **GitHub Discussions**: Ask questions and get help
- **Issues**: Report bugs and request features
- **Discord**: Join our community chat (coming soon)

---

Thank you for contributing to Infralyzer! 🚀