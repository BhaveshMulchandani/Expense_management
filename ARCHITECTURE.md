# Project Architecture Diagram

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                          │
│  ┌───────────┬───────────┬───────────┬───────────────┐     │
│  │   Home    │ Dashboard │ Expenses  │  Analytics    │     │
│  │  page.tsx │  page.tsx │ page.tsx  │   page.tsx    │     │
│  └───────────┴───────────┴───────────┴───────────────┘     │
│                            │                                 │
│                    ┌───────┴────────┐                       │
│                    │  Components    │                       │
│                    │  - Button      │                       │
│                    │  - Card        │                       │
│                    │  - Input       │                       │
│                    │  - Select      │                       │
│                    │  - Navigation  │                       │
│                    └────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP Requests
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS API ROUTES                         │
│  ┌─────────────────────────────────────────────────┐        │
│  │ /api/expenses                                   │        │
│  │   - GET (all)    - POST (create)               │        │
│  │ /api/expenses/[id]                             │        │
│  │   - GET (one)    - PUT (update)  - DELETE      │        │
│  │ /api/dashboard                                  │        │
│  │   - GET (stats)                                 │        │
│  │ /api/analytics                                  │        │
│  │   - GET (analytics)                             │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            │
                    Database Operations
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  ┌──────────────────────────────────────────────┐           │
│  │          src/lib/db.ts                       │           │
│  │  ┌────────────────────────────────────────┐  │           │
│  │  │  In-Memory Data Store (Development)    │  │           │
│  │  │  - expenses: Expense[]                 │  │           │
│  │  │                                        │  │           │
│  │  │  Methods:                              │  │           │
│  │  │  - getAll()                            │  │           │
│  │  │  - getById(id)                         │  │           │
│  │  │  - create(expense)                     │  │           │
│  │  │  - update(id, updates)                 │  │           │
│  │  │  - delete(id)                          │  │           │
│  │  │  - filter(filters)                     │  │           │
│  │  └────────────────────────────────────────┘  │           │
│  │                                              │           │
│  │  TODO: Replace with real database          │           │
│  │  - PostgreSQL + Prisma                      │           │
│  │  - MongoDB + Mongoose                       │           │
│  │  - Supabase                                 │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App Layout (layout.tsx)
├── Navigation
│   ├── Home Link
│   ├── Dashboard Link
│   ├── Expenses Link
│   └── Analytics Link
│
└── Page Content
    │
    ├── Home Page (/)
    │   ├── Hero Section
    │   ├── Cards (3x Features)
    │   └── Card (Key Features)
    │
    ├── Dashboard (/dashboard)
    │   ├── Stats Cards (4x)
    │   ├── Category Breakdown Card
    │   ├── Recent Expenses Card
    │   └── Monthly Trend Card
    │
    ├── Expenses (/expenses)
    │   ├── Header + Add Button
    │   ├── Expense Form Card (conditional)
    │   │   ├── Input (Amount)
    │   │   ├── Select (Category)
    │   │   ├── Input (Description)
    │   │   ├── Input (Date)
    │   │   ├── Select (Payment Method)
    │   │   └── Buttons (Submit/Cancel)
    │   └── Expenses Table Card
    │       └── Expense Rows (Edit/Delete)
    │
    └── Analytics (/analytics)
        ├── Overview Stats Cards (4x)
        ├── Category Analysis Card
        ├── Payment Methods Card
        └── Daily Spending Card
```

## Data Flow Diagram

### Creating an Expense

```
User Action                    Frontend                      API                        Database
─────────────────────────────────────────────────────────────────────────────────────────────────

1. Fill Form     ──────────>  Expense Form
                              (page.tsx)
                                   │
2. Click Submit  ──────────>      │
                                   │
3. Validate      ◄─────────       │
                                   │
4. POST Request  ─────────────────┼──────────>  /api/expenses
                                                     │
5. Validate Data ◄───────────────────────────       │
                                                     │
6. Create Expense ────────────────────────────────────┼─────────>  db.expenses.create()
                                                                         │
7. Save to Store ◄───────────────────────────────────────────────       │
                                                                         │
8. Return Data   ◄────────────────────────────────────┤                 │
                                   │                                     │
9. Update UI     ◄─────────       │                                     │
                                   │
