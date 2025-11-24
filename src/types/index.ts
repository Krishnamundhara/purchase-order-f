export interface PurchaseOrder {
  id: string;
  date: string;
  order_number: string;
  party_name: string;
  broker?: string;
  mill?: string;
  weight?: number;
  bags?: number;
  product?: string;
  rate?: number;
  terms_and_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfile {
  companyName: string;
  companyLogo: string; // base64 or URL
  address: string;
  phone: string;
  email: string;
  gstNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  branchName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
