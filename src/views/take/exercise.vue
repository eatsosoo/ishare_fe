<template>
  <div class="bg-white">
    <div
      class="flex justify-center items-center border-gray-200 border-b-1 border-b h-14"
      :class="isWarning ? 'blinking' : ''"
    >
      <div class="right-0 absolute mr-4">
        <a-button type="primary" preIcon="ant-design:send-outlined" @click="submit"
          >Submit</a-button
        >
      </div>
    </div>

    <div v-if="exerciseItem" ref="htmlContainer" class="custom-html">
      <template v-if="exerciseItem.skill === 'Reading' || exerciseItem.skill === 'Listening'">
        <audio
          v-if="exerciseItem.media"
          :src="exerciseItem.media"
          controls
          autoplay
          class="h-8 w-full"
          :key="exerciseItem.media"
        ></audio>
        <Row :gutter="[16, 16]" class="h-[88vh] w-[100vw]">
          <Col
            v-if="exerciseItem.skill === 'Reading'"
            :span="12"
            class="bg-[aliceblue] border-r-2 border-gray h-full overflow-auto"
          >
            <div class="p-4">
              <div>
                <div v-html="exerciseItem.subject"></div>
              </div>
            </div>
          </Col>
          <Col
            :span="exerciseItem.skill === 'Listening' ? 24 : 12"
            class="border-gray border-l-2 h-full overflow-auto p-4"
          >
            <div ref="htmlContainer">
              <div
                v-for="(group, gIdx) in exerciseItem.question_groups"
                :key="group.id || gIdx"
                class="px-4 mb-12"
              >
                <h2 class="text-primary font-bold"
                  >Questions
                  {{
                    group.question_no.length > 1
                      ? `${group.question_no[0]} - ${group.question_no.at(-1)}`
                      : group.question_no[0]
                  }}</h2
                >
                <div v-html="renderGroupQuestions(group, classStyle, studentAnswer)"></div>
              </div>
            </div>
          </Col>
        </Row>
        <div
          v-for="(group, gIdx) in exerciseItem.question_groups"
          :key="gIdx"
          class="flex items-center p-4 justify-center gap-2 absolute bottom-0 h-14 bg-white box-shadow border-t w-full border-gray-200"
        >
          <div
            v-for="q in group.question_no"
            :key="q"
            class="rounded-full h-8 w-8 border flex items-center justify-center border-gray-200"
          >
            {{ q }}
          </div>
        </div>
      </template>
      <template v-else-if="exerciseItem.skill === 'Writing'">
        <Row :gutter="[16, 16]" class="h-[88vh] w-[100vw] border-t-1 border-gray-200">
          <Col :span="12" class="bg-[aliceblue] border-r-2 border-gray h-full overflow-auto">
            <div class="p-6">
              <h2 class="text-primary">Writing Task {{ state.tabActive + 1 }}</h2>
              <div v-html="exerciseItem.question_groups[state.tabActive].question_text"></div>
            </div>
          </Col>
          <Col :span="12" class="border-gray border-l-2 h-full overflow-auto py-6">
            <div class="mx-4">
              <InputTextArea
                v-model:value="studentAnswer[`question_${state.tabActive + 1}`]"
                :rows="25"
                @paste.prevent
                placeholder="Type your essay here..."
              />
              <div class="mt-4">Word counts: {{ wordCount }}</div>
            </div>
          </Col>
        </Row>
        <div
          class="absolute bottom-0 bg-white box-shadow border-t w-full border-gray-200 border-t-1"
        >
          <div class="flex gap-4 py-2 px-2">
            <div
              v-for="(_, index) in exerciseItem.question_groups"
              :key="index"
              @click="state.tabActive = index"
              :class="
                state.tabActive === index
                  ? 'flex-1 border-[#e8202a]'
                  : 'flex-1 cursor-pointer border-gray'
              "
              class="border-1 py-4 px-6 rounded-xl"
            >
              <div class="text-xl font-semibold text-center">Task {{ index + 1 }}</div>
            </div>
          </div>
        </div>
      </template>
      <!-- SPEAKING -->
      <template v-else-if="exerciseItem.skill === 'Speaking'">
        <Row :gutter="[16, 16]" class="h-[92vh] w-[100vw] border-t-1 border-gray-200">
          <Col :span="24">
            <div class="p-6 flex justify-center items-center h-full">
              <div
                class="min-h-[480px] rounded-md border-1 border-[#d4dae0] bg-[#f7dcdc] w-[1000px] text-center flex flex-col"
              >
                <div class="rounded-t-md bg-[#ebebeb] border-b-1 border-[#d4dae0] h-14 relative">
                  <div class="right-0 absolute mr-4 top-[10px]">
                    <a-button
                      type="default"
                      preIcon="ant-design:caret-right-filled"
                      :disabled="state.loading"
                      @click="actionRecord(textButton)"
                      >{{ transText[textButton] }}</a-button
                    >
                  </div>
                </div>

                <div class="flex-1 grid place-items-center">
                  <template v-if="state.qIdx !== null">
                    <div v-if="exerciseItem.question_groups.length === state.qIdx">
                      <h2 class="font-bold text-3xl">IT'S THE END OF EXERCISE</h2>
                      <p>{{ state.loading ? 'Uploading...' : 'Uploaded' }}</p>
                    </div>
                    <div v-else-if="exerciseItem.question_groups[state.qIdx]" class="p-4">
                      <div>
                        <h2 class="text-primary text-3xl font-bold"
                          >Question {{ state.qIdx + 1 }}</h2
                        >
                        <div
                          v-html="exerciseItem.question_groups[state.qIdx].question_text"
                          class="text-3xl text-dark font-500"
                        ></div>
                      </div>
                      <div></div>
                      <div class="flex justify-center items-center mt-4">
                        <span class="relative flex h-3 w-3">
                          <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                          ></span>
                          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span class="ml-2">Recording...</span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <h2>Please check your microphone before starting.</h2>
                  </template>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { GroupQuestionItem } from '@/views/test/types/question';
  import { useRoute, useRouter } from 'vue-router';
  import { SkillType, SubmitAnswer, SubmitExam } from '@/api/exam/examModel';
  import { isString, toNumber } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoading } from '@/components/Loading';
  import { takeExerciseStudentApi } from '@/api/student/student';
  import { isArray } from '@/utils/is';
  import { TakeExerciseStudentItem } from '@/api/student/studentModel';
  import { Col, Input, Row } from 'ant-design-vue';
  import { renderGroupQuestions } from './helpers';
  import { exerciseSubmitApi } from '@/api/exercise/exercise';

  const route = useRoute();
  const router = useRouter();

  if (!route.query.id) {
    router.push('/dashboard');
  }

  const InputTextArea = Input.TextArea;

  const classStyle =
    'bg-white rounded-full text-center outline-red-400 outline-1 border-gray-300 border-1 p-1 shadow-md h-[32px]';

  const state = reactive({
    exerciseId: toNumber(route.query.id),
    type: route.query.type as SkillType,
    loading: false,
    tabActive: 0,
    qIdx: null as number | null,
  });
  const exerciseItem = ref<TakeExerciseStudentItem | null>(null);
  const htmlContainer = ref<any>(null);
  const studentAnswer = ref<{ [key: string]: string | string[] }>({});
  const submitForm = ref({
    type: '',
    answers: [],
  });

  // time left
  const isWarning = ref(false);

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [openFullLoading, closeFullLoading] = useLoading({
    tip: 'Loading...',
  });

  const wordCount = computed(() => {
    const text = studentAnswer.value[`question_${state.tabActive + 1}`];
    if (!isString(text)) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word).length;
  });

  const textButton = computed(() => {
    if (state.qIdx === null) {
      return 'START_NOW';
    } else if (state.qIdx === exerciseItem.value?.question_groups.length) {
      return 'FINISHED';
    } else {
      return 'NEXT_QUESTION';
    }
  });

  const transText = {
    START_NOW: 'Start Now',
    NEXT_PART: 'Next Part',
    NEXT_QUESTION: 'Next Question',
    FINISHED: 'Finished',
  };

  const actionRecord = (actionType: string) => {
    if (actionType === 'START_NOW') {
      state.qIdx = 0;
    } else if (actionType === 'FINISHED') {
      console.log('finish');
    } else {
      if (state.qIdx !== null) state.qIdx++;
    }
  };

  function generateAnswerObject(groups: GroupQuestionItem[]) {
    const answerObject = {};

    groups.forEach((group) => {
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
    console.log(answerObject);
    return answerObject;
  }

  async function getExerciseDetail(homeworkId: number) {
    try {
      openFullLoading();
      const result = await takeExerciseStudentApi(homeworkId);
      const data = result.items;
      exerciseItem.value = result.items;
      studentAnswer.value = generateAnswerObject(data.question_groups);
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
    console.log(values);
    studentAnswer.value = { ...studentAnswer.value, ...values };
  };

  const mapAnswersToParts = (
    questions: GroupQuestionItem[],
    answers: { [key: string]: string | string[] },
  ): SubmitAnswer[] => {
    return questions.map((group) => {
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
  };

  async function submit() {
    if (!exerciseItem.value) return;

    const { skill, id, question_groups } = exerciseItem.value;

    if (skill !== 'Speaking') {
      getInputValues();

      if (skill !== 'Writing' && Object.values(studentAnswer.value).some((value) => value === '')) {
        createMessage.error(t('common.error.finishAllQuestions'));
        return;
      }
    }

    console.log(studentAnswer.value);

    const finalAnswers: SubmitAnswer[] =
      skill === 'Writing'
        ? submitForm.value.answers
        : skill === 'Speaking'
          ? []
          : mapAnswersToParts(question_groups, studentAnswer.value);

    const formatData: SubmitExam = {
      exam_skill_id: id as number,
      type: state.type,
      answers: finalAnswers,
    };

    console.log(formatData);

    try {
      openFullLoading();
      const result = await exerciseSubmitApi(state.exerciseId, formatData);

      if (result?.items) {
        createMessage.success(t('common.submitTestSuccess'));
        router.push('/student/exam');
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      closeFullLoading();
    }
  }

  getExerciseDetail(state.exerciseId);
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
      opacity: 1;

      /* Đảm bảo không bị mờ */
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
      border-radius: 4px;

      /* 🛑 Vuông thay vì tròn */
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
