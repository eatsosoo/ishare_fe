<template>
  <PageWrapper :title="t('common.readingExercise')">
    <Row :gutter="[16, 16]" class="bg-white">
      <Col :span="12">
        <div class="p-4 m-4 re-box-shadow rounded-lg">
          <Tinymce v-model="value" @change="handleChange" width="100%" />
        </div>
      </Col>
      <Col :span="12">
        <div class="p-4">
          <Select
            :options="questionTypes"
            v-model:value="createQuestion.type"
            placeholder="Chọn loại câu hỏi"
            :style="{ width: '150px' }"
          />
        </div>
      </Col>
    </Row>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { PageWrapper } from '@/components/Page';
  import { Col, Row, Select } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { questionTypes } from './data';

  const value = ref('hello world!');
  const createQuestion = reactive({
    type: '',
    answerNum: 4,
  });
  const { t } = useI18n();
  function handleChange(value: string) {
    console.log(value);
  }
</script>

<style lang="less" scoped>
  .reading-exercise-card {
    padding: 10px;
    border-radius: 8px;
    background-color: white;
  }

  .re-box-shadow {
    box-shadow:
      rgb(50 50 93 / 25%) 0 2px 5px -1px,
      rgb(0 0 0 / 30%) 0 1px 3px -1px;
  }
</style>
