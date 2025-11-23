<script setup lang="ts">
import NotificationsPopover from "~/components/notifications/Popover.vue";
import { Menu } from "lucide-vue-next";
</script>

<template>
  <header class="pt-4 lg:pt-0 lg:px-2 px-4 w-full lg:block flex flex-row-reverse lg:relative sticky top-0 z-50">
    <Sheet class="lg:hidden">
      <SheetTrigger as-child>
					<Button class="lg:hidden ml-auto" variant="outline" size="icon">
						<Menu class="size-6" />
					</Button>
					<NotificationsPopover />
      </SheetTrigger>
      <SheetContent class="w-[85vw]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav>
          <ul class="px-4 flex flex-col gap-4 items-start">
            <li class="flex gap-2 items-center">
              <AuthSignOut />
            </li>
            <li class="flex flex-col gap-4">
              <TransactionDialogCreate />
            </li>
            <li>
              <DateSelect />
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
    <Card class="hidden lg:block p-4">
      <nav>
        <ul class="flex flex-row gap-4">
          <li>
            <NuxtLink tabindex="0" to="/" class="nav-link"> Budget </NuxtLink>
          </li>
          <li class="ml-auto flex flex-row gap-4">
            <TransactionDialogCreate />
            <NotificationsPopover />
            <AuthSignOut />
          </li>
        </ul>
      </nav>
    </Card>
  </header>
</template>
