import { userBudgetService } from "../budget/service";
import { notificationService } from "../notification/service";
import { transactionRepository } from "./repository";
import type {
  CreateTransaction,
  Transaction,
  UpdateTransaction,
  TransactionWithCategory,
  CategoryTransactionCount,
} from "./schema";

export const transactionService = {
  async handleNotification({
    date,
    userId,
    type,
    amount,
  }: {
    date: Date;
    userId: string;
    type: "expense" | "income";
    amount: number;
  }): Promise<void> {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const budgetInfo = await userBudgetService.calculateUserBudget(
      userId,
      start,
      end,
    );
    if (budgetInfo) {
      const sign = type === "expense" ? -1 : 1;

      const remainingPercent = (
        budgetInfo.totalBudget > 0
          ? ((budgetInfo.totalBudget -
              budgetInfo.totalExpenses +
              sign * amount) /
              budgetInfo.totalBudget) *
            100
          : 0
      ).toFixed(0);

      if (Number(remainingPercent) <= 20) {
        await notificationService.createNotification({
          userId: userId,
          name: "Budget Alert",
          description: "You almost spend your budget!",
          iconId: 1,
        });
      }
    }
  },
  async createTransaction(
    data: CreateTransaction,
  ): Promise<TransactionWithCategory> {
    this.handleNotification(data);

    return await transactionRepository.createTransaction(data);
  },
  async updateTransaction(
    id: number,
    data: UpdateTransaction,
  ): Promise<TransactionWithCategory> {
    return await transactionRepository.updateTransaction(id, data);
  },
  async getTransaction(id: number): Promise<TransactionWithCategory> {
    return await transactionRepository.getTransaction(id);
  },
  async getTransactionsByUserId(
    id: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TransactionWithCategory[]> {
    return await transactionRepository.getTransactionsByUserId(
      id,
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

  async groupTransactionsByCategory(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<CategoryTransactionCount[]> {
    return await transactionRepository.groupTransactionsByCategory(
      userId,
      startDate,
      endDate,
    );
  },
};
