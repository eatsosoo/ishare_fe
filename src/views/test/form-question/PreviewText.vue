<template>
  <BasicModal
    v-bind="$attrs"
    :title="'Chỉnh sửa lựa chọn câu hỏi'"
    width="600px"
    :can-fullscreen="false"
    :show-ok-btn="false"
  >
    <div v-html="previewText" class="custom-html"></div>
  </BasicModal>
</template>

<script setup>
  import BasicModal from '@/components/Modal/src/BasicModal.vue';

  defineProps({ previewText: String });
</script>

<style scoped>
  .custom-html {
    margin-top: 10px;
    padding: 10px;
    background: #f8f8f8;
  }
</style>
