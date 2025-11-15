# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 (App Router) frontend application using React 19, TypeScript, and Tailwind CSS v4. The project follows the modern Next.js App Router architecture with server components by default.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: ^5
- **Styling**: Tailwind CSS v4 with PostCSS
- **UI Components**: @headlessui/react for accessible components
- **Fonts**: Geist Sans and Geist Mono (via next/font)

## Project Structure

```
app/
├── layout.tsx         # Root layout with font setup and metadata
├── page.tsx           # Home page component
├── globals.css        # Global styles with Tailwind imports and CSS variables
└── favicon.ico        # Application favicon

public/                # Static assets (SVG icons/logos)
```

## Architecture Notes

### App Router Conventions

- All components in `app/` directory are **Server Components** by default
- Use `"use client"` directive at the top of files that need client-side interactivity
- Route structure is file-system based: `app/foo/page.tsx` → `/foo` route

### Path Aliases

TypeScript is configured with `@/*` alias pointing to the project root:
```typescript
import Something from "@/app/components/Something"
```

### Styling Approach

- Tailwind CSS v4 with PostCSS plugin
- CSS variables defined in `globals.css` for theming
- Dark mode support via `prefers-color-scheme`
- Custom theme configuration using `@theme inline` directive
- Utility-first approach with responsive modifiers (sm:, md:, etc.)

### Font Loading

Fonts are loaded via `next/font/google` in the root layout and exposed as CSS variables:
- `--font-geist-sans` for sans-serif
- `--font-geist-mono` for monospace

## TypeScript Configuration

- Strict mode enabled
- Module resolution: `bundler`
- JSX: `react-jsx` (modern JSX transform)
- Target: ES2017

## ESLint Configuration

Uses Next.js recommended configs:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Dependencies

- **@headlessui/react**: Use this for accessible UI components (modals, dropdowns, etc.)
- **next/image**: Optimize images automatically
- **next/font**: Optimize and load Google Fonts

## Development Notes

- The `.next/` directory is auto-generated during builds/dev server startup
- Hot reload is enabled in development mode
- Production builds use static optimization where possible
- This is a fresh Next.js installation with minimal custom configuration
