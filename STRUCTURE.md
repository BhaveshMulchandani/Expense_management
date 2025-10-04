# Project Structure Documentation

## Overview

This document provides a detailed breakdown of the Expense Management System architecture.

## Directory Structure

### `/src/app` - Next.js App Router Pages

#### API Routes (`/src/app/api`)

All API endpoints are built using Next.js Route Handlers (App Router).

**Expenses API** (`/api/expenses`)

- `GET /api/expenses` - Fetch all expenses with optional filtering
  - Query params: category, status, dateFrom, dateTo, minAmount, maxAmount
- `POST /api/expenses` - Create a new expense
  - Body: ExpenseFormData

**Single Expense API** (`/api/expenses/[id]`)

- `GET /api/expenses/[id]` - Fetch single expense by ID
- `PUT /api/expenses/[id]` - Update expense by ID
- `DELETE /api/expenses/[id]` - Delete expense by ID

**Dashboard API** (`/api/dashboard`)

- `GET /api/dashboard` - Returns dashboard statistics
  - Total expenses
  - Monthly total
  - Category breakdown
  - Recent expenses
  - Monthly trend

**Analytics API** (`/api/analytics`)

- `GET /api/analytics` - Returns comprehensive analytics
  - Overview (total spent, averages, top category)
  - Category analysis
  - Time analysis (daily, weekly, monthly)
  - Payment method analysis

#### Pages

- `/` - Home/Landing page
- `/dashboard` - Dashboard with stats overview
- `/expenses` - Expense management (CRUD operations)
- `/analytics` - Detailed analytics and reports

### `/src/components` - Reusable UI Components

**Form Components**

- `Button.tsx` - Customizable button (variants: primary, secondary, danger, outline)
- `Input.tsx` - Text input with label and error state
- `Select.tsx` - Dropdown select with options

**Layout Components**

- `Card.tsx` - Container component for grouped content
- `Navigation.tsx` - Main navigation bar (client component)
- `Loading.tsx` - Loading spinner component

### `/src/lib` - Utilities and Business Logic

**Database** (`db.ts`)

- In-memory database implementation
- CRUD operations for expenses
- Filtering functionality
- **Note**: Replace with real database in production

**Utils** (`utils.ts`)

- `formatCurrency()` - Format numbers as currency (INR)
- `formatDate()` - Format dates for display
- `generateId()` - Generate unique IDs
- `cn()` - Utility for conditional class names
- `getMonthName()` - Get month name from index
- `getDateRange()` - Get date ranges (week/month/year)

### `/src/types` - TypeScript Type Definitions

**Core Types**

```typescript
- Expense: Main expense entity
- ExpenseFormData: Form submission data
- ExpenseFilters: Filter criteria for expenses
- DashboardStats: Dashboard statistics structure
- AnalyticsData: Analytics data structure
- ApiResponse<T>: Standard API response wrapper
```

**Enums**

- ExpenseCategory: Food, Transportation, Utilities, etc.
- PaymentMethod: Cash, Credit Card, Debit Card, UPI, etc.
- ExpenseStatus: Pending, Approved, Rejected

## Data Flow

### Adding an Expense

1. User fills form on `/expenses` page
2. Form submits POST request to `/api/expenses`
3. API validates data and creates expense
4. Database updates (in-memory)
5. Response returns to client
6. UI refreshes to show new expense

### Viewing Dashboard

1. User navigates to `/dashboard`
2. Page loads and calls `GET /api/dashboard`
3. API calculates statistics from all expenses
4. Data returned and rendered with charts
5. Real-time updates on subsequent visits

### Filtering Expenses

1. User applies filters on `/expenses` page
2. Query parameters sent to `GET /api/expenses?category=Food&...`
3. API filters expenses based on criteria
4. Filtered results returned and displayed

## State Management

Currently using React's built-in hooks:

- `useState` - Component state
- `useEffect` - Side effects and data fetching
- `usePathname` - Route detection (Navigation)

**Future Consideration**: Add Redux/Zustand for complex state management

## Styling Approach

**Tailwind CSS** - Utility-first CSS framework

- Responsive design with breakpoints (sm, md, lg, xl)
- Custom color palette (blue primary, gray neutrals)
- Dark mode ready (can be enabled)
- Custom utilities in `utils.ts` (cn function)

**Design System**

- Primary color: Blue (#2563eb)
- Success: Green (#10b981)
- Danger: Red (#dc2626)
- Neutral: Gray scale

## API Response Format

All API endpoints follow a consistent response structure:

```typescript
{
  success: boolean,
  data?: T,              // Response data (if successful)
  error?: string,        // Error message (if failed)
  message?: string       // Additional message
}
```

## Error Handling

- Try-catch blocks in all API routes
- Consistent error responses
- HTTP status codes (200, 201, 404, 500)
- Client-side error logging to console

## Performance Considerations

- Server-side data fetching where possible
- Client-side caching with React state
- Turbopack for fast development builds
- Optimized Tailwind CSS (tree-shaking in production)

## Security Notes

**Current Implementation** (Development)

- No authentication (add before production)
- In-memory storage (data lost on restart)
- No input sanitization (add validation)

**Production Checklist**

- [ ] Add authentication (NextAuth.js)
- [ ] Implement authorization (role-based)
- [ ] Validate and sanitize all inputs
- [ ] Add rate limiting
- [ ] Enable HTTPS only
- [ ] Secure database connections
- [ ] Add CSRF protection
- [ ] Implement proper error handling

## Environment Variables (To Be Added)

```env
# Database
DATABASE_URL=your_database_url

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Optional: File Upload
CLOUDINARY_URL=your_cloudinary_url
```

## Testing Strategy (To Be Implemented)

- **Unit Tests**: Jest for utility functions
- **Integration Tests**: API route testing
- **E2E Tests**: Playwright/Cypress for user flows
- **Component Tests**: React Testing Library

## Deployment Checklist

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Add authentication
- [ ] Enable error monitoring (Sentry)
- [ ] Set up analytics (Google Analytics/Plausible)
- [ ] Configure CDN for static assets
- [ ] Enable caching strategies
- [ ] Set up CI/CD pipeline
- [ ] Add health check endpoints
- [ ] Configure logging

## Future Enhancements

### Phase 1 - Core Improvements

- Real database integration
- User authentication
- Receipt upload (Cloudinary/S3)
- Data export (CSV/PDF)

### Phase 2 - Advanced Features

- Multi-user support
- Budget tracking
- Recurring expenses
- Email notifications
- Mobile responsive improvements

### Phase 3 - Enterprise Features

- Team collaboration
- Expense approval workflows
- Advanced reporting
- API webhooks
- Multi-currency support
