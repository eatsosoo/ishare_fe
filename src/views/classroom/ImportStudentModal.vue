<template>
  <BasicModal
    v-bind="$attrs"
    :title="props.title"
    width="500px"
    :height="300"
    :can-fullscreen="false"
    :loading="loading"
    @ok="uploadFile"
  >
    <div class="custom-file-upload mx-4">
      <p class="font-italic">{{ t('common.importNote') }}</p>
      <label for="fileInput" class="upload-label" accept=".xls,.xlsx">
        {{ t('common.selectFile') }}
      </label>
      <input type="file" id="fileInput" @change="handleFileChange" />
      <span v-if="fileName">{{ fileName }}</span>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';
  import { importExcelApi } from '@/api/student/student';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    classId: {
      type: Number,
      required: true,
    },
    classKey: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['success']);

  const { t } = useI18n();
  const file = ref<File | null>(null);
  const fileName = ref<string>('');
  const loading = ref(false);
  const { createMessage } = useMessage();

  // Kiểm tra file trước khi upload
  const handleFileChange = (event) => {
    file.value = event.target.files[0];
    if (file.value) {
      fileName.value = file.value.name;
    }
  };

  const uploadFile = async () => {
    if (!file.value) {
      createMessage.warning(t('common.chooseText'));
      return;
    }

    const formData = new FormData();
    formData.append('excel', file.value);
    formData.append('class_id', props.classId.toString());
    formData.append('class_key', props.classKey);

    try {
      loading.value = true;
      const result = await importExcelApi(formData);
      if (result) {
        createMessage.success(t('common.uploadFileSuccess'));
        emit('success');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      loading.value = false;
    }
  };
</script>

<style scoped>
  /* Ẩn input file */
  input[type='file'] {
    display: none;
  }

  /* Tạo button giả */
  .upload-label {
    display: inline-block;
    padding: 5px 20px;
    border: 1px solid #e63946;
    border-radius: 5px;
    background-color: white;
    color: #e63946;
    cursor: pointer;
  }

  /* Hover */
  .upload-label:hover {
    background-color: #d62828;
    color: white;
  }

  /* Hiển thị tên file */
  .custom-file-upload span {
    margin-left: 10px;
    color: #333;
    font-size: 14px;
  }
</style>
