# 🚀 Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Start the Development Server

```powershell
npm run dev
```

### Step 2: Open Your Browser

Go to: **http://localhost:3000**

### Step 3: Explore the Application

- **Home** (/) - Landing page
- **Dashboard** (/dashboard) - View statistics
- **Expenses** (/expenses) - Manage expenses
- **Analytics** (/analytics) - View insights

## 📊 Sample Data

The database has been seeded with 7 sample expenses totaling **₹10,450**:

| Description      | Amount | Category       | Payment       |
| ---------------- | ------ | -------------- | ------------- |
| Grocery shopping | ₹1,200 | Food           | Credit Card   |
| Uber ride        | ₹500   | Transportation | UPI           |
| Movie and dinner | ₹2,500 | Entertainment  | Debit Card    |
| Electricity bill | ₹800   | Utilities      | Bank Transfer |
| New clothing     | ₹3,500 | Shopping       | Credit Card   |
| Doctor visit     | ₹1,500 | Healthcare     | Cash          |
| Restaurant lunch | ₹450   | Food           | UPI           |

## ✨ Try These Actions

### Add a New Expense

1. Go to `/expenses`
2. Click **"+ Add Expense"**
3. Fill in the form
4. Click **"Add Expense"**

### Edit an Expense

1. Go to `/expenses`
2. Click **"Edit"** on any expense
3. Modify the details
4. Click **"Update Expense"**

### Delete an Expense

1. Go to `/expenses`
2. Click **"Delete"** on any expense
3. Confirm the deletion

### View Statistics

1. Go to `/dashboard`
2. See:
   - Total expenses
   - Monthly total
   - Category breakdown
   - Recent expenses
   - Monthly trends

### Analyze Spending

1. Go to `/analytics`
2. See:
   - Average daily/monthly spending
   - Top spending category
   - Category distribution
   - Payment method breakdown
   - Daily spending list

## 🔄 Reset Data

To reset the database with fresh sample data:

```powershell
npm run seed
```

## 🛠️ Common Tasks

### Check Connection

Look for this in terminal when accessing the app:

```
✅ Connected to MongoDB
```

### View Logs

- Console logs appear in terminal
- Browser logs appear in DevTools (F12)

### Stop the Server

Press `Ctrl + C` in the terminal

## 📝 API Endpoints

Test these in your browser or with a tool like Postman:

- **GET** http://localhost:3000/api/expenses
- **GET** http://localhost:3000/api/dashboard
- **GET** http://localhost:3000/api/analytics

## 🎯 Next Actions

### Learn More

- Read [MONGODB_SETUP.md](MONGODB_SETUP.md) for database details
- Check [STRUCTURE.md](STRUCTURE.md) for architecture
- See [FILE_GUIDE.md](FILE_GUIDE.md) for file explanations

### Build Features

- Add user authentication
- Implement receipt uploads
- Create budget tracking
- Add export functionality

## ❓ Need Help?

### Application Not Starting?

```powershell
# Reinstall dependencies
npm install

# Try again
npm run dev
```

### No Data Showing?

```powershell
# Reseed the database
npm run seed

# Refresh your browser
```

### Connection Errors?

1. Check `.env.local` file exists
2. Verify MongoDB URI is correct
3. Ensure internet connection is active

## 🎉 You're Ready!

Your expense management application is fully functional and connected to MongoDB!

Start exploring and building your personal finance tracker! 💰
