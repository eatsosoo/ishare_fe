<template>
  <div class="audio-player bg-red-500 rounded-xl border border-red-500 p-2 shadow-lg w-full">
    <div class="flex items-center justify-between">
      <div>
        <button class="text-white p-2 rounded-md" @click="togglePlay">
          <span v-if="!isPlaying">▶️</span>
          <span v-else>⏸️</span>
        </button>
      </div>
      <div class="flex-1 mx-4">
        <input
          type="range"
          class="w-full"
          min="0"
          :max="duration"
          step="0.1"
          v-model="currentTime"
          @input="seek"
        />
      </div>
      <div
        class="flex items-center rounded-md mr-2"
        @mouseenter="showVolume = true"
        @mouseleave="showVolume = false"
      >
        <transition name="slide">
          <input
            v-show="showVolume"
            type="range"
            class="w-14 ml-2"
            min="0"
            max="1"
            step="0.01"
            v-model="volume"
            @input="adjustVolume"
          />
        </transition>
        <div class="p-2 rounded-md hover:cursor-pointer">🔉</div>
      </div>
      <div>
        <span class="text-sm text-white font-medium">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </span>
      </div>
    </div>
    <!-- <div class="flex items-center justify-between mt-2">
      <button class="text-white p-2 rounded-md" @click="decreaseVolume">🔉</button>
      <input
        type="range"
        class="w-full mx-4"
        min="0"
        max="1"
        step="0.01"
        v-model="volume"
        @input="adjustVolume"
      />
      <button class="text-white p-2 rounded-md" @click="increaseVolume">🔊</button>
    </div> -->
    <audio ref="audioRef" :src="src" @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded"></audio>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  defineOptions({ name: 'AudioPlayer' });

  const props = defineProps<{
    src: string;
  }>();

  const audioRef = ref<HTMLAudioElement | null>(null);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(1); // Default volume is 1 (max)
  const showVolume = ref(false);

  function togglePlay() {
    if (!audioRef.value) return;
    if (isPlaying.value) {
      audioRef.value.pause();
    } else {
      audioRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }

  function onTimeUpdate() {
    if (!audioRef.value) return;
    currentTime.value = audioRef.value.currentTime;
  }

  function onLoaded() {
    if (!audioRef.value) return;
    duration.value = audioRef.value.duration;
  }

  function seek() {
    if (!audioRef.value) return;
    audioRef.value.currentTime = currentTime.value;
  }

  function adjustVolume() {
    if (!audioRef.value) return;
    audioRef.value.volume = volume.value;
  }

  function increaseVolume() {
    volume.value = Math.min(volume.value + 0.1, 1); // Increase volume by 0.1, max is 1
    adjustVolume();
  }

  function decreaseVolume() {
    volume.value = Math.max(volume.value - 0.1, 0); // Decrease volume by 0.1, min is 0
    adjustVolume();
  }

  function formatTime(sec: number): string {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  watch(
    () => props.src,
    () => {
      isPlaying.value = false;
      currentTime.value = 0;
      duration.value = 0;
      if (audioRef.value) {
        audioRef.value.pause();
        audioRef.value.load();
      }
    },
  );
</script>

<style scoped>
  .audio-player input[type='range'] {
    appearance: none;
    height: 6px;
    border-radius: 9999px;
    background: #f87171;
    cursor: pointer;
  }

  .audio-player input[type='range']::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    border: 2px solid white;
    border-radius: 50%;
    background: white;
    appearance: none;
  }
</style>
