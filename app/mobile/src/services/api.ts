import { config } from '../config';

export interface ClaimReceiptData {
  claimId: string;
  packageId: string;
  status: 'requested' | 'verified' | 'approved' | 'disbursed' | 'archived' | 'cancelled';
  amount: number;
  tokenAddress?: string;
  transactionHash?: string;
  contractId?: string;
  timestamp: string;
  recipientRef?: string;
  explorerLink?: string;
  receiptPointer?: string;
}

export class ReceiptApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ReceiptApiError';
  }
}

export const fetchClaimReceipt = async (
  identifier: string,
): Promise<ClaimReceiptData> => {
  const response = await fetch(
    `${config.apiUrl}/claims/${encodeURIComponent(identifier)}/receipt`,
  );

  if (!response.ok) {
    let message = `Server responded with ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
    }
    throw new ReceiptApiError(response.status, message);
  }

  return (await response.json()) as ClaimReceiptData;
};

const API_URL = config.apiUrl;

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  mocked?: boolean;
}

export const fetchHealthStatus = async (): Promise<HealthStatus> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch health status:', error);
    throw error;
  }
};

export interface AidPackage {
  id: string;
  title: string;
  amount: number;
  status: string;
  date: string;
}

export const getAidPackages = async (): Promise<AidPackage[]> => {
  try {
    const response = await fetch(`${API_URL}/aid`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch aid packages:', error);
    throw error;
  }
};