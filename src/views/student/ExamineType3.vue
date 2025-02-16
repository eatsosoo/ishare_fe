<template>
  <div class="h-full relative">
    <Row :gutter="[16, 16]" class="h-full">
      <Col :span="12" class="bg-[aliceblue] border-r-2 border-gray">
        <div class="p-4">
          <div v-html="subjectRef"></div>
        </div>
      </Col>
      <Col :span="12" class="border-l-2 border-gray">
        <div
          v-for="question in questionsRef"
          :key="question.question_no"
          class="mb-4 pr-2 pt-2"
          :question="question"
        >
          <Tinymce v-model="inputEditor" :showImageUpload="false" />
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { Col, Row } from 'ant-design-vue';
  import { ResponseExamPartItem } from '@/api/exam/examModel';
  import { ref, watch } from 'vue';
  import { QuizItem } from '@/views/test/types/question';
  import { Tinymce } from '@/components/Tinymce';

  const props = defineProps({
    value: {
      type: Array as PropType<ResponseExamPartItem[]>,
      default: () => [],
    },
  });
  const subjectRef = ref('');
  const questionsRef = ref<QuizItem[]>([]);
  const final = ref<{ question_id: number; answer: string | string[] }[]>([]);
  const inputEditor = ref('');

  const emit = defineEmits(['updateAnswer']);

  watch(
    () => props.value,
    (value) => {
      subjectRef.value = value[0].subject;
      questionsRef.value = value[0].questions.map((question) => ({
        ...question,
        your_answer: null,
      }));

      final.value = value.flatMap((part) =>
        part.questions.map((question) => ({
          question_id: question.id as number,
          answer: '',
        })),
      );
    },
  );

  watch(
    () => inputEditor.value,
    (value) => {
      const updateData = [
        {
          question_id: questionsRef.value[0].id,
          answer: value,
        },
      ];
      emit('updateAnswer', updateData);
    },
  );
</script>
