# Medical Report Analyzer

## Overview

MediClarify is an AI-powered medical report analyzer that helps patients understand their medical reports in simple, accessible language. Users upload medical documents (PDFs or images), and the application uses AI to extract text and generate clear, compassionate explanations. The app also features an interactive chat interface where users can ask follow-up questions about their reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui (Radix UI primitives) with Tailwind CSS for styling. The design follows Material Design principles adapted for healthcare, prioritizing clinical clarity, trust, and conversational accessibility.

**Routing**: Wouter for client-side routing with two main pages:
- Home page (`/`) - Upload interface and recent reports list
- Report viewer (`/report/:id`) - Display report analysis and chat interface

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. No global client-side state management library is used.

**Design System**: Custom design system based on "new-york" style with extensive Radix UI components. Typography uses Inter font with carefully chosen size scales for medical content readability. Layout follows a responsive grid system with max-width containers.

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Structure**: RESTful API with the following endpoints:
- `POST /api/upload` - File upload for medical reports
- `GET /api/reports` - List all reports
- `GET /api/reports/:id` - Get specific report
- `POST /api/chat/:id` - Chat about a specific report
- `GET /api/messages/:id` - Get chat messages for a report

**File Processing Pipeline**:
1. File upload via multer (in-memory storage, 10MB limit)
2. Text extraction based on file type (PDF or image)
3. Asynchronous AI analysis of extracted text
4. Storage of results

**Document Processing**:
- PDF parsing using `pdf-parse` library
- OCR for images using Tesseract.js (`tesseract.js`)
- Support for PDF and image file types (jpg, png, etc.)

### Data Storage

**Database**: PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)

**ORM**: Drizzle ORM for type-safe database operations

**Schema**:
- `reports` table: Stores uploaded report metadata, extracted text, AI explanations, and error states
- `messages` table: Stores chat conversation history linked to reports

**Storage Strategy**: Currently uses in-memory storage implementation (`MemStorage` class) as a fallback, but database schema is defined for PostgreSQL deployment. The storage interface (`IStorage`) allows easy switching between implementations.

**Session Management**: Uses `connect-pg-simple` for PostgreSQL-backed session storage with Express sessions.

### External Dependencies

**AI/LLM Service**: Hugging Face Inference API (`@huggingface/inference`) for:
- Medical report analysis and explanation generation
- Chat-based question answering about reports
- Uses text generation models with custom prompts optimized for medical content

**LangChain Integration**: `@langchain/core` included for potential advanced AI workflows and chaining capabilities.

**OCR Service**: Tesseract.js for optical character recognition of image-based medical reports (runs client-side in worker threads).

**Database Provider**: Neon serverless PostgreSQL for scalable, serverless database hosting.

**Design Rationale**:
- **Hugging Face chosen over OpenAI**: Likely for cost-effectiveness and flexibility in model selection
- **Neon serverless PostgreSQL**: Enables automatic scaling and pay-per-use pricing suitable for healthcare applications with variable load
- **Drizzle ORM**: Provides type safety and better TypeScript integration compared to traditional ORMs
- **In-memory fallback storage**: Ensures application can run during development without database provisioning

**Third-party UI Libraries**:
- Radix UI for accessible, unstyled component primitives
- react-markdown with remark-gfm for rendering AI-generated explanations
- react-dropzone for file upload interface
- date-fns for date formatting