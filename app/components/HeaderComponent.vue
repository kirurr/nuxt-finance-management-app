<script setup lang="ts">
import NotificationsPopover from "~/components/notifications/Popover.vue";
</script>

<template>
  <header>
    <Card class="p-4">
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
