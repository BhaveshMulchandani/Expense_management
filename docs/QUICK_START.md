# 🚀 Quick Start Guide

## Getting Started with the Expense Management System

### Step 1: Initial Setup

Your system is now fully configured with all features! Here's how to start using it:

### Step 2: Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 📝 First-Time Setup Walkthrough

### 1. Create Admin Account

1. Go to `http://localhost:3000/auth/register`
2. Fill in the form:
   - **Name:** Your name
   - **Email:** admin@company.com
   - **Password:** Your password
   - **Role:** Admin (should be pre-selected)
   - **Company Name:** Your Company Inc.
   - **Country:** Select your country from dropdown
   - **Currency:** Auto-fills based on country
3. Click "Register"
4. You'll be logged in automatically

### 2. Create Managers

1. Go to **User Management** in the navigation
2. Click "Create User"
3. Fill in:
   - Name: John Manager
   - Email: john@company.com
   - Password: password123
   - Role: **Manager**
4. Click "Create User"
5. Repeat to create more managers if needed

### 3. Create Employees

1. Still in **User Management**
2. Click "Create User"
3. Fill in:
   - Name: Jane Employee
   - Email: jane@company.com
   - Password: password123
   - Role: **Employee**
   - **Manager:** Select a manager from dropdown
4. Click "Create User"

### 4. Create Approval Rules

1. Go to **Approval Rules** in navigation
2. Click "Create Rule"
3. Example Rule 1: Small Expenses

   - **Name:** "Small Expense - Manager Only"
   - **Min Amount:** 0
   - **Max Amount:** 5000
   - **Approvers:** Select 1 manager
   - ✅ **Require manager approval first**
   - **Sequential:** No (only 1 approver)
   - **Percentage:** 100%
   - Click "Create Rule"

4. Example Rule 2: Medium Expenses

   - **Name:** "Medium Expense - Manager + Finance"
   - **Min Amount:** 5000
   - **Max Amount:** 25000
   - **Approvers:** Select Manager and Finance Manager
   - ✅ **Require manager approval first**
   - ✅ **Sequential approval**
   - **Percentage:** 100%
   - Click "Create Rule"

5. Example Rule 3: Large Expenses
   - **Name:** "Large Expense - Full Chain"
   - **Min Amount:** 25000
   - **Max Amount:** Leave blank (unlimited)
   - **Approvers:** Select Manager, Finance, Director
   - ✅ **Require manager approval first**
   - ✅ **Sequential approval**
   - **Percentage:** 100%
   - ✅ **Enable specific approver auto-approval**
   - **Specific Approver:** Select CEO/CFO
   - Click "Create Rule"

---

## 🎯 Testing the Workflow

### As Employee:

1. **Login as Employee:**

   - Email: jane@company.com
   - Password: password123

2. **Create an Expense:**

   - Go to **Expenses**
   - Click "Add Expense"
   - Fill in:
     - Amount: 15000
     - Category: Travel
     - Description: Business trip to Mumbai
     - Date: Today
     - Payment Method: Credit Card
   - Click "Save" (creates as Draft)

3. **Submit for Approval:**
   - Find the expense in the list
   - Click "Submit for Approval"
   - System automatically:
     - Finds matching rule (Medium Expense)
     - Adds manager as first approver
     - Creates approval requests
     - Changes status to "Submitted"

### As Manager:

1. **Logout and Login as Manager:**

   - Email: john@company.com
   - Password: password123

2. **Review Pending Approvals:**

   - Go to **Approvals** in navigation
   - See Jane's expense waiting for approval
   - Review details:
     - Amount: ₹15,000
     - Category: Travel
     - Description: Business trip to Mumbai

3. **Approve the Expense:**
   - Click "Approve"
   - Add comment (optional): "Approved for business travel"
   - Click "Confirm Approval"
   - If sequential, expense moves to Finance Manager
   - If this was the last approver, status changes to "Approved"

---

## 🌍 Testing Multi-Currency

### As Employee (US-based):

