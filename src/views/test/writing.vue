<template>
  <PageWrapper :title="t('common.test.writing')">
    <div class="bg-white px-4 pb-4 mb-8">
      <Row :gutter="[16, 16]">
        <Col :span="24">
          <div class="p-4 mt-4 re-box-shadow rounded-lg">
            <h3>{{ t('common.writingSubject') }}</h3>
            <Tinymce v-model="value" @change="handleChange" width="100%" />
          </div>
        </Col>
      </Row>
    </div>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> {{ t('common.saveText') }} </a-button>
    </template>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { Row, Col } from 'ant-design-vue';

  const { t } = useI18n();
  const value = ref('');

  function handleChange() {
    console.log('change');
  }

  function submitAll() {
    console.log('submit all');
  }
</script>

<style lang="less" scoped>
  .re-box-shadow {
    box-shadow:
      rgb(50 50 93 / 25%) 0 2px 5px -1px,
      rgb(0 0 0 / 30%) 0 1px 3px -1px;
  }
</style>
