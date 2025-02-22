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
      <Select v-model:value="skillSelected" :options="SKILL_OPTIONS" />
    </div>
    <Reading ref="editorRef" :value="computedT" :skill-type="skillSelected" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { computed, ref, watch } from 'vue';
  import { examDetailApi } from '@/api/exam/exam';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ExamDetailItem, SkillType } from '@/api/exam/examModel';
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
  const editorRef = ref<InstanceType<typeof Reading> | null>(null);
  const detail = ref<ExamDetailItem | null>(null);
  const loading = ref(false);
  const skillSelected = ref<SkillType>('Reading');

  const computedT = computed(() => {
    if (detail.value && detail.value[skillSelected.value]) {
      return detail.value[skillSelected.value].parts;
    }
    return [];
  });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  function handleOk() {
    if (!props.examId) {
      createMessage.error(t('sys.exception.noDataTitle'));
      return;
    }

    if (editorRef.value) {
      loading.value = true;
      editorRef.value.submitAll(props.examId);
      loading.value = false;
    }
  }

  async function getExamDetail(examId: number) {
    try {
      loading.value = true;
      const result = await examDetailApi(examId);
      detail.value = result;
      console.log(detail.value[skillSelected.value].parts);
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
