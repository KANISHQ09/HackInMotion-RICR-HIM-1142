/**
 * Merchant and Keyword Signal Definitions for Rule-Based Categorization
 */

export type SignalSource = 'merchant' | 'description' | 'both';

export interface MerchantSignal {
  pattern: string;
  categoryId: string;
  source: SignalSource;
}

export const MERCHANT_SIGNALS: MerchantSignal[] = [
  // Food & Dining
  { pattern: 'swiggy', categoryId: 'food', source: 'both' },
  { pattern: 'zomato', categoryId: 'food', source: 'both' },
  { pattern: 'dominos', categoryId: 'food', source: 'both' },
  { pattern: 'mcdonald', categoryId: 'food', source: 'both' },
  { pattern: 'kfc', categoryId: 'food', source: 'both' },
  { pattern: 'burger king', categoryId: 'food', source: 'both' },
  { pattern: 'subway', categoryId: 'food', source: 'both' },
  { pattern: 'starbucks', categoryId: 'food', source: 'both' },
  { pattern: 'dunkin', categoryId: 'food', source: 'both' },
  { pattern: 'cafe', categoryId: 'food', source: 'description' },
  { pattern: 'restaurant', categoryId: 'food', source: 'description' },

  // Groceries
  { pattern: 'blinkit', categoryId: 'groceries', source: 'both' },
  { pattern: 'zepto', categoryId: 'groceries', source: 'both' },
  { pattern: 'bigbasket', categoryId: 'groceries', source: 'both' },
  { pattern: 'instamart', categoryId: 'groceries', source: 'both' },
  { pattern: 'dmart', categoryId: 'groceries', source: 'both' },
  { pattern: 'supermarket', categoryId: 'groceries', source: 'both' },
  { pattern: 'grocery', categoryId: 'groceries', source: 'description' },

  // Subscriptions
  { pattern: 'netflix', categoryId: 'subscriptions', source: 'both' },
  { pattern: 'spotify', categoryId: 'subscriptions', source: 'both' },
  { pattern: 'amazon prime', categoryId: 'subscriptions', source: 'both' },
  { pattern: 'youtube premium', categoryId: 'subscriptions', source: 'both' },
  { pattern: 'hulu', categoryId: 'subscriptions', source: 'both' },
  { pattern: 'disney', categoryId: 'subscriptions', source: 'both' },
  { pattern: 'apple.com/bill', categoryId: 'subscriptions', source: 'both' },
  { pattern: 'subscription', categoryId: 'subscriptions', source: 'description' },

  // Transport
  { pattern: 'uber', categoryId: 'transport', source: 'both' },
  { pattern: 'ola', categoryId: 'transport', source: 'both' },
  { pattern: 'rapido', categoryId: 'transport', source: 'both' },
  { pattern: 'lyft', categoryId: 'transport', source: 'both' },
  { pattern: 'metro', categoryId: 'transport', source: 'both' },
  { pattern: 'petrol', categoryId: 'transport', source: 'both' },
  { pattern: 'fuel', categoryId: 'transport', source: 'both' },
  { pattern: 'toll', categoryId: 'transport', source: 'description' },

  // Shopping
  { pattern: 'amazon', categoryId: 'shopping', source: 'both' },
  { pattern: 'flipkart', categoryId: 'shopping', source: 'both' },
  { pattern: 'myntra', categoryId: 'shopping', source: 'both' },
  { pattern: 'ajio', categoryId: 'shopping', source: 'both' },
  { pattern: 'zara', categoryId: 'shopping', source: 'both' },
  { pattern: 'h&m', categoryId: 'shopping', source: 'both' },

  // Bills & Utilities
  { pattern: 'airtel', categoryId: 'bills', source: 'both' },
  { pattern: 'jio', categoryId: 'bills', source: 'both' },
  { pattern: 'electricity', categoryId: 'bills', source: 'both' },
  { pattern: 'broadband', categoryId: 'bills', source: 'both' },
  { pattern: 'water bill', categoryId: 'bills', source: 'both' },
  { pattern: 'utility', categoryId: 'bills', source: 'description' },

  // Rent
  { pattern: 'rent', categoryId: 'rent', source: 'both' },
  { pattern: 'landlord', categoryId: 'rent', source: 'both' },

  // Entertainment
  { pattern: 'bookmyshow', categoryId: 'entertainment', source: 'both' },
  { pattern: 'pvr', categoryId: 'entertainment', source: 'both' },
  { pattern: 'inox', categoryId: 'entertainment', source: 'both' },

  // Healthcare
  { pattern: 'apollo', categoryId: 'healthcare', source: 'both' },
  { pattern: '1mg', categoryId: 'healthcare', source: 'both' },
  { pattern: 'pharmeasy', categoryId: 'healthcare', source: 'both' },
  { pattern: 'pharmacy', categoryId: 'healthcare', source: 'both' },

  // Education
  { pattern: 'udemy', categoryId: 'education', source: 'both' },
  { pattern: 'coursera', categoryId: 'education', source: 'both' },
  { pattern: 'tuition', categoryId: 'education', source: 'both' },
];
