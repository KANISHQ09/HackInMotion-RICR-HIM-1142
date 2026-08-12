import {
  transactionSchema,
  NormalizedTransaction,
  TransactionType,
} from '../types/transaction.js';

/**
 * Helper to normalize string text by trimming and collapsing repeated whitespace.
 */
export function normalizeText(text: unknown): string | undefined {
  if (typeof text !== 'string') {
    return undefined;
  }
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Helper to normalize merchant names consistently:
 * - Trims whitespace and collapses multiple spaces
 * - Converts casing consistently to Title Case
 */
export function normalizeMerchant(merchant: unknown): string | undefined {
  const cleaned = normalizeText(merchant);
  if (!cleaned) {
    return undefined;
  }
  return cleaned
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Helper to convert and validate numeric amount values.
 */
export function normalizeAmount(amount: unknown): number {
  if (typeof amount === 'number') {
    if (!Number.isFinite(amount)) {
      throw new Error('Invalid amount: number must be finite and not NaN');
    }
    return amount;
  }

  if (typeof amount === 'string') {
    const trimmed = amount.trim();
    if (trimmed === '') {
      throw new Error('Invalid amount: string amount is empty');
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) {
      throw new Error(`Invalid amount: cannot parse "${amount}" as number`);
    }
    return parsed;
  }

  throw new Error('Invalid amount: amount is required and must be a number or numeric string');
}

/**
 * Helper to normalize dates into ISO-8601 string format.
 */
export function normalizeDate(dateInput: unknown): string {
  if (!dateInput) {
    throw new Error('Invalid date: date is required');
  }

  let dateObj: Date;

  if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    dateObj = new Date(dateInput);
  } else {
    throw new Error('Invalid date: input must be a string, number timestamp, or Date object');
  }

  if (Number.isNaN(dateObj.getTime())) {
    throw new Error(`Invalid date: value "${String(dateInput)}" cannot be parsed as a valid date`);
  }

  return dateObj.toISOString();
}

/**
 * Helper to normalize transaction type to supported enum values ('income' | 'expense' | 'transfer').
 */
export function normalizeTransactionType(typeInput: unknown): TransactionType {
  if (typeof typeInput !== 'string') {
    throw new Error('Invalid transaction type: type must be a string');
  }

  const lowered = typeInput.trim().toLowerCase();

  if (lowered === 'income' || lowered === 'expense' || lowered === 'transfer') {
    return lowered as TransactionType;
  }

  throw new Error(`Invalid transaction type: "${typeInput}" is not supported`);
}

/**
 * Main normalization function.
 * Converts raw transaction inputs into a clean, normalized, Zod-validated transaction.
 */
export function normalizeTransaction(input: unknown): NormalizedTransaction {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input: transaction must be a non-null object');
  }

  const raw = input as Record<string, unknown>;

  const id = typeof raw.id === 'string' ? raw.id.trim() : String(raw.id ?? '').trim();
  const userId = typeof raw.userId === 'string' ? raw.userId.trim() : String(raw.userId ?? '').trim();
  const currency = typeof raw.currency === 'string' ? raw.currency.trim().toUpperCase() : '';

  const amount = normalizeAmount(raw.amount);
  const type = normalizeTransactionType(raw.type);
  const date = normalizeDate(raw.date);

  const merchant = normalizeMerchant(raw.merchant);
  const description = normalizeText(raw.description);
  const category = normalizeText(raw.category);
  const accountId = normalizeText(raw.accountId);

  const candidate: Record<string, unknown> = {
    id,
    userId,
    amount,
    type,
    date,
    currency,
  };

  if (merchant) candidate.merchant = merchant;
  if (description) candidate.description = description;
  if (category) candidate.category = category;
  if (accountId) candidate.accountId = accountId;

  // Validate candidate object against Zod schema
  return transactionSchema.parse(candidate);
}
