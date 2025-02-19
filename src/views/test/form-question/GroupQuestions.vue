<template>
  <div>
    <div class="flex gap-2 mb-4">
      <Select v-model:value="selected" :options="options" class="w-[20rem]" />
      <InputNumber v-model:value="total" :min="1" />
    </div>
    <QuestionEditor
      :type-answer="selected"
      :questions="questionsNo"
      @delete="emit('delete', props.groupNo)"
    />
  </div>
</template>

<script setup lang="ts">
  import { InputNumber, Select } from 'ant-design-vue';
  import { computed, ref } from 'vue';
  import QuestionEditor from '@/views/test/form-question/QuestionEditor.vue';
  import { GroupQuestionType, SelectQuestionType } from '@/views/test/types/question';

  const props = defineProps({
    startNo: {
      type: Number,
      default: 1,
    }, // bắt đầu tạo từ question thứ mấy
    groupNo: {
      type: Number,
      default: 1,
    },
  });

  const emit = defineEmits(['delete']);

  const selected = ref<SelectQuestionType>('fill_in');
  const total = ref<number>(1);
  const options: GroupQuestionType[] = [
    {
      label: 'fill_in',
      value: 'fill_in',
    },
    {
      label: 'true_false_not_given',
      value: 'true_false_not_given',
    },
    {
      label: 'correct_letter',
      value: 'correct_letter',
    },
    {
      label: 'choice',
      value: 'choice',
    },
    {
      label: 'multiple_choice',
      value: 'multiple_choice',
    },
  ];

  const questionsNo = computed(() => {
    return Array.from({ length: total.value }, (_, i) => i + props.startNo);
  });
</script>
