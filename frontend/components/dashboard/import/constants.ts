export const maxFileSize = 5 * 1024 * 1024

export const steps = [
  {
    title: "Add or Upload",
    description: "Enter one transaction manually or upload a CSV statement.",
  },
  {
    title: "Graceful Cleanup",
    description: "Dates, missing fields, duplicates, and malformed CSV rows are reviewed safely.",
  },
  {
    title: "Import Ready Rows",
    description: "Valid rows are saved while problem rows stay visible for review.",
  },
] as const

export const previewRows = [
  ["12 Aug", "Zomato", "Food delivery", "₹450"],
  ["13 Aug", "Amazon", "Shopping order", "₹1,200"],
  ["15 Aug", "Netflix", "Subscription", "₹649"],
  ["16 Aug", "Uber", "Ride", "₹320"],
] as const
