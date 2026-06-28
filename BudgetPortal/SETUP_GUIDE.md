# Budget Performance Portal – Power Apps Setup Guide

## What This App Does

| Screen | Features |
|--------|----------|
| **Budget Performance** | KPI cards (Total Budget / Actual / Variance / % Used), filterable detail table with color-coded status badges |
| **Transfer Requests** | Submit new budget transfer requests, view pending/approved/rejected counts, search/filter, approval workflow ready |

---

## Step 1 – Open Power Apps Maker

1. Go to **https://make.powerapps.com**
2. Sign in with your Microsoft 365 account (the one with your Power Apps licence)
3. Select the correct **Environment** (top-right dropdown)

---

## Step 2 – Create a New Canvas App

1. Click **+ Create** → **Blank app** → **Blank canvas app**
2. Name it: `Budget Performance Portal`
3. Format: **Tablet** (1366 × 768) — best for desktop use
4. Click **Create**

---

## Step 3 – Set Up the Two Screens

In the left panel click **+ New screen** → **Blank** and name them:
- `BudgetPerformanceScreen`
- `TransferRequestScreen`

---

## Step 4 – Add the App OnStart Code

1. Click the **App** object in the tree view (left panel)
2. Select the `OnStart` property
3. Paste the entire `OnStart` formula from `PowerApps/src/App.yaml`

This loads sample data. Later you will swap it for your real Excel / Oracle source.

---

## Step 5 – Build the Budget Performance Screen

Use the YAML file `PowerApps/src/Screens/BudgetPerformance.yaml` as your blueprint.

**Quick build order:**
1. Header rectangle + labels (top dark blue bar)
2. Navigation buttons (2 tabs)
3. Filter row (3 dropdowns + Apply button + Export button)
4. 4 KPI cards (white rectangles with labels)
5. Table header rectangle + column labels
6. Gallery with all row controls

**Key formula – Apply Filter button OnSelect:**
```powerapps
ClearCollect(
  FilteredBudget,
  Filter(
    BudgetData,
    (DeptDropdown.Selected.Value = "All Departments" || Department = DeptDropdown.Selected.Value),
    Year = Value(YearDropdown.Selected.Value)
  )
)
```

---

## Step 6 – Build the Transfer Request Screen

Use `PowerApps/src/Screens/TransferRequest.yaml` as your blueprint.

**Key formula – Submit button OnSelect:**
```powerapps
If(
  IsBlank(FormFromDeptInput.Selected.Value) || IsBlank(FormAmountInput.Text),
  Notify("Please fill in all required fields", NotificationType.Warning),
  Collect(
    TransferRequests,
    {
      RequestRef: "TR-" & Text(Now(), "yyyymmdd") & "-" & Text(CountRows(TransferRequests)+1,"000"),
      RequestDate: Now(),
      RequestedBy: User().FullName,
      FromDepartment: FormFromDeptInput.Selected.Value,
      ToDepartment: FormToDeptInput.Selected.Value,
      TransferAmount: Value(FormAmountInput.Text),
      Status: "Pending"
    }
  );
  UpdateContext({ShowForm: false});
  Notify("Request submitted!", NotificationType.Success)
)
```

---

## Step 7 – Download the App to Your Desktop

Power Apps provides a **desktop player** so you don't need a browser:

1. Go to **https://apps.microsoft.com/store/detail/power-apps/9NBLGGH5Z8F3**
   or search **"Power Apps"** in the Microsoft Store
2. Install **Power Apps** (free player app)
3. Open it and sign in → your app appears in **My Apps**
4. Click the app → it runs natively on your desktop

---

## Step 8 – Connect Your Real Data (When Ready)

### Option A – Excel (OneDrive / SharePoint)
1. Upload your Excel file to **OneDrive for Business**
2. In Power Apps: **Data → Add data → Excel Online (Business)**
3. Pick your file and both tables (`BudgetData`, `TransferRequests`)
4. In `App.OnStart` replace `ClearCollect(BudgetData, {...sample...})` with:
   ```powerapps
   ClearCollect(BudgetData, BudgetData_Table)
   ```

### Option B – Oracle EPS (via Power Automate)
1. Create a **Power Automate** flow with the **Oracle DB connector**
2. Query your EPS budget table: `SELECT dept, cost_center, budget_amt, actual_amt FROM eps_budget WHERE fiscal_year = :year`
3. Return results as JSON
4. In Power Apps call the flow:
   ```powerapps
   ClearCollect(BudgetData, BudgetFlow.Run(YearDropdown.Selected.Value).budgetItems)
   ```

### Option C – SharePoint List (easiest, no extra licence)
1. Create two SharePoint lists: `BudgetData` and `TransferRequests`
2. In Power Apps: **Data → SharePoint** → connect both lists
3. Direct delegation works — no `ClearCollect` needed for large datasets

---

## Step 9 – Approval Workflow (Power Automate)

When you get your **Power Automate licence**, create a flow:

**Trigger:** When a new item is added to `TransferRequests` SharePoint list  
**Action 1:** Send Approval email to budget manager  
**Action 2 (Approved):** Update `Status` → `"Approved"` + email requester  
**Action 2 (Rejected):** Update `Status` → `"Rejected"` + email requester with reason  

In Power Apps, trigger it from the Submit button:
```powerapps
TransferApprovalFlow.Run(NewRequest.RequestRef, NewRequest.RequestedByEmail)
```

---

## App Colour Reference

| Element | Colour |
|---------|--------|
| Header / Footer | `RGBA(0, 70, 127, 1)` – Dark Blue |
| Active tab | `RGBA(0, 120, 212, 1)` – Microsoft Blue |
| On Track badge | `RGBA(16, 124, 16, 1)` – Green |
| At Risk badge | `RGBA(255, 140, 0, 1)` – Orange |
| Over Budget badge | `RGBA(196, 43, 28, 1)` – Red |
| Background | `RGBA(245, 247, 250, 1)` – Light Grey |

---

## Files in This Package

```
BudgetPortal/
├── SETUP_GUIDE.md                          ← This file
└── PowerApps/
    ├── src/
    │   ├── App.yaml                        ← OnStart data + screen wiring
    │   └── Screens/
    │       ├── BudgetPerformance.yaml      ← Screen 1 full layout + formulas
    │       └── TransferRequest.yaml        ← Screen 2 full layout + formulas
    └── DataTemplates/
        └── BudgetData_Template.xlsx.md     ← Excel column definitions
```
