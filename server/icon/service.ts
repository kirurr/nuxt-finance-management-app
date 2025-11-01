import { iconRepository } from "./repository";
import type {
  CreateIcon,
  Icon,
  UpdateIcon,
} from "./schema";

export const iconService = {
  async createIcon(data: CreateIcon): Promise<Icon> {
    return await iconRepository.createIcon(data);
  },
  async updateIcon(
    id: number,
    data: UpdateIcon,
  ): Promise<Icon> {
    return await iconRepository.updateIcon(id, data);
  },
  async getIcon(id: number): Promise<Icon> {
    return await iconRepository.getIcon(id);
  },
  async getIcons(): Promise<Icon[]> {
    return await iconRepository.getIcons();
  },
  async deleteIcon(id: number): Promise<void> {
    return await iconRepository.deleteIcon(id);
  },
};
