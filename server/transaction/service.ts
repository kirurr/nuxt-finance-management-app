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
    const budgetInfo = await userBudgetService.calculateUserBudget(
      data.userId,
      data.date.getMonth() + 1,
      data.date.getFullYear(),
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
    return await transactionRepository.getTransactionsByUserIdAndMonth(
      id,
      month,
    );
  },
};
