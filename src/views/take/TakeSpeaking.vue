<template>
  <div>
    <Row :gutter="[16, 16]" class="h-[92vh] w-[100vw] border-t-1 border-gray-200">
      <Col :span="12" class="bg-[aliceblue] border-r-2 border-gray h-full overflow-auto">
        <div v-for="(question, index) in questions" :key="question.id || index" class="p-6">
          <h2 class="text-primary">Question {{ index + 1 }}</h2>
          <div v-html="question.question_text"></div>
        </div>
      </Col>
      <Col :span="12" class="border-gray border-l-2 h-full overflow-auto py-6">
        <div class="px-4">
          <!-- <div class="mb-2 flex items-center">
            <a-button class="mr-2" @click="startRecording" :disabled="isRecording"
              >Start Recording</a-button
            >
            <a-button class="mr-2" @click="stopRecording" :disabled="!isRecording"
              >Stop Recording</a-button
            >
            <p class="pt-3">{{ isRecording ? 'Recording' : '' }}</p>
          </div>
          <audio v-if="audioUrl" :src="audioUrl" controls class="h-8"></audio> -->
          <WaveRecorder />
          <!-- <a-button v-if="audioFile" @click="uploadAudio">Upload Audio</a-button> -->
        </div>
      </Col>
    </Row>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { GroupQuestionItem, SkillItem } from '../test/types/question';
  import { Col, Row } from 'ant-design-vue';
  import { uploadAudioApi } from '@/api/exam/exam';
  import WaveRecorder from '@/views/test/form-question/WaveRecorder.vue';

  const props = defineProps({
    value: {
      type: Object as PropType<SkillItem>,
      default: () => {},
    },
  });

  const questions = ref<GroupQuestionItem[]>(props.value.parts[0].question_groups);

  const isRecording = ref(false);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks = ref<Blob[]>([]);
  const audioUrl = ref<string | null>(null);
  const audioFile = ref<File | null>(null);

  const final = ref<string>('');

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
