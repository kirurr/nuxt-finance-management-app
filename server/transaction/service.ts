import { userBudgetService } from "../budget/service";
import { notificationService } from "../notification/service";
import { transactionRepository } from "./repository";
import type {
  CreateTransaction,
  Transaction,
  UpdateTransaction,
  TransactionWithCategory,
} from "./schema";

export const transactionService = {
  async createTransaction(data: CreateTransaction): Promise<Transaction> {
    // Create start and end dates for the month of the transaction
    const start = new Date(data.date.getFullYear(), data.date.getMonth(), 1);
    const end = new Date(data.date.getFullYear(), data.date.getMonth() + 1, 0, 23, 59, 59);
    
    const budgetInfo = await userBudgetService.calculateUserBudget(
      data.userId,
      start,
      end,
    );
    if (budgetInfo) {
      const sign = data.type === "expense" ? -1 : 1;

      const remainingPercent = (
        budgetInfo.totalBudget > 0
          ? ((budgetInfo.totalBudget -
              budgetInfo.totalExpenses +
              sign * data.amount) /
              budgetInfo.totalBudget) *
            100
          : 0
      ).toFixed(0);

      if (Number(remainingPercent) <= 20) {
        await notificationService.createNotification({
          userId: data.userId,
          name: "budget_remaining",
          description: "You almost spend your budget!",
          iconId: 1,
        });
      }
    }

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
		startDate?: Date,
		endDate?: Date,
  ): Promise<{ items: TransactionWithCategory[]; nextCursor: number | null }> {
    return await transactionRepository.getTransactionsByUserId(
      id,
      pageSize,
      cursor,
			startDate,
			endDate,
    );
  },
  async deleteTransaction(id: number): Promise<void> {
    return await transactionRepository.deleteTransaction(id);
  },
  async getTransactionsByUserIdAndMonth(
    id: string,
    month: Date,
  ): Promise<Transaction[]> {
    return await transactionRepository.getTransactionsByUserIdAndMonth(
      id,
      month,
    );
  },
};
