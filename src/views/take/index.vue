<template>
  <div class="bg-white">
    <div class="bg-white p-4 flex justify-between border-gray-200 border-b-1 border-b">
      <a-button type="primary" ghost>{{ timeLeft }}</a-button>
      <a-button type="primary" @click="submitExam">Submit</a-button>
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
        <TakeListening v-if="skillExam" :value="skillExam" />
      </template>
      <template v-else-if="state.type === 'Writing'">
        <TakeWriting v-if="skillExam" :value="skillExam" />
      </template>
      <template v-else-if="state.type === 'Speaking'">
        <TakeSpeaking v-if="skillExam" :value="skillExam" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { NewPartItem, SkillItem } from '@/views/test/types/question';
  import { useRoute, useRouter } from 'vue-router';
  import { SkillType } from '@/api/exam/examModel';
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

  // time left
  const timeLeft = ref('');
  const duration = ref(0);
  let interval: number | null = null;

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [openFullLoading, closeFullLoading] = useLoading({
    tip: 'Loading...',
  });

  function startCountdown() {
    if (interval) clearInterval(interval); // Xóa interval cũ nếu có

    interval = setInterval(() => {
      if (duration.value <= 0) {
        clearInterval(interval!);
        return;
      }

      const minutes = Math.floor(duration.value / 60);
      const seconds = duration.value % 60;
      timeLeft.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      duration.value--;
    }, 1000);
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
      duration.value = skillExam.value.duration * 60;
      studentAnswer.value = generateAnswerObject(skillExam.value.parts);
      startCountdown();
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
    console.log(studentAnswer.value);
  };

  const mapAnswersToParts = (
    parts: NewPartItem[],
    answers: { [key: string]: string | string[] },
  ) => {
    console.log(answers);
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

          return {
            id: group.id,
            question_count: group.question_no.length,
            question_answer,
          };
        });
      })
      .flat();
  };

  async function submitExam() {
    getInputValues();
    const formatData = {
      type: state.type,
      answers: mapAnswersToParts(skillExam.value?.parts, studentAnswer.value),
    };
    console.log(formatData);

    try {
      openFullLoading();
      const result = await examSubmitApi(state.examId, formatData);
      if (result) {
        createMessage.success('Nộp bài thành công');
      }
    } catch (error) {
      console.log(error);
      createMessage.warning('Bạn cần hoàn thành hết câu hỏi!');

      // createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      closeFullLoading();
    }
  }

  getExamDetail(state.examId, state.type);
</script>

<style lang="scss">
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
