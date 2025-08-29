# Overview

This is a lean eCommerce sourcing platform built with Express.js backend and React frontend. The application allows admins to manage products and customers to browse, purchase, and request custom products. It features Stripe integration for payments, a modern UI built with Radix components, and PostgreSQL database with Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with separate authenticated and unauthenticated flows
- **UI Framework**: Radix UI components with shadcn/ui design system and Tailwind CSS for styling
- **State Management**: TanStack Query for server state management and API caching
- **Authentication Flow**: Conditional rendering based on authentication status - landing page for unauthenticated users, main app for authenticated users

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Replit Auth integration using OpenID Connect with session-based authentication
- **API Design**: RESTful endpoints with consistent error handling and request/response logging
- **File Structure**: Modular approach with separate route handlers, storage abstraction, and database configuration

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Well-defined tables for users, products, orders, cart items, product requests, and sessions
- **Relationships**: Proper foreign key relationships between entities (users to orders, products to cart items, etc.)
- **Session Storage**: PostgreSQL-based session storage for authentication persistence

## Authentication & Authorization
- **Provider**: Replit Auth using OpenID Connect protocol
- **Session Management**: Express sessions stored in PostgreSQL with connect-pg-simple
- **User Roles**: Admin flag in user table for role-based access control
- **Security**: HTTP-only cookies, CSRF protection, and secure session configuration

## Payment Integration
- **Provider**: Stripe for payment processing
- **Implementation**: Both client-side (@stripe/react-stripe-js) and server-side (stripe npm package) integration
- **Flow**: Cart → Checkout → Payment Intent → Order Creation → Confirmation

# External Dependencies

## Core Framework Dependencies
- **Express.js**: Web application framework for Node.js backend
- **React**: Frontend user interface library with TypeScript support
- **Vite**: Build tool and development server for fast frontend development

## Database & ORM
- **PostgreSQL**: Primary database (configured via Neon serverless)
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL adapter
- **@neondatabase/serverless**: Serverless PostgreSQL connection pooling

## Authentication
- **Replit Auth**: OpenID Connect authentication provider
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **openid-client**: OpenID Connect client library with Passport strategy

## Payment Processing
- **Stripe**: Payment processing platform
- **@stripe/stripe-js**: Stripe JavaScript SDK for client-side integration
- **@stripe/react-stripe-js**: React components for Stripe Elements

## UI & Styling
- **Radix UI**: Unstyled, accessible UI component library (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system using Radix and Tailwind

## State Management & API
- **TanStack Query**: Server state management and caching library
- **Wouter**: Minimalist routing library for React
- **Zod**: Runtime type validation for API schemas and form validation