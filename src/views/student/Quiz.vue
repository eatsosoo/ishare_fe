<template>
  <div>
    <h2 class="text-primary mb-0">Question {{ props.question.no }}</h2>
    <h3 class="mb-0">{{ props.question.no }}. {{ props.question.content }}</h3>
    <ul class="mb-0">
      <li v-for="option in question.options" :key="option.id" class="flex">
        <Radio /><span>{{ option.id }}. {{ option.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { QuestionItem } from '@/views/test/types/question';
  import { Radio } from 'ant-design-vue';

  const props = defineProps({
    question: {
      type: Object as PropType<QuestionItem>,
      required: true,
    },
  });
</script>
