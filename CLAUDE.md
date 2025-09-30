# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using React 19, TypeScript, and Tailwind CSS v4. The project was created with `create-next-app` and uses Biome for linting and formatting instead of ESLint/Prettier.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack  
- `npm start` - Start production server
- `npm run lint` - Run Biome linting checks
- `npm run format` - Format code with Biome

## Architecture

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono from next/font/google
- **Code Quality**: Biome for linting and formatting
- **Build Tool**: Turbopack for faster builds

### Project Structure

```
src/
  app/
    layout.tsx    # Root layout with font configuration
    page.tsx      # Home page component
    globals.css   # Global Tailwind styles
    favicon.ico   # Site favicon
```

### Key Configuration

- **TypeScript**: Configured with strict mode, path mapping (`@/*` → `./src/*`)
- **Biome**: Configured with React and Next.js rules, 2-space indentation
- **Next.js**: Uses App Router, configured for optimal font loading

## Development Notes

- Uses Turbopack for faster development and builds
- Biome handles both linting and formatting (no separate Prettier)
- Path aliases configured for imports from `src/` directory
- Environment files (`.env.*`) are gitignored but present in workspace