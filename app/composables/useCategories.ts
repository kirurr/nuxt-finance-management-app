import { useQuery, useMutation } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import type {
  CategoryFormData,
  CategoryWithIconAndColor,
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
      context.client.setQueriesData<CategoryWithIconAndColor[]>(
        { queryKey: [...queryKeys.categories], exact: false },
        (old) => {
          if (!old) {
            return [value];
          }

          const index = old?.findIndex((item) => item.id === data.id);
          if (index == -1) {
            return old;
          }

          const newArray = [...old];
          newArray[index] = value;
          return newArray;
        },
      );
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
      context.client.setQueriesData<CategoryWithIconAndColor[]>(
        { queryKey: [...queryKeys.categories], exact: false },
        (old) => [value, ...(old ?? [])],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await $orpc.category.deleteCategory.call(id);
    },
    mutationKey: [...queryKeys.categories],
    onSuccess: async (_, id, ___, context) => {
      context.client.setQueriesData<CategoryWithIconAndColor[]>(
        { queryKey: [...queryKeys.categories], exact: false },
        (old) => [...(old ?? [])].filter((item) => item.id !== id),
      );
    },
  });

  return {
    categories,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
