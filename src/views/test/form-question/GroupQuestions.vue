<template>
  <div>
    <div class="flex gap-2 items-center mb-4">
      <label for="" class="w-30">Dạng câu hỏi</label>
      <Select v-model:value="selected" :options="options" class="w-[20rem]" />
      <label for="" class="w-30">Số lượng câu</label>
      <InputNumber v-model:value="total" :min="1" disabled />
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
  import { ref } from 'vue';
  import QuestionEditor from '@/views/test/form-question/QuestionEditor.vue';
  import { GroupQuestionType, SelectQuestionType } from '@/views/test/types/question';

  const props = defineProps({
    questionsNo: {
      type: Array as PropType<number[]>,
      default: () => [],
    }, // bắt đầu tạo từ question thứ mấy
    groupNo: {
      type: Number,
      default: 1,
    },
    groupType: {
      type: String as PropType<SelectQuestionType>,
      required: true,
    },
  });

  const emit = defineEmits(['delete']);

  const selected = ref<SelectQuestionType>(props.groupType);
  const total = ref<number>(props.questionsNo.length);
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
</script>
