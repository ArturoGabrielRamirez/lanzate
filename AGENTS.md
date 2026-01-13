# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Project Overview

This is a Next.js 16 application with TypeScript, using:
- **Runtime**: Bun (package manager and runtime)
- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with Shadcn built-in and custom components
- **Forms**: React Hook Form with Yup validation
- **Testing**: Bun test with Testing Library
- **Internationalization**: next-intl

## Build/Test/Lint Commands

```bash
# Development
bun dev                    # Start development server with Turbopack

# Build & Production
bun build                 # Build for production
bun start                  # Start production server

# Code Quality
bun lint                   # Run ESLint
bun typecheck              # Run TypeScript type checking (if available)

# Testing
bun test                   # Run all tests
bun test path/to/test.test.ts    # Run single test file
```

## Project Structure

```
lanzate/
├── app/                    # Next.js App Router pages
│   └── [locale]/          # Internationalized routes
├── features/              # Feature-based organization
│   ├── auth/              # Authentication feature
│   ├── billing/           # Billing & subscriptions
│   ├── stores/            # Store management
│   ├── global/            # Shared components & utilities
│   └── ...
├── lib/                   # External library configurations
├── __tests__/             # Test files (mirroring features structure)
├── messages/              # Internationalization messages
├── prisma/                # Database schema & migrations
└── public/                # Static assets
```

## Code Style Guidelines

### Import Organization

Follow the ESLint import/order configuration:

1. **Node built-ins** (fs, path, etc.)
2. **External packages** (npm packages)
3. **Internal aliases** (@//*)
4. **Relative imports** (parent, sibling, index) - **AVOID THESE**
5. **Object imports**
6. **Type imports**

**IMPORTANT**: Always use `@/` aliases instead of relative imports. This is enforced by ESLint.

```typescript
// ✅ Good
import { Button } from '@/features/global/components';
import { getUserData } from '@/features/auth/data';
import type { User } from '@/features/auth/types';

// ❌ Bad - relative imports
import { Button } from '../../../global/components';
import { getUserData } from '../data';
```

### TypeScript & Types

- **Strict mode enabled**: All TypeScript strict rules apply
- **Type inference preferred**: Use `infer` types from Yup schemas
- **Generic components**: Use proper generic constraints
- **Server/Client separation**: Mark client components with `"use client"`

```typescript
// ✅ Good - Server action with proper typing
export async function handleSignupAction(
  data: SignupData
): Promise<ServerResponse<User>> {
  // Implementation
}

// ✅ Good - Generic component
interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
}

// ✅ Good - Client component
"use client";

export function InteractiveComponent() {
  // Client-side logic
}
```

### Component Patterns

- **Feature-based organization**: Group related components, actions, data, types
- **Index files**: Use index.ts for clean exports
- **Component composition**: Prefer composition over inheritance
- **Props interface**: Always define props interfaces

```typescript
// features/auth/components/login-form.tsx
interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
  loading?: boolean;
}

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  // Implementation
}

// features/auth/components/index.ts
export { LoginForm } from './login-form';
export { SignupForm } from './signup-form';
```

### Server Actions & Service/Data Layer

- **Action wrapper**: Use `actionWrapper` for consistent error handling
- **Data functions**: Separate data access from actions
- **Service layer**: Business logic in services
- **Validation**: Yup schemas for all input validation

```typescript
// features/auth/actions/handleLogin.action.ts
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { validateCredentials } from '@/features/auth/services/validateCredentials.service';

export const handleLoginAction = actionWrapper(
  async (data: LoginData): Promise<ServerResponse<User>> => {
    const user = await validateCredentials(data);
    return { success: true, data: user };
  }
);

// features/auth/data/findUserByEmail.data.ts
export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}
```

### Error Handling

- **Action wrapper**: All server actions use `actionWrapper` for consistent error responses
- **Validation errors**: Yup validation errors are automatically handled
- **Database errors**: Prisma errors are converted to user-friendly messages
- **Client errors**: Use try-catch with proper error states

```typescript
// ✅ Good - Using action wrapper
export const createUserAction = actionWrapper(
  async (userData: UserData): Promise<ServerResponse<User>> => {
    const user = await createUser(userData);
    return { success: true, data: user };
  }
);

// ✅ Good - Client-side error handling
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (data: FormData) => {
  try {
    await createUserAction(data);
    setError(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  }
};
```

### Testing Guidelines

- **Test structure**: Mirror the features structure in `__tests__/`
- **Test-first approach**: Write tests before implementation
- **Integration tests**: Test complete flows when possible
- **Descriptive comments**: Explain what each test covers

```typescript
// __tests__/features/auth/actions.test.ts
/**
 * Server Actions Tests
 *
 * These tests verify that server actions work correctly by testing
 * the complete flow from validation through service layer to response.
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

describe('handleSignupAction', () => {
  it('should create user with valid data', async () => {
    // Test implementation
  });
});
```

### Database & Prisma

- **Schema location**: `prisma/schema.prisma`
- **Migrations**: Use Prisma migrate for schema changes
- **Client configuration**: Use `lib/prisma.ts` for client setup
- **Type safety**: Use generated types from Prisma

### Internationalization

- **Messages**: Store in `messages/[locale].json`
- **Usage**: Use `next-intl` for translations
- **Routing**: Internationalized routes via `[locale]` segment

### UI Components

- **Base components**: Radix UI primitives
- **Styling**: Tailwind CSS with custom components
- **Animation**: Framer Motion for animations
- **Icons**: Lucide React for icons

## Development Workflow

1. **Feature creation**: Create new feature directory under `features/`
2. **Test first**: Write tests in `__tests__/features/[feature]/`
3. **Implementation**: Build components, actions, data layer
4. **Type checking**: Ensure TypeScript compliance
5. **Linting**: Run `bun lint` to check code style
6. **Testing**: Run `bun test` to verify functionality

## Common Patterns

### File Naming
- **Components**: kebab-case (`login-form.tsx`)
- **Actions**: kebab-case with `.action.ts` suffix (`handle-login.action.ts`)
- **Data**: kebab-case with `.data.ts` suffix (`find-user.data.ts`)
- **Services**: kebab-case with `.service.ts` suffix (`validate-credentials.service.ts`)
- **Types**: kebab-case (`auth.types.ts`)
- **Schemas**: kebab-case (`.schema.ts` suffix)

### Export Patterns
```typescript
// index.ts - barrel exports
export { LoginForm } from './login-form';
export { SignupForm } from './signup-form';
export type { LoginFormData, SignupFormData } from './types';
```

### Environment Variables
- Use `.env` for local development
- Never commit secrets to the repository
- Use proper environment variable validation

## Performance Considerations

- **Dynamic imports**: Use for code splitting when appropriate
- **Image optimization**: Use Next.js Image component
- **Database queries**: Optimize Prisma queries with proper selects
- **Caching**: Implement appropriate caching strategies

## Security Best Practices

- **Input validation**: Always validate with Yup schemas
- **SQL injection**: Use Prisma parameterized queries
- **Authentication**: Use Supabase Auth properly
- **Environment variables**: Never expose secrets to client