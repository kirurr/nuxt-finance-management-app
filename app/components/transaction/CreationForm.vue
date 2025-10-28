<script setup lang="ts">
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { useMutation } from "@tanstack/vue-query";
import type { TransactionFormData } from "~~/server/transaction/schema";

const session = authClient.useSession();
const { $orpc } = useNuxtApp();

const mutation = useMutation({
  mutationFn: async (data: TransactionFormData) => {
    await $orpc.transaction.createTransaction.call({
      ...data,
      userId: session.value!.data!.user.id,
      date: parseDate(data.date).toDate(getLocalTimeZone()),
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      amount: Number(data.amount),
    });
  },
  mutationKey: ["transactions"],
	onSuccess: () => {
		// TODO: change stuff
	}
});
</script>

<template>
  <div>
    <div v-if="!session.isPending">
      <TransactionForm :action="mutation.mutateAsync" />
    </div>
  </div>
</template>
