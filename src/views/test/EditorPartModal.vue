<template>
  <BasicModal
    v-bind="$attrs"
    :title="props.titleEditor"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    @ok="handleOk"
  >
    <div class="mb-2">
      <Select v-model:value="skill" :options="SKILL_OPTIONS" />
    </div>
    <Reading ref="readingRef" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { ref, watch } from 'vue';
  import { examDetailApi } from '@/api/exam/exam';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ExamDetailItem } from '@/api/exam/examModel';
  import { Select } from 'ant-design-vue';
  import Reading from '@/views/test/skill/Reading2.vue';
  import { SKILL_OPTIONS } from '@/views/test/data';

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
  const skill = ref('reading');

  const { t } = useI18n();
  const { createMessage } = useMessage();

  function handleOk() {
    if (!props.examId) {
      createMessage.error(t('sys.exception.noDataTitle'));
      return;
    }

    if (readingRef.value) {
      readingRef.value.submitAll();
    }
  }

  async function getExamDetail(examId: number) {
    try {
      loading.value = true;
      const result = await examDetailApi(examId);
      detail.value = result;
    } catch (error) {
      createMessage.error(t('sys.app.dataNotFound'));
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
