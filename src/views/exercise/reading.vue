<template>
  <PageWrapper :title="t('common.readingExercise')">
    <div class="bg-white px-4 pb-4">
      <Tabs v-model:activeKey="activeKey">
        <TabPane
          v-for="item in readingParts"
          :key="item.key"
          v-bind="omit(item, ['questions', 'key'])"
        >
          <Row :gutter="[16, 16]">
            <Col :span="12">
              <div class="p-4 re-box-shadow rounded-lg">
                <Tinymce v-model="value" @change="handleChange" width="100%" />
              </div>
            </Col>
            <Col :span="12">
              <div class="mt-4">
                <Select
                  :options="questionTypes"
                  v-model:value="createQuestion.type"
                  placeholder="Chọn loại câu hỏi"
                  :style="{ width: '150px' }"
                />
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>

    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> {{ t('common.confirm') }} </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { PageWrapper } from '@/components/Page';
  import { Col, Row, Select, Tabs } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { questionTypes, readingParts } from './data';
  import { omit } from 'lodash-es';

  const TabPane = Tabs.TabPane;
  const activeKey = ref('tabs1');
  const value = ref('hello world!');
  const createQuestion = reactive({
    type: '',
    answerNum: 4,
  });
  const { t } = useI18n();

  function handleChange(value: string) {
    console.log(value);
  }

  function submitAll() {
    console.log('submit all');
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
