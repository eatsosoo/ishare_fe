<template>
  <div>
    <Row :gutter="[16, 16]" class="h-[92vh] w-[100vw] border-t-1 border-gray-200">
      <Col :span="24">
        <div class="p-6 flex justify-center items-center h-full">
          <div
            class="min-h-[480px] rounded-md border-1 border-[#d4dae0] bg-[#f3f3f3] w-[1000px] text-center"
          >
            <div class="rounded-t-md bg-[#ebebeb] border-b-1 border-[#d4dae0] h-14 relative">
              <h1 class="text-2xl line-height-14">{{
                partIndex === null ? 'READY' : `PART ${partIndex + 1}`
              }}</h1>
              <div class="right-0 absolute mr-4 top-[10px]">
                <a-button
                  type="default"
                  preIcon="ant-design:caret-right-filled"
                  @click="actionRecord(textButton)"
                  >{{ textButton }}</a-button
                >
              </div>
            </div>
            <div class="p-4">
              <div v-if="questionCurrent">
                <h2 class="text-primary text-3xl font-bold">Question {{ questionIndex + 1 }}</h2>
                <div
                  v-html="questionCurrent.question_text"
                  class="text-3xl text-dark font-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <!-- <Col :span="12" class="border-gray border-l-2 h-full overflow-auto py-6">
        <div class="px-4">
          <div class="mb-2 flex items-center">
            <a-button class="mr-2" @click="startRecording" :disabled="isRecording"
              >Start Recording</a-button
            >
            <a-button class="mr-2" @click="stopRecording" :disabled="!isRecording"
              >Stop Recording</a-button
            >
            <p class="pt-3">{{ isRecording ? 'Recording' : '' }}</p>
          </div>
          <audio v-if="audioUrl" :src="audioUrl" controls class="h-8"></audio>
          <WaveRecorder />
        </div>
      </Col> -->
    </Row>
    <BasicModal v-bind="$attrs" @register="register" :title="'Confirm'" :canFullscreen="false"
      ><div class="text-dark text-3xl font-bold"
        >Bạn có muốn hoành thành phần thi trước thời hạn không?</div
      >
    </BasicModal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { GroupQuestionItem, SkillItem } from '../test/types/question';
  import { Col, Row } from 'ant-design-vue';
  import { uploadAudioApi } from '@/api/exam/exam';
  import WaveRecorder from '@/views/test/form-question/WaveRecorder.vue';
  import { BasicModal, useModal } from '@/components/Modal';

  const props = defineProps({
    value: {
      type: Object as PropType<SkillItem>,
      default: () => {},
    },
  });

  const [register, { openModal, closeModal }] = useModal();

  const partIndex = ref<number | null>(null);
  const questionIndex = ref<number | null>(null);
  const questionCurrent = ref<GroupQuestionItem | null>(null);

  const isRecording = ref(false);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks = ref<Blob[]>([]);
  const audioUrl = ref<string | null>(null);
  const audioFile = ref<File | null>(null);

  const final = ref<string>('');

  const textButton = computed(() => {
    if (partIndex.value === null && questionIndex.value === null) {
      return 'START NOW';
    } else if (partIndex.value !== null && questionIndex.value !== null) {
      return 'NEXT QUESTION';
    } else if (partIndex.value !== null && questionIndex.value === null) {
      return 'NEXT PART';
    }
    return '';
  });

  const actionRecord = (actionType: string) => {
    if (actionType === 'START NOW') {
      // startRecording();
      partIndex.value = 0;
      questionIndex.value = 0;
      questionCurrent.value =
        props.value?.parts[partIndex.value].question_groups[questionIndex.value];
    } else if (actionType === 'NEXT QUESTION') {
      if (questionIndex.value === props.value?.parts[partIndex.value].question_groups.length) {
        openModal();
        return;
      }
      questionCurrent.value =
        props.value?.parts[partIndex.value].question_groups[questionIndex.value];
      questionIndex.value++;
    } else if (actionType === 'NEXT PART') {
      partIndex.value++;
      questionIndex.value = 0;
      questionCurrent.value =
        props.value?.parts[partIndex.value].question_groups[questionIndex.value];
    }
  };

  const startRecording = async () => {
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
        console.log(audioFile.value, audioUrl.value);

        const speakingUrl = await uploadAudio();
        final.value = speakingUrl as string;
      };

      mediaRecorder.value.start();
      setTimeout(stopRecording, 15 * 60 * 1000); // Tự động dừng sau 15 phút
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
    console.log(audioFile.value);
    if (!audioFile.value) return;

    const formData = new FormData();
    formData.append('media', audioFile.value);

    try {
      const result = await uploadAudioApi(formData);
      if (result) {
        return result.items;
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
</script>
