<template>
  <div>
    <template v-for="(value, arrIdx) in arrStr" :key="`${arrIdx}`">
      <Input :value="value" class="w-[10rem] m-1" @change="handleSplashStr(arrIdx, $event)" />
    </template>
    <a-button
      type="dashed"
      preIcon="ant-design:plus-circle-filled"
      class="bg-gray-200 ml-2"
      @click="pushSplash"
    />
  </div>
</template>

<script setup lang="ts">
  import { Input } from 'ant-design-vue';
  import { ref, watch } from 'vue';

  const props = defineProps({
    str: {
      type: String,
      default: '',
    },
  });
  const emits = defineEmits(['update-value']);

  const arrStr = ref<string[]>(scanSplashCharacter(props.str));

  function scanSplashCharacter(str: String) {
    if (typeof str !== 'string') {
      return [];
    }
    return str.split('/') ?? [str];
  }

  function pushSplash() {
    arrStr.value.push('');
  }

  function handleSplashStr(arrIdx: number, event: Event) {
    arrStr.value[arrIdx] = event.target?.value;
    const strMegered = arrStr.value.join('/');
    emits('update-value', strMegered);
  }

  scanSplashCharacter(props.str);

  watch(
    () => props.str,
    (newVal) => {
      arrStr.value = scanSplashCharacter(newVal);
    },
  );
</script>
