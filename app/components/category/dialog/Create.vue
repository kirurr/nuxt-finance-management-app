<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
const isOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline"> Create category </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create category</DialogTitle>
        <DialogDescription>
					Create a new category
        </DialogDescription>
      </DialogHeader>

      <CategoryCreationForm :close-dialog="() => isOpen = false" />
    </DialogContent>
  </Dialog>
</template>