<script setup lang="ts">
definePageMeta({
  layout: "signin",
});
</script>

<template>
  <Tabs default-value="signin" class="w-[400px]">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="signin">Sign In</TabsTrigger>
      <TabsTrigger value="signup">Sign Up</TabsTrigger>
    </TabsList>
    <TabsContent tabindex="-1" value="signin">
      <AuthSignIn />
    </TabsContent>
    <TabsContent tabindex="-1" value="signup">
      <AuthSignUp />
    </TabsContent>
  </Tabs>
</template>
