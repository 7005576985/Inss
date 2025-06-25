# AI Photo Enhancer - Replit Configuration

## Overview

This is a full-stack photo enhancement application built with React, Express, and PostgreSQL. The application allows users to upload images and apply various enhancements like brightness, contrast, saturation, and exposure adjustments. It features a modern dark-themed photo editor interface with real-time preview capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management
- **UI Framework**: Radix UI components with Shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **File Handling**: Multer for multipart/form-data uploads
- **Development**: TSX for TypeScript execution in development

### Database Architecture
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations
- **Storage Strategy**: In-memory storage for development, PostgreSQL for production

## Key Components

### Image Processing System
- **Upload Handler**: Supports JPEG, PNG, and WEBP formats with 10MB size limit
- **Enhancement Engine**: Client-side canvas-based image processing for real-time effects
- **Processing Pipeline**: Brightness, contrast, saturation, and exposure adjustments
- **Job Management**: Async processing job tracking with status updates

### Data Models
- **Users**: Authentication and user management
- **Images**: File metadata, dimensions, and enhancement tracking
- **Processing Jobs**: Background task management for complex operations

### UI Components
- **Photo Editor**: Main canvas area with drag-and-drop upload
- **Sidebar**: Enhancement controls with real-time sliders
- **Toolbar**: Action buttons and processing indicators
- **Demo Modal**: Sample enhancement showcase

## Data Flow

1. **Image Upload**: User selects/drops image → Multer processes upload → File saved to uploads directory
2. **Enhancement Processing**: User adjusts sliders → Client-side canvas applies effects → Real-time preview updates
3. **Job Processing**: Complex operations queued → Background processing → Status updates via polling
4. **Download**: Processed image converted to downloadable format

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management and caching
- **multer**: File upload handling
- **wouter**: Lightweight React routing

### UI Dependencies
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Port**: 5000 (configured in .replit)
- **Hot Reload**: Vite dev server with HMR
- **Database**: PostgreSQL module in Replit
- **File Storage**: Local uploads directory

### Production Build
- **Frontend**: Vite build → Static files in dist/public
- **Backend**: ESBuild → Bundled Node.js application in dist/
- **Database**: Environment-based DATABASE_URL configuration
- **Deployment**: Replit autoscale deployment target

### Configuration Files
- **Vite**: Custom configuration with path aliases and Replit plugins
- **Drizzle**: PostgreSQL dialect with migration support
- **TypeScript**: Shared configuration for client/server/shared code
- **Tailwind**: Component-focused configuration with dark theme

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```