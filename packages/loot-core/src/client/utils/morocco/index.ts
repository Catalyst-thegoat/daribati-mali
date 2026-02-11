/*
  💵 Moroccan Currency Utilities
  ==============================
  Currency formatting and utilities for Morocco (MAD/DHS)
*/

import { format, parse } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * Moroccan Dirham currency code
 */
export const MAD_CURRENCY = {
  code: 'MAD',
  symbol: 'د.إ',
  name: 'Moroccan Dirham',
  nameArabic: 'درهم مغربي',
  nameFrench: 'Dirham marocain',
  decimals: 2,
  minorUnit: 'سنتيم',
};

/**
 * Format amount in Moroccan Dirham
 * @param amount - Amount to format
 * @param options - Formatting options
 */
export function formatMAD(
  amount: number,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    locale?: 'ar' | 'fr' | 'en';
  }
): string {
  const { showSymbol = true, showCode = false, locale = 'ar' } = options || {};

  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (showSymbol && showCode) {
    return `${formatted} ${MAD_CURRENCY.code}`;
  }

  if (showSymbol) {
    return `${formatted} ${MAD_CURRENCY.symbol}`;
  }

  if (showCode) {
    return `${formatted} ${MAD_CURRENCY.code}`;
  }

  return formatted;
}

/**
 * Parse Moroccan formatted currency string
 * @param str - Formatted currency string
 * @returns Parsed amount or null if invalid
 */
export function parseMAD(str: string): number | null {
  // Remove currency symbols and separators
  const cleaned = str
    .replace(/[د.إ\s]/g, '')
    .replace(/,/g, '.')
    .trim();

  const amount = parseFloat(cleaned);
  return isNaN(amount) ? null : amount;
}

/**
 * Format number in Moroccan style (1 234,56)
 * @param amount - Number to format
 * @param locale - Locale ('ar', 'fr', 'en')
 */
export function formatMoroccanNumber(
  amount: number,
  locale: 'ar' | 'fr' | 'en' = 'ar'
): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date in Moroccan Arabic format
 * @param date - Date to format
 * @param formatStr - Format string
 */
export function formatMoroccanDate(
  date: Date | string,
  formatStr: string = 'dd/MM/yyyy'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr, { locale: ar });
}

/**
 * Parse Moroccan date format (DD/MM/YYYY)
 * @param str - Date string
 * @returns Parsed Date or null if invalid
 */
