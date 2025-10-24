import { transactionCategoryRepository } from "./repository";
import type { CreateTransactionCategory, TransactionCategory, UpdateTransactionCategory } from "./schema";

export const transactionCategoryService = {
  async createTransactionCategory(data: CreateTransactionCategory): Promise<TransactionCategory> {
    return await transactionCategoryRepository.createTransactionCategory(data);
  },
	async updateTransactionCategory(id: number, data: UpdateTransactionCategory): Promise<TransactionCategory> {
		return await transactionCategoryRepository.updateTransactionCategory(id, data);
	},
  async getTransactionCategory(id: number): Promise<TransactionCategory> {
    return await transactionCategoryRepository.getTransactionCategory(id);
  },
  async getTransactionCategories(): Promise<TransactionCategory[]> {
    return await transactionCategoryRepository.getTransactionCategories();
  },
	async deleteTransactionCategory(id: number): Promise<void> {
		return await transactionCategoryRepository.deleteTransactionCategory(id);
	}
};
