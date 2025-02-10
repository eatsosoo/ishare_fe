<template>
  <div class="bg-white px-4 pb-4 mb-8">
    <Tabs
      v-model:activeKey="activeKey"
      @change="questionCurrent = readingExercise[$event].questions[0]"
    >
      <TabPane
        v-for="(item, index) in readingExercise"
        :key="item.key"
        v-bind="omit(item, ['questions', 'key'])"
      >
        <Row :gutter="[16, 16]">
          <Col :span="12">
            <div class="p-4 re-box-shadow rounded-lg">
              <h3>{{ t('common.readingContext') }}</h3>
              <Tinymce v-model="item.subject" @change="handleChange" :height="550" />
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
                  questionCurrent && questionCurrent.question_no === question.question_no
                    ? 'primary'
                    : 'default'
                "
                :key="`${item.key}_${index}`"
                class="border rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                @click="questionCurrent = { ...question }"
              >
                {{ question.question_no }}
              </a-button>
              <a-button
                v-if="item.questions.length < 13"
                class="border rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                @click="handleAddQuestion(index)"
                >+</a-button
              >
            </div>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { Col, Row, Tabs } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { readingParts } from './data';
  import { omit } from 'lodash-es';
  import { QuestionItem, ReadingPart } from './types/question';
  import Question from './Question.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { examPartApi } from '@/api/exam/exam';
  import { ExamPartForm } from '@/api/exam/examModel';

  const TabPane = Tabs.TabPane;
  const { t } = useI18n();

  const activeKey = ref(0);
  const questionCurrent = ref<QuestionItem | null>(readingParts[0].questions[0]);
  const readingExercise = ref<ReadingPart[]>(readingParts);
  const loading = ref(false);

  const { createMessage } = useMessage();
  const { createErrorModal, createSuccessModal } = useMessage();
  const { prefixCls } = useDesign('register');

  function handleChange(value: string) {
    console.log(value);
  }

  function handleUpdateQuestion(partIdx: number, value: QuestionItem) {
    const questionIndex = readingExercise.value[partIdx].questions.findIndex(
      (item) => item.question_no === questionCurrent.value?.question_no,
    );
    if (questionIndex !== -1) {
      readingExercise.value[partIdx].questions[questionIndex] = value;
    }

    createMessage.success(t('common.updateSuccess'));
  }

  function handleAddQuestion(partIdx: number) {
    const questions = readingExercise.value[partIdx].questions;
    const lastEl = questions.at(-1); // Lấy phần tử cuối cùng mà không xóa

    const questionNo = lastEl ? lastEl.question_no + 1 : 1; // Nếu rỗng, bắt đầu từ 1

    questions.push({
      question_no: questionNo,
      content: `Question ${questionNo} ?`,
      type: 'choice',
      options: ['A', 'B', 'C', 'D'].map((id) => ({ id, text: '' })),
      answer: null,
    });
  }

  async function submitAll(examId: number) {
    try {
      loading.value = true;
      const { subject, questions } = readingExercise.value[activeKey.value];
      const submitForm: ExamPartForm = {
        exam_id: examId,
        type: 'reading',
        subject,
        questions,
        duration: 500,
        media: null,
      };
      console.log(submitForm);
      const res = await examPartApi(submitForm);
      if (res) {
        createSuccessModal({
          title: t('form.newClassForm.title'),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      }
    } catch (error) {
      if (error.errorFields) return;
      const apiMessage = error.response?.data.message;
      createErrorModal({
        title: t('sys.api.errorTip'),
        content:
          apiMessage || (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }

  defineExpose({
    submitAll,
  });
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
