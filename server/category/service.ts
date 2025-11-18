import { transactionCategoryRepository } from "./repository";
import type { CategoryWithIconAndColor, CreateTransactionCategory, TransactionCategory, UpdateTransactionCategory } from "./schema";

export const transactionCategoryService = {
  async createTransactionCategory(data: CreateTransactionCategory): Promise<CategoryWithIconAndColor> {
    return await transactionCategoryRepository.createTransactionCategory(data);
  },
	async updateTransactionCategory(id: number, data: UpdateTransactionCategory): Promise<CategoryWithIconAndColor> {
		return await transactionCategoryRepository.updateTransactionCategory(id, data);
	},
  async getTransactionCategory(id: number): Promise<CategoryWithIconAndColor> {
    return await transactionCategoryRepository.getTransactionCategory(id);
  },
  async getTransactionCategories(userId: string): Promise<CategoryWithIconAndColor[]> {
    return await transactionCategoryRepository.getTransactionCategories(userId);
  },
	async deleteTransactionCategory(id: number): Promise<void> {
		return await transactionCategoryRepository.deleteTransactionCategory(id);
	}
};