10. Show Success  ◄─────────       │
```

### Fetching Dashboard Stats

```
User Action                    Frontend                      API                        Database
─────────────────────────────────────────────────────────────────────────────────────────────────

1. Visit /dashboard ───────>  Dashboard
                              page.tsx
                                   │
2. useEffect()    ──────────>      │
                                   │
3. GET Request    ─────────────────┼──────────>  /api/dashboard
                                                     │
4. Fetch Expenses ────────────────────────────────────┼─────────>  db.expenses.getAll()
                                                                         │
5. Return All     ◄───────────────────────────────────────────────       │
                                                     │
6. Calculate:                                        │
   - Total amount                                    │
   - Monthly total                                   │
   - Category breakdown                              │
   - Recent expenses                                 │
   - Monthly trend                                   │
                                                     │
7. Return Stats   ◄────────────────────────────────  │
                                   │
8. Update State   ◄─────────       │
                                   │
9. Render UI      ◄─────────       │
```

## Type System Flow

```
┌─────────────────────────────────────────┐
│        src/types/index.ts               │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Core Types                       │  │
│  │  - Expense                        │  │
│  │  - ExpenseFormData                │  │
│  │  - ExpenseFilters                 │  │
│  │  - DashboardStats                 │  │
│  │  - AnalyticsData                  │  │
│  │  - ApiResponse<T>                 │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Enums                            │  │
│  │  - ExpenseCategory                │  │
│  │  - PaymentMethod                  │  │
│  │  - ExpenseStatus                  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │            │            │
         ▼            ▼            ▼
    ┌────────┐  ┌─────────┐  ┌──────────┐
    │ Pages  │  │  API    │  │ Database │
    │        │  │ Routes  │  │  Layer   │
    └────────┘  └─────────┘  └──────────┘
```

## Routing Structure

```
Next.js App Router File System

/                           →    src/app/page.tsx
/dashboard                  →    src/app/dashboard/page.tsx
/expenses                   →    src/app/expenses/page.tsx
/analytics                  →    src/app/analytics/page.tsx

API Routes:
/api/expenses               →    src/app/api/expenses/route.ts
/api/expenses/[id]          →    src/app/api/expenses/[id]/route.ts
/api/dashboard              →    src/app/api/dashboard/route.ts
/api/analytics              →    src/app/api/analytics/route.ts
```

## State Management

```
Current: React Hooks (useState, useEffect)

┌──────────────────────────────────────┐
│         Component State              │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Dashboard                      │  │
│  │  - stats: DashboardStats      │  │
│  │  - loading: boolean           │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Expenses                       │  │
│  │  - expenses: Expense[]        │  │
│  │  - loading: boolean           │  │
│  │  - showForm: boolean          │  │
│  │  - editingId: string | null   │  │
│  │  - formData: ExpenseFormData  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Analytics                      │  │
│  │  - analytics: AnalyticsData   │  │
│  │  - loading: boolean           │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

Future: Consider Redux/Zustand for:
  - Shared state across pages
  - Complex state logic
  - Real-time updates
```

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  - React Components                     │
│  - Tailwind CSS                         │
│  - Client-side Logic                    │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Application Layer               │
│  - Next.js App Router                   │
│  - Server Components                    │
│  - Client Components                    │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         API Layer                       │
│  - Next.js Route Handlers               │
│  - Request/Response Logic               │
│  - Data Validation                      │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│  - Data Processing                      │
│  - Calculations                         │
│  - Aggregations                         │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Data Access Layer               │
│  - Database Operations                  │
│  - CRUD Functions                       │
│  - Filtering/Sorting                    │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Data Storage Layer              │
│  - In-Memory (Development)              │
│  - Database (Production)                │
└─────────────────────────────────────────┘
```

## Key Concepts

### 1. Server vs Client Components

- Pages with "use client" directive = Client Components
- API routes = Server-side
- Navigation = Client Component (uses hooks)

### 2. Data Fetching

- Client-side: useEffect + fetch
- Server-side: Direct database calls (in API routes)

### 3. Type Safety

- TypeScript throughout
- Shared types in /types directory
- Compile-time checks

### 4. Styling

- Utility-first with Tailwind
- Component-scoped styles
- Responsive by default

### 5. Routing

- File-system based routing
- Dynamic routes ([id])
- Nested layouts
