<template>
  <PageWrapper :title="t('common.readingExercise')">
    <div class="bg-white px-4 pb-4 mb-8">
      <Tabs v-model:activeKey="activeKey" @change="questionCurrent = null">
        <TabPane
          v-for="(item, index) in readingExercise"
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
                  <Question
                    :value="questionCurrent"
                    @update:value="handleUpdateQuestion(index, $event)"
                  />
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
      <a-button type="primary" @click="submitAll"> {{ t('common.saveText') }} </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { PageWrapper } from '@/components/Page';
  import { Col, Row, Tabs } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { readingParts } from './data';
  import { omit } from 'lodash-es';
  import { QuestionItem, ReadingPart } from './types/question';
  import Question from './Question.vue';

  const TabPane = Tabs.TabPane;
  const activeKey = ref('tabs1');
  const value = ref('Reading');
  const questionCurrent = ref<QuestionItem | null>(null);
  const { t } = useI18n();
  const readingExercise = ref<ReadingPart[]>(readingParts);

  function handleChange(value: string) {
    console.log(value);
  }

  function submitAll() {
    console.log('submit all');
  }

  function handleUpdateQuestion(partIdx: number, value: QuestionItem) {
    const questionIndex = readingExercise.value[partIdx].questions.findIndex(
      (item) => item.no === questionCurrent.value?.no,
    );
    if (questionIndex !== -1) {
      readingExercise.value[partIdx].questions[questionIndex] = value;
    }
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
