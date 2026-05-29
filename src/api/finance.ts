import { apiClient } from './apiClient';

const financeBase = (groupId: number) => `/finance/groups/${groupId}`;

export type FinanceAccount = {
  id: number;
  group_id: number;
  name: string;
  type: 'checking' | 'savings' | 'cash' | 'other';
  currency: string;
  initial_balance_cents: number;
  is_archived: boolean;
  created_by: number;
  balance_cents: number;
};

export type FinanceCategory = {
  id: number;
  group_id: number;
  name: string;
  kind: 'income' | 'expense';
  color?: string;
  is_system: boolean;
};

export type FinanceTransaction = {
  id: number;
  group_id: number;
  account_id: number;
  transfer_account_id?: number;
  category_id?: number;
  type: 'income' | 'expense' | 'transfer';
  amount_cents: number;
  description: string;
  date: string;
  visibility: 'private' | 'household';
  created_by: number;
};

export type FinanceDashboard = {
  month: string;
  currency: string;
  totals: {
    income_cents: number;
    expense_cents: number;
    net_cents: number;
  };
  by_category: {
    category_id: number;
    name: string;
    kind: string;
    total_cents: number;
  }[];
  accounts: FinanceAccount[];
};

export const getFinanceDashboard = async (
  groupId: number,
  month?: string
): Promise<FinanceDashboard> => {
  const response = await apiClient.get<FinanceDashboard>(`${financeBase(groupId)}/dashboard`, {
    params: month ? { month } : undefined,
  });
  return response.data;
};

export const getFinanceAccounts = async (groupId: number): Promise<FinanceAccount[]> => {
  const response = await apiClient.get<FinanceAccount[]>(`${financeBase(groupId)}/accounts`);
  return response.data;
};

export const createFinanceAccount = async (
  groupId: number,
  body: {
    name: string;
    type: FinanceAccount['type'];
    initial_balance_cents?: number;
  }
): Promise<FinanceAccount> => {
  const response = await apiClient.post(`${financeBase(groupId)}/accounts`, body);
  return response.data;
};

export const getFinanceCategories = async (
  groupId: number,
  kind?: 'income' | 'expense'
): Promise<FinanceCategory[]> => {
  const response = await apiClient.get<FinanceCategory[]>(`${financeBase(groupId)}/categories`, {
    params: kind ? { kind } : undefined,
  });
  return response.data;
};

export const getFinanceTransactions = async (
  groupId: number,
  params?: { from?: string; to?: string; account_id?: number }
): Promise<FinanceTransaction[]> => {
  const response = await apiClient.get<FinanceTransaction[]>(
    `${financeBase(groupId)}/transactions`,
    { params }
  );
  return response.data;
};

export type CreateFinanceTransactionBody = {
  type: FinanceTransaction['type'];
  account_id: number;
  transfer_account_id?: number;
  category_id?: number;
  amount_cents: number;
  description?: string;
  date: string;
  visibility?: FinanceTransaction['visibility'];
};

export type UpdateFinanceTransactionBody = {
  account_id?: number;
  transfer_account_id?: number;
  category_id?: number;
  amount_cents?: number;
  description?: string;
  date?: string;
  visibility?: FinanceTransaction['visibility'];
};

export const createFinanceTransaction = async (
  groupId: number,
  body: CreateFinanceTransactionBody
): Promise<FinanceTransaction> => {
  const response = await apiClient.post(`${financeBase(groupId)}/transactions`, body);
  return response.data;
};

export const updateFinanceTransaction = async (
  groupId: number,
  transactionId: number,
  body: UpdateFinanceTransactionBody
): Promise<FinanceTransaction> => {
  const response = await apiClient.put(
    `${financeBase(groupId)}/transactions/${transactionId}`,
    body
  );
  return response.data;
};

export const deleteFinanceTransaction = async (
  groupId: number,
  transactionId: number
): Promise<void> => {
  await apiClient.delete(`${financeBase(groupId)}/transactions/${transactionId}`);
};
