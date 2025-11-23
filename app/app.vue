<script setup lang="ts">
import { authClient } from "~/utils/auth-client";
import { LoaderCircle } from "lucide-vue-next";
import { cn } from "~/lib/utils";

const isLoading = computed(() => authClient.useSession().value.isPending);

useHead({
  htmlAttrs: {
    style: isLoading.value && "overflow: hidden;",
  },
});

watch(isLoading, (v) => {
  document.documentElement.style.overflow = v ? "hidden" : "";
});
</script>
<template>
  <div :class="cn('flex flex-col max-w-6xl mx-auto')">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div
      v-if="isLoading"
      class="fixed inset-0 w-full h-screen bg-bg z-50 flex items-center justify-center"
    >
      <LoaderCircle class="size-32 text-primary/60 animate-spin" />
    </div>
  </div>
</template>