export function parseMoroccanDate(str: string): Date | null {
  const parts = str.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Moroccan phone number validation
 * @param phone - Phone number to validate
 * @returns Validated phone number or null
 */
export function validateMoroccanPhone(phone: string): string | null {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');

  // Moroccan phone patterns
  const patterns = [
    /^(\+212)[5-7]\d{8}$/,  // +212XXXXXXXXX
    /^(\+212)[5-7]\d{8}$/,  // +212XXXXXXXXX (with country code)
    /^0[5-7]\d{8}$/,        // 0XXXXXXXXX (local)
  ];

  for (const pattern of patterns) {
    if (pattern.test(cleaned)) {
      return cleaned;
    }
  }

  return null;
}

/**
 * Format Moroccan phone number
 * @param phone - Phone number
 * @param format - Format ('international' | 'local')
 */
export function formatMoroccanPhone(
  phone: string,
  format: 'international' | 'local' = 'international'
): string {
  const cleaned = phone.replace(/[\s-]/g, '');

  if (format === 'international') {
    if (cleaned.startsWith('0')) {
      return `+212${cleaned.slice(1)}`;
    }
    return cleaned.startsWith('+212') ? cleaned : `+212${cleaned}`;
  }

  // Local format
  if (cleaned.startsWith('+212')) {
    return `0${cleaned.slice(3)}`;
  }
  return cleaned;
}

/**
 * Calculate Zakat (2.5% of wealth)
 * @param totalAssets - Total assets
 * @param debts - Debts to deduct
 * @returns Zakat amount
 */
export function calculateZakat(
  totalAssets: number,
  debts: number = 0
): {
  netAssets: number;
  nisab: number;
  isNisabMet: boolean;
  zakatAmount: number;
} {
  // Nisab threshold (approximately 85g of gold in MAD)
  // Gold price ~6500 MAD per gram as of 2024
  const goldPricePerGram = 6500;
  const nisabThresholdGrams = 85;
  const nisab = goldPricePerGram * nisabThresholdGrams;

  const netAssets = totalAssets - debts;
  const isNisabMet = netAssets >= nisab;
  const zakatAmount = isNisabMet ? netAssets * 0.025 : 0;

  return {
    netAssets,
    nisab,
    isNisabMet,
    zakatAmount: Math.round(zakatAmount * 100) / 100,
  };
}

/**
 * Moroccan bank formats
 */
export const MOROCCAN_BANKS = {
  attijariwafa: {
    name: 'البنك التجاري وفا بنك',
    nameEn: 'Attijariwafa Bank',
    code: 'ATT',
    logo: '/banks/attijariwafa.png',
    exportFormats: ['csv', 'pdf'],
  },
  bmce: {
    name: 'البنك المغربي للتجارة الخارجية',
    nameEn: 'BMCE Bank',
    code: 'BMCE',
    logo: '/banks/bmce.png',
    exportFormats: ['csv', 'pdf', 'xlsx'],
  },
  societe: {
    name: 'البنك المغربي للشؤون',
    nameEn: 'Société Générale',
    code: 'SG',
    logo: '/banks/societe.png',
    exportFormats: ['csv', 'pdf'],
  },
  credit: {
    name: 'القرض الشعبي',
    nameEn: 'Crédit Populaire du Maroc',
    code: 'CPM',
    logo: '/banks/credit.png',
    exportFormats: ['csv', 'pdf'],
  },
  ci: {
    name: 'القرض العقاري والسياحي',
    nameEn: 'Crédit Immobilier et Hôtelier',
    code: 'CIH',
    logo: '/banks/cih.png',
    exportFormats: ['csv', 'pdf'],
  },
};

/**
 * Moroccan cities list
 */
export const MOROCCAN_CITIES = [
  { name: 'الدار البيضاء', nameFr: 'Casablanca', code: 'CAS' },
  { name: 'الرباط', nameFr: 'Rabat', code: 'RAB' },
  { name: 'مراكش', nameFr: 'Marrakech', code: 'MAR' },
  { name: 'فاس', nameFr: 'Fes', code: 'FES' },
  { name: 'طنجة', nameFr: 'Tangier', code: 'TNG' },
  { name: 'أكادير', nameFr: 'Agadir', code: 'AGA' },
  { name: 'المحمدية', nameFr: 'Mohammedia', code: 'MOH' },
  { name: 'القنيطرة', nameFr: 'Kénitra', code: 'KEN' },
  { name: 'وجدة', nameFr: 'Oujda', code: 'OUJ' },
  { name: 'الجديدة', nameFr: 'El Jadida', code: 'EJD' },
  { name: 'بني ملال', nameFr: 'Béni Mellal', code: 'BML' },
  { name: 'تطوان', nameFr: 'Tétouan', code: 'TET' },
  { name: 'سلا', nameFr: 'Salé', code: 'SAL' },
  { name: 'تمارة', nameFr: 'Temara', code: 'TEM' },
  { name: 'الخميسات', nameFr: 'Khemisset', code: 'KHM' },
];

/**
 * Moroccan tax configurations
 */
export const MOROCCAN_TAX = {
  vat: {
    rate: 0.20, // 20% VAT
    reducedRate: 0.10, // 10% reduced VAT
    name: 'TVA',
    nameArabic: 'الضريبة على القيمة المضافة',
  },
  incomeTax: {
    brackets: [
      { min: 0, max: 30000, rate: 0 },
      { min: 30001, max: 50000, rate: 0.10 },
      { min: 50001, max: 60000, rate: 0.20 },
      { min: 60001, max: 80000, rate: 0.30 },
      { min: 80001, max: 120000, rate: 0.34 },
      { min: 120001, max: Infinity, rate: 0.38 },
    ],
    name: 'IGR',
    nameArabic: 'الضريبة على الدخل',
  },
};

export default {
  MAD_CURRENCY,
  formatMAD,
  parseMAD,
  formatMoroccanNumber,
  formatMoroccanDate,
  parseMoroccanDate,
  validateMoroccanPhone,
  formatMoroccanPhone,
  calculateZakat,
  MOROCCAN_BANKS,
  MOROCCAN_CITIES,
  MOROCCAN_TAX,
};