1. Create expense in USD:
   - Amount: 500
   - Currency: USD (if you've added currency selector)
2. Submit expense

3. System converts:
   - $500 USD × 83 = ₹41,500 INR
   - Stores both amounts
   - Approval rule checks ₹41,500

### As Manager:

1. See expense showing:
   - Original: $500 USD
   - Converted: ≈ ₹41,500 INR
2. Approve based on converted amount

---

## 🎭 Different Approval Scenarios

### Scenario 1: Sequential Approval

**Rule:** Manager → Finance → Director (all must approve in order)

**Flow:**

1. Employee submits ₹30,000 expense
2. Manager approves ✅
   - Status: "Waiting Approval"
   - Next: Finance
3. Finance approves ✅
   - Status: "Waiting Approval"
   - Next: Director
4. Director approves ✅
   - Status: "Approved"

### Scenario 2: Parallel Approval (60%)

**Rule:** 3 approvers, any 60% must approve

**Flow:**

1. Employee submits ₹15,000 expense
2. Manager 1 approves ✅
   - Status: "Waiting Approval" (33%)
3. Manager 2 approves ✅
   - Status: "Approved" (66% ≥ 60%)
4. Manager 3's approval not needed

### Scenario 3: Specific Approver Auto-Approval

**Rule:** If CFO approves, auto-approve entire expense

**Flow:**

1. Employee submits ₹100,000 expense
2. CFO approves ✅
   - Status: "Approved" immediately
   - All other approvers bypassed

### Scenario 4: Manager Required First

**Rule:** Manager must approve before others can see

**Flow:**

1. Employee submits expense
2. Only manager sees in "Approvals" page
3. Manager approves ✅
4. Now Finance and Director can see it
5. Sequential approval continues

---

## 📊 Admin Dashboard Features

### User Management (`/admin/users`)

- View all employees and managers
- Create new users with roles
- Assign/change managers for employees
- Deactivate users
- See who reports to whom

### Approval Rules (`/admin/approval-rules`)

- View all active rules
- Create new rules with:
  - Amount thresholds
  - Multiple approvers
  - Sequential vs parallel
  - Manager requirement
  - Specific approver auto-approval
  - Category filters
- Edit existing rules
- Delete rules

---

## 🔐 Role Permissions

### Admin Can:

✅ Create users (employees, managers)
✅ Assign managers
✅ Create/edit approval rules
✅ See all expenses
✅ Approve expenses (if added as approver)
✅ Access User Management
✅ Access Approval Rules

### Manager Can:

✅ Create own expenses
✅ Submit expenses for approval
✅ Approve team's expenses
✅ Approve expenses they're assigned to
✅ Access Approvals page
❌ Cannot access Admin features

### Employee Can:

✅ Create own expenses
✅ Submit expenses for approval
✅ View own expense status
❌ Cannot approve expenses
❌ Cannot access Admin features
❌ Cannot access Approvals page

---

## 🐛 Troubleshooting

### Issue: "No approval rule found"

**Solution:** Create an approval rule that covers the amount range, or ensure employee has a manager assigned.

### Issue: "Manager not found"

**Solution:** Go to User Management and assign a manager to the employee.

### Issue: Can't see "Approvals" in navigation

**Solution:** Only managers and admins see this. Login as manager role.

### Issue: Currency conversion fails

**Solution:** Check internet connection. Exchange Rate API requires internet access.

### Issue: Can't create users

**Solution:** Ensure you're logged in as admin. Check User Management is accessible.

---

## 💡 Tips & Best Practices

### Creating Approval Rules:

1. Start with simple rules (1-2 approvers)
2. Test with small amounts first
3. Add sequential approval for important expenses
4. Use specific approver for emergency approvals
5. Set clear amount thresholds

### Managing Users:

1. Create managers before employees
2. Assign clear manager-employee relationships
3. Use meaningful names and emails
4. Deactivate users instead of deleting

### Expense Workflow:

1. Create expense as "Draft" first
2. Review details before submitting
3. Add clear descriptions
4. Attach receipts if possible
5. Submit when ready for approval

### Approving Expenses:

1. Review all details carefully
2. Check converted amounts for multi-currency
3. Add comments for context
4. Reject with clear reasons
5. Approve promptly to avoid delays

---

## 📈 Next Steps

### Immediate:

1. ✅ Create admin account
2. ✅ Create 2-3 managers
3. ✅ Create 5-10 employees
4. ✅ Create 3-4 approval rules
5. ✅ Test expense submission workflow

### Short-term:

1. Add more approval rules for different categories
2. Test multi-currency expenses
3. Invite real team members
4. Configure email notifications (optional)
5. Set up OCR for receipts (optional)

### Long-term:

1. Add analytics dashboard
2. Export expense reports
3. Integrate with accounting software
4. Add mobile app
5. Implement real-time notifications

---

## 🎉 You're All Set!

Your complete expense management system with approval workflows is ready to use!

**Key Features Active:**
✅ Multi-role system (Admin, Manager, Employee)
✅ User management
✅ Manager assignment
✅ Approval rule configuration
✅ Sequential approval workflow
✅ Parallel approval with percentage
✅ Specific approver auto-approval
✅ Manager approval requirement
✅ Multi-currency support
✅ Currency conversion
✅ Approval interface
✅ Expense submission workflow

**Start by creating your admin account and setting up your first approval rule!** 🚀

For detailed feature documentation, see `COMPLETE_IMPLEMENTATION.md`
