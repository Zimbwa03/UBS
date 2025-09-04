# Overview

This is a modern fundraising event web application for the "Chipangura Outreach" - a charitable initiative by Ubabalo Sungano to help 30 underprivileged children in Guruve. The application serves as both a marketing platform showcasing the cause and a real-time donation tracker with dynamic progress visualization. Built as a full-stack application, it features a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration via Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens for consistent theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with JSON responses
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations for database versioning
- **Data Storage**: In-memory storage implementation with interface for database abstraction
- **Development**: Hot module replacement via Vite integration

## Data Storage Solutions
- **Primary Database**: PostgreSQL accessed via Neon Database serverless driver
- **ORM**: Drizzle ORM with TypeScript integration for type safety
- **Schema Definition**: Centralized schema in shared directory with Zod validation
- **Tables**: donations, campaign_settings, newsletter_subscribers with UUID primary keys
- **Real-time Updates**: Polling-based updates every 5 seconds for donation statistics

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express session configuration present but not actively used
- **Security**: Basic request validation and error handling middleware

## External Dependencies
- **Database**: Neon Database (PostgreSQL-compatible serverless database)
- **Image Assets**: Unsplash for placeholder images in gallery and hero sections
- **Fonts**: Google Fonts (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)
- **Icons**: Lucide React for consistent iconography
- **Development Tools**: Replit integration for development environment
- **Real-time Placeholder**: Supabase client configuration present but not implemented