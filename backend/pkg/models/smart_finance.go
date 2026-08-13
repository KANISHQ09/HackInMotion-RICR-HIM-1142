package models

// Budget represents a user category budget for a period such as "monthly".
type Budget struct {
	BudgetId        int64  `xorm:"PK AUTOINCR"`
	Uid             int64  `xorm:"INDEX(IDX_budget_uid_deleted) NOT NULL"`
	Deleted         bool   `xorm:"INDEX(IDX_budget_uid_deleted) NOT NULL"`
	CategoryId      int64  `xorm:"INDEX(IDX_budget_uid_category)"`
	CategoryName    string `xorm:"VARCHAR(64) NOT NULL"`
	LimitAmount     int64  `xorm:"NOT NULL"`
	Period          string `xorm:"VARCHAR(16) NOT NULL"`
	CreatedUnixTime int64
	UpdatedUnixTime int64
	DeletedUnixTime int64
}

// SavingsGoal represents a user savings target.
type SavingsGoal struct {
	GoalId          int64  `xorm:"PK AUTOINCR"`
	Uid             int64  `xorm:"INDEX(IDX_savings_goal_uid_deleted) NOT NULL"`
	Deleted         bool   `xorm:"INDEX(IDX_savings_goal_uid_deleted) NOT NULL"`
	Name            string `xorm:"VARCHAR(64) NOT NULL"`
	TargetAmount    int64  `xorm:"NOT NULL"`
	TargetDate      string `xorm:"VARCHAR(10) NOT NULL"`
	CreatedUnixTime int64
	UpdatedUnixTime int64
	DeletedUnixTime int64
}

// PlannedAddOn represents expected future money movement, separate from posted transactions.
type PlannedAddOn struct {
	PlannedAddOnId  int64  `xorm:"PK AUTOINCR"`
	Uid             int64  `xorm:"INDEX(IDX_planned_add_on_uid_deleted_date) NOT NULL"`
	Deleted         bool   `xorm:"INDEX(IDX_planned_add_on_uid_deleted_date) NOT NULL"`
	ExpectedDate    string `xorm:"VARCHAR(10) INDEX(IDX_planned_add_on_uid_deleted_date) NOT NULL"`
	Description     string `xorm:"VARCHAR(255) NOT NULL"`
	Merchant        string `xorm:"VARCHAR(96)"`
	Amount          int64  `xorm:"NOT NULL"`
	Type            string `xorm:"VARCHAR(16) NOT NULL"`
	CategoryName    string `xorm:"VARCHAR(64) NOT NULL"`
	Note            string `xorm:"VARCHAR(255)"`
	Status          string `xorm:"VARCHAR(16) NOT NULL"`
	CreatedUnixTime int64
	UpdatedUnixTime int64
	DeletedUnixTime int64
}
