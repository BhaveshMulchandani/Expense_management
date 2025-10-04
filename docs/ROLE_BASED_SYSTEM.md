# Role-Based Access Control System

This document explains the complete role-based access control (RBAC) system implemented according to the Excalidraw workflow specifications.

## Overview

The system implements a **3-tier role hierarchy** with complete approval workflow management:

1. **Admin** - Company owner with full control
2. **Manager** - Can approve/reject expenses and manage team members
3. **Employee** - Can create and submit expenses

## User Roles

### 1. Admin Role

**Capabilities:**

- ✅ Create and manage the company
- ✅ Set company currency
- ✅ Create and manage users (Employees & Managers)
- ✅ Assign managers to employees
- ✅ Create and manage approval rules
- ✅ Configure approval workflows (sequential/parallel)
- ✅ Set minimum approval percentages
- ✅ View all expenses across the company
- ✅ Override approvals and managers
- ✅ Generate company-wide reports

**Signup Process:**

1. Register with admin role
2. Provide company name and currency
3. System automatically creates:
   - Company record
   - Admin user account
   - Links admin to company

**Admin Dashboard Features:**

- User management panel
- Approval rules configuration
- Company-wide analytics
- Currency settings

---

### 2. Manager Role

**Capabilities:**

- ✅ Create and submit own expenses
- ✅ Review and approve/reject team expenses
- ✅ View expenses from assigned employees
- ✅ Add approval comments
- ✅ Track approval queue
- ✅ View team analytics

**Assignment:**

- Created by Admin
- Assigned to specific employees
- Can be changed by Admin if needed

**Manager Dashboard Features:**

- "Approvals to Review" section
- Team expense overview
- Approval history
- Quick approve/reject actions

---

### 3. Employee Role

**Capabilities:**

- ✅ Create expense drafts
- ✅ Submit expenses for approval
- ✅ Upload receipts
- ✅ Track expense status
- ✅ View approval progress
- ✅ See who approved/rejected
- ✅ View personal expense analytics

**Assignment:**

- Created by Admin
- Assigned to a manager
- Manager can be changed by Admin

**Employee Dashboard Features:**

- Expense status overview
- Draft expenses counter
- Submitted/Waiting approval counters
- Quick submit action

## Expense Workflow States

### State Machine

```
Draft → Submitted → Waiting Approval → Approved/Rejected
```

### State Descriptions

**1. Draft**

- Initial state when expense is created
- Editable by employee
- Not visible to managers/approvers
- Can be deleted

**2. Submitted**

- Employee submits expense for approval
- System determines applicable approval rule
- Expense becomes read-only for employee
- Triggers notification to approvers

**3. Waiting Approval**

- Expense is in approval process
- Visible to assigned approvers
- Shows approval progress
- May require multiple approvers based on rules

**4. Approved**

- All required approvals obtained
- Expense marked as approved
- Ready for reimbursement processing
- Cannot be edited

**5. Rejected**

- One or more approvers rejected
- Reason/comment attached
- Employee can view rejection reason
- Cannot resubmit (must create new)

## Approval Rules System

### Rule Components

**1. Approval Rule Structure:**

```typescript
{
  name: string;                    // Rule name
  minAmount: number;               // Minimum amount this rule applies to
  maxAmount: number | null;        // Maximum amount (null = no limit)
  approvers: [{                    // List of approvers
    userId: string;
    order: number;                 // Order in sequential approval
  }];
  isSequential: boolean;           // Sequential or parallel approval
  minApprovalPercentage: number;   // % of approvers needed (e.g., 50 = 50%)
  categories: string[];            // Applicable expense categories
}
```

### Approval Modes

**Sequential Approval (`isSequential: true`)**

- Approvers must approve in order
- Request goes to approver #1 first
- If approved, moves to approver #2
- If any required approver rejects → Auto-rejected
- Order determined by `order` field

**Parallel Approval (`isSequential: false`)**

- All approvers notified simultaneously
- Each can approve/reject independently
- Expense status determined by `minApprovalPercentage`
- Example: 50% means at least half must approve

