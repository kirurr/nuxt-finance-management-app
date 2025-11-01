import z from "zod";
import { authed } from "../orpc";
import type { Color } from "./schema";
import { colorService } from "./service";

export const colorRouter = {
  getColor: authed
    .input(z.number())
    .handler(async ({ input }): Promise<Color> => {
      return await colorService.getColor(input);
    }),
  getColors: authed.handler(async (): Promise<Color[]> => {
    return await colorService.getColors();
  }),
};
