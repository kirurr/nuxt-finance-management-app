<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import queryKeys from "~/lib/query-keys";
import type { NotificationWithIcon } from "~~/server/notification/schema";
import { Bell } from "lucide-vue-next";

const { $orpc } = useNuxtApp();

const notifications = useQuery({
  queryKey: [...queryKeys.notifications],
  queryFn: async (): Promise<NotificationWithIcon[]> => {
    return await $orpc.notification.getNotifications.call();
  },
  refetchInterval: 3000,
});

const { mutateAsync: checkIsSeen } = useMutation({
  mutationKey: [...queryKeys.notifications],
  mutationFn: async (id: number) => {
    return await $orpc.notification.toggleIsSeen.call(id);
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

  Promise.all(
    notSeenNotifications.value.map((n) => {
      checkIsSeen(n.id);
    }),
  );
}
</script>

<template>
  <Popover :open="isOpen" @update:open="(v: boolean) => setOpen(v)">
    <PopoverTrigger as-child>
      <Button variant="outline" size="icon" class="relative">
        <Bell v-if="notSeenNotifications.length === 0" />
        <template v-else>
          <span class="absolute bg-red-500 rounded-full p-1 right-1 top-1" />
          <Bell />
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-100 max-h-[600px]">
      <h4 class="font-medium leading-none mb-4">Notifications</h4>
			<ScrollArea class="max-h-[600px] overflow-y-auto">
				<ul
					class="space-y-4"
				>
					<li
					v-for="notification in notifications.data.value"
					:key="notification.id"
					>
						<NotificationsItem :notification="notification" />
					</li>
				</ul>
			</ScrollArea>
    </PopoverContent>
  </Popover>
</template>
