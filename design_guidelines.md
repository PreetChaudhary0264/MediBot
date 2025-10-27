# Medical Report Analyzer - Design Guidelines

## Design Approach

**Selected Approach**: Design System - Material Design foundation adapted for healthcare
**Justification**: Healthcare applications demand clarity, trust, and usability above visual experimentation. The information-dense nature (medical reports, explanations, chat) requires proven interaction patterns that users can navigate confidently.

**Core Principles**:
- Clinical clarity with warmth
- Trust through professional polish
- Conversational accessibility
- Progressive disclosure of complexity

---

## Typography System

**Font Stack**: Inter (primary), -apple-system fallback
- **Hero/Headlines**: text-4xl to text-5xl, font-bold (48-60px)
- **Section Headers**: text-2xl to text-3xl, font-semibold (24-36px)
- **Body Text**: text-base to text-lg, font-normal (16-18px) - critical for medical content readability
- **Labels/Metadata**: text-sm, font-medium (14px)
- **Chat Messages**: text-base, font-normal with line-height-relaxed for easy scanning

**Line Height**: Use relaxed (1.625) for all medical explanations and chat content; normal (1.5) for UI elements

---

## Layout System

**Spacing Primitives**: Tailwind units of 3, 4, 6, 8, 12, 16
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16
- Card gaps: gap-6
- Form field spacing: space-y-4

**Container Strategy**:
- Main application: max-w-7xl mx-auto
- Chat container: max-w-4xl for optimal reading
- Upload area: max-w-2xl centered

**Grid System**:
- Desktop: Two-column layout (report viewer + chat sidebar)
- Tablet: Single column with collapsible panels
- Mobile: Stacked, full-width components

---

## Core Components

### 1. Upload Interface
**Layout**: Centered card with drag-and-drop zone
- Large dropzone (min-h-64) with dashed border
- Icon (document upload, 48px) centered above text
- Primary text: "Drop your medical report here" (text-xl)
- Secondary text: "or click to browse" (text-sm)
- Supported formats badge below (PDF, JPG, PNG)
- Upload button appears after file selection (w-full, py-3)

### 2. Report Viewer Panel
**Structure**: Left panel (desktop), full-width (mobile)
- Header with report filename and upload date
- Original report preview area with zoom controls
- Tabbed interface: "Original" | "AI Explanation"
- Explanation section uses prose-lg for maximum readability
- Section dividers with medical term callouts
- "Ask a question" quick action at bottom

### 3. Chat Interface
**Layout**: Right sidebar (desktop, w-96), slide-up panel (mobile)
- Fixed header: "Chat about your report"
- Scrollable message area (flex-1, overflow-y-auto)
- Message bubbles: User (right-aligned, rounded-2xl rounded-br-sm), AI (left-aligned, rounded-2xl rounded-bl-sm)
- Each AI message includes timestamp and citation markers
- Input area: Fixed bottom with textarea, send button, attachment option
- Textarea grows with content (max-h-32)

### 4. Navigation Header
- Logo/App name (left)
- "New Analysis" button (right)
- History dropdown (recent reports)
- Simple, clean navigation without clutter

### 5. History/Dashboard (Home State)
**Before Upload**:
- Welcome section with app explanation
- Upload CTA card (prominent, elevated)
- How it works (3 steps with icons)
- Sample questions users can ask

**After Upload**:
- Recent reports grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card shows: thumbnail, filename, date, quick actions
- "Start new analysis" prominently featured

### 6. Explanation Display
**Information Architecture**:
- Summary card (elevated, border-l-4 accent)
- Expandable sections for different report parts
- Medical terms have subtle indicators (dotted underline) - clicking shows definition
- Key findings highlighted in distinct containers
- Severity indicators where appropriate (icons, no colors specified)

---

## Interaction Patterns

**File Upload**:
- Drag-and-drop with visual feedback (border change on drag-over)
- Progress indicator during processing
- Success state with smooth transition to explanation view

**Chat Flow**:
- Auto-scroll to latest message
- Typing indicator (three animated dots)
- Smooth message appearance (fade-in from bottom)
- Click medical term in explanation → auto-fills chat with question

**Report Navigation**:
- Sticky headers during scroll
- Smooth scrolling between sections
- Deep linking to specific report sections

**Responsive Behavior**:
- Desktop: Side-by-side report and chat
- Tablet: Tabbed interface or collapsible panels
- Mobile: Vertical stack with sticky chat toggle button

---

## Accessibility & Trust Elements

**Trust Signals**:
- Disclaimer: "AI-generated explanation. Consult healthcare professional" (always visible, text-sm)
- Data privacy notice in footer
- Processing status messages ("Analyzing report...", "Report ready")

**Accessibility**:
- All form inputs have visible labels
- Chat messages have proper ARIA roles
- Keyboard navigation throughout
- Focus indicators on all interactive elements
- Alt text for all medical imagery

---

## Component Specifications

**Cards**: Rounded corners (rounded-xl), subtle shadow (shadow-sm), responsive padding (p-6 md:p-8)

**Buttons**:
- Primary: py-3 px-6, rounded-lg, font-medium
- Secondary: py-2 px-4, rounded-lg, font-medium
- Icon buttons: p-2, rounded-full

**Form Fields**:
- Input height: h-12
- Textarea: min-h-24
- Border: border-2, rounded-lg
- Focus state: ring-2 offset-2

**Chat Bubbles**: 
- Max width: max-w-md
- Padding: p-4
- User/AI distinction through alignment, not just styling

---

## Images

**Hero Section**: No traditional hero - application opens directly to functional interface (upload or dashboard)

**Supporting Images**:
- Document preview thumbnails in history grid
- Illustration in empty state: "medical document with magnifying glass" - warm, approachable style
- Icon set: Medical-themed (stethoscope, document, chat) from Heroicons or Font Awesome

**Placement**:
- Empty state illustration: centered, w-64 to w-80
- Report thumbnails: aspect-ratio-square in grid cards
- No decorative imagery - focus on functionality and trust

---

## Animation Budget

**Minimal, Purposeful Motion**:
- Upload progress: smooth linear progression
- Message appearance: subtle fade-up (150ms)
- Panel transitions: slide with easing (200ms)
- Loading states: gentle pulse on skeleton screens
- NO: Excessive hover effects, unnecessary micro-interactions

**Loading States**: Skeleton screens for report processing, spinner for chat responses