### Example Rules

**Rule 1: Small Expenses**

```typescript
{
  name: "Small Expense Approval",
  minAmount: 0,
  maxAmount: 5000,
  approvers: [{ userId: "manager1", order: 1 }],
  isSequential: false,
  minApprovalPercentage: 100,
  categories: ["Food", "Transportation"]
}
```

- Expenses ₹0-₹5000 in Food/Transportation
- Requires 1 manager approval
- Simple, fast approval

**Rule 2: Medium Expenses**

```typescript
{
  name: "Medium Expense Approval",
  minAmount: 5001,
  maxAmount: 25000,
  approvers: [
    { userId: "manager1", order: 1 },
    { userId: "manager2", order: 2 }
  ],
  isSequential: true,
  minApprovalPercentage: 100,
  categories: [] // All categories
}
```

- Expenses ₹5001-₹25000
- Requires sequential approval from 2 managers
- Manager1 must approve before Manager2 sees it

**Rule 3: Large Expenses**

```typescript
{
  name: "Large Expense Approval",
  minAmount: 25001,
  maxAmount: null,
  approvers: [
    { userId: "manager1", order: 1 },
    { userId: "manager2", order: 2 },
    { userId: "finance_head", order: 3 }
  ],
  isSequential: true,
  minApprovalPercentage: 100,
  categories: [] // All categories
}
```

- Expenses above ₹25000
- Requires 3-level sequential approval
- Highest scrutiny for large amounts

## Company Management

### Company Creation (Admin Signup)

When an admin signs up:

1. Provides company name and currency
2. System creates:
   ```typescript
   {
     id: "unique-id",
     name: "Company Name",
     currency: "INR",
     adminId: "admin-user-id",
     isActive: true
   }
   ```
3. Admin account linked to company
4. All future users created under this company

### Currency Handling

- Set once during company creation
- Applied to all expenses in the company
- Supports: INR, USD, EUR, GBP, and more
- Display format: ₹1,234.56 (based on currency)

## User Management (Admin Functions)

### Creating Users

Admins can create users through the admin panel:

**Employee Creation:**

```typescript
{
  name: "John Doe",
  email: "john@company.com",
  role: "employee",
  managerId: "manager-user-id", // Assign to manager
  companyId: "company-id"
}
```

**Manager Creation:**

```typescript
{
  name: "Jane Smith",
  email: "jane@company.com",
  role: "manager",
  managerId: null, // Managers report to admin
  companyId: "company-id"
}
```

### Manager Assignment

- **Initial Assignment**: Set by admin during user creation
- **Dynamic Change**: Admin can reassign employees to different managers
- **Dropdown**: Shows all managers in the company
- **Approval Impact**: New manager becomes approver for future expenses

## Data Isolation

### Company-Level Isolation

- Each company has separate data
- Users can only see data from their company
- Expenses, budgets, users all filtered by `companyId`
- No cross-company data visibility

### User-Level Isolation

**Employee View:**

- Only sees own expenses
- Can't view other employees' data
- Dashboard shows personal stats only

**Manager View:**

- Sees own expenses
- Sees expenses from assigned employees
- Approval queue shows relevant requests
- Team analytics for assigned employees

**Admin View:**

- Sees all company data
- Full access to all users
- Complete expense visibility
- Company-wide reports

## Security & Permissions

### Route Protection

```typescript
// middleware.ts
- /dashboard → Requires authentication
- /expenses → Requires authentication
- /budgets → Requires authentication
- /analytics → Requires authentication
- /admin → Requires admin role
- /approvals → Requires manager or admin role
```

### API Endpoint Protection

All API endpoints check:

1. User authentication (valid session)
2. Company membership (same companyId)
3. Role permissions (appropriate role)
4. Data ownership (can access this data)

### Example Permission Checks

