import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from "@orpc/json-schema";
import { router } from "../../routers";

const openAPIHandler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
});

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event);

  const { response } = await openAPIHandler.handle(request, {
    prefix: "/api",
    context: {
      headers: request.headers,
    },
  });

  if (response) {
    return response;
  }

  setResponseStatus(event, 404, "Not Found");
  return "Not Found";
});
