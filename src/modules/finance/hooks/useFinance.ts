import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFinanceAccount,
  createFinanceTransaction,
  deleteFinanceTransaction,
  getFinanceAccounts,
  getFinanceCategories,
  getFinanceCategoryBudgets,
  getFinanceDashboard,
  getFinanceTransactions,
  setFinanceCategoryBudgets,
  updateFinanceTransaction,
} from '@/api/finance';

const keys = {
  dashboard: (groupId: number, month: string) => ['finance', 'dashboard', groupId, month] as const,
  accounts: (groupId: number) => ['finance', 'accounts', groupId] as const,
  categories: (groupId: number, kind: string) => ['finance', 'categories', groupId, kind] as const,
  transactions: (groupId: number) => ['finance', 'transactions', groupId] as const,
  budgets: (groupId: number, month: string) => ['finance', 'budgets', groupId, month] as const,
};

export const useFinanceDashboard = (groupId: number | null, month: string) =>
  useQuery({
    queryKey: groupId ? keys.dashboard(groupId, month) : ['finance', 'dashboard', 'none'],
    queryFn: () => getFinanceDashboard(groupId!, month),
    enabled: groupId != null && groupId > 0,
  });

export const useFinanceAccounts = (groupId: number | null) =>
  useQuery({
    queryKey: groupId ? keys.accounts(groupId) : ['finance', 'accounts', 'none'],
    queryFn: () => getFinanceAccounts(groupId!),
    enabled: groupId != null && groupId > 0,
  });

export const useFinanceCategories = (groupId: number | null, kind: 'income' | 'expense') =>
  useQuery({
    queryKey: groupId ? keys.categories(groupId, kind) : ['finance', 'categories', 'none'],
    queryFn: () => getFinanceCategories(groupId!, kind),
    enabled: groupId != null && groupId > 0,
  });

export const useFinanceTransactions = (groupId: number | null) =>
  useQuery({
    queryKey: groupId ? keys.transactions(groupId) : ['finance', 'transactions', 'none'],
    queryFn: () => getFinanceTransactions(groupId!),
    enabled: groupId != null && groupId > 0,
  });

export const useCreateFinanceAccount = (groupId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof createFinanceAccount>[1]) =>
      createFinanceAccount(groupId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.accounts(groupId) });
      qc.invalidateQueries({ queryKey: ['finance', 'dashboard', groupId] });
    },
  });
};

const invalidateFinanceData = (
  qc: ReturnType<typeof useQueryClient>,
  groupId: number,
  month?: string
) => {
  qc.invalidateQueries({ queryKey: keys.transactions(groupId) });
  qc.invalidateQueries({ queryKey: keys.accounts(groupId) });
  qc.invalidateQueries({ queryKey: ['finance', 'dashboard', groupId] });
  if (month) {
    qc.invalidateQueries({ queryKey: keys.dashboard(groupId, month) });
  }
};

export const useCreateFinanceTransaction = (groupId: number, month?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof createFinanceTransaction>[1]) =>
      createFinanceTransaction(groupId, body),
    onSuccess: () => invalidateFinanceData(qc, groupId, month),
  });
};

export const useUpdateFinanceTransaction = (groupId: number, month?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      transactionId,
      body,
    }: {
      transactionId: number;
      body: Parameters<typeof updateFinanceTransaction>[2];
    }) => updateFinanceTransaction(groupId, transactionId, body),
    onSuccess: () => invalidateFinanceData(qc, groupId, month),
  });
};

export const useDeleteFinanceTransaction = (groupId: number, month?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: number) => deleteFinanceTransaction(groupId, transactionId),
    onSuccess: () => invalidateFinanceData(qc, groupId, month),
  });
};

export const useFinanceCategoryBudgets = (groupId: number | null, month: string) =>
  useQuery({
    queryKey: groupId ? keys.budgets(groupId, month) : ['finance', 'budgets', 'none'],
    queryFn: () => getFinanceCategoryBudgets(groupId!, month),
    enabled: groupId != null && groupId > 0,
  });

export const useSetFinanceCategoryBudgets = (groupId: number, month: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: Parameters<typeof setFinanceCategoryBudgets>[2]) =>
      setFinanceCategoryBudgets(groupId, month, items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.budgets(groupId, month) });
      qc.invalidateQueries({ queryKey: keys.dashboard(groupId, month) });
    },
  });
};
