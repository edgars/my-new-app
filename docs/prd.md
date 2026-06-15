# Product Requirements Document — JP-Delphi

## Overview

This PRD specifies the functional requirements for JP-Delphi, a modern rebuild of a legacy system. Requirements are derived from the legacy UI screens, data model, and business rules recovered by RNC.

## Goals

- Preserve the behavior of the legacy system on a modern, supported stack.
- Provide full CRUD for every recovered entity.
- Enforce the recovered business rules.

## Functional requirements

### Entity management

- **FR-01** — The system shall let a user list, create, view, edit and delete **Parts** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/parts`; required fields are validated.
- **FR-02** — The system shall let a user list, create, view, edit and delete **Nextcusts** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/nextcusts`; required fields are validated.
- **FR-03** — The system shall let a user list, create, view, edit and delete **Vendors** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/vendors`; required fields are validated.
- **FR-04** — The system shall let a user list, create, view, edit and delete **Orders** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/orders`; required fields are validated.
- **FR-05** — The system shall let a user list, create, view, edit and delete **Customers** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/customers`; required fields are validated.
- **FR-06** — The system shall let a user list, create, view, edit and delete **Items** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/items`; required fields are validated.
- **FR-07** — The system shall let a user list, create, view, edit and delete **Nextords** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/nextords`; required fields are validated.
- **FR-08** — The system shall let a user list, create, view, edit and delete **Employees** records.
  - *Acceptance:* a list page, a create form, an edit form and delete all work at `/employees`; required fields are validated.

### Business rules

- **FR-09** — Procedure: TEdPartsForm.Edit
  - *Condition:* `procedure TEdPartsForm.Edit(PartNo:Double)`
  - *Severity:* WARN
- **FR-10** — Procedure: TEdPartsForm.PrintBtnClick
  - *Condition:* `procedure TEdPartsForm.PrintBtnClick(Sender:TObject)`
  - *Severity:* WARN
- **FR-11** — Condition: MessageDlg('Printthisform?',mtConfirmation,[mbYes,mbNo],0) = mrYes  **(NEEDS REVIEW)**
  - *Condition:* `MessageDlg('Printthisform?',mtConfirmation,[mbYes,mbNo],0) = mrYes`
  - *Severity:* WARN
- **FR-12** — Procedure: TEdPartsForm.FormCloseQuery
  - *Condition:* `procedure TEdPartsForm.FormCloseQuery(Sender:TObject;varCanClose:Boolean)`
  - *Severity:* WARN
- **FR-13** — Function: Confirm
  - *Condition:* `function Confirm(Msg:string): Boolean`
  - *Severity:* WARN
- **FR-14** — Function: TMastData.DataDirectory
  - *Condition:* `function TMastData.DataDirectory: string`
  - *Severity:* WARN
- **FR-15** — Procedure: TMastData.SetDatabaseAlias
  - *Condition:* `procedure TMastData.SetDatabaseAlias(AliasName:string)`
  - *Severity:* WARN
- **FR-16** — Procedure: TMastData.UseLocalData
  - *Condition:* `procedure TMastData.UseLocalData`
  - *Severity:* WARN
- **FR-17** — Condition: notSession  **(NEEDS REVIEW)**
  - *Condition:* `notSession`
  - *Severity:* WARN
- **FR-18** — Condition: notFileExists(DataDir+'ORDERS  **(NEEDS REVIEW)**
  - *Condition:* `notFileExists(DataDir+'ORDERS`
  - *Severity:* WARN
- **FR-19** — Procedure: TMastData.UseRemoteData
  - *Condition:* `procedure TMastData.UseRemoteData`
  - *Severity:* WARN
- **FR-20** — Condition: notSession  **(NEEDS REVIEW)**
  - *Condition:* `notSession`
  - *Severity:* WARN
- **FR-21** — Condition: notFileExists(DataFile)  **(NEEDS REVIEW)**
  - *Condition:* `notFileExists(DataFile)`
  - *Severity:* WARN
- **FR-22** — Procedure: TMastData.PartsBeforeOpen
  - *Condition:* `procedure TMastData.PartsBeforeOpen(DataSet:TDataSet)`
  - *Severity:* WARN
- **FR-23** — Procedure: TMastData.PartsCalcFields
  - *Condition:* `procedure TMastData.PartsCalcFields(DataSet:TDataSet)`
  - *Severity:* WARN
- **FR-24** — Procedure: TMastData.PartsQueryCalcFields
  - *Condition:* `procedure TMastData.PartsQueryCalcFields(DataSet:TDataSet)`
  - *Severity:* WARN
- **FR-25** — Procedure: TMastData.OrdersAfterCancel
  - *Condition:* `procedure TMastData.OrdersAfterCancel(DataSet:TDataSet)`
  - *Severity:* WARN
- **FR-26** — Procedure: TMastData.OrdersAfterDelete
  - *Condition:* `procedure TMastData.OrdersAfterDelete(DataSet:TDataSet)`
  - *Severity:* WARN
- **FR-27** — Procedure: TMastData.OrdersAfterPost
  - *Condition:* `procedure TMastData.OrdersAfterPost(DataSet:TDataSet)`
  - *Severity:* WARN
- **FR-28** — Condition: Cust < OrdersShipDate  **(NEEDS REVIEW)**
  - *Condition:* `Cust < OrdersShipDate`
  - *Severity:* WARN
- **FR-29** — Procedure: TMastData.OrdersBeforeCancel
  - *Condition:* `procedure TMastData.OrdersBeforeCancel(DataSet:TDataSet)`
  - *Severity:* WARN
- **FR-30** — Condition: (Orders = dsInsert)andnot(Items  **(NEEDS REVIEW)**
  - *Condition:* `(Orders = dsInsert)andnot(Items`
  - *Severity:* WARN
- **FR-31** — Condition: notConfirm('Cancelorderbeinginserted and deletealllineitems?')  **(NEEDS REVIEW)**
  - *Condition:* `notConfirm('Cancelorderbeinginserted and deletealllineitems?')`
  - *Severity:* WARN
- **FR-32** — Procedure: TMastData.OrdersBeforeClose
  - *Condition:* `procedure TMastData.OrdersBeforeClose(DataSet:TDataSet)`
  - *Severity:* WARN
- **FR-33** — Procedure: TMastData.OrdersBeforeDelete
  - *Condition:* `procedure TMastData.OrdersBeforeDelete(DataSet:TDataSet)`
  - *Severity:* WARN
- **FR-34** — Condition