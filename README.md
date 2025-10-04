<div align="center"># Expense Management System



# 💸 ExpenseTracker Pro EditionA comprehensive expense tracking and management application built with Next.js 15, TypeScript, Tailwind CSS, and MongoDB.



### Enterprise-Grade Expense Management System## 🚀 Features



[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)- **Dashboard**: Overview of your expenses with visual analytics

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)- **Expense Management**: Add, edit, delete, and track all your expenses

[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)- **Analytics**: Detailed insights into spending patterns

[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)- **Category Tracking**: Organize expenses by multiple categories

[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)- **Payment Methods**: Track different payment types

- **MongoDB Integration**: Persistent data storage with MongoDB Atlas

**A modern, full-stack expense tracking platform with role-based access control, real-time analytics, and multi-currency support.**- **Responsive Design**: Works seamlessly on desktop and mobile



[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api-reference) • [Contributing](#-contributing)## 📁 Project Structure



</div>```

expense-management/

---├── src/

│   ├── app/                      # Next.js App Router

## 🎯 Overview│   │   ├── api/                  # API Routes

│   │   │   ├── expenses/         # Expense CRUD operations

ExpenseTracker Pro is a production-ready expense management system designed for modern enterprises. Built with Next.js 14+ and powered by MongoDB, it provides comprehensive expense tracking, approval workflows, budget management, and real-time analytics.│   │   │   │   ├── route.ts      # GET (all), POST (create)

│   │   │   │   └── [id]/

### Why ExpenseTracker Pro?│   │   │   │       └── route.ts  # GET, PUT, DELETE (single expense)

│   │   │   ├── dashboard/

- **🔐 Secure & Compliant**: Enterprise-grade authentication with NextAuth.js│   │   │   │   └── route.ts      # Dashboard statistics

- **📊 Real-time Analytics**: Interactive dashboards with data visualization│   │   │   └── analytics/

- **🌍 Multi-Currency Support**: Automatic currency conversion with live exchange rates│   │   │       └── route.ts      # Analytics data

- **🎨 High-Contrast UI**: WCAG AAA compliant (21:1 contrast ratio)│   │   ├── dashboard/

- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices│   │   │   └── page.tsx          # Dashboard page

- **⚡ Blazing Fast**: Server-side rendering with React Server Components│   │   ├── expenses/

│   │   │   └── page.tsx          # Expenses management page

---│   │   ├── analytics/

│   │   │   └── page.tsx          # Analytics page

## ✨ Features│   │   ├── layout.tsx            # Root layout with navigation

│   │   ├── page.tsx              # Home page

### Core Functionality│   │   └── globals.css           # Global styles

│   ├── components/               # Reusable React components

| Feature | Description |│   │   ├── Button.tsx            # Button component

|---------|-------------|│   │   ├── Card.tsx              # Card container

| **Expense Management** | Create, edit, submit, and track expenses with receipt uploads |│   │   ├── Input.tsx             # Input field

| **Budget Tracking** | Set departmental budgets with real-time spending alerts |│   │   ├── Select.tsx            # Select dropdown

| **Approval Workflows** | Multi-level approval rules based on amount thresholds |│   │   ├── Navigation.tsx        # Main navigation

| **Analytics Dashboard** | Visualize spending trends, categories, and budget utilization |│   │   └── Loading.tsx           # Loading spinner

| **Multi-Currency** | Support for 150+ currencies with automatic conversion |│   ├── lib/                      # Utility libraries

| **Export & Reporting** | Export expenses to CSV/Excel for accounting integration |│   │   ├── mongodb.ts            # MongoDB connection with caching

│   │   ├── db.ts                 # Database operations using MongoDB

### Role-Based Access Control│   │   └── utils.ts              # Helper functions

│   ├── models/                   # Mongoose models

<table>│   │   └── Expense.ts            # Expense schema and model

  <tr>│   ├── scripts/                  # Utility scripts

    <th>Role</th>│   │   └── seed.ts               # Database seeding script

    <th>Permissions</th>│   └── types/                    # TypeScript type definitions

  </tr>│       └── index.ts              # Core types

  <tr>├── public/                       # Static assets

    <td><b>👑 Admin</b></td>├── .env.local                    # Environment variables (not in git)

    <td>├── package.json                  # Dependencies and scripts

      • Manage users & companies<br>├── tsconfig.json                 # TypeScript configuration

      • Configure approval rules<br>├── next.config.ts                # Next.js configuration

      • View all expenses<br>├── tailwind.config.ts            # Tailwind CSS configuration

      • Override approvals└── README.md                     # This file

    </td>```

  </tr>

  <tr>## 🛠️ Tech Stack

    <td><b>⭐ Manager</b></td>

    <td>- **Framework**: Next.js 15 (App Router)

      • Approve/reject team expenses<br>- **Language**: TypeScript

      • View team analytics<br>- **Styling**: Tailwind CSS 4

      • Add approval comments<br>- **Database**: MongoDB Atlas with Mongoose ODM

      • Manage team budgets- **API**: Next.js API Routes (integrated)

    </td>- **State Management**: React Hooks (useState, useEffect)

  </tr>

  <tr>## 📦 Installation

    <td><b>👤 Employee</b></td>

    <td>1. **Clone the repository**

      • Create & submit expenses<br>

      • Upload receipts<br>   ```bash

      • Track expense status<br>   git clone <repository-url>

      • View personal analytics   cd expense-management

    </td>   ```

  </tr>

</table>2. **Install dependencies**



---   ```bash

   npm install

## 🛠️ Tech Stack   ```



### Frontend3. **Run the development server**

- **Framework**: Next.js 14+ (App Router)

- **Language**: TypeScript 5.0+   ```bash

- **Styling**: Tailwind CSS 3.4+   npm run dev

- **UI Components**: Custom component library with dark mode   ```

- **State Management**: React Hooks & Server Components

4. **Open your browser**

### Backend   Navigate to [http://localhost:3000](http://localhost:3000)

- **Runtime**: Node.js 18+

- **API**: Next.js API Routes (RESTful)## 🔧 Available Scripts

- **Authentication**: NextAuth.js with JWT

- **Database**: MongoDB with Mongoose ODM- `npm run dev` - Start development server with Turbopack

- `npm run build` - Build for production

### DevOps & Tools- `npm start` - Start production server

- **Package Manager**: npm/yarn/pnpm/bun- `npm run seed` - Seed MongoDB with sample data

- **Linting**: ESLint with TypeScript rules- `npm run lint` - Run ESLint

- **Version Control**: Git & GitHub

- **Deployment**: Vercel-ready (one-click deploy)## 📊 API Endpoints



---### Expenses



## 🚀 Quick Start- `GET /api/expenses` - Get all expenses (with optional filters)

- `POST /api/expenses` - Create new expense

### Prerequisites- `GET /api/expenses/[id]` - Get single expense

- `PUT /api/expenses/[id]` - Update expense

```bash- `DELETE /api/expenses/[id]` - Delete expense

Node.js >= 18.0.0

MongoDB >= 6.0### Dashboard

npm/yarn/pnpm/bun

```- `GET /api/dashboard` - Get dashboard statistics



### Installation### Analytics



1. **Clone the repository**- `GET /api/analytics` - Get analytics data

```bash

git clone https://github.com/ClasherCr/expense-management.git## 🎨 Core Components

cd expense-management

```### Button



2. **Install dependencies**Reusable button component with variants (primary, secondary, danger, outline) and sizes (sm, md, lg).

```bash

npm install### Card

# or

yarn installContainer component for displaying grouped content with optional title and subtitle.

# or

pnpm install### Input

```

Form input component with label and error handling.

3. **Environment Setup**

### Select

Create a `.env.local` file in the root directory:

Dropdown select component for forms.

```env

# Database### Navigation

MONGODB_URI=mongodb://localhost:27017/expense-tracker

# or use MongoDB AtlasMain navigation bar with active route highlighting.

# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expense-tracker

## 📝 Type Definitions

# Authentication

NEXTAUTH_URL=http://localhost:3000### Expense

NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

```typescript

# Currency API (Optional - for live exchange rates)interface Expense {

EXCHANGE_RATE_API_KEY=your-api-key-here  id: string;

  amount: number;

# Application  category: ExpenseCategory;

NODE_ENV=development  description: string;

```  date: string;

  paymentMethod: PaymentMethod;

4. **Initialize the Database**  status: ExpenseStatus;

  receiptUrl?: string;

```bash  tags?: string[];

# The app will auto-create collections on first run  createdAt: string;

# Optional: Seed initial data  updatedAt: string;

npm run db:seed}

