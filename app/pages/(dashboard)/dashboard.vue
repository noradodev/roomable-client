<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>
<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        title="Dashboard"
        toggle-side="right"
        :toggle="{
          color: 'primary',
          variant: 'soft',
          class: 'rounded-full',
          
        }"
      />
    </template>
    <template #body>
      <div>Hello world, this is dashboard</div>
    </template>
  </UDashboardPanel>
</template>
