<template>
  <div class="wave-recorder">
    <a-button @click="startRecording" v-if="!isRecording">🎤 Bắt đầu ghi âm</a-button>
    <a-button @click="stopRecording" v-else>🛑 Dừng ghi âm</a-button>
    <div ref="waveform" class="waveform"></div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import WaveSurfer from 'wavesurfer.js';

  const waveform = ref(null);
  const wavesurfer = ref(null);
  const isRecording = ref(false);
  const mediaRecorder = ref(null);
  const audioChunks = ref([]);

  onMounted(() => {
    wavesurfer.value = WaveSurfer.create({
      container: waveform.value,
      waveColor: 'gray',
      progressColor: 'red',
      cursorColor: 'blue',
      barWidth: 2,
      height: 100,
      responsive: true,
    });
  });

  const startRecording = async () => {
    isRecording.value = true;
    audioChunks.value = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data);
    };

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      wavesurfer.value.load(audioUrl);
    };

    mediaRecorder.value.start();
  };

  const stopRecording = () => {
    isRecording.value = false;
    mediaRecorder.value.stop();
  };

  onBeforeUnmount(() => {
    if (wavesurfer.value) {
      wavesurfer.value.destroy();
    }
  });
</script>

<style scoped>
  .wave-recorder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .waveform {
    width: 100%;
    max-width: 500px;
    height: 100px;
    border: 1px solid #ddd;
  }
</style>
