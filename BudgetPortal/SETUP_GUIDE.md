# NPO Budget Portal – Power Apps Setup Guide
**National Projects Office | FY2026 | AED Currency**

This Power Apps canvas app is a faithful recreation of your HTML portal
(`NPO_Budget_Portal_FY2026_MASTER_All_Departments.html`) built for Microsoft Power Apps Desktop.

---

## What the App Contains

### Real Data Already Embedded
All your FY2026 data is pre-loaded in `App.yaml` → `OnStart`:

| Data | Records |
|------|---------|
| Corporate accounts | 54 accounts across 8 departments |
| Project items | 21 projects across 4 departments |
| Departments (Corp) | Logistics & GS, IT, HR, Financial Affairs, Org Dev, Enablement, Legal Affairs, Strategic Initiatives |
| Departments (Proj) | Activation, Creative, Strategic Initiatives, Enablement |
| Fields per record | FY Budget, YTD Budget, Actual, Encumbrances, Jan–May actuals |
| Currency | AED |

### Screens

| Screen | Purpose |
|--------|---------|
| `LoginScreen` | Department selector — same as HTML login |
| `DashboardScreen` | All views: NPO overview, Corp All, Corp Dept, Accounts, Proj All, Proj Dept, Projects, Transfer |

### Pages (within DashboardScreen, controlled by `ActivePage` variable)
- `npo` — Full NPO organization view with Corporate + Projects split
- `corp-all` — All corporate departments overview + KPIs
- `corp-depts` — Department cards grid (click to drill)
- `corp-dept` — Single department overview + KPIs
- `accounts` — Account-level table with utilization % and status badges
- `proj-all` — All projects overview + KPIs
- `proj-depts` — Project department cards grid
- `proj-dept` — Single project department overview
- `projects` — Project-level table
- `transfer` — Budget transfer request form → sends **mailto:Tawfiq.Nayef@npo.ae**

---

## Step 1 – Open Power Apps Maker

1. Go to **https://make.powerapps.com**
2. Sign in with your Microsoft 365 / NPO account
3. Select the correct Environment (top-right)

---

## Step 2 – Create the Canvas App

1. **+ Create** → **Blank app** → **Blank canvas app**
2. Name: `NPO Budget Portal FY2026`
3. Format: **Tablet** (1366 × 768)
4. Click **Create**

---

## Step 3 – Add the Screens

In the left tree view:
1. Rename the default screen to `LoginScreen`
2. Add a second screen: `DashboardScreen`

---

## Step 4 – Wire Up the App.OnStart

1. Click **App** in the tree view
2. Select the `OnStart` property
3. Paste the full formula from `PowerApps/src/App.yaml`

This loads all 54 corporate accounts + 21 projects into Power Apps Collections.

---

## Step 5 – Build LoginScreen

Copy all controls from `PowerApps/src/Screens/LoginScreen.yaml`:

Key pieces:
- Dropdown with all dept options (NPO / Corporate / Projects)
- Access button → `Navigate(DashboardScreen)` + sets `SelectedView`
- Same espresso/gold brand colors as your HTML portal (`#2C2420` / `#A47F60`)

---

## Step 6 – Build DashboardScreen

This is the main screen. All pages are controlled by the `ActivePage` context variable.

Copy from `PowerApps/src/Screens/DashboardScreen.yaml`:

| Control | Purpose |
|---------|---------|
| TopBar | Navy header with org name, dept pill, switch button |
| Left sidebar | Navigation buttons — show/hide based on `ViewType` |
| KPIContainer | 5 KPI cards — FY Budget / YTD / Actual / Enc / Variance |
| DeptCardsGallery | Dept card grid for `corp-depts` and `proj-depts` pages |
| AccountsGallery | Account rows with util % and status badge |
| ProjectsGallery | Project rows with director name |
| TransferFormContainer | Full transfer form with 12 monthly cashflow inputs |

### Key Formulas

**Variance color (green/red):**
```powerapps
If(ThisItem.YTD - ThisItem.Act >= 0, RGBA(59,109,17,1), RGBA(163,45,45,1))
```

**Status badge:**
```powerapps
If(ThisItem.YTD=0 || ThisItem.Act/ThisItem.YTD < 0.5, "Significant",
   ThisItem.Act/ThisItem.YTD < 0.8, "Moderate", "On track")
```

**Transfer submit — mailto (same as HTML):**
```powerapps
Launch(
  "mailto:Tawfiq.Nayef@npo.ae?subject=" &
  EncodeUrl("Budget Transfer Request — " & FromDept & " → " & ToDept) &
  "&body=" & EncodeUrl(bodyText)
)
```

---

## Step 7 – Install Power Apps Desktop

1. Open **Microsoft Store** on your desktop
2. Search **"Power Apps"** → Install (free)
3. Sign in with your Microsoft 365 account
4. Your app appears under **My Apps** → click to run it natively

---

## Step 8 – Connect Real Data (When Ready)

### Option A – Keep data in Power Apps (current approach)
- All data lives in the `OnStart` formula
- Update the numbers there each month when you get new actuals from Oracle EPS
- **Advantage**: No extra licence needed

### Option B – Excel on SharePoint / OneDrive
1. Create an Excel file with two sheets: `CorpAccounts` and `ProjItems` (same columns as the data in `App.yaml`)
2. Upload to **SharePoint** or **OneDrive for Business**
3. In Power Apps: **Data → Add data → Excel Online (Business)** → select your file
4. Replace `ClearCollect(CorpAccounts, {...})` in OnStart with:
   ```powerapps
   ClearCollect(CorpAccounts, CorpAccounts_Table)
   ```
5. **No Power Automate licence needed for read-only**

### Option C – Oracle EPS via Power Automate
When you have a **Power Automate licence**:
1. Create a flow: HTTP trigger → Oracle DB connector → query EPS budget table
2. Return JSON with FY/YTD/Act/Enc by account
3. In Power Apps call it:
   ```powerapps
   ClearCollect(CorpAccounts, OracleEPSFlow.Run(2026).accounts)
   ```

---

## Brand Colors (matching your HTML portal)

| CSS Variable | Color | RGBA in Power Apps |
|---|---|---|
| `--navy` | Espresso dark | `RGBA(44, 36, 32, 1)` |
| `--gold` | Bronze/tan | `RGBA(164, 127, 96, 1)` |
| `--sf` | Sand/cream bg | `RGBA(245, 242, 236, 1)` |
| `--grn` | Green (on track) | `RGBA(59, 109, 17, 1)` |
| `--amb` | Amber (moderate) | `RGBA(176, 122, 30, 1)` |
| `--red` | Red (significant) | `RGBA(163, 45, 45, 1)` |

---

## File Structure

```
BudgetPortal/
├── SETUP_GUIDE.md                       ← This file
└── PowerApps/
    └── src/
        ├── App.yaml                     ← OnStart: all 54 corp accounts + 21 projects
        └── Screens/
            ├── LoginScreen.yaml         ← Dept selector login screen
            └── DashboardScreen.yaml     ← Main portal: all 9 pages + transfer form
```