``````



5. **Start Development Server**### Categories



```bash- Food, Transportation, Utilities, Entertainment

npm run dev- Healthcare, Shopping, Travel, Education, Other

```

### Payment Methods

6. **Open your browser**

- Cash, Credit Card, Debit Card, UPI, Bank Transfer, Other

Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database

---

Currently using an in-memory database (`src/lib/db.ts`).

## 📁 Project Structure

**To integrate a real database:**

```

expense-management/1. Choose your database (PostgreSQL, MongoDB, etc.)

├── public/                     # Static assets2. Install the appropriate client library

├── src/3. Replace the functions in `src/lib/db.ts`

│   ├── app/                   # Next.js App Router pages4. Update environment variables with connection string

│   │   ├── api/              # API routes

│   │   │   ├── auth/         # Authentication endpoints### Recommended Databases

│   │   │   ├── expenses/     # Expense CRUD

│   │   │   ├── budgets/      # Budget management- **PostgreSQL** with Prisma ORM

│   │   │   ├── approvals/    # Approval workflows- **MongoDB** with Mongoose

│   │   │   └── analytics/    # Analytics data- **Supabase** for instant backend

│   │   ├── admin/            # Admin dashboard- **PlanetScale** for MySQL-compatible serverless database

│   │   ├── dashboard/        # Main dashboard

│   │   ├── expenses/         # Expense management UI## 🎯 Next Steps

│   │   ├── budgets/          # Budget tracking UI

│   │   ├── analytics/        # Analytics & reports### Immediate Enhancements

│   │   ├── auth/             # Login/Register pages

│   │   └── profile/          # User profile- [ ] Connect to a real database (PostgreSQL/MongoDB)

│   ├── components/           # Reusable React components- [ ] Add user authentication (NextAuth.js)

│   │   ├── Navigation.tsx    # Main navigation bar- [ ] Implement receipt upload functionality

│   │   ├── Card.tsx          # Card component (4 variants)- [ ] Add data export (CSV/PDF)

│   │   ├── Button.tsx        # Button component (6 variants)- [ ] Create expense categories customization

│   │   ├── Input.tsx         # Form input component- [ ] Add budget tracking and alerts

│   │   ├── Select.tsx        # Dropdown select

│   │   └── Loading.tsx       # Loading spinner### Advanced Features

│   ├── lib/                  # Utility functions

│   │   ├── db.ts            # Database connection- [ ] Multi-currency support

│   │   ├── auth.ts          # Auth configuration- [ ] Recurring expenses

│   │   └── utils.ts         # Helper functions- [ ] Expense sharing and splitting

│   ├── models/              # MongoDB schemas- [ ] Email notifications

│   │   ├── User.ts- [ ] Dark mode

│   │   ├── Expense.ts- [ ] Mobile app (React Native)

│   │   ├── Budget.ts- [ ] Advanced charts (Chart.js/Recharts)

│   │   ├── Company.ts

│   │   └── ApprovalRule.ts## 🚀 Deployment

│   └── types/               # TypeScript type definitions

├── .env.local               # Environment variables### Vercel (Recommended)

├── next.config.ts           # Next.js configuration

├── tailwind.config.ts       # Tailwind CSS config```bash

