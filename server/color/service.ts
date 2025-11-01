import { colorRepository } from "./repository";
import type {
  Color,
} from "./schema";

export const colorService = {
  async getColor(id: number): Promise<Color> {
    return await colorRepository.getColor(id);
  },
  async getColors(): Promise<Color[]> {
    return await colorRepository.getColors();
  },
};
