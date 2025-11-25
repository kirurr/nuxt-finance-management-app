<script setup lang="ts">
import RangeDatePicker from "@/components/ui/RangeDatePicker.vue";

const dateStore = useDateStore();

</script>

<template>
	<div role="group" aria-label="Date range selection">
		<RangeDatePicker
			v-model="dateStore.range"
			class="max-w-full text-wrap"
			aria-label="Select date range"
		/>
	</div>
</template>
