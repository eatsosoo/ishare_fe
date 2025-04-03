<template>
  <div class="bg-white">
    <div
      class="flex justify-center items-center border-gray-200 border-b-1 border-b h-14"
      :class="isWarning ? 'blinking' : ''"
    >
      <div class="text-primary text-4xl font-bold"
        ><Icon size="30" icon="ant-design:field-time-outlined" color="black" /> {{ timeLeft }}</div
      >
      <div v-if="skillExam?.type !== 'Speaking'" class="right-0 absolute mr-4">
        <a-button type="primary" preIcon="ant-design:send-outlined" @click="submitExam()"
          >Submit</a-button
        >
      </div>
    </div>

    <div ref="htmlContainer" class="custom-html">
      <template v-if="state.type === 'Reading'">
        <TakeReading
          v-if="skillExam"
          :value="skillExam"
          :answers="studentAnswer"
          @sync="getInputValues"
        />
      </template>
      <template v-else-if="state.type === 'Listening'">
        <TakeListening
          v-if="skillExam"
          :value="skillExam"
          :answers="studentAnswer"
          @sync="getInputValues"
        />
      </template>
      <template v-else-if="state.type === 'Writing'">
        <TakeWriting v-if="skillExam" :value="skillExam" @change="submitForm = $event" />
      </template>
      <template v-else-if="state.type === 'Speaking'">
        <TakeSpeaking
          v-if="skillExam"
          :value="skillExam"
          @start-recording="startCountdown"
          @stop-recording="stopTimer"
          @submit="submitExam"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import { NewPartItem, SkillItem } from '@/views/test/types/question';
  import { useRoute, useRouter } from 'vue-router';
  import { SkillType, SubmitAnswer, SubmitExam } from '@/api/exam/examModel';
  import { toNumber } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoading } from '@/components/Loading';
  import TakeReading from './TakeReading.vue';
  import TakeListening from './TakeListening.vue';
  import TakeWriting from './TakeWriting.vue';
  import TakeSpeaking from './TakeSpeaking.vue';
  import { takeExamStudentApi } from '@/api/student/student';
  import { examSubmitApi } from '@/api/exam/exam';
  import { isArray } from '@/utils/is';
  import Icon from '@/components/Icon/Icon.vue';

  const route = useRoute();
  const router = useRouter();

  if (!route.query.id || !route.query.type) {
    router.push('/dashboard');
  }

  const state = reactive({
    examId: toNumber(route.query.id),
    type: route.query.type as SkillType,
    tabActive: 0,
    loading: false,
  });
  const skillExam = ref<SkillItem | null>(null);
  const htmlContainer = ref<any>(null);
  const studentAnswer = ref<{ [key: string]: string | string[] }>({});
  const submitForm = ref({
    type: '',
    answers: [],
  });

  // time left
  const timeLeft = ref('');
  const duration = ref(0);
  const isWarning = ref(false);
  let interval: TimeoutHandle | null = null;

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [openFullLoading, closeFullLoading] = useLoading({
    tip: 'Loading...',
  });

  function startCountdown(time: number) {
    duration.value = time * 60;
    isWarning.value = false;

    if (interval) clearInterval(interval); // Xóa interval cũ nếu có

    interval = setInterval(() => {
      if (duration.value < 0) {
        clearInterval(interval!);
        return;
      }
      if (duration.value <= 60) {
        isWarning.value = true;
      }

      const minutes = Math.floor(duration.value / 60);
      const seconds = duration.value % 60;
      timeLeft.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      duration.value--;
    }, 1000);
  }

  function stopTimer() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }

  function generateAnswerObject(parts: NewPartItem[]) {
    const answerObject = {};

    parts.forEach((part) => {
      part.question_groups.forEach((group) => {
        if (group.question_type === 'multiple_choice') {
          // Gộp các số thành key duy nhất
          const key = `question_${group.question_no.join('_')}`;
          answerObject[key] = '';
        } else {
          // Tạo key bình thường
          group.question_no.forEach((no) => {
            const key = `question_${no}`;
            answerObject[key] = '';
          });
        }
      });
    });

    return answerObject;
  }

  async function getExamDetail(examId: number, type: SkillType) {
    try {
      openFullLoading();
      const result = await takeExamStudentApi(examId, type);
      skillExam.value = result.items;
      studentAnswer.value = generateAnswerObject(skillExam.value.parts);
      if (state.type !== 'Speaking') {
        startCountdown(skillExam.value.duration);
      }
    } catch (error) {
      createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      closeFullLoading();
    }
  }

  const getInputValues = () => {
    if (!htmlContainer.value) return;

    const inputs = htmlContainer.value.querySelectorAll(
      'input[name^="question_"], select[name^="question_"]',
    );

    const values: { [key: string]: string | string[] } = {};

    inputs.forEach((input) => {
      const name = input.getAttribute('name') || '';

      if (input.type === 'radio') {
        if ((input as HTMLInputElement).checked) {
          values[name] = (input as HTMLInputElement).value;
        }
      } else if (input.type === 'checkbox') {
        if ((input as HTMLInputElement).checked) {
          values[name] = values[name]
            ? [...(values[name] as string[]), input.value]
            : [input.value];
        }
      } else {
        values[name] = (input as HTMLInputElement | HTMLSelectElement).value;
      }
    });

    studentAnswer.value = { ...studentAnswer.value, ...values };
  };

  const mapAnswersToParts = (
    parts: NewPartItem[],
    answers: { [key: string]: string | string[] },
  ): SubmitAnswer[] => {
    return parts
      .map((part) => {
        return part.question_groups.map((group) => {
          const question_answer = {};

          group.question_no.forEach((no) => {
            const key =
              group.question_type === 'multiple_choice'
                ? `question_${group.question_no.join('_')}`
                : `question_${no}`;
            question_answer[key] =
              group.question_type === 'multiple_choice' && isArray(answers[key])
                ? answers[key].join(',')
                : answers[key];
          });

          const val: SubmitAnswer = {
            id: group.id as number,
            question_count: group.question_no.length,
            question_answer,
          };
          return val;
        });
      })
      .flat();
  };

  async function submitExam(submitData?: any) {
    if (!skillExam.value) return;

    if (!submitData) {
      getInputValues();

      const hasEmptyValue = (obj: Record<string, any>): boolean => {
        if (state.type === 'Writing' || state.type === 'Speaking') return false;
        return Object.values(obj).some((value) => value === '');
      };

      if (hasEmptyValue(studentAnswer.value) && duration.value > 0) {
        createMessage.error(t('common.error.finishAllQuestions'));
        return;
      }
    }

    let finalAnswers: SubmitAnswer[] = [];
    if (state.type === 'Writing') {
      finalAnswers = submitForm.value.answers;
    } else if (state.type === 'Speaking') {
      finalAnswers = submitData;
    } else {
      finalAnswers = mapAnswersToParts(skillExam.value.parts, studentAnswer.value);
    }

    const formatData: SubmitExam = {
      exam_skill_id: skillExam.value.id as number,
      type: state.type,
      answers: finalAnswers,
    };
    console.log(formatData);
    try {
      openFullLoading();
      const result = await examSubmitApi(state.examId, formatData);
      if (result && result.items) {
        createMessage.success(t('common.submitTestSuccess'));
        router.push('/student/exam');
      }
    } catch (error) {
      console.log(error);
      // createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      closeFullLoading();
    }
  }

  watch(
    () => duration.value,
    (val) => {
      if (val < 0) {
        console.log(val);
        isWarning.value = false;
        // timeLeft.value = '0:00';
        if (skillExam.value?.type !== 'Speaking') {
          let countdown = 3;
          const countdownInterval = setInterval(() => {
            if (countdown > 0) {
              createMessage.loading(`Nộp bài sau ${countdown}s`);
              countdown--;
            } else {
              clearInterval(countdownInterval);
              submitExam();
            }
          }, 1000);
        }
      }
    },
  );

  getExamDetail(state.examId, state.type);
