import { useQuery, useMutation } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import type {
  CategoryFormData,
} from "~~/server/category/schema";

export function useCategories() {
  const { $orpc } = useNuxtApp();

  const categories = useQuery({
    queryKey: computed(() => [...queryKeys.categories]),
    queryFn: async () => await $orpc.category.getCategories.call(),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CategoryFormData;
    }) => {
      return await $orpc.category.updateCategory.call({
        ...data,
        id,
        iconId: Number(data.iconId),
        colorId: Number(data.colorId),
      });
    },
    mutationKey: [...queryKeys.categories],
    onSuccess: async (value, data, ___, context) => {
      context.client.invalidateQueries({
        queryKey: [...queryKeys.categories],
        exact: false,
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      return await $orpc.category.createCategory.call({
        ...data,
        iconId: Number(data.iconId),
        colorId: Number(data.colorId),
      });
    },
    mutationKey: [...queryKeys.categories],
    onSuccess: async (value, _, ___, context) => {
      context.client.invalidateQueries({
        queryKey: [...queryKeys.categories],
        exact: false,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await $orpc.category.deleteCategory.call(id);
    },
    mutationKey: [...queryKeys.categories],
    onSuccess: async (_, id, ___, context) => {
      context.client.invalidateQueries({
        queryKey: [...queryKeys.categories],
        exact: false,
      });
    },
  });

  return {
    categories,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
