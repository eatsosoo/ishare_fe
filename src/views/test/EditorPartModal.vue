<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('form.exam.title')"
    default-fullscreen
    :show-cancel-btn="false"
    :show-ok-btn="false"
    :can-fullscreen="false"
  >
    <Reading />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import Reading from './Reading.vue';

  const { t } = useI18n();
</script>
