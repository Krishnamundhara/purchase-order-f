import { PurchaseOrder } from '../types/index';
import { format } from 'date-fns';

export function formatDate(date: string): string {
  try {
    return format(new Date(date), 'dd MMM yyyy');
  } catch {
    return date;
  }
}

export function formatCurrency(value: number | undefined): string {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);
}

export function formatWeight(value: number | undefined): string {
  if (!value) return 'N/A';
  return `${value} kg`;
}

export function validateOrderNumber(orderNumber: string): boolean {
  return orderNumber.trim().length > 0;
}

export function validatePartyName(partyName: string): boolean {
  return partyName.trim().length > 0;
}

export function validateDate(date: string): boolean {
  try {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  } catch {
    return false;
  }
}
