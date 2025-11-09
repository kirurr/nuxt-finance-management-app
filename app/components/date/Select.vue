<script setup lang="ts">
import RangeDatePicker from "@/components/ui/RangeDatePicker.vue";

const dateStore = useDateStore();

</script>

<template>
	<div>
		<RangeDatePicker
			v-model="dateStore.range"
		/>
	</div>
</template>
