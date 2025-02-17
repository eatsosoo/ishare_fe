<template>
  <BasicModal
    v-bind="$attrs"
    default-fullscreen
    :show-cancel-btn="true"
    :show-ok-btn="false"
    :can-fullscreen="false"
    :loading="loading"
  >
    <Row :gutter="[16, 16]" class="h-full">
      <Col :span="12" class="bg-[aliceblue] border-r-2 border-gray h-full overflow-auto">
        <div class="p-4">
          <h1>Đề bài</h1>
          <div v-html="subjectRef"></div>
        </div>
      </Col>
      <Col :span="12" class="border-l-2 border-gray h-full overflow-auto">
        <div class="p-4">
          <h1>Bài làm của học sinh</h1>
          <template v-if="props.skillType === 'Reading' || props.skillType === 'Listening'">
            <div v-for="question in questionsRef" :key="question.question_no" class="mb-4">
              <div class="flex items-center">
                <h3 class="text-primary mr-2">Question {{ question.question_no }}: </h3>
                <h3>{{ question.content }}</h3>
              </div>

              <p class="mb-0">Đáp học sinh: {{ question.student_answer }}</p>
              <p class="mb-0">Đáp án đúng: {{ question.answer }}</p>
            </div>
          </template>
          <template v-else>
            <!-- <div v-html="questionsRef[0].student_answer" class="mb-4"></div> -->
            <Form :model="gradingFormData">
              <template v-if="questionsRef[0]">
                <div
                  v-if="skillType === 'Writing'"
                  v-html="questionsRef[0].student_answer"
                  class="mb-4"
                ></div>
                <audio
                  v-else-if="skillType === 'Speaking'"
                  :src="questionsRef[0].student_answer"
                  controls
                  class="h-8"
                ></audio>
              </template>
              <h3>Chấm điểm và nhận xét</h3>

              <FormItem label="Điểm" name="score" :label-col="{ span: 4 }" label-align="left">
                <InputNumber v-model:value="gradingFormData.score" :min="0" :max="100" required />
              </FormItem>
              <FormItem
                label="Nhận xét"
                name="feedback"
                :label-col="{ span: 4 }"
                label-align="left"
              >
                <InputTextArea v-model:value="gradingFormData.feedback" :rows="10" />
              </FormItem>
              <div class="flex justify-end">
                <a-button type="primary" @click="submitAll">{{ t('common.confirm') }}</a-button>
              </div>
            </Form>
          </template>
        </div>
      </Col>
    </Row>
    <template #footer>
      <div class="flex gap-2">
        <div
          v-for="(p, index) in completedAssignment"
          :key="p.id"
          @click="clickTab(index)"
          :class="tabActive === index ? ' border-[#0960bd]' : 'cursor-pointer border-gray'"
          class="border-1 px-4 rounded-lg flex-1"
        >
          <div class="text-lg text-center">
            <span class="font-semibold mr-4">Part {{ index + 1 }}</span>
            <span class="font-light">{{ p.questions_count }} questions</span>
          </div>
        </div>
      </div>
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
  import { QuizItem } from '@/views/test/types/question';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDesign } from '@/hooks/web/useDesign';
  import { submitGradingApi } from '@/api/teacher/teacher';
  import { GradingForm } from '@/api/teacher/teacherModel';

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
      type: Number, // giao bài cùng cái đề thi ấy lần thứ 2
    },
  });

  const emit = defineEmits(['submit-grading']);

  const { t } = useI18n();
  const gradingFormData = ref({
    score: 0,
    feedback: '',
  });
  const loading = ref(false);
  const completedAssignment = ref<ResponseExamPartItem[]>([]);
  const tabActive = ref(0);
  const subjectRef = ref('');
  const questionsRef = ref<QuizItem[]>([]);
  const mediaRef = ref<string | null>(null);

  const { createMessage, createSuccessModal, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('register');

  function clickTab(index: number) {
    const { subject, questions, media } = completedAssignment.value[index];
    subjectRef.value = subject;
    questionsRef.value = questions;
    mediaRef.value = media;
    tabActive.value = index;
  }

  async function submitAll() {
    const { studentId, scoreId, times, examId, skillType } = props;
    const questionId = questionsRef.value[0].id;

    if (!studentId || !examId || !studentId || !questionId) {
      createMessage.error('sys.exception.anErrorOccured');
    }
    try {
      loading.value = true;
      const { feedback, score } = gradingFormData.value;
      const submitForm: GradingForm = {
        user_id: studentId,
        score_id: scoreId,
        times: times,
        exam_id: examId,
        type: skillType,
        score,
        answers: [
          {
            question_id: questionId,
            is_correct: true,
            explanation: feedback,
          },
        ],
      };
      console.log(submitForm);
      const result = await submitGradingApi(submitForm);
      if (result) {
        createSuccessModal({
          title: t('form.exam.gradingSkill', { skill: props.skillType }),
          content: t('common.saveSuccessfully'),
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
      console.log(result);
      completedAssignment.value = result.items;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }

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
      gradingFormData.value.score = 0;
      gradingFormData.value.feedback = '';
      clickTab(0);
    },
  );
</script>
