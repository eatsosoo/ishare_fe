<template>
  <BasicModal
    v-bind="$attrs"
    :title="titleEditor"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    @ok="handleOk"
  >
    <div v-if="!isUpdate" class="mb-2">
      <Select v-model:value="skill" :options="options" />
    </div>

    <Reading
      v-show="skill === 'reading'"
      ref="readingRef"
      :value="detail?.Reading"
      :is-homework="true"
    />
    <Listening
      v-show="skill === 'listening'"
      ref="listeningRef"
      :value="detail?.Listening"
      :is-homework="true"
    />
    <Writing
      v-show="skill === 'writing'"
      ref="writingRef"
      :value="detail?.Writing"
      :is-homework="true"
    />
    <Speaking
      v-show="skill === 'speaking'"
      ref="speakingRef"
      :value="detail?.Speaking"
      :is-homework="true"
    />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { ref, computed, watch } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Select } from 'ant-design-vue';
  import Reading from '@/views/test/reading.vue';
  import Listening from '@/views/test/listening.vue';
  import Writing from '@/views/test/writing.vue';
  import Speaking from '@/views/test/speaking.vue';
  import {
    LISTENING_DEFAULT,
    READING_DEFAULT,
    SPEAKING_DEFAULT,
    WRITING_DEFAULT,
  } from '@/views/test/data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { examDetailApi } from '@/api/exam/exam';

  const props = defineProps({
    homeworkId: Number,
    titleEditor: {
      type: String,
    },
  });

  const { t } = useI18n();
  const { createMessage, createErrorModal } = useMessage();

  const defaultHomeworks = {
    Reading: READING_DEFAULT,
    Listening: LISTENING_DEFAULT,
    Writing: WRITING_DEFAULT,
    Speaking: SPEAKING_DEFAULT,
  };

  const readingRef = ref<InstanceType<typeof Reading> | null>(null);
  const listeningRef = ref<InstanceType<typeof Listening> | null>(null);
  const writingRef = ref<InstanceType<typeof Writing> | null>(null);
  const speakingRef = ref<InstanceType<typeof Speaking> | null>(null);

  const detail = ref({ ...defaultHomeworks });
  const loading = ref(false);
  const skill = ref('reading');
  const isUpdate = ref(false);

  const options = computed(() => [
    { label: 'Reading', value: 'reading' },
    { label: 'Listening', value: 'listening' },
    { label: 'Writing', value: 'writing' },
    { label: 'Speaking', value: 'speaking' },
  ]);

  const handleOk = async () => {
    if (!props.homeworkId) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: t('sys.exception.anErrorOccured'),
      });
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
      currentRef.value.submitAll(props.homeworkId);
      loading.value = false;
    }
  };

  async function getExamDetail(examId: number) {
    try {
      loading.value = true;
      const result = await examDetailApi(examId);
      detail.value = result;

      const hasContent = ['Reading', 'Listening', 'Writing', 'Speaking'].some((key) => {
        if (result[key]?.length > 0) {
          skill.value = key.toLowerCase();
          return true;
        }
        return false;
      });
      isUpdate.value = hasContent;
      console.log(hasContent);
    } catch (error) {
      createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => props.homeworkId,
    (value) => {
      if (value) {
        getExamDetail(value);
      } else {
        detail.value = { ...defaultHomeworks };
      }
    },
  );
</script>
