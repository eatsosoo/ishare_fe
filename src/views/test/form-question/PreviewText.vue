<template>
  <BasicModal
    v-bind="$attrs"
    :title="'Chỉnh sửa lựa chọn câu hỏi'"
    width="1000px"
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

<style lang="scss">
  .custom-html {
    table {
      width: 100%;
      border-collapse: collapse;
    }

    table,
    th,
    td {
      border: 1px solid black;
    }

    th,
    td {
      padding: 8px;
      text-align: left;
    }
  }
</style>
