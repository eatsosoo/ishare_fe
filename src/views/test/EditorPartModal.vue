<template>
  <BasicModal
    v-bind="$attrs"
    :title="props.titleEditor"
    default-fullscreen
    :show-cancel-btn="false"
    :can-fullscreen="false"
    @ok="handleOk"
  >
    <Reading ref="readingRef" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import Reading from './Reading.vue';
  import { ref } from 'vue';

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

  function handleOk() {
    if (readingRef.value && props.examId) {
      readingRef.value.submitAll(props.examId);
    }
  }
</script>
