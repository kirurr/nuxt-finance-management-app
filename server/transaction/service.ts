import { transactionRepository } from "./repository";
import type {
  CreateTransaction,
  Transaction,
  UpdateTransaction,
  TransactionWithCategory
} from "./schema";

export const transactionService = {
  async createTransaction(data: CreateTransaction): Promise<Transaction> {
    return await transactionRepository.createTransaction(data);
  },
  async updateTransaction(
    id: number,
    data: UpdateTransaction,
  ): Promise<Transaction> {
    return await transactionRepository.updateTransaction(id, data);
  },
  async getTransaction(id: number): Promise<TransactionWithCategory> {
    return await transactionRepository.getTransaction(id);
  },
  async getTransactionsByUserId(
    id: string,
    pageSize?: number,
    cursor?: number,
  ): Promise<{ items: TransactionWithCategory[]; nextCursor: number | null }> {
    return await transactionRepository.getTransactionsByUserId(
      id,
      pageSize,
      cursor,
    );
  },
  async deleteTransaction(id: number): Promise<void> {
    return await transactionRepository.deleteTransaction(id);
  },
	async getTransactionsByUserIdAndMonth(
		id: string,
		month: Date,
	): Promise<Transaction[]> {
		return await transactionRepository.getTransactionsByUserIdAndMonth(id, month);
	},
};
