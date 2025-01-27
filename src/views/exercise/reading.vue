<template>
  <PageWrapper :title="t('common.readingExercise')">
    <div class="bg-white px-4 pb-4">
      <Tabs v-model:activeKey="activeKey" @change="questionCurrent = null">
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
              <div class="flex flex-wrap gap-2">
                <a-button
                  v-for="(question, index) in item.questions"
                  :type="
                    questionCurrent && questionCurrent.no === question.no ? 'primary' : 'default'
                  "
                  :key="`${item.key}_${index}`"
                  class="border rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                  @click="questionCurrent = question"
                >
                  {{ question.no }}
                </a-button>
              </div>
              <div class="re-box-shadow rounded-lg mt-4 pa-4">
                <template v-if="questionCurrent">
                  <h3>{{ t('common.questionInformation') }}</h3>
                  <Input
                    v-model:value="questionCurrent.content"
                    placeholder="Nhập tên câu hỏi"
                    class="mb-4"
                  />
                  <Select
                    :options="questionTypes"
                    v-model:value="questionCurrent.type"
                    placeholder="Chọn loại câu hỏi"
                    class="mb-4 w-1/2"
                  />
                  <div v-if="questionCurrent.type === 'choice'">
                    <div
                      v-for="answer in ['A', 'B', 'C', 'D']"
                      :key="answer"
                      class="flex items-center w-1/2"
                      >{{ answer }}. <Input placeholder="Đáp án A" class="ml-2 mb-2"
                    /></div>
                  </div>
                  <div class="text-right">
                    <a-button type="primary">{{ t('common.confirm') }}</a-button>
                  </div>
                </template>
                <template v-else>
                  <div class="text-center">{{
                    `${t('common.pleaseSelectQuestion')} ${item.tab}`
                  }}</div>
                </template>
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
  import { ref } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { PageWrapper } from '@/components/Page';
  import { Col, Row, Select, Tabs, Input } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { questionTypes, readingParts } from './data';
  import { omit } from 'lodash-es';
  import { QuestionItem } from './types/question';

  const TabPane = Tabs.TabPane;
  const activeKey = ref('tabs1');
  const value = ref('hello world!');
  const questionCurrent = ref<QuestionItem | null>(null);
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
