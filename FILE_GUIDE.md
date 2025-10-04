# File Structure Summary

## Complete File Listing

### Root Configuration Files

```
├── package.json              # Dependencies and npm scripts
├── tsconfig.json             # TypeScript configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.mjs        # PostCSS configuration
├── eslint.config.mjs         # ESLint configuration
├── README.md                 # Project documentation
└── STRUCTURE.md              # Detailed structure documentation
```

### Source Code (`/src`)

#### Application Pages (`/src/app`)

```
src/app/
├── layout.tsx                # Root layout with navigation
├── page.tsx                  # Home/landing page
├── globals.css               # Global CSS styles
├── favicon.ico               # Site favicon
│
├── dashboard/
│   └── page.tsx              # Dashboard page with stats
│
├── expenses/
│   └── page.tsx              # Expense management page (CRUD)
│
├── analytics/
│   └── page.tsx              # Analytics and reports page
│
└── api/                      # API Routes
    ├── expenses/
    │   ├── route.ts          # GET all, POST create
    │   └── [id]/
    │       └── route.ts      # GET, PUT, DELETE by ID
    ├── dashboard/
    │   └── route.ts          # Dashboard statistics API
    └── analytics/
        └── route.ts          # Analytics data API
```

#### Components (`/src/components`)

```
src/components/
├── Button.tsx                # Reusable button component
├── Card.tsx                  # Card container component
├── Input.tsx                 # Form input component
├── Select.tsx                # Form select dropdown
├── Navigation.tsx            # Main navigation bar
└── Loading.tsx               # Loading spinner
```

#### Libraries (`/src/lib`)

```
src/lib/
├── db.ts                     # In-memory database (to be replaced)
└── utils.ts                  # Utility helper functions
```

#### Types (`/src/types`)

```
src/types/
└── index.ts                  # TypeScript type definitions
```

### Public Assets (`/public`)

```
public/
├── next.svg                  # Next.js logo
├── vercel.svg                # Vercel logo
├── file.svg                  # File icon
├── globe.svg                 # Globe icon
└── window.svg                # Window icon
```

---

## File Purposes

### Configuration Files

**package.json**

- Lists all npm dependencies (React, Next.js, Tailwind)
- Defines npm scripts (dev, build, start, lint)
- Project metadata

**tsconfig.json**

- TypeScript compiler options
- Path aliases (@/ for src/)
- Include/exclude patterns

**next.config.ts**

- Next.js framework configuration
- Build optimization settings
- Turbopack enabled

**tailwind.config.ts**

- Tailwind CSS configuration
- Custom theme colors
- Plugin configurations

### Page Files

**src/app/page.tsx** (Home Page)

- Landing page with hero section
- Feature showcase
- Call-to-action buttons
- Links to dashboard and expenses

**src/app/dashboard/page.tsx**

- Overview statistics cards
- Category breakdown chart
- Recent expenses list
- Monthly trend visualization
- Fetches data from `/api/dashboard`

**src/app/expenses/page.tsx**

- Expense list table
- Add expense form
- Edit expense functionality
- Delete expense with confirmation
- Filter expenses (future feature)
- Full CRUD operations

**src/app/analytics/page.tsx**

- Spending overview stats
- Category analysis with charts
- Payment method breakdown
- Daily spending list
- Visual reports

### API Route Files

**src/app/api/expenses/route.ts**

- `GET` - Retrieve all expenses with filters
- `POST` - Create new expense
- Validates input data
- Returns standardized ApiResponse

**src/app/api/expenses/[id]/route.ts**

- `GET` - Get single expense by ID
- `PUT` - Update expense
- `DELETE` - Remove expense
- 404 handling for not found

**src/app/api/dashboard/route.ts**

- Calculates total expenses
- Computes monthly totals
- Aggregates category breakdown
- Returns recent expenses
- Generates monthly trend data

**src/app/api/analytics/route.ts**

- Computes spending averages
- Identifies top spending category
- Analyzes by category
- Analyzes by payment method
- Time-based analysis (daily/weekly/monthly)

### Component Files

**Button.tsx**

- Variants: primary, secondary, danger, outline
- Sizes: sm, md, lg
- Extends HTML button props
- Consistent styling with Tailwind

**Card.tsx**

- Container for grouped content
- Optional title and subtitle
- Consistent padding and shadow
- Customizable via className

**Input.tsx**

- Label support
- Error message display
- Full HTML input props
- Validation styling

**Select.tsx**

- Dropdown for forms
- Dynamic options array
- Label and error support
- Accessible design

**Navigation.tsx**

- Client component (uses hooks)
- Active route highlighting
- Links to all main pages
- Responsive design

**Loading.tsx**

- Simple spinner animation
- Used while fetching data
- Centered layout

### Library Files

**src/lib/db.ts**

- In-memory data storage
- CRUD operations for expenses
- Filter functionality
- Sample seed data
- **TODO**: Replace with real database

**src/lib/utils.ts**

- `formatCurrency()` - Format as INR
- `formatDate()` - Human-readable dates
- `generateId()` - Unique ID generation
- `cn()` - Conditional classNames
- Date utility functions

### Type Definition Files

**src/types/index.ts**

- `Expense` interface
- `ExpenseFormData` interface
- `ExpenseFilters` interface
- `DashboardStats` interface
- `AnalyticsData` interface
- `ApiResponse<T>` generic type
- Enums for categories, payment methods, status

---

## Quick Start Guide

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   ```

3. **Access Application**

   - Home: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard
   - Expenses: http://localhost:3000/expenses
   - Analytics: http://localhost:3000/analytics

4. **Test API Endpoints**
   - GET http://localhost:3000/api/expenses
   - GET http://localhost:3000/api/dashboard
   - GET http://localhost:3000/api/analytics

---

## Development Workflow

### Adding a New Feature

1. **Define Types** (`src/types/index.ts`)

   - Add interfaces/types

2. **Create API Route** (`src/app/api/...`)

   - Implement backend logic
   - Add proper error handling

3. **Build Component** (`src/components/`)

   - Create reusable UI component

4. **Create Page** (`src/app/.../page.tsx`)

   - Use components
   - Fetch from API
   - Handle loading/error states

5. **Add Navigation** (`src/components/Navigation.tsx`)
   - Add link to new page

### Modifying Existing Features

1. Find relevant files using this guide
2. Update types if data structure changes
3. Modify API route if backend logic changes
4. Update components for UI changes
5. Test all affected pages

---

## Common Tasks

### Add New Expense Category

1. Update `ExpenseCategory` type in `src/types/index.ts`
2. No other changes needed (dynamic)

### Add New Payment Method

1. Update `PaymentMethod` type in `src/types/index.ts`
2. No other changes needed (dynamic)

### Change Styling

1. Modify Tailwind classes in components
2. Update `tailwind.config.ts` for theme changes
3. Edit `globals.css` for global styles

### Add Database

1. Install database client (e.g., Prisma, Mongoose)
2. Replace functions in `src/lib/db.ts`
3. Add connection string to `.env.local`
4. Update API routes if needed

---

## Notes

- All pages under `/src/app` use file-based routing
- API routes automatically handle HTTP methods
- Components are client-side by default unless marked `"use client"`
- Tailwind classes are purged in production for smaller bundles
- TypeScript provides type safety across the app
