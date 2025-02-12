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
      <Select v-model:value="skill" :options="options" />
    </div>
    <Reading v-show="skill === 'reading'" ref="readingRef" :value="detail?.reading" />
    <Listening v-show="skill === 'listening'" ref="listeningRef" :value="detail?.listening" />
    <Writing v-show="skill === 'writing'" ref="writingRef" :value="detail?.writing" />
    <Speaking v-show="skill === 'speaking'" ref="speakingRef" :value="detail?.speaking" />
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
  import Reading from './reading.vue';
  import Listening from './listening.vue';
  import Writing from './writing.vue';
  import Speaking from './speaking.vue';

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
  const listeningRef = ref<InstanceType<typeof Listening> | null>(null);
  const writingRef = ref<InstanceType<typeof Writing> | null>(null);
  const speakingRef = ref<InstanceType<typeof Speaking> | null>(null);

  const detail = ref<ExamDetailItem | null>(null);
  const loading = ref(false);
  const skill = ref('reading');

  const options = [
    { label: 'Reading', value: 'reading' },
    { label: 'Listening', value: 'listening' },
    { label: 'Writing', value: 'writing' },
    { label: 'Speaking', value: 'speaking' },
  ];

  const { t } = useI18n();
  const { createMessage } = useMessage();

  function handleOk() {
    if (!props.examId) {
      createMessage.error(t('sys.exception.noDataTitle'));
      return;
    }

    const refMap = {
      reading: readingRef,
      listening: listeningRef,
      writing: writingRef,
      speaking: speakingRef,
    };

    const currentRef = refMap[skill.value];
    if (currentRef.value) {
      loading.value = true;
      currentRef.value.submitAll(props.examId);
      loading.value = false;
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