├── tsconfig.json            # TypeScript confignpm install -g vercel

└── package.json             # Dependenciesvercel

``````



---### Other Platforms



## 📖 Documentation- **Netlify**: Connect your Git repository

- **Railway**: Deploy with one click

### Key Concepts- **AWS/Azure/GCP**: Use container deployment



#### 1. **Expense Lifecycle**## 📄 License



```This project is open source and available under the MIT License.

Draft → Submitted → Pending Approval → Approved/Rejected

```## 🤝 Contributing



- **Draft**: Expense created but not submittedContributions, issues, and feature requests are welcome!

- **Submitted**: Awaiting approval based on rules

- **Pending**: In approval queue## 📧 Support

- **Approved**: Ready for reimbursement

- **Rejected**: Requires revision or cancellationFor support, email your-email@example.com or create an issue in the repository.


#### 2. **Approval Rules**

Configure automatic routing based on:
- **Amount Threshold**: Auto-approve small expenses
- **Department**: Route to specific managers
- **Expense Category**: Different approvers per category
- **User Role**: Escalation to higher management

#### 3. **Budget Alerts**

- **80% Warning**: Yellow alert when budget reaches 80%
- **100% Exceeded**: Red alert when budget is exceeded
- **Email Notifications**: Automatic alerts to stakeholders

