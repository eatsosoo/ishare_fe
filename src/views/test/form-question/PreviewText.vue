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

    .custom-radio {
      display: flex;
      align-items: center;
      font-size: 16px;
      cursor: pointer;
      gap: 10px;
    }

    /* Ẩn radio mặc định */
    .custom-radio input {
      display: none;
    }

    /* Tạo vòng tròn ngoài */
    .custom-radio .checkmark {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
      border: 2px solid #c14b54;
      border-radius: 50%;
    }

    /* Khi radio được chọn -> tạo dấu check */
    .custom-radio input:checked + .checkmark::before {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #c14b54;
    }
  }
</style>
