<template>
  <div v-for="(_, key) in localModel" :key="key" class="my-2">
    <label v-if="typeof key === 'string'">Đáp án Question {{ key.split('_')[1] }}:</label>
    <Input v-if="answerType === 'fill_in'" v-model:value="localModel[key]" class="w-[10rem] ml-2" />
    <Select
      v-else-if="answerType === 'true_false_not_given' || answerType === 'correct_letter'"
      v-model:value="localModel[key]"
      :options="options"
      class="w-[10rem] ml-2"
    />
    <div v-else-if="answerType === 'choice'">
      <RadioGroup v-model:value="localModel[key]" class="flex">
        <Radio value="A">A</Radio>
        <Radio value="B">B</Radio>
        <Radio value="C">C</Radio>
        <Radio value="D">D</Radio>
      </RadioGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { Input, Select, RadioGroup, Radio } from 'ant-design-vue';
  import { OptionAnswerType, SelectQuestionType } from '@/views/test/types/question';

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
    answerType: {
      type: String as PropType<SelectQuestionType>,
      default: 'fill_in',
    },
    options: {
      type: Array as PropType<OptionAnswerType[]>,
      default: () => [],
    },
  });
  const emit = defineEmits(['update:modelValue']);

  // ✅ Tạo `computed` để phản chiếu `modelValue` và cập nhật qua `emit`
  const localModel = computed({
    get: () => props.modelValue,
    set: (newValue) => emit('update:modelValue', newValue),
  });
</script>
