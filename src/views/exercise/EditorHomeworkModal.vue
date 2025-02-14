<template>
  <BasicModal
    v-bind="$attrs"
    :title="titleEditor"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    @ok="handleOk"
  >
    <div class="mb-2">
      <Select v-model:value="skill" :options="options" />
    </div>

    <Reading
      v-show="skill === 'reading'"
      ref="readingRef"
      :value="detail?.reading"
      tpye="homework"
    />
    <Listening
      v-show="skill === 'listening'"
      ref="listeningRef"
      :value="detail?.listening"
      tpye="homework"
    />
    <Writing
      v-show="skill === 'writing'"
      ref="writingRef"
      :value="detail?.writing"
      tpye="homework"
    />
    <Speaking
      v-show="skill === 'speaking'"
      ref="speakingRef"
      :value="detail?.speaking"
      tpye="homework"
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

  const props = defineProps({
    homeworkId: Number,
    titleEditor: {
      type: String,
    },
  });

  const { t } = useI18n();
  const { createErrorModal } = useMessage();

  const defaultHomeworks = {
    reading: READING_DEFAULT,
    listening: LISTENING_DEFAULT,
    writing: WRITING_DEFAULT,
    speaking: SPEAKING_DEFAULT,
  };

  const readingRef = ref<InstanceType<typeof Reading> | null>(null);
  const listeningRef = ref<InstanceType<typeof Listening> | null>(null);
  const writingRef = ref<InstanceType<typeof Writing> | null>(null);
  const speakingRef = ref<InstanceType<typeof Speaking> | null>(null);

  const detail = ref({ ...defaultHomeworks });
  const loading = ref(false);
  const skill = ref('reading');

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

  watch(
    () => props.homeworkId,
    () => {
      detail.value = { ...defaultHomeworks };
    },
  );
</script>
