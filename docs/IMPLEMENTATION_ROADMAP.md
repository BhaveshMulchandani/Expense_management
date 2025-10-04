# Complete Implementation Roadmap

Based on the requirements, here's what's been implemented and what still needs to be done:

## ✅ COMPLETED FEATURES

### 1. Authentication & User Management ✅

- [x] Admin auto-creates company on first signup
- [x] Country selection auto-sets currency (using REST Countries API)
- [x] Currency symbols stored with company
- [x] Three roles: Employee, Manager, Admin
- [x] User registration for all roles
- [x] Company selection for employees/managers
- [x] Role-based authentication
- [x] Profile page showing role and permissions

### 2. Database Models ✅

- [x] User model with roles and manager assignment
- [x] Company model with country and currency
- [x] Expense model with approval tracking
- [x] Approval Rule model with sequential/parallel flows
- [x] Budget model (already exists)

### 3. Type Definitions ✅

- [x] Complete TypeScript interfaces
- [x] NextAuth type extensions
- [x] API response types

---

## 🔄 IN PROGRESS (Need to Complete)

### 1. Admin Panel - User Management

**Priority: HIGH**

Create `/admin/users` page with:

- List all company users (Employee, Manager)
- Create new users button
- Edit user roles
- Assign/change managers for employees
- Deactivate users

**API Endpoints needed:**

```typescript
GET /api/admin/users - List all users in company
POST /api/admin/users - Create employee/manager
PATCH /api/admin/users/:id - Update user (role, manager)
DELETE /api/admin/users/:id - Deactivate user
```

**UI Components:**

- UserListTable component
- CreateUserModal component
- EditUserModal component
- ManagerAssignmentDropdown component

---

### 2. Approval Rules Configuration

**Priority: HIGH**

Create `/admin/approval-rules` page with:

- List approval rules
- Create/Edit approval rule form
- Define amount thresholds
- Assign multiple approvers
- Set sequential vs parallel
- Set approval percentage
- Apply to specific categories

**Fields for Approval Rule:**

```typescript
{
  name: "Large Expense Approval",
  minAmount: 25000,
  maxAmount: null,
  isManagerApproverRequired: true, // NEW FIELD
  approvers: [
    { userId: "manager1", order: 1 },
    { userId: "finance", order: 2 },
    { userId: "director", order: 3 }
  ],
  isSequential: true,
  minApprovalPercentage: 100,
  specificApproverRule: {
    enabled: true,
    approverId: "cfo", // If CFO approves -> auto-approved
  },
  categories: ["Travel", "Equipment"]
}
```

**API Endpoints:**

```typescript
GET /api/admin/approval-rules - List rules
POST /api/admin/approval-rules - Create rule
PATCH /api/admin/approval-rules/:id - Update rule
DELETE /api/admin/approval-rules/:id - Delete rule
```

---

### 3. Expense Submission Workflow

**Priority: HIGH**

**Employee Side:**