```typescript
// Creating expense - Employee, Manager, Admin
if (!session?.user) return unauthorized();
expense.userId = session.user.id;
expense.companyId = session.user.companyId;

// Viewing expense - Owner or Manager or Admin
if (expense.userId !== session.user.id && session.user.role === "employee") {
  return forbidden();
}

// Approving expense - Assigned Manager or Admin
if (!isApproverForExpense(session.user.id, expense)) {
  return forbidden();
}
```

## Implementation Status

### ✅ Completed

- User model with roles (employee, manager, admin)
- Company model with currency
- Approval rule model
- Enhanced expense model with approvals
- Type definitions for all entities
- Authentication with role support
- Admin registration with company creation

### 🔄 In Progress

- Admin panel for user management
- Approval rules configuration UI
- Manager approval interface
- Enhanced expense workflow
- Role-based navigation

### ⏳ Pending

- Email notifications for approvals
- Approval reminder system
- Expense resubmission workflow
- Advanced reporting by role
- Audit log for approval actions

## API Endpoints (To Be Created)

### User Management (Admin)

- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - List all company users
- `PATCH /api/admin/users/:id` - Update user (change manager, etc.)
- `DELETE /api/admin/users/:id` - Deactivate user

### Approval Rules (Admin)

- `POST /api/admin/approval-rules` - Create rule
- `GET /api/admin/approval-rules` - List all rules
- `PATCH /api/admin/approval-rules/:id` - Update rule
- `DELETE /api/admin/approval-rules/:id` - Delete rule

### Approvals (Manager/Admin)

- `GET /api/approvals` - Get pending approvals
- `POST /api/approvals/:expenseId/approve` - Approve expense
- `POST /api/approvals/:expenseId/reject` - Reject expense

### Expenses (Enhanced)

- `POST /api/expenses/:id/submit` - Submit expense for approval
- `GET /api/expenses/team` - Get team expenses (Manager)
- `GET /api/expenses/company` - Get all expenses (Admin)

## Testing Scenarios

### Scenario 1: Admin Setup

1. Admin signs up with company name "TechCorp" and currency "INR"
2. System creates company and admin user
3. Admin logs in and sees admin dashboard
4. Admin creates approval rule for expenses > ₹10,000

### Scenario 2: Employee Expense Submission

1. Admin creates employee "John" with manager "Jane"
2. John logs in and creates expense of ₹15,000
3. John submits expense
4. System applies approval rule (requires Jane's approval)
5. Expense moves to "Waiting Approval"
6. Jane receives notification

### Scenario 3: Manager Approval

1. Jane logs in to manager dashboard
2. Sees John's expense in "Approvals to Review"
3. Reviews details and receipt
4. Approves with comment
5. Expense status changes to "Approved"
6. John receives notification

### Scenario 4: Sequential Approval

1. Employee submits ₹30,000 expense
2. Rule requires 2 sequential approvals
3. Manager1 approves → moves to Manager2
4. Manager2 approves → status becomes "Approved"
5. If Manager1 rejected → auto-rejected, Manager2 never sees it

## Best Practices

1. **Always Assign Managers**: Every employee should have a manager
2. **Create Approval Rules**: Define rules before expense submission
3. **Use Categories**: Apply rules to specific expense types
4. **Set Thresholds**: Different approval levels for different amounts
5. **Regular Audits**: Admin should review approval patterns
6. **Clear Comments**: Approvers should provide rejection reasons
7. **Receipt Uploads**: Mandatory for expenses above threshold

## Troubleshooting

### User Can't Submit Expense

- Check if user has manager assigned
- Verify approval rules exist for expense amount/category
- Ensure user is active in the system

### Manager Can't See Approval

- Verify manager is assigned to employee
- Check if manager is in approval rule
- Ensure expense status is "Submitted" or "Waiting Approval"

### Approval Stuck

- Check if sequential approval is enabled
- Verify previous approver has acted
- Check minimum approval percentage

---

**Next Implementation Priority:**

1. Create Admin User Management UI
2. Build Approval Rules Configuration Page
3. Implement Manager Approval Interface
4. Add Expense Submission Workflow
5. Create Role-Based Dashboards
