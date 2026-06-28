# Excel Template – BudgetData Sheet

## Sheet name: BudgetData

| Column | Type | Description |
|--------|------|-------------|
| Department | Text | Department name (e.g. Finance, IT, Operations) |
| CostCenter | Text | Cost center code (e.g. CC-1001) |
| Year | Number | Fiscal year (e.g. 2026) |
| Period | Text | Optional: Q1 / Q2 / Jan / Feb … |
| BudgetAmount | Number | Approved budget amount in USD |
| ActualAmount | Number | Actual spend to date in USD |
| AccountCode | Text | Optional: GL account code |
| ProjectCode | Text | Optional: Project/WBS code |

## Sheet name: TransferRequests

| Column | Type | Description |
|--------|------|-------------|
| RequestRef | Text | Auto-generated reference (e.g. TR-20260601-001) |
| RequestDate | Date | Date of request |
| RequestedBy | Text | Full name of requester |
| RequestedByEmail | Text | Email of requester |
| FromDepartment | Text | Source department |
| FromCostCenter | Text | Source cost center code |
| ToDepartment | Text | Target department |
| ToCostCenter | Text | Target cost center code |
| TransferAmount | Number | Amount to transfer in USD |
| Justification | Text | Business reason |
| Priority | Text | Normal / Urgent / Critical |
| Status | Text | Pending / Approved / Rejected |
| SubmittedDate | DateTime | Timestamp of submission |
| ApprovedBy | Text | Name of approver (filled by Power Automate) |
| ApprovedDate | DateTime | Date of approval/rejection |
| ApproverComments | Text | Approver notes |

## How to connect this Excel to Power Apps

1. Upload this file to **OneDrive for Business** or **SharePoint** (not local drive)
2. In Power Apps maker: **Data → Add data → Excel Online (Business)**
3. Select your OneDrive / SharePoint file and choose both tables
4. Replace the `ClearCollect(BudgetData, ...)` in `App.OnStart` with:
   ```
   ClearCollect(BudgetData, 'BudgetData Table')
   ```
5. Replace `ClearCollect(TransferData, ...)` with:
   ```
   ClearCollect(TransferRequests, 'TransferRequests Table')
   ```
6. For saving new transfer requests, replace `Collect(TransferRequests, {...})` with:
   ```
   Patch('TransferRequests Table', Defaults('TransferRequests Table'), { ... })
   ```
