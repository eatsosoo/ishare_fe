<template>
  <div class="h-full relative">
    <Row :gutter="[16, 16]">
      <Col :span="12">
        <audio v-if="audioUrl" :src="audioUrl" controls class="h-8" autoplay></audio>
        <Card>
          <div>
            <div v-html="subjectRef"></div>
          </div>
        </Card>
      </Col>
      <Col :span="12">
        <Card>
          <div
            v-for="question in questionsRef"
            :key="question.question_no"
            class="mb-4"
            :question="question"
          >
            <div>
              <Tinymce v-model="inputEditor" width="100%" height="600px" :showImageUpload="false" />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts" setup>
  import { Card, Col, Row } from 'ant-design-vue';
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
  const audioUrl = ref<string | null>('');
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
      audioUrl.value = value[0].media;

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
