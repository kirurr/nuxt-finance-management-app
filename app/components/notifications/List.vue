<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import type { NotificationWithIcon } from "~~/server/notification/schema";

const { $orpc } = useNuxtApp();

const notifications = useQuery({
  queryKey: [...queryKeys.notifications],
  queryFn: async (): Promise<NotificationWithIcon[]> => {
    return await $orpc.notification.getNotifications.call();
  },
  refetchInterval: 3000,
});

const { mutateAsync: checkIsSeen, isPending: isPendingCheckIsSeen } =
  useMutation({
    mutationKey: [...queryKeys.notifications],
    mutationFn: async (id: number) => {
      return await $orpc.notification.toggleIsSeen.call(id);
    },
    onSuccess: () => {
      notifications.refetch();
    },
  });

const { mutateAsync: deleteNotification, isPending: isPendingDelete } =
  useMutation({
    mutationKey: [...queryKeys.notifications],
    mutationFn: async (id: number) => {
      return await $orpc.notification.deleteNotification.call(id);
    },
    onSuccess: () => {
      notifications.refetch();
    },
  });

const notSeenNotifications = computed(() => {
  return (
    notifications.data.value?.filter((notification) => !notification.isSeen) ??
    []
  );
});

const isOpen = ref(false);
function setOpen(value: boolean) {
  isOpen.value = value;

	Promise.all(notSeenNotifications.value.map(n => {
		checkIsSeen(n.id);
	}))
}
</script>

<template>
  <Popover :open="isOpen" @update:open="(v) => setOpen(v)">
    <PopoverTrigger as-child>
      <Button variant="outline"> Open popover </Button>
    </PopoverTrigger>
    <PopoverContent>
      <div>
        <div>Notifications</div>
        <div
          v-for="notification in notifications.data.value"
          :key="notification.id"
        >
          <pre>{{ JSON.stringify(notification, null, "\t") }} </pre>
          <Button
            :disabled="isPendingCheckIsSeen"
            @click="checkIsSeen(notification.id)"
            >Seen</Button
          >
          <Button
            :disabled="isPendingDelete"
            @click="deleteNotification(notification.id)"
            >Delete</Button
          >
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
