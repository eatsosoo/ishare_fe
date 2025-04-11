<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('common.preview')"
    :loading="state.loading"
    :default-fullscreen="true"
    :can-fullscreen="false"
    :show-ok-btn="false"
  >
    <div v-if="exerciseItem" ref="htmlContainer" class="custom-html overflow-hidden">
      <template
        v-if="
          exerciseItem.skill === 'Reading' ||
          exerciseItem.skill === 'Listening' ||
          exerciseItem.skill === 'Vocabulary'
        "
      >
        <div v-if="exerciseItem.media" class="p-4">
          <audio
            :src="exerciseItem.media"
            controls
            class="h-8 w-full"
            :key="exerciseItem.media"
          ></audio>
        </div>
        <Row :gutter="[16, 16]" class="h-full w-full">
          <Col
            v-if="exerciseItem.skill === 'Reading'"
            :span="12"
            class="border-r-2 border-gray h-full overflow-auto"
            :class="isDark ? '' : 'bg-[aliceblue]'"
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
      </template>
      <template v-else-if="exerciseItem.skill === 'Writing'">
        <Row :gutter="[16, 16]" class="h-[80vh] w-full border-t-1 border-gray-200">
          <Col :span="12" class="bg-[aliceblue] border-r-2 border-gray h-full overflow-auto">
            <div class="p-6">
              <h2 class="text-primary">Writing Task {{ state.tabWriting + 1 }}</h2>
              <div v-html="exerciseItem.question_groups[state.tabWriting].question_text"></div>
            </div>
          </Col>
          <Col :span="12" class="border-gray border-l-2 h-full overflow-auto py-6">
            <div class="mx-4">
              <InputTextArea
                v-model:value="studentAnswer[`question_${state.tabWriting + 1}`]"
                :rows="25"
                @paste.prevent
                placeholder="Type your essay here..."
              />
              <div class="mt-4">Word counts: {{ wordCount }}</div>
            </div>
          </Col>
        </Row>
        <div class="bg-white box-shadow border-t w-full border-gray-200 border-y-1">
          <div class="flex gap-4 py-2 px-2">
            <div
              v-for="(_, index) in exerciseItem.question_groups"
              :key="index"
              @click="state.tabWriting = index"
              :class="
                state.tabWriting === index
                  ? 'flex-1 border-[#e8202a]'
                  : 'flex-1 cursor-pointer border-gray'
              "
              class="border-1 py-1 px-6 rounded-xl"
            >
              <div class="text-xl font-semibold text-center">Task {{ index + 1 }}</div>
            </div>
          </div>
        </div>
      </template>
      <!-- SPEAKING -->
      <template v-else-if="exerciseItem.skill === 'Speaking'">
        <Row :gutter="[16, 16]" class="h-[80vh] w-full border-t-1 border-gray-200">
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

                      <h3>{{ t('common.test.plsClickBtnForSubmit') }}</h3>
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
                    <div>
                      <h2>Please check your microphone before starting.</h2>
                      <a-button type="primary" @click="requestMicrophoneAccess" class="my-4">
                        Allow Microphone
                      </a-button>
                      <p v-if="microphoneAccess !== null" class="font-500">
                        {{
                          microphoneAccess
                            ? 'Microphone has been enabled ✅'
                            : 'Microphone is blocked ❌'
                        }}
                      </p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </template>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, h, reactive, ref, watch } from 'vue';
  import { GroupQuestionItem } from '@/views/test/types/question';
  import { isString } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoading } from '@/components/Loading';
  import { TakeExerciseStudentItem } from '@/api/student/studentModel';
  import { Col, Input, Row } from 'ant-design-vue';
  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';
  import { renderGroupQuestions } from '../take/helpers';
  import { BasicModal } from '@/components/Modal';
  import { getExerciseApi } from '@/api/exercise/exercise';

  const props = defineProps({
    exerciseId: {
      type: [Number, null] as PropType<number | null>,
      default: null,
    },
  });

  const { isDark } = useDarkModeTheme();

  const InputTextArea = Input.TextArea;

  const classStyle =
    'bg-white rounded-full text-center outline-red-400 outline-1 border-gray-300 border-1 p-1 shadow-md h-[32px]';

  const state = reactive({
    loading: false,
    tabWriting: 0,
    qIdx: null as number | null,
  });
  const exerciseItem = ref<TakeExerciseStudentItem | null>(null);
  const htmlContainer = ref<any>(null);
  const studentAnswer = ref<{ [key: string]: string | string[] }>({});

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [openFullLoading, closeFullLoading] = useLoading({
    tip: 'Loading...',
  });

  const wordCount = computed(() => {
    const text = studentAnswer.value[`question_${state.tabWriting + 1}`];
    if (!isString(text)) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word).length;
  });

  const transText = {
    START_NOW: 'Start Now',
    NEXT_PART: 'Next Part',
    NEXT_QUESTION: 'Next Question',
    FINISHED: 'Finish',
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
    // console.log(answerObject);
    return answerObject;
  }

  async function getExerciseDetail(homeworkId: number) {
    try {
      openFullLoading();
      const result = await getExerciseApi(homeworkId);
      const data = result.items;
      exerciseItem.value = data;
      if (exerciseItem.value) {
        exerciseItem.value.question_groups = exerciseItem.value.question_groups.sort(
          (a, b) => a.group_no - b.group_no,
        );
      }
      studentAnswer.value = generateAnswerObject(data.question_groups);
    } catch (error) {
      createMessage.error(t('sys.app.dataNotFound'));
    } finally {
      closeFullLoading();
    }
  }

  const textButton = computed(() => {
    if (state.qIdx === null) {
      return 'START_NOW';
    } else if (state.qIdx === exerciseItem.value?.question_groups.length) {
      return 'FINISHED';
    } else {
      return 'NEXT_QUESTION';
    }
  });

  const actionRecord = async (actionType: string) => {
    if (!exerciseItem.value) return;

    if (actionType === 'START_NOW') {
      state.qIdx = 0;
    } else if (actionType === 'FINISHED') {
      // submitExercise();
    } else {
      if (state.qIdx === exerciseItem.value.question_groups.length - 1) {
        createConfirm({
          iconType: 'warning',
          title: () => h('span', t('sys.app.logoutTip')),
          content: () => h('span', t('sys.app.submitExam')),
          onOk: async () => {
            state.qIdx = exerciseItem.value.question_groups.length;
          },
        });
      } else {
        state.qIdx++;
      }
    }
  };

  const microphoneAccess = ref(false);

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneAccess.value = true;
    } catch (error) {
      microphoneAccess.value = false;
    }
  };

  watch(
    () => props.exerciseId,
    () => {
      if (props.exerciseId) {
        getExerciseDetail(props.exerciseId);
      }
    },
  );
</script>

<style lang="scss" scoped>
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
    height: 100%;
    overflow: hidden;

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
