<template>
  <div class="bg-white px-2 mb-8">
    <Row :gutter="[16, 16]">
      <Col :span="24">
        <div class="p-4 mt-4 re-box-shadow rounded-lg">
          <h3>{{ t('common.speakingSubject') }}</h3>
          <Tinymce v-model="value" width="100%" />
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { Row, Col } from 'ant-design-vue';
  import { ExamPartItem, SkillType } from '@/api/exam/examModel';
  import { SPEAKING_DEFAULT } from './data';

  const props = defineProps({
    value: {
      type: Array as PropType<ExamPartItem[]>,
      default: SPEAKING_DEFAULT,
    },
    type: {
      type: String as PropType<SkillType>,
      default: 'speaking',
    },
  });

  const { t } = useI18n();
  const value = ref(props.value[0].subject);

  function submitAll() {
    console.log('submit all');
  }

  defineExpose({
    submitAll,
  });
</script>

<style lang="less" scoped>
  .re-box-shadow {
    box-shadow:
      rgb(50 50 93 / 25%) 0 2px 5px -1px,
      rgb(0 0 0 / 30%) 0 1px 3px -1px;
  }
</style>
