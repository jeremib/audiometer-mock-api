# Hearing Test Application

## Overview

This is a full-stack hearing test application built with a React frontend and Express.js backend. The application provides a developer portal interface and is designed to manage hearing tests for various organizations and their employees. It uses PostgreSQL for data storage via Drizzle ORM and includes JWT-based authentication. The system supports multi-tenant architecture with organizations (tenants), groups, employee profiles, and hearing test management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with configurable secret
- **Session Storage**: PostgreSQL session store using connect-pg-simple
- **API Design**: RESTful API endpoints with Express route handlers

### Database Schema
The application uses a multi-tenant PostgreSQL database with the following main entities:
- **Users**: Authentication and role management (certified_tester role)
- **Tenants**: Organizations using the hearing test system
- **Groups**: Departments or teams within tenants
- **Profiles**: Individual employee records with personal information
- **Test Paths**: Customizable test sequences for different profiles
- **Hearing Tests**: Test results and submissions with JSON data storage

### Authentication & Authorization
- JWT tokens with configurable expiration (default 1 hour)
- Role-based access control with "certified_tester" as default role
- Token validation middleware for protected endpoints
- Local storage for client-side token persistence

### Development Tools
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Database Migrations**: Drizzle Kit for schema management
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Build Process**: Separate builds for client (Vite) and server (esbuild)

## External Dependencies

### Database
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Connection**: Environment variable `DATABASE_URL` required
- **ORM**: Drizzle ORM with PostgreSQL dialect

### UI & Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **Google Fonts**: Roboto and Roboto Mono font families

### Development & Build
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Backend bundling for production
- **Replit Integration**: Special plugins for Replit development environment
- **PostCSS**: CSS processing with Autoprefixer

### Runtime Libraries
- **Express.js**: Web application framework
- **JSON Web Tokens**: Authentication token management
- **Date-fns**: Date utility library
- **Zod**: Schema validation library
- **Class Variance Authority**: Utility for conditional CSS classes