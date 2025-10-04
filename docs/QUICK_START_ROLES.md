# Quick Start Guide - Role-Based System

## 🎉 Fixed Issues

✅ **All 3 roles now work** - Employee, Manager, and Admin
✅ **Everyone can register** - No longer restricted to admin-only
✅ **Company selection** - Employees/Managers can join existing companies
✅ **Role-specific permissions** - Each role has proper access controls

## 📝 How to Test the Roles

### Step 1: Create Admin Account (First User)

1. Go to `/auth/register`
2. Select **"Admin (Create New Company)"** as role
3. Enter company details:
   - Company Name: "TechCorp"
   - Currency: "INR (₹)"
4. Enter your name, email, password
5. Click **"Create account"**
6. ✅ This creates:
   - A new company
   - Admin user account
   - Links admin to company

### Step 2: Create Manager Account

1. Go to `/auth/register` (in a new incognito window or logout first)
2. Select **"Manager"** as role
3. Select the company from dropdown: "TechCorp (INR)"
4. Enter name, email, password
5. Click **"Create account"**
6. ✅ Manager account created in the same company

### Step 3: Create Employee Account

1. Go to `/auth/register` (new incognito or logout)
2. Select **"Employee"** as role
3. Select the company from dropdown: "TechCorp (INR)"
4. Enter name, email, password
5. Click **"Create account"**
6. ✅ Employee account created in the same company

## 🔍 Verify Roles are Working

### Check Your Profile

After logging in with any account:

1. Go to `/profile` in the navigation
2. You should see:
   - Your name and email
   - **Your role** (Employee/Manager/Admin) with colored badge
   - User ID
   - Company ID
   - Role-specific permissions list

### Role Badges:

- 🟣 **Admin** - Purple badge
- 🔵 **Manager** - Blue badge
- 🟢 **Employee** - Green badge

## 🧪 Testing Scenarios

### Test 1: Multiple Companies

1. Create Admin 1 → Company "TechCorp"
2. Create Admin 2 → Company "StartupInc"
3. Create Employee → Join "TechCorp"
4. Create Manager → Join "StartupInc"

✅ Each company has separate users

### Test 2: Role Verification

**Admin Login:**

- Can see profile with "admin" role
- Has admin permissions listed

**Manager Login:**

- Can see profile with "manager" role
- Has manager permissions listed

**Employee Login:**

- Can see profile with "employee" role
- Has employee permissions listed

### Test 3: Data Isolation

1. Login as Employee A (TechCorp)
2. Create an expense
3. Logout and login as Employee B (TechCorp)
4. Employee B should NOT see Employee A's expenses
5. Login as Manager (TechCorp)
6. Manager SHOULD see all TechCorp expenses

## 🔐 What Each Role Can Do

### 👑 Admin

- ✅ Create and manage users
- ✅ Configure approval rules
- ✅ View all company expenses
- ✅ Override approvals
- ✅ Manage company settings

### 👔 Manager

- ✅ Create own expenses
- ✅ Approve/reject team expenses
- ✅ View team member expenses
- ✅ Add approval comments
- ✅ Track approval queue

### 👤 Employee

- ✅ Create and submit expenses
- ✅ Upload receipts
- ✅ Track expense status
- ✅ View personal analytics
- ✅ See approval progress

## 📊 Registration Flow

```
┌─────────────────┐
│  Choose Role    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
  Admin   Employee/Manager
    │         │
    ├─────────┴────────┐
    │                  │
 Create New      Select Existing
 Company          Company
    │                  │
    └─────────┬────────┘
              │
        Register User
```

## 🚀 Current Features

### ✅ Completed

- 3-tier role system (Employee, Manager, Admin)
- Company creation on admin signup
- User registration for all roles
- Company selection for employees/managers
- Role-based authentication
- Profile page showing role details
- Session management with role data

### 🔄 Next Steps

- Admin panel to manage users
- Approval workflow UI
- Manager dashboard for approvals
- Employee expense submission
- Role-based dashboard views

## 🐛 Troubleshooting

### "Company ID required" error

**Solution:** Make sure a company exists first. Create an admin account to create a company, then employees/managers can join.

### No companies in dropdown

**Solution:** Create an admin account first. Admin signup creates the company that others can join.

### Role not showing correctly

**Solution:**

1. Go to `/profile` to verify your role
2. Clear cookies and login again
3. Check the colored badge (Purple=Admin, Blue=Manager, Green=Employee)

### Can't see expenses

**Solution:**

- Employees: Can only see own expenses
- Managers: Can see company expenses
- Admins: Can see all company expenses

## 📧 Test Accounts Template

Create these accounts to test:

```
Account 1 (Admin):
- Email: admin@techcorp.com
- Password: admin123
- Role: Admin
- Company: TechCorp (INR)

Account 2 (Manager):
- Email: manager@techcorp.com
- Password: manager123
- Role: Manager
- Company: TechCorp (INR)

Account 3 (Employee):
- Email: employee@techcorp.com
- Password: employee123
- Role: Employee
- Company: TechCorp (INR)
```

## ✅ Verification Checklist

- [ ] Can create admin account with company
- [ ] Can create manager account in existing company
- [ ] Can create employee account in existing company
- [ ] Profile page shows correct role
- [ ] Role badge has correct color
- [ ] Each role shows different permissions
- [ ] Can login with all account types
- [ ] Navigation shows profile link
- [ ] Session persists after refresh

---

**All roles are now working! 🎉**

Test the registration flow and verify each role displays correctly in the profile page.
