<template>
  <div class="bg-white px-2 mb-8">
    <Tabs v-model:activeKey="activeKey" @change="handleChangeTab">
      <TabPane v-for="(item, index) in tabs" :key="item.key" :tab="item.tab">
        <Row :gutter="[16, 16]">
          <Col :span="12">
            <div class="p-4 re-box-shadow rounded-lg">
              <h3>{{ t('common.readingContext') }}</h3>
              <Tinymce v-model="readingParts[index].subject" @change="handleChange" :height="550" />
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
              <div
                v-for="(question, idx) in readingParts[index].questions"
                :key="`${item.key}_${idx}`"
                class="border rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                :class="
                  questionCurrent.question_no === question.question_no
                    ? 'border-blue text-blue'
                    : 'border-gray text-gray'
                "
                @click="questionCurrent = { ...question }"
              >
                {{ question.question_no }}
              </div>
              <a-button
                v-if="readingParts[index].questions.length < 13"
                class="border rounded-full h-10 w-10 flex items-center justify-center cursor-pointer"
                @click="handleAddQuestion(index)"
                >+</a-button
              >
            </div>
          </Col>
        </Row>
      </TabPane>

      <template v-if="readingParts.length < 3" #rightExtra>
        <a-button type="default" @click="handleAddTab">{{ t('common.add') }} Passage</a-button>
      </template>
    </Tabs>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { Tinymce } from '@/components/Tinymce';
  import { Col, Row, Tabs } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { READING_DEFAULT } from './data';
  import { QuestionItem } from './types/question';
  import Question from './Question.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { examPartApi } from '@/api/exam/exam';
  import { ExamPartForm, ExamPartItem, ExtendedQuestionItem } from '@/api/exam/examModel';

  const props = defineProps({
    value: {
      type: Array as PropType<ExamPartItem[]>,
      default: READING_DEFAULT,
    },
  });

  const TabPane = Tabs.TabPane;

  const activeKey = ref(0);
  const questionCurrent = ref<ExtendedQuestionItem>(props.value[0].questions[0]);
  const readingParts = ref<ExamPartItem[]>(props.value);
  const loading = ref(false);
  const tabs = computed(() => {
    return Array.from({ length: readingParts.value.length }, (_, i) => ({
      key: i,
      tab: `Passage ${i + 1}`,
    }));
  });

  const { t } = useI18n();
  const { createMessage, createErrorModal, createSuccessModal } = useMessage();
  const { prefixCls } = useDesign('register');

  function handleChange(value: string) {
    console.log(value);
  }

  function handleUpdateQuestion(partIdx: number, value: QuestionItem) {
    const questionIndex = readingParts.value[partIdx].questions.findIndex(
      (item) => item.question_no === questionCurrent.value?.question_no,
    );
    if (questionIndex !== -1) {
      readingParts.value[partIdx].questions[questionIndex] = value;
    }

    createMessage.success(t('common.updateSuccess'));
  }

  function handleAddQuestion(partIdx: number) {
    const questions = readingParts.value[partIdx].questions;
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

  function handleAfterSubmit(result: ExamPartItem) {
    readingParts.value[activeKey.value] = result;
  }

  function handleAddTab() {
    readingParts.value.push({ ...READING_DEFAULT[0] });
  }

  function handleChangeTab() {
    questionCurrent.value = readingParts.value[activeKey.value].questions[0];
  }

  async function submitAll(examId: number) {
    try {
      loading.value = true;
      const { subject, questions } = readingParts.value[activeKey.value];
      const submitForm: ExamPartForm = {
        exam_id: examId,
        type: 'reading',
        subject,
        questions,
        duration: 500,
        media: null,
      };
      const result = await examPartApi(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.exam.title', { skill: 'Reading' }),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        handleAfterSubmit(result);
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

  watch(
    () => props.value,
    (value) => {
      readingParts.value = value.length === 0 ? READING_DEFAULT : value;
      questionCurrent.value = readingParts.value[0].questions[0];
      activeKey.value = 0;
    },
  );

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
