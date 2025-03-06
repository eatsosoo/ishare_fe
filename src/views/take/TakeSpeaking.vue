<template>
  <div>
    <Row :gutter="[16, 16]" class="h-[92vh] w-[100vw] border-t-1 border-gray-200">
      <Col :span="24">
        <div class="p-6 flex justify-center items-center h-full">
          <div
            class="min-h-[480px] rounded-md border-1 border-[#d4dae0] bg-[#f7dcdc] w-[1000px] text-center flex flex-col"
          >
            <div class="rounded-t-md bg-[#ebebeb] border-b-1 border-[#d4dae0] h-14 relative">
              <h1 class="text-2xl line-height-14">{{
                partIndex === null ? 'READY' : `PART ${partIndex + 1}`
              }}</h1>
              <div class="right-0 absolute mr-4 top-[10px]">
                <a-button
                  type="default"
                  preIcon="ant-design:caret-right-filled"
                  :disabled="uploading"
                  @click="actionRecord(textButton)"
                  >{{ transText[textButton] }}</a-button
                >
              </div>
            </div>

            <div class="flex-1 grid place-items-center">
              <div v-if="props.value.parts[partIndex]?.question_groups.length === questionIndex">
                <h2 class="font-bold text-3xl">IT'S THE END OF PART {{ partIndex + 1 }}</h2>
                <p>{{ uploading ? 'Uploading...' : 'Uploaded' }}</p>
              </div>
              <div v-else-if="questionCurrent" class="p-4">
                <div>
                  <h2 class="text-primary text-3xl font-bold">Question {{ questionIndex + 1 }}</h2>
                  <div
                    v-html="questionCurrent.question_text"
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
                </div></div
              >
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, h } from 'vue';
  import { GroupQuestionItem, SkillItem } from '../test/types/question';
  import { Col, Row } from 'ant-design-vue';
  import { uploadAudioApi } from '@/api/exam/exam';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';

  const props = defineProps({
    value: {
      type: Object as PropType<SkillItem>,
      default: () => {},
    },
  });

  const emit = defineEmits(['startRecording', 'stopRecording', 'submit']);

  const partIndex = ref<number | null>(null);
  const questionIndex = ref<number | null>(null);
  const questionCurrent = ref<GroupQuestionItem | null>(null);

  const isRecording = ref(false);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks = ref<Blob[]>([]);
  const audioUrl = ref<string | null>(null);
  const audioFile = ref<File | null>(null);
  const uploading = ref(false);
  const final = ref<string[]>([]);

  const textButton = computed(() => {
    if (partIndex.value === null && questionIndex.value === null) {
      return 'START_NOW';
    } else if (
      partIndex.value === props.value?.parts.length - 1 &&
      questionIndex.value === props.value?.parts[partIndex.value]?.question_groups.length
    ) {
      return 'FINISHED';
    } else if (
      partIndex.value !== null &&
      questionIndex.value === props.value?.parts[partIndex.value]?.question_groups.length
    ) {
      return 'NEXT_PART';
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

  const { createConfirm } = useMessage();
  const { t } = useI18n();

  const actionRecord = (actionType: string) => {
    if (actionType === 'START_NOW') {
      // startRecording();
      partIndex.value = 0;
      questionIndex.value = 0;
      questionCurrent.value =
        props.value?.parts[partIndex.value].question_groups[questionIndex.value];

      const time = props.value?.parts[partIndex.value].duration;
      emit('startRecording', time);
      startRecording(time);
    } else if (actionType === 'NEXT_PART') {
      const idx = partIndex.value + 1;
      const part = props.value?.parts[idx];
      if (!part) {
        return;
      }
      partIndex.value = idx;

      questionIndex.value = 0;
      questionCurrent.value = part.question_groups[questionIndex.value];

      const time = props.value?.parts[partIndex.value].duration;
      emit('startRecording', time);
      startRecording(time);
    } else if (actionType === 'FINISHED') {
      const submitData = props.value.parts.map((part, index) => ({
        part_id: part.id,
        part_answer: final.value[index],
      }));
      emit('submit', submitData);
    } else {
      const part = props.value?.parts[partIndex.value];
      if (questionIndex.value === part.question_groups.length - 1) {
        createConfirm({
          iconType: 'warning',
          title: () => h('span', t('sys.app.logoutTip')),
          content: () => h('span', t('sys.app.submitExam')),
          onOk: async () => {
            questionCurrent.value = null;
            emit('stopRecording');
            stopRecording();
            questionIndex.value++;
          },
        });
      } else {
        questionIndex.value++;
        questionCurrent.value = part.question_groups[questionIndex.value];
      }
    }
  };

  const startRecording = async (time = 15) => {
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
      setTimeout(stopRecording, time * 60 * 1000); // Tự động dừng sau 15 phút
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder.value) {
      mediaRecorder.value.stop();
      isRecording.value = false;
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
</script>