</script>

<style lang="scss">
  @keyframes blinking-bg {
    0% {
      background-color: rgb(240 169 169);
    }

    50% {
      background-color: white;
    }

    100% {
      background-color: rgb(240 169 169);
    }
  }

  .blinking {
    animation: blinking-bg 2s infinite;
  }

  .custom-html {
    table {
      width: 100%;
      border-collapse: collapse;
    }

    table,
    th,
    td {
      border: 1px solid black;
    }

    th,
    td {
      padding: 8px;
      text-align: left;
    }

    /* ======= 📌 Custom Radio & Checkbox ======= */
    .custom-input {
      display: flex;
      align-items: center;
      font-size: 16px;
      cursor: pointer;
      gap: 10px;
    }

    .custom-text-input::placeholder {
      opacity: 1; /* Đảm bảo không bị mờ */
      color: #e8202a;
      font-size: 18px;
      font-weight: bold;
    }

    .custom-select-input {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Ẩn input mặc định */
    .custom-input input {
      display: none;
    }

    /* 🎯 Radio Style */
    .custom-radio .checkmark {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
      border: 1px solid gray;
      border-radius: 50%;
    }

    /* Khi radio được chọn */
    .custom-radio input:checked + .checkmark::before {
      content: '';
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #e8202a;
    }

    /* 🔲 Checkbox Style */
    .custom-checkbox .checkmark {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: all 0.3s ease;
      border: 1px solid gray;
      border-radius: 4px; /* 🛑 Vuông thay vì tròn */
    }

    /* Khi checkbox được chọn -> Thêm dấu tick */
    .custom-checkbox input:checked + .checkmark::before {
      content: '✔';
      color: white;
      font-size: 14px;
      font-weight: bold;
    }

    .custom-checkbox input:checked + .checkmark {
      border-color: #e8202a;
      background: #e8202a;
    }
  }
</style>
