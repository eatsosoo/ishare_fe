<template>
  <BasicModal
    v-bind="$attrs"
    :title="props.titleEditor"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    @ok="handleOk"
  >
    <Reading ref="readingRef" :value="detail?.reading" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import Reading from './reading.vue';
  import { ref, watch } from 'vue';
  import { examDetailApi } from '@/api/exam/exam';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ExamDetailItem } from '@/api/exam/examModel';

  const props = defineProps({
    examId: {
      type: Number,
      default: null,
    },
    titleEditor: {
      type: String,
      default: '',
    },
  });
  const readingRef = ref<InstanceType<typeof Reading> | null>(null);
  const detail = ref<ExamDetailItem | null>(null);
  const loading = ref(false);

  const { t } = useI18n();
  const { createMessage } = useMessage();

  function handleOk() {
    if (readingRef.value && props.examId) {
      readingRef.value.submitAll(props.examId);
    }
  }

  async function getExamDetail(examId: number) {
    try {
      loading.value = true;
      const result = await examDetailApi(examId);
      detail.value = result;
    } catch (error) {
      createMessage.error(t('sys.app.dataNotFound'));
      console.log(error);
    } finally {
      loading.value = false;
    }
  }
  watch(
    () => props.examId,
    (value) => {
      getExamDetail(value);
    },
  );
</script>