- Update `/expenses` page with "Submit" button
- Add status indicator (Draft/Submitted/Waiting Approval/Approved/Rejected)
- Show approval progress (who approved, who's next)
- Disable editing after submission

**API Endpoints:**

```typescript
POST /api/expenses/:id/submit - Submit expense for approval
  ├─ Find applicable approval rule based on amount/category
  ├─ Check if isManagerApproverRequired
  ├─ Create approval requests for all approvers
  ├─ Send notifications
  └─ Update status to "Submitted"
```

**Approval Logic:**

```typescript
function determineApprovers(expense, rules) {
  // Find matching rule
  const rule = rules.find(
    (r) =>
      expense.amount >= r.minAmount &&
      (r.maxAmount === null || expense.amount <= r.maxAmount) &&
      (r.categories.length === 0 || r.categories.includes(expense.category))
  );

  if (!rule) {
    // No rule found - auto approve or require default manager
    return getDefaultApprovers(expense.userId);
  }

  let approvers = [];

  // Check if manager approval required first
  if (rule.isManagerApproverRequired) {
    const manager = await getEmployeeManager(expense.userId);
    approvers.push({ userId: manager.id, order: 0 });
  }

  // Add rule approvers
  approvers = [...approvers, ...rule.approvers];

  return approvers;
}
```

---

### 4. Manager Approval Interface

**Priority: HIGH**

Create `/approvals` page for Managers:

- "Pending Approvals" section
- List expenses waiting for approval
- Show expense details (amount in company currency, description, receipt)
- Approve/Reject buttons
- Comment field (required for reject)
- Show approval history

**API Endpoints:**

```typescript
GET /api/approvals - Get expenses pending approval for logged-in manager
POST /api/approvals/:expenseId/approve - Approve expense
POST /api/approvals/:expenseId/reject - Reject expense with comment
```

**Approval Flow Logic:**

```typescript
async function approveExpense(expenseId, approverId, comment) {
  const expense = await Expense.findOne({ id: expenseId });
  const rule = await getApplicableRule(expense);

  // Update this approver's status
  expense.approvals = expense.approvals.map((a) =>
    a.approverId === approverId
      ? { ...a, status: "Approved", comment, approvedAt: new Date() }
      : a
  );

  // Check if specific approver rule applies
  if (
    rule.specificApproverRule?.enabled &&
    rule.specificApproverRule.approverId === approverId
  ) {
    // Auto-approve entire expense
    expense.status = "Approved";
    expense.approvedAt = new Date();
    return await expense.save();
  }

  // Check if sequential approval
  if (rule.isSequential) {
    const currentApproval = expense.approvals.find(
      (a) => a.approverId === approverId
    );
    const nextApproval = expense.approvals.find(
      (a) => a.order === currentApproval.order + 1
    );

    if (nextApproval) {
      // Move to next approver
      expense.status = "Waiting Approval";
      // Send notification to next approver
    } else {
      // Last approver approved
      expense.status = "Approved";
      expense.approvedAt = new Date();
    }
  } else {
    // Parallel approval - check percentage
    const approvedCount = expense.approvals.filter(
      (a) => a.status === "Approved"
    ).length;
    const totalCount = expense.approvals.length;
    const percentage = (approvedCount / totalCount) * 100;

    if (percentage >= rule.minApprovalPercentage) {
      expense.status = "Approved";
      expense.approvedAt = new Date();
    } else {
      expense.status = "Waiting Approval";
    }
  }

  return await expense.save();
}
```

---

### 5. Multi-Currency Support

**Priority: MEDIUM**

Features:

- Expense amount can be in different currency than company
- Auto-convert to company currency for approval threshold checks
- Display both original and converted amounts
- Use Exchange Rate API for conversion

**API Integration:**

```typescript
// GET https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY}
async function convertCurrency(amount, fromCurrency, toCurrency) {
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
  );
  const data = await response.json();
  const rate = data.rates[toCurrency];
  return amount * rate;
}
```

**Update Expense Model:**

```typescript
{
  amount: 1000,
  currency: "USD", // Original currency
  currencySymbol: "$",
  convertedAmount: 83000, // In company currency (INR)
  companyCurrency: "INR",
  exchangeRate: 83.0,
  conversionDate: "2025-10-04"
}
```

**UI Updates:**

- Currency selector in expense form
- Display: "$1,000 USD (₹83,000 INR)"
- Approval rules check convertedAmount

---

### 6. OCR for Receipts

**Priority: LOW (Nice to have)**

**Options:**

1. **Google Cloud Vision API** (Recommended)
2. **Tesseract.js** (Free, client-side)
3. **AWS Textract**

**Implementation:**

```typescript
// API Endpoint
POST /api/ocr/scan-receipt
  ├─ Accept image file
  ├─ Send to OCR service
  ├─ Parse response
  ├─ Extract: amount, date, vendor, category
  └─ Return structured data

// Response
{
  amount: 1250.50,
  date: "2025-10-04",
  vendor: "Hilton Hotel",
  category: "Travel",
  description: "Hotel stay - Business trip",
  confidence: 0.95
}
```

**UI Flow:**

1. User uploads receipt image
2. Show loading spinner
3. OCR extracts data
4. Pre-fill expense form
5. User can edit extracted data
6. Submit expense

---

## 📋 IMPLEMENTATION ORDER

### Phase 1: Core Approval Workflow (Week 1)

1. ✅ Update expense model with IS_MANAGER_APPROVER field
2. Create Admin User Management panel
3. Implement manager assignment for employees
4. Create expense submission API
5. Implement approval rule matching logic

### Phase 2: Approval Interface (Week 2)

1. Create Manager approvals page
2. Implement approve/reject API endpoints
3. Add sequential approval logic
4. Add conditional approval (percentage + specific approver)
5. Add email/in-app notifications

### Phase 3: Enhanced Features (Week 3)

1. Multi-currency support
2. Currency conversion API integration
3. Role-based dashboards
4. Approval history tracking
5. Export functionality

### Phase 4: Advanced Features (Week 4)

1. OCR receipt scanning
2. Mobile-responsive design
3. Real-time notifications
4. Advanced analytics
5. Audit logs

---

## 🚀 IMMEDIATE NEXT STEPS

To complete the core workflow, focus on these 5 tasks:

### 1. Update ApprovalRule Model

Add `isManagerApproverRequired` field:

```typescript
isManagerApproverRequired: {
  type: Boolean,
  default: true,
}
```

### 2. Create Admin Users API

File: `/api/admin/users/route.ts`

- GET: List users
- POST: Create user with manager assignment

### 3. Create Expense Submission API

File: `/api/expenses/[id]/submit/route.ts`

- Match approval rule
- Create approval requests
- Update status

### 4. Create Approvals API

File: `/api/approvals/route.ts`

- GET: Pending approvals for manager
- POST approve/reject endpoints

### 5. Build Manager Approvals UI

File: `/app/approvals/page.tsx`

- List pending expenses
- Approve/Reject interface
- Comments section

---

## 📊 Current Status

**Completion: 35%**

- ✅ Authentication & roles: 100%
- ✅ Database models: 90%
- ✅ Country/Currency: 100%
- 🔄 Admin panel: 0%
- 🔄 Approval workflow: 20%
- 🔄 Manager interface: 0%
- ⏳ Multi-currency: 0%
- ⏳ OCR: 0%

**Estimated Time to Complete Core Features: 2-3 weeks**

---

## 🎯 Success Criteria

The system will be considered complete when:

1. ✅ Admin can create company with country/currency
2. ⏳ Admin can create employees and managers
3. ⏳ Admin can assign managers to employees
4. ⏳ Admin can create approval rules
5. ⏳ Employee can submit expenses
6. ⏳ Manager sees pending approvals
7. ⏳ Sequential approval works correctly
8. ⏳ Conditional approval (percentage) works
9. ⏳ Specific approver rule works
10. ⏳ Multi-currency conversion works

---

Would you like me to start implementing these features in order? I recommend starting with:

1. Admin User Management panel
2. Expense submission workflow
3. Manager approval interface
