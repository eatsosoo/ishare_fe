<template>
  <BasicModal
    v-bind="$attrs"
    default-fullscreen
    :can-fullscreen="false"
    :loading="loading"
    :show-ok-btn="false"
  >
    <template v-if="props.skillType === 'Reading' || props.skillType === 'Listening'">
      <Row :gutter="[16, 16]" class="h-full">
        <Col :span="12" class="bg-[aliceblue] border-r-2 border-gray h-full overflow-auto">
          <div class="p-4">
            <div v-if="props.skillType !== 'Listening'" v-html="subjectRef"></div>
            <div v-else>
              <audio
                v-if="completedAssignment"
                :src="completedAssignment.media"
                controls
                class="h-8 w-full"
              ></audio>
            </div>
          </div>
        </Col>
        <Col :span="12" class="border-l-2 border-gray h-full overflow-auto">
          <div class="p-4">
            <div
              v-for="(part, index) in completedAssignment?.parts"
              :key="'part' + index"
              class="mb-4"
            >
              <h2 class="font-bold">Part {{ index + 1 }}</h2>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="(group, gIdx) in part.question_groups" :key="gIdx">
                  <div
                    v-for="(value, key) in group.question_answer"
                    :key="key"
                    class="flex items-center mb-4"
                  >
                    <!-- Xử lý multiple_choice -->
                    <template v-if="group.question_type === 'multiple_choice'">
                      <div
                        class="w-8 h-8 bg-[#c4303a] text-white font-bold flex items-center justify-center rounded-full mr-2 text-[11px]"
                      >
                        {{ key.split('_')[1] }}-{{ key.split('_').pop() }}
                      </div>
                    </template>
                    <template v-else>
                      <div
                        class="w-8 h-8 bg-[#c4303a] text-white font-bold text-sm flex items-center justify-center rounded-full mr-2"
                      >
                        {{ key.split('_')[1] }}
                      </div>
                    </template>

                    <span class="text-[#c4303a]">{{
                      group.question_type === 'multiple_choice' ? value.join(',') : value
                    }}</span
                    >:
                    {{ JSON.parse(group.student_answer)[key] }}

                    <!-- So sánh đúng/sai và hiển thị icon -->
                    <Icon
                      :icon="
                        compareAnswers(value, JSON.parse(group.student_answer)[key])
                          ? 'ant-design:check-circle-outlined'
                          : 'ant-design:close-outlined'
                      "
                      class="ml-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </template>
    <template v-else>
      <Row v-if="completedAssignment" :gutter="[16, 16]" class="h-full">
        <Col :span="12" class="bg-[aliceblue] border-r-2 border-gray h-full overflow-auto">
          <div
            v-for="(group, index) in completedAssignment.parts[0].question_groups"
            class="p-4"
            :key="index"
          >
            <h1>Task {{ index + 1 }}</h1>
            <div v-html="group.question_text"></div>
          </div>
        </Col>
        <Col :span="12" class="border-l-2 border-gray h-full overflow-auto">
          <div class="p-4" ref="contentWord">
            <div
              v-for="(group, index) in completedAssignment.parts[0].question_groups"
              :key="'answer' + index"
            >
              <h1>Task {{ index + 1 }}</h1>
              <div v-html="Object.values(JSON.parse(group.student_answer))[0]"></div>
            </div>
            <a-button
              v-if="props.skillType === 'Writing'"
              preIcon="ant-design:file-word-twotone"
              @click="exportToWord"
              class="mt-4"
              >{{ t('common.download') }}</a-button
            >
          </div>
          <div class="m-4">
            <h3>Chấm điểm và nhận xét</h3>
            <Form :model="gradingFormData">
              <FormItem label="Điểm" name="score" :label-col="{ span: 3 }" label-align="left">
                <InputNumber v-model:value="gradingFormData.score" :min="0" :max="10" required />
              </FormItem>
              <FormItem
                label="Nhận xét"
                name="feedback"
                :label-col="{ span: 3 }"
                label-align="left"
              >
                <InputTextArea v-model:value="gradingFormData.feedback" />
              </FormItem>
              <div class="flex justify-end">
                <a-button type="primary" @click="submitAll">{{ t('common.confirm') }}</a-button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal } from '@/components/Modal';
  import { Row, Col, InputNumber, Form, FormItem, Input } from 'ant-design-vue';
  import { ref, type PropType, watch } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SkillType, ResponseExamPartItem } from '@/api/exam/examModel';
  import { getDetailExamOfStudent } from '@/api/student/student';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { GradingForm } from '@/api/teacher/teacherModel';
  import { submitGradingApi } from '@/api/teacher/teacher';
  import Icon from '@/components/Icon/Icon.vue';
  import { isArray } from 'lodash-es';
  import { saveAs } from 'file-saver';

  const InputTextArea = Input.TextArea;
  const props = defineProps({
    skillType: {
      type: String as PropType<SkillType>,
      default: 'Reading',
    },
    // id của đề thi
    examId: {
      type: Number,
    },
    studentId: {
      type: Number,
    },
    // id của bài làm
    scoreId: {
      type: Number,
    },
    times: {
      type: Number,
    },
    title: {
      type: String,
    },
  });

  const emit = defineEmits(['submit-grading']);

  const { t } = useI18n();
  const gradingFormData = ref({
    score: 0,
    feedback: '',
  });
  const loading = ref(false);
  const completedAssignment = ref<ResponseExamPartItem | null>(null);
  const tabActive = ref(0);
  const subjectRef = ref('');
  const contentWord = ref<HTMLDivElement | null>(null);

  const { createSuccessModal, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('register');

  function clickTab(index: number) {
    if (!completedAssignment.value) return;
    const { subject } = completedAssignment.value.parts[index];
    subjectRef.value = subject;
    tabActive.value = index;
  }

  async function submitAll() {
    try {
      loading.value = true;
      const answerW = completedAssignment.value?.parts[0].question_groups.map((group) => {
        return {
          id: group.id,
          is_correct: true,
          explanation: gradingFormData.value.feedback,
          question_count: 1,
        };
      });
      const submitForm: GradingForm = {
        exam_id: props.examId,
        user_id: props.studentId,
        score_id: props.scoreId,
        times: props.times,
        type: props.skillType,
        answers: answerW,
        score: gradingFormData.value.score,
      };

      const result = await submitGradingApi(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.exam.editSkill', { skill: 'Reading' }),
          content: t('common.createSuccessfully'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        emit('submit-grading');
      }
    } catch (error) {
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

  async function getExamOfStudent(studentId: number, examId: number, type: SkillType) {
    try {
      loading.value = true;
      const result = await getDetailExamOfStudent(studentId, examId, type);
      if (result && result.items) {
        completedAssignment.value = result.items;
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }

  const compareAnswers = (correctAnswer: string | string[], studentAnswer: string) => {
    if (!correctAnswer || !studentAnswer) return false;
    if (!isArray(correctAnswer)) {
      return correctAnswer.toLowerCase() === studentAnswer.toLowerCase();
    } else {
      const value2Array = studentAnswer.split(',');

      // Kiểm tra xem tất cả phần tử của value2Array có trong value1 không
      const isContained = value2Array.every((val) => correctAnswer.includes(val));
      return isContained;
    }
  };

  // const countCorrectAnswers = (group) => {
  //   let correctCount = 0;
  //   const studentAnswers = JSON.parse(group.student_answer);
  //   for (let key in group.question_answer) {
  //     if (group.question_answer[key].toLowerCase() === studentAnswers[key]?.toLowerCase()) {
  //       correctCount++;
  //     }
  //   }
  //   return correctCount;
  // };

  const exportToWord = async () => {
    const htmlContent = `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>${contentWord.value.innerHTML}</body>
    </html>
  `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    saveAs(blob, `${props.title}.doc`);
  };

  watch(
    () => [props.examId, props.studentId, props.scoreId],
    ([newExamId, newStudentId, newScoreId]) => {
      if (newExamId && newStudentId && newScoreId) {
        getExamOfStudent(newStudentId, newExamId, props.skillType);
      }
    },
  );

  watch(
    () => completedAssignment.value,
    () => {
      clickTab(0);
    },
  );
</script>
