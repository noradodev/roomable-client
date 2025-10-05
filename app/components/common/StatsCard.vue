<template>
  <div
    class="card flex flex-col shadow p-4 border border-slate-50 rounded-xl space-y-8 bg-white"
  >
    <div class="card-icon flex items-center">
      <div
        class="border-2 border-primary flex justify-center items-center p-4 rounded-full inset-shadow-sm"
      >
        <UIcon
          :name="icon"
          class="text-3xl just text-primary"
        ></UIcon>
      </div>
    </div>
    <div class="card-info">
      <div>
        <span class="text-base text-slate-600">{{ subHeader }}</span>
        <div class="stats_no flex justify-between items-center">
          <h3 class="text-3xl font-bold">{{ total }}</h3>
          <div class="flex justify-center items-center space-x-2">
            <UBadge variant="soft" color="success"> + {{ increase }} </UBadge>
            <p class="text-slate-600">last month</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
    icon: string,
    subHeader: string,
    total?: number | string,
    increase?: number

}>()
</script>