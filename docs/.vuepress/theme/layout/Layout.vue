<template>
  <ParentLayout>
    <template #sidebar-top>
    </template>
    <template #page-bottom>
    </template>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
export default {
  name: 'Layout',
  components: {
    ParentLayout,
  }
}
</script>