# Authentication System

This project now includes a complete authentication system using NextAuth.js with MongoDB.

## Features

- ✅ User Registration with email and password
- ✅ Secure Login with bcrypt password hashing
- ✅ JWT-based Session Management
- ✅ Protected Routes (dashboard, expenses, budgets, analytics)
- ✅ Role-based Access Control (user/admin)
- ✅ Automatic Redirect to Login for Unauthenticated Users
- ✅ Sign Out Functionality
- ✅ User-specific Data (ready for implementation)

## Getting Started

### 1. Environment Variables

The `.env.local` file includes:

```bash
MONGODB_URI=mongodb+srv://expense-management:1234567890@cluster0.hmuwfft.mongodb.net/expense-management
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

**⚠️ IMPORTANT:** For production, generate a secure secret:

```bash
openssl rand -base64 32
```

### 2. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## User Flow

### New User Registration

1. Click **"Register"** in the navigation bar
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
3. Click **"Create account"**
4. Redirected to login page upon success

### User Login

1. Click **"Sign In"** in the navigation bar
2. Enter your email and password
3. Click **"Sign in"**
4. Redirected to dashboard upon success

### Protected Routes

The following routes require authentication:

- `/dashboard` - Main dashboard
- `/expenses` - Expense management
- `/budgets` - Budget tracking
- `/analytics` - Analytics and insights

If you try to access these routes without logging in, you'll be automatically redirected to the login page.

### Sign Out

Click the **"Sign Out"** button in the navigation bar (visible when logged in).

## API Endpoints

### POST `/api/auth/register`

Register a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

- `400` - Missing required fields or password too short
- `409` - User already exists
- `500` - Internal server error

### POST `/api/auth/signin`

Handled by NextAuth.js at `/api/auth/[...nextauth]`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

## Database Schema

### User Model

```typescript
{
  id: string; // Unique user ID
  name: string; // User's full name
  email: string; // Unique email (lowercase)
  password: string; // Bcrypt hashed password
  role: "user" | "admin"; // User role
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

## Security Features

1. **Password Hashing**: Uses bcryptjs with salt rounds of 10
2. **Email Uniqueness**: Enforced at database level
3. **Session Management**: JWT-based sessions with NextAuth.js
4. **Protected Routes**: Middleware automatically protects specified routes
5. **Input Validation**: Server-side validation for all user inputs
6. **Lowercase Emails**: All emails stored in lowercase for consistency

## TypeScript Support

Full TypeScript support with custom type definitions:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}
```

## Next Steps (User-Specific Data)

To filter expenses and budgets by user:

1. **Update Expense Model:**

```typescript
userId: { type: String, required: true }
```

2. **Update Budget Model:**

```typescript
userId: { type: String, required: true }
```

3. **Update API Routes:**

```typescript
// In GET /api/expenses
const expenses = await ExpenseModel.find({ userId: session.user.id });
```

4. **Update Seed Script:**
   Assign expenses to specific user IDs.

## Testing Credentials

After registering your first user, you can use those credentials for testing. Example:

```
Email: test@example.com
Password: test123
```

## Troubleshooting

### "Configuration" error

- Ensure `NEXTAUTH_SECRET` is set in `.env.local`
- Restart the development server

### "Invalid credentials" on login

- Verify email and password are correct
- Check MongoDB connection
- Ensure user exists in database

### Redirected to login when already logged in

- Clear browser cookies
- Check session configuration in `src/lib/auth.ts`

### Cannot access protected routes

- Ensure you're logged in
- Check middleware configuration in `src/middleware.ts`

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts          # NextAuth API handler
│   │       └── register/
│   │           └── route.ts          # Registration endpoint
│   └── auth/
│       ├── login/
│       │   └── page.tsx              # Login page
│       └── register/
│           └── page.tsx              # Registration page
├── components/
│   ├── AuthProvider.tsx              # Session provider wrapper
│   └── Navigation.tsx                # Updated with auth UI
├── lib/
│   └── auth.ts                       # NextAuth configuration
├── models/
│   └── User.ts                       # User model
├── types/
│   ├── index.ts                      # User types
│   └── next-auth.d.ts                # NextAuth type extensions
└── middleware.ts                     # Route protection
```

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
