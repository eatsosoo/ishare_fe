<template>
  <div class="bg-white">
    <div
      class="flex justify-center items-center border-gray-200 border-b-1 border-b h-14"
      :class="isWarning ? 'blinking' : ''"
    >
      <div class="text-primary text-4xl font-bold">
        <Icon size="30" icon="ant-design:field-time-outlined" color="black" /> {{ timeLeft }}
      </div>
      <div class="right-0 absolute mr-4">
        <a-button
          v-if="exerciseItem?.skill !== 'Speaking'"
          type="primary"
          preIcon="ant-design:send-outlined"
          @click="submitExercise()"
          >Submit</a-button
        >
      </div>
    </div>

    <div v-if="exerciseItem" ref="htmlContainer" class="custom-html">
      <template
        v-if="
          exerciseItem.skill === 'Reading' ||
          exerciseItem.skill === 'Listening' ||
          exerciseItem.skill === 'Vocabulary'
        "
      >
        <div class="p-4">
          <audio
            v-if="exerciseItem.media"
            :src="exerciseItem.media"
            controls
            class="h-8 w-full"
            :key="exerciseItem.media"
          ></audio>
        </div>
        <Row :gutter="[16, 16]" class="h-[88vh] w-[100vw]">
          <Col
            v-if="exerciseItem.skill === 'Reading'"
            :span="8"
            class="border-r-2 border-gray h-full overflow-auto"
            :class="isDark ? '' : 'bg-[aliceblue]'"
          >
            <div class="p-4">
              <div>
                <div ref="content" v-html="htmlSubject"></div>
              </div>
            </div>

            <!-- Popup lựa chọn: highlight / note -->
            <div
              v-if="showActions"
              :style="{ top: popupY + 'px', left: popupX + 'px' }"
              class="absolute bg-white border rounded shadow-md z-50"
            >
              <button
                @click="highlightSelection"
                class="mr-2 rounded hover:bg-red hover:opacity-90 cursor-pointer hover:underline m-2 mb-0"
                >Highlight</button
              >
              <button
                @click="startNote"
                class="rounded hover:bg-red hover:opacity-90 cursor-pointer hover:underline m-2"
                >Note</button
              >
            </div>

            <!-- Popup nhập ghi chú -->
            <div
              v-if="showNotePopup"
              class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
            >
              <div class="bg-white p-4 rounded shadow-lg w-80">
                <textarea
                  v-model="noteText"
                  class="w-full h-24 p-2 border mb-2 outline-blueGray border-gray-200 rounded-md"
                  placeholder="..."
                ></textarea>
                <div class="text-right">
                  <a-button @click="saveNote" class="mr-2">{{ t('common.saveText') }}</a-button>
                  <a-button @click="cancelNote">{{ t('common.cancelText') }}</a-button>
                </div>
              </div>
            </div>
          </Col>
          <Col
            :span="exerciseItem.skill === 'Listening' ? 24 : 8"
            class="border-gray border-l-2 h-full overflow-auto p-4"
          >
            <div>
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
          <Col
            v-if="exerciseItem.skill === 'Reading'"
            :span="8"
            class="border-gray border-l-2 h-full overflow-auto p-4"
          >
            <div class="mb-4">
              <Input v-model:value="searchKeyword" class="w-50" placeholder="Search..." />
            </div>
            <div>
              <div v-for="(note, index) in fillterdNotes" :key="index" class="mb-4">
                <div
                  class="border-gray-300 border p-2 border-b-0 flex items-center justify-between"
                >
                  <span class="underline text-[#DD1804]">{{ note.text }}</span>
                  <Icon icon="ion:close" @click="deleteNote(note.id)" />
                </div>
                <div class="border-gray-300 border p-2">{{ note.note }}</div>
              </div>
            </div>
          </Col>
        </Row>
        <!-- <div
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
        </div> -->
      </template>
      <template v-else-if="exerciseItem.skill === 'Writing'">
        <Row :gutter="[16, 16]" class="h-[88vh] w-[100vw] border-t-1 border-gray-200">
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
        <div
          class="absolute bottom-0 bg-white box-shadow border-t w-full border-gray-200 border-t-1"
        >
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
                  <div class="right-0 absolute mr-4 top-[10px] flex items-center">
                    <div v-if="isRecording" class="flex justify-center items-center mr-4">
                      <span class="relative flex h-3 w-3">
                        <span
                          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                        ></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span class="ml-2">Recording...</span>
                    </div>
                    <a-button
                      v-if="microphoneAccess"
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
                      <p
                        class="font-500 shadow-md p-2 rounded-md"
                        :class="uploading ? 'bg-amber' : 'bg-green'"
                        >{{ uploading ? 'Uploading record...' : 'Uploaded record' }}</p
                      >
                      <h3>{{ t('common.test.plsClickBtnForSubmit') }}</h3>
                    </div>
                    <div v-else-if="exerciseItem.question_groups[state.qIdx]" class="p-4">
                      <div>
                        <h2 class="text-primary text-2xl font-bold"
                          >Question {{ state.qIdx + 1 }}</h2
                        >
                        <div
                          v-html="exerciseItem.question_groups[state.qIdx].question_text"
                          class="text-dark"
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
                    <Card>
                      <p class="font-500 text-md text-red-500"
                        >Please check your microphone before starting. If not, please press the
                        button.</p
                      >
                      <a-button @click="requestMicrophoneAccess" class="my-4" type="primary">
                        Allow Microphone
                      </a-button>
                      <p v-if="microphoneAccess !== null" class="font-500 text-md">
                        {{
                          microphoneAccess
                            ? 'Microphone has been enabled'
                            : 'Microphone is blocked'
                        }}<Icon
                          size="20"
                          class="ml-2"
                          :icon="
                            microphoneAccess
                              ? 'ant-design:audio-filled'
                              : 'ant-design:audio-muted-outlined'
                          "
                        />
                      </p>
                    </Card>
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
  import {
    computed,
    h,
    nextTick,
    onBeforeUnmount,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
  } from 'vue';
  import { GroupQuestionItem } from '@/views/test/types/question';
  import { useRoute, useRouter } from 'vue-router';
  import { SkillType, SubmitAnswer } from '@/api/exam/examModel';
  import { isString, toNumber } from 'lodash-es';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoading } from '@/components/Loading';
  import { isArray } from '@/utils/is';
  import { TakeExerciseStudentItem } from '@/api/student/studentModel';
  import { Card, Col, Input, Row } from 'ant-design-vue';
  import { renderGroupQuestions } from './helpers';
  import { exerciseSubmitApi, getExerciseApi } from '@/api/exercise/exercise';
  import { SpeakingExeAnswer, SubmitExerciseParams } from '@/api/exercise/exerciseModel';
  import { uploadAudioApi } from '@/api/exam/exam';
  import Icon from '@/components/Icon/Icon.vue';
  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';
  import { nanoid } from 'nanoid';

  const route = useRoute();
  const router = useRouter();
  const { isDark } = useDarkModeTheme();
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
    tabWriting: 0,
    qIdx: null as number | null,
  });
  const exerciseItem = ref<TakeExerciseStudentItem | null>(null);
  const htmlContainer = ref<any>(null);
  const studentAnswer = ref<{ [key: string]: string | string[] }>({});
  let observer: MutationObserver | null = null;

  // recording
  const isRecording = ref(false);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks = ref<Blob[]>([]);
  const audioUrl = ref<string | null>(null);
  const audioFile = ref<File | null>(null);
  const uploading = ref(false);
  const final = ref<string[]>([]);

  // time left
  const timeLeft = ref('');
  const duration = ref(0);
  const isWarning = ref(false);
  let interval: TimeoutHandle | null = null;

  // highlight and note
  const content = ref<any>(null);
  const showActions = ref<Boolean>(false);
  const popupX = ref(0);
  const popupY = ref(0);
  let selectedRange: any = null;

  const showNotePopup = ref<Boolean>(false);
  const noteText = ref<string>('');
  const selectedText = ref<string>('');
  const notes = ref<{ id: string; text: string; note: string }[]>([]);
  const searchKeyword = ref<string>('');
  localStorage.setItem('notes', '');

  const htmlSubject = ref<string>('');

  const fillterdNotes = computed(() => {
    if (!searchKeyword.value.trim()) return notes.value;
    return notes.value.filter(
      (note) =>
        note.note.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        note.text.toLowerCase().includes(searchKeyword.value.toLowerCase()),
    );
  });
  //-- END

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

    return answerObject;
  }

  async function getExerciseDetail(homeworkId: number) {
    try {
      openFullLoading();
      const result = await getExerciseApi(homeworkId);
      const data = result.items;
      exerciseItem.value = data;
      studentAnswer.value = generateAnswerObject(data.question_groups);
      htmlSubject.value = exerciseItem.value.subject;

      if (data.skill !== 'Speaking') {
        // Load progress on page load
        loadProgress();
        const localValue = localStorage.getItem(LOCAL_STORAGE_KEY);
        const timeLeft = !localValue ? data.duration * 60 : JSON.parse(localValue).remainingTime;
        startCountdown(timeLeft);
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

  async function submitExercise(passValidate = false) {
    if (!exerciseItem.value) return;

    const { skill, id, question_groups } = exerciseItem.value;

    if (skill !== 'Speaking') {
      getInputValues();

      if (
        skill !== 'Writing' &&
        Object.values(studentAnswer.value).some((value) => value === '') &&
        !passValidate
      ) {
        createMessage.error(t('common.error.finishAllQuestions'));
        return;
      }
    }

    const finalAnswers: SubmitAnswer[] | SpeakingExeAnswer[] =
      skill === 'Speaking'
        ? [
            {
              part_id: null,
              part_answer: final.value[0],
              question_group_ids: question_groups.map((item) => item.id),
            },
          ]
        : mapAnswersToParts(question_groups, studentAnswer.value);

    const formatData: SubmitExerciseParams = {
      type: skill,
      answers: finalAnswers,
    };

    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      openFullLoading();
      const result = await exerciseSubmitApi(id, formatData);

      if (result && result.items) {
        createMessage.success(t('common.submitTestSuccess'));
        router.push('/student/homework');
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      closeFullLoading();
    }
  }

  const startRecording = async (time) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.value = new MediaRecorder(stream);
      isRecording.value = true;

      mediaRecorder.value.ondataavailable = (event) => {
        audioChunks.value.push(event.data);
      };

      mediaRecorder.value.onstop = async () => {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
        audioUrl.value = URL.createObjectURL(audioBlob);
        audioFile.value = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

        const speakingUrl = await uploadAudio();
        final.value.push(speakingUrl as string);
      };

      mediaRecorder.value.start();
      setTimeout(stopRecording, time * 60 * 1000 + 3000); // Tự động dừng sau 15 phút, + 3000 (delay 3000 upload)
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder.value) {
      mediaRecorder.value.stop();
      isRecording.value = false;
      state.qIdx = exerciseItem.value.question_groups.length;
    }
  };

  const uploadAudio = async () => {
    if (!audioFile.value) return;

    const formData = new FormData();
    formData.append('media', audioFile.value);

    try {
      uploading.value = true;
      const result = await uploadAudioApi(formData);
      if (result) {
        return result.items;
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      uploading.value = false;
    }
  };

  const textButton = computed(() => {
    if (state.qIdx === null) {
      return 'START_NOW';
    } else if (state.qIdx === exerciseItem.value?.question_groups.length) {
      stopRecording();
      return 'FINISHED';
    } else {
      return 'NEXT_QUESTION';
    }
  });

  const actionRecord = async (actionType: string) => {
    if (!exerciseItem.value) return;

    if (actionType === 'START_NOW') {
      state.qIdx = 0;
      const timeLimit = exerciseItem.value.duration;
      const questionDuration = exerciseItem.value.question_groups[state.qIdx].question_duration;
      startCountdown(questionDuration * 60);
      startRecording(timeLimit);
    } else if (actionType === 'FINISHED') {
      submitExercise();
    } else {
      if (state.qIdx === exerciseItem.value.question_groups.length - 1) {
        createConfirm({
          iconType: 'warning',
          title: () => h('span', t('sys.app.logoutTip')),
          content: () => h('span', t('sys.app.submitExam')),
          onOk: async () => {
            stopRecording();
            stopTimer();
            state.qIdx = exerciseItem.value.question_groups.length;
          },
        });
      } else {
        state.qIdx++;
        if (
          exerciseItem.value?.skill === 'Speaking' &&
          exerciseItem.value.question_groups[state.qIdx]
        ) {
          const questionDuration = exerciseItem.value.question_groups[state.qIdx].question_duration;
          startCountdown(questionDuration * 60);
        }
      }
    }
  };

  // COUNT DOWN
  function startCountdown(time: number) {
    duration.value = time;
    if (interval) clearInterval(interval); // Xóa interval cũ nếu có

    interval = setInterval(() => {
      if (duration.value < 0) {
        clearInterval(interval!);
        if (
          exerciseItem.value?.skill === 'Speaking' &&
          state.qIdx < exerciseItem.value?.question_groups.length
        ) {
          actionRecord('NEXT_QUESTION');
        }
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

  const microphoneAccess = ref<Boolean | null>(null); // Use `null` to indicate uninitialized state

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneAccess.value = true;
      createMessage.success('Microphone access granted ✅');
    } catch (error) {
      microphoneAccess.value = false;
      createMessage.error('Microphone access denied ❌. Please check your browser settings.');
    }
  };

  const LOCAL_STORAGE_KEY = `exercise_${state.exerciseId}`;

  function saveProgress() {
    const progress = {
      exerciseId: state.exerciseId,
      answers: studentAnswer.value,
      remainingTime: duration.value,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  }

  function loadProgress() {
    const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedProgress) {
      const { exerciseId, answers, remainingTime } = JSON.parse(savedProgress);
      if (exerciseId === state.exerciseId) {
        studentAnswer.value = answers || {};
        duration.value = remainingTime || 0;
      }
    }
  }

  // Hàm xử lý sự kiện change
  function handleInputChange(event) {
    const target = event.target;

    if (target.name && target.value) {
      // Cập nhật đáp án vào studentAnswer
      studentAnswer.value = {
        ...studentAnswer.value,
        [target.name]: target.value,
      };
    }
  }

  // Gắn sự kiện change vào các input bên trong v-html
  function attachChangeEvent() {
    if (!htmlContainer.value) {
      return;
    }

    const inputs = htmlContainer.value.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      input.addEventListener('change', handleInputChange);
    });
  }

  // Xóa sự kiện change khi cần (tránh rò rỉ bộ nhớ)
  function detachChangeEvent() {
    if (!htmlContainer.value) return;

    const inputs = htmlContainer.value.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      input.removeEventListener('change', handleInputChange);
    });
  }

  // Theo dõi thay đổi trong DOM bằng MutationObserver
  function observeDomChanges() {
    if (!htmlContainer.value) return;

    observer = new MutationObserver(() => {
      detachChangeEvent(); // Xóa sự kiện cũ
      attachChangeEvent(); // Gắn lại sự kiện mới
    });

    observer.observe(htmlContainer.value, {
      childList: true, // Theo dõi thay đổi trong các phần tử con
      subtree: true, // Theo dõi toàn bộ cây DOM bên trong
    });
  }

  // Dừng theo dõi DOM khi component bị hủy
  function disconnectObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Save progress whenever answers or duration change
  watch(() => studentAnswer.value, saveProgress, { deep: true });

  watch(() => duration.value, saveProgress);

  getExerciseDetail(state.exerciseId);

  watch(
    () => duration.value,
    (val) => {
      if (val < 0) {
        isWarning.value = false;
        if (exerciseItem.value?.skill !== 'Speaking') {
          let countdown = 3;
          const countdownInterval = setInterval(() => {
            if (countdown > 0) {
              createMessage.loading(`Nộp bài sau ${countdown}s`);
              countdown--;
            } else {
              clearInterval(countdownInterval);
              submitExercise(true);
            }
          }, 1000);
        }
      }
    },
  );

  // Gắn sự kiện và theo dõi DOM khi component được mount
  onMounted(() => {
    watch(
      () => exerciseItem.value,
      async () => {
        await nextTick(); // Đợi DOM cập nhật
        attachChangeEvent();
        observeDomChanges();
      },
      { immediate: true },
    );

    content.value?.addEventListener('mouseup', handleMouseUp);
  });

  // Dọn dẹp khi component bị hủy
  onUnmounted(() => {
    detachChangeEvent();
    disconnectObserver();
  });

  function handleMouseUp() {
    const selection = window.getSelection();
    if (!selection) return;

    const text = selection.toString().trim();

    if (text.length > 0) {
      selectedRange = selection.getRangeAt(0).cloneRange();
      selectedText.value = text;

      const rect = selectedRange.getBoundingClientRect();
      popupX.value = rect.left + window.scrollX;
      popupY.value = rect.top + window.scrollY - 40; // hiển thị phía trên
      showActions.value = true;
    } else {
      showActions.value = false;
    }
  }

  function updateHTML() {
    htmlSubject.value[state.tabActive].subject = content.value?.innerHTML;
  }

  function highlightSelection() {
    if (!selectedRange) return;

    const span = document.createElement('span');
    span.style.backgroundColor = 'yellow';
    span.textContent = selectedRange.toString();

    selectedRange.deleteContents();
    selectedRange.insertNode(span);

    updateHTML();

    showActions.value = false;
  }

  function startNote() {
    showNotePopup.value = true;
    showActions.value = false;
  }

  function saveNote() {
    const id = 'note-' + nanoid();
    const selected = selectedRange.toString();
    const span = document.createElement('span');
    span.textContent = selected;
    span.style.textDecoration = 'underline';
    span.style.fontWeight = '600';
    span.style.color = '#DD1804';
    span.setAttribute('data-note-id', id);
    span.setAttribute('id', id);

    selectedRange.deleteContents();
    selectedRange.insertNode(span);

    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    savedNotes.push({ id, text: selected, note: noteText.value });
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    notes.value = savedNotes;

    noteText.value = '';
    selectedText.value = '';
    showNotePopup.value = false;

    updateHTML();
  }

  function cancelNote() {
    noteText.value = '';
    selectedText.value = '';
    showNotePopup.value = false;
  }

  function deleteNote(id: string) {
    const el = document.getElementById(id);
    if (el && el.textContent) {
      const parent = el.parentNode;
      const textNode = document.createTextNode(el.textContent);
      parent && parent.replaceChild(textNode, el);
    }

    // Xoá khỏi localStorage
    const updatedNotes = notes.value.filter((n) => n.id !== id);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    notes.value = updatedNotes;

    updateHTML();
  }

  onBeforeUnmount(() => {
    content.value?.removeEventListener('mouseup', handleMouseUp);
  });
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
