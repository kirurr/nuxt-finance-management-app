import z from "zod";
import { authed } from "../orpc";
import { createIconSchema, updateIconSchema, type Icon } from "./schema";
import { iconService } from "./service";

export const iconRouter = {
  createIcon: authed
    .input(createIconSchema)
    .handler(async ({ input }): Promise<Icon> => {
      return await iconService.createIcon(input);
    }),
  updateIcon: authed
    .input(updateIconSchema)
    .handler(async ({ input }): Promise<Icon> => {
      return await iconService.updateIcon(input.id, input);
    }),
  getIcon: authed
    .input(z.number())
    .handler(async ({ input }): Promise<Icon> => {
      return await iconService.getIcon(input);
    }),
  getIcons: authed.handler(async (): Promise<Icon[]> => {
    return await iconService.getIcons();
  }),
  deleteIcon: authed
    .input(z.number())
    .handler(async ({ input }): Promise<void> => {
      return await iconService.deleteIcon(input);
    }),
};
