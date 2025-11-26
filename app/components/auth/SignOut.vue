<script setup lang="ts">
import { handleSignOut } from "~/lib/auth";
</script>
<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="outline">Sign out</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Sign out</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to sign out?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction as-child>
          <Button variant="destructive" @click="handleSignOut">Sign out</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
