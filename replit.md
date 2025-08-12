# Overview

This is a full-stack web application that combines a React frontend with an Express backend, featuring a voice-enabled chat interface. The application is built using modern web technologies with TypeScript throughout, focusing on speech recognition capabilities and real-time user interaction. The frontend uses shadcn/ui components for a polished, accessible interface with dark theme support, while the backend provides a foundation for API routes and database integration using Drizzle ORM with PostgreSQL.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming and dark mode support
- **State Management**: TanStack Query (React Query) for server state management with custom query client configuration
- **Form Handling**: React Hook Form with Zod validation through @hookform/resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework using ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL session store using connect-pg-simple
- **Development**: Custom Vite integration for SSR-style development with HMR support
- **Error Handling**: Centralized error middleware with structured JSON responses

## Key Features
- **Speech Recognition**: Browser-based Web Speech API integration with real-time transcription
- **Responsive Design**: Mobile-first approach with sidebar navigation and responsive layouts
- **Voice Input**: Toggle-based voice recording with visual feedback and transcription display
- **Chat Interface**: Message-based conversation system with timestamp support
- **Component Architecture**: Modular component structure with reusable UI primitives

## Database Design
- **User Management**: Basic user schema with username/password authentication structure
- **Schema Validation**: Drizzle-zod integration for runtime type validation
- **Migrations**: Drizzle Kit for database schema management and migrations

## Development Environment
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Development Server**: Express with Vite middleware for seamless full-stack development
- **Asset Handling**: Vite-based asset resolution with custom path aliases

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database (@neondatabase/serverless)
- **Connection**: Environment-based DATABASE_URL configuration

## UI and Styling
- **Radix UI**: Complete set of accessible component primitives for complex UI interactions
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Consistent icon library for UI elements
- **Google Fonts**: Inter and JetBrains Mono fonts for typography

## Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Error Overlay**: Runtime error modal for development debugging
- **Cartographer**: Replit-specific tooling for enhanced development experience

## Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Date Handling**: date-fns for date manipulation and formatting

## Build and Runtime
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for development server
- **Node.js Crypto**: Built-in cryptographic functionality for UUID generation