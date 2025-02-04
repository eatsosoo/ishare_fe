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
                <h3>{{ t('common.readingContext') }}</h3>
                <Tinymce v-model="value" @change="handleChange" height="550" />
              </div>
            </Col>
            <Col :span="12" class="flex">
              <div class="re-box-shadow rounded-lg pa-4 w-full">
                <template v-if="questionCurrent">
                  <Question
                    :value="questionCurrent"
                    @update:value="handleUpdateQuestion(index, $event)"
                  />
                </template>
                <template v-else>
                  <h3>{{ `${t('common.pleaseSelectQuestion')} ${item.tab}` }}</h3>
                </template>
              </div>
              <div class="flex flex-col gap-2 ml-4">
                <a-button
                  v-for="(question, index) in item.questions"
                  :type="
                    questionCurrent && questionCurrent.no === question.no ? 'primary' : 'default'
                  "
                  :key="`${item.key}_${index}`"
                  class="border rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                  @click="questionCurrent = { ...question }"
                >
                  {{ question.no }}
                </a-button>
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
  import { readingParts } from '@/views/test/data';
  import { omit } from 'lodash-es';
  import { QuestionItem, ReadingPart } from '@/views/test/types/question';
  import Question from '@/views/test/Question.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const TabPane = Tabs.TabPane;
  const activeKey = ref('tabs1');
  const value = ref('Reading');
  const questionCurrent = ref<QuestionItem | null>(null);
  const { t } = useI18n();
  const readingExercise = ref<ReadingPart[]>(readingParts);
  const { createMessage } = useMessage();

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

    createMessage.success(t('common.updateSuccess'));
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
