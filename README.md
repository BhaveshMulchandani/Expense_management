# Expense Management System

A comprehensive expense tracking and management application built with Next.js 15, TypeScript, Tailwind CSS, and MongoDB.

## 🚀 Features

- **Dashboard**: Overview of your expenses with visual analytics
- **Expense Management**: Add, edit, delete, and track all your expenses
- **Analytics**: Detailed insights into spending patterns
- **Category Tracking**: Organize expenses by multiple categories
- **Payment Methods**: Track different payment types
- **MongoDB Integration**: Persistent data storage with MongoDB Atlas
- **Responsive Design**: Works seamlessly on desktop and mobile

## 📁 Project Structure

```
expense-management/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── expenses/         # Expense CRUD operations
│   │   │   │   ├── route.ts      # GET (all), POST (create)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET, PUT, DELETE (single expense)
│   │   │   ├── dashboard/
│   │   │   │   └── route.ts      # Dashboard statistics
│   │   │   └── analytics/
│   │   │       └── route.ts      # Analytics data
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   ├── expenses/
│   │   │   └── page.tsx          # Expenses management page
│   │   ├── analytics/
│   │   │   └── page.tsx          # Analytics page
│   │   ├── layout.tsx            # Root layout with navigation
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/               # Reusable React components
│   │   ├── Button.tsx            # Button component
│   │   ├── Card.tsx              # Card container
│   │   ├── Input.tsx             # Input field
│   │   ├── Select.tsx            # Select dropdown
│   │   ├── Navigation.tsx        # Main navigation
│   │   └── Loading.tsx           # Loading spinner
│   ├── lib/                      # Utility libraries
│   │   ├── mongodb.ts            # MongoDB connection with caching
│   │   ├── db.ts                 # Database operations using MongoDB
│   │   └── utils.ts              # Helper functions
│   ├── models/                   # Mongoose models
│   │   └── Expense.ts            # Expense schema and model
│   ├── scripts/                  # Utility scripts
│   │   └── seed.ts               # Database seeding script
│   └── types/                    # TypeScript type definitions
│       └── index.ts              # Core types
├── public/                       # Static assets
├── .env.local                    # Environment variables (not in git)
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── README.md                     # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB Atlas with Mongoose ODM
- **API**: Next.js API Routes (integrated)
- **State Management**: React Hooks (useState, useEffect)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd expense-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed MongoDB with sample data
- `npm run lint` - Run ESLint

## 📊 API Endpoints

### Expenses

- `GET /api/expenses` - Get all expenses (with optional filters)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/[id]` - Get single expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

### Dashboard

- `GET /api/dashboard` - Get dashboard statistics

### Analytics

- `GET /api/analytics` - Get analytics data

## 🎨 Core Components

### Button

Reusable button component with variants (primary, secondary, danger, outline) and sizes (sm, md, lg).

### Card

Container component for displaying grouped content with optional title and subtitle.

### Input

Form input component with label and error handling.

### Select

Dropdown select component for forms.

### Navigation

Main navigation bar with active route highlighting.

## 📝 Type Definitions

### Expense

```typescript
interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  status: ExpenseStatus;
  receiptUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Categories

- Food, Transportation, Utilities, Entertainment
- Healthcare, Shopping, Travel, Education, Other

### Payment Methods

- Cash, Credit Card, Debit Card, UPI, Bank Transfer, Other

## 🗄️ Database

Currently using an in-memory database (`src/lib/db.ts`).

**To integrate a real database:**

1. Choose your database (PostgreSQL, MongoDB, etc.)
2. Install the appropriate client library
3. Replace the functions in `src/lib/db.ts`
4. Update environment variables with connection string

### Recommended Databases

- **PostgreSQL** with Prisma ORM
- **MongoDB** with Mongoose
- **Supabase** for instant backend
- **PlanetScale** for MySQL-compatible serverless database

## 🎯 Next Steps

### Immediate Enhancements

- [ ] Connect to a real database (PostgreSQL/MongoDB)
- [ ] Add user authentication (NextAuth.js)
- [ ] Implement receipt upload functionality
- [ ] Add data export (CSV/PDF)
- [ ] Create expense categories customization
- [ ] Add budget tracking and alerts

### Advanced Features

- [ ] Multi-currency support
- [ ] Recurring expenses
- [ ] Expense sharing and splitting
- [ ] Email notifications
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Advanced charts (Chart.js/Recharts)

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

- **Netlify**: Connect your Git repository
- **Railway**: Deploy with one click
- **AWS/Azure/GCP**: Use container deployment

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email your-email@example.com or create an issue in the repository.
