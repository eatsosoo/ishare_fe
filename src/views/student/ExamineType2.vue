<template>
  <div class="audio-recorder">
    <Row :gutter="[16, 16]">
      <Col :span="12">
        <Card>
          <div>
            <div v-html="subjectRef"></div>
          </div>
        </Card>
      </Col>
      <Col :span="12">
        <Card>
          <div class="">
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
            <!-- <a-button v-if="audioFile" @click="uploadAudio">Upload Audio</a-button> -->
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { uploadAudioApi } from '@/api/exam/exam';
  import { ResponseExamPartItem } from '@/api/exam/examModel';
  import { Card, Col, Row } from 'ant-design-vue';

  const props = defineProps({
    value: {
      type: Array as PropType<ResponseExamPartItem[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['updateAnswer']);

  const isRecording = ref(false);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks = ref<Blob[]>([]);
  const audioUrl = ref<string | null>(null);
  const audioFile = ref<File | null>(null);

  const subjectRef = ref('');
  const final = ref<{ question_id: number; answer: string | string[] }[]>([]);

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
        final.value[0].answer = speakingUrl as string;
        console.log(final.value);
        emit('updateAnswer', final.value);
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

  watch(
    () => props.value,
    (value) => {
      console.log(value);
      subjectRef.value = value[0].subject;

      final.value = [
        {
          question_id: value[0].questions[0].id as number,
          answer: '',
        },
      ];
    },
  );
</script>
