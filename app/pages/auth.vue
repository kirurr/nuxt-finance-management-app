<script setup lang="ts">
definePageMeta({
  layout: "signin",
});

useHead({
  title: "Sign In / Sign Up - Expensess",
  meta: [
    {
      name: "description",
      content:
        "Sign in or create an account to track your expenses and manage your budget",
    },
  ],
});
</script>

<template>
  <Tabs
    default-value="signin"
    class="w-full lg:w-[400px]"
    aria-label="Authentication"
  >
    <TabsList
      class="grid w-full grid-cols-2"
      role="tablist"
      aria-label="Authentication options"
    >
      <TabsTrigger
        id="signin0-trigger"
        value="signin"
        role="tab"
        aria-selected="true"
        aria-controls="signin0-panel"
        >Sign In</TabsTrigger
      >
      <TabsTrigger
        id="signup0-trigger"
        value="signup"
        role="tab"
        aria-controls="signup0-panel"
        >Sign Up</TabsTrigger
      >
    </TabsList>
    <TabsContent
      id="signin0-panel"
      tabindex="-1"
      value="signin"
      role="tabpanel"
      aria-labelledby="signin0-trigger"
    >
      <AuthSignIn />
    </TabsContent>
    <TabsContent
      id="signup0-panel"
      tabindex="-1"
      value="signup"
      role="tabpanel"
      aria-labelledby="signup0-trigger"
    >
      <AuthSignUp />
    </TabsContent>
  </Tabs>
</template>
