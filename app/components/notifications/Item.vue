<script setup lang="ts">
import type { NotificationWithIcon } from "~~/server/notification/schema";
import { X } from "lucide-vue-next";
import { useMutation } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import { Item } from "~/components/ui/item";

const { notification } = defineProps<{
  notification: NotificationWithIcon;
}>();

const { $orpc } = useNuxtApp();

const { mutateAsync, isPending } = useMutation({
  mutationKey: [...queryKeys.notifications],
  mutationFn: async (id: number) => {
    return await $orpc.notification.deleteNotification.call(id);
  },
  onSuccess: async (_, id, ___, context) => {
    await context.client.cancelQueries({
      queryKey: [...queryKeys.notifications],
      exact: false,
    });
    context.client.setQueryData<NotificationWithIcon[]>(
      [...queryKeys.notifications],
      (old) => old?.filter((n) => n.id !== id) ?? [],
    );

    context.client.invalidateQueries({
      queryKey: [...queryKeys.notifications],
      exact: false,
    });
  },
});
</script>

<template>
  <Item variant="outline">
    <ItemMedia variant="image">
      <NuxtImg
        v-if="notification.icon?.path"
        :src="notification.icon?.path"
        alt="Icon"
        class="size-8"
      />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>{{ notification.name }}</ItemTitle>
      <ItemDescription v-if="notification.description">{{
        notification.description
      }}</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button
        variant="outline"
        size="icon"
        :disabled="isPending"
        @click="mutateAsync(notification.id)"
        ><X/></Button>
    </ItemActions>
  </Item>
</template>
