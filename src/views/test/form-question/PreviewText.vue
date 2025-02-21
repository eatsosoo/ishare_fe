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

    /* ======= 📌 Custom Radio & Checkbox ======= */
    .custom-input {
      display: flex;
      align-items: center;
      font-size: 16px;
      cursor: pointer;
      gap: 10px;
    }

    /* Ẩn input mặc định */
    .custom-input input {
      display: none;
    }

    /* 🎯 Radio Style */
    .custom-radio .checkmark {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
      border: 1px solid gray;
      border-radius: 50%;
    }

    /* Khi radio được chọn */
    .custom-radio input:checked + .checkmark::before {
      content: '';
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #c14b54;
    }

    /* 🔲 Checkbox Style */
    .custom-checkbox .checkmark {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
      border: 1px solid gray;
      border-radius: 4px; /* 🛑 Vuông thay vì tròn */
    }

    /* Khi checkbox được chọn -> Thêm dấu tick */
    .custom-checkbox input:checked + .checkmark::before {
      content: '✔';
      color: white;
      font-size: 14px;
      font-weight: bold;
    }

    .custom-checkbox input:checked + .checkmark {
      border-color: #c14b54;
      background: #c14b54;
    }
  }
</style>
