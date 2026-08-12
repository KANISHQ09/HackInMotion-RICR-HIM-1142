/**
 * Expense Category Taxonomy for Financial Intelligence Layer
 */

export interface ExpenseCategoryDefinition {
  id: string;
  name: string;
  description: string;
}

export const EXPENSE_CATEGORIES: Record<string, ExpenseCategoryDefinition> = {
  food: {
    id: 'food',
    name: 'Food',
    description: 'Restaurants, dining out, food delivery, and cafes',
  },
  groceries: {
    id: 'groceries',
    name: 'Groceries',
    description: 'Supermarkets, quick-commerce, and fresh food markets',
  },
  rent: {
    id: 'rent',
    name: 'Rent',
    description: 'Housing rent, lease payments, and property maintenance',
  },
  bills: {
    id: 'bills',
    name: 'Bills',
    description: 'Utilities, mobile recharges, electricity, and internet bills',
  },
  shopping: {
    id: 'shopping',
    name: 'Shopping',
    description: 'E-commerce, apparel, electronics, and general merchandise',
  },
  transport: {
    id: 'transport',
    name: 'Transport',
    description: 'Ridesharing, public transit, fuel, tolls, and parking',
  },
  travel: {
    id: 'travel',
    name: 'Travel',
    description: 'Flights, hotels, lodging, and vacation expenses',
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, concerts, events, gaming, and sports',
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Pharmacies, medical clinics, doctors, and health services',
  },
  education: {
    id: 'education',
    name: 'Education',
    description: 'Online courses, tuition, books, and educational software',
  },
  subscriptions: {
    id: 'subscriptions',
    name: 'Subscriptions',
    description: 'Digital streaming, software SaaS, and recurring memberships',
  },
  'personal-care': {
    id: 'personal-care',
    name: 'Personal Care',
    description: 'Salon, grooming, fitness, and personal wellness',
  },
  insurance: {
    id: 'insurance',
    name: 'Insurance',
    description: 'Health, life, vehicle, and property insurance policies',
  },
  fees: {
    id: 'fees',
    name: 'Fees',
    description: 'Bank charges, service fees, interest, and transaction costs',
  },
  other: {
    id: 'other',
    name: 'Other',
    description: 'Uncategorized or miscellaneous expenses',
  },
};

export function getCategoryById(id: string): ExpenseCategoryDefinition | undefined {
  return EXPENSE_CATEGORIES[id];
}