---

## 🔌 API Reference

### Authentication

```bash
POST /api/auth/register       # Register new user
POST /api/auth/[...nextauth]  # NextAuth endpoints
```

### Expenses

```bash
GET    /api/expenses          # List all expenses (filtered by role)
POST   /api/expenses          # Create new expense
GET    /api/expenses/[id]     # Get expense details
PUT    /api/expenses/[id]     # Update expense
DELETE /api/expenses/[id]     # Delete expense
POST   /api/expenses/[id]/submit  # Submit for approval
```

### Budgets

```bash
GET    /api/budgets           # List all budgets
POST   /api/budgets           # Create budget
PUT    /api/budgets/[id]      # Update budget
DELETE /api/budgets/[id]      # Delete budget
```

### Approvals

```bash
GET    /api/approvals         # Get pending approvals
POST   /api/approvals/[id]/approve  # Approve expense
POST   /api/approvals/[id]/reject   # Reject expense
```

### Analytics

```bash
GET    /api/analytics         # Get analytics data
```

### Admin

```bash
GET    /api/admin/users       # List all users
PUT    /api/admin/users/[id]  # Update user
GET    /api/admin/approval-rules  # List approval rules
POST   /api/admin/approval-rules  # Create approval rule
```

---

## 🎨 UI Components

### Component Library

Our high-contrast, accessible component system:

#### Button Variants
```tsx
<Button variant="default">Default</Button>
<Button variant="gradient">Gradient</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Success</Button>
```

#### Card Variants
```tsx
<Card variant="default">Standard Card</Card>
<Card variant="gradient">Gradient Card</Card>
<Card variant="outlined">Outlined Card</Card>
<Card variant="glass">Glass Morphism</Card>
```

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Type checking
npm run type-check
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ClasherCr/expense-management)

1. Click the button above
2. Add environment variables
3. Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build image
docker build -t expense-tracker .

# Run container
docker run -p 3000:3000 --env-file .env.local expense-tracker
```

---

## 🔒 Security

- **Authentication**: Secure JWT-based auth with NextAuth.js
- **Authorization**: Role-based access control (RBAC)
- **Data Validation**: Server-side input validation
- **Environment Variables**: Sensitive data protection
- **HTTPS Only**: Production deployments require HTTPS
- **CORS**: Configured for API security

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-company support
- [ ] Advanced reporting (PDF generation)
- [ ] Integration with accounting software (QuickBooks, Xero)
- [ ] OCR receipt scanning
- [ ] Approval workflow automation
- [ ] Email notifications
- [ ] Audit logs
- [ ] Two-factor authentication (2FA)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain WCAG AAA accessibility standards
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**ClasherCr**
- GitHub: [@ClasherCr](https://github.com/ClasherCr)
- Repository: [expense-management](https://github.com/ClasherCr/expense-management)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Hosting Platform

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by [ClasherCr](https://github.com/ClasherCr)

</div>
