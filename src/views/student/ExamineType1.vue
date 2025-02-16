<template>
  <div>
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
          <Quiz
            v-for="question in questionsRef"
            :key="question.question_no"
            class="mb-4"
            :question="question"
          />
        </Card>
      </Col>
    </Row>
    <div class="sticky bottom-0 bg-white box-shadow">
      <div class="flex gap-4 py-2 px-2">
        <Card
          v-for="(p, index) in props.value"
          :key="p.id"
          @click="clickTab(index)"
          :class="tabActive === index ? 'shrink-0 border-[#0960bd]' : 'flex-1 cursor-pointer'"
        >
          <div v-if="tabActive === index" class="flex items-center">
            <div class="text-xl font-semibold mr-2">Part {{ p }}</div>
            <div class="flex gap-2">
              <div
                v-for="q in p.questions"
                :key="q.id"
                class="rounded-full h-8 w-8 border flex items-center justify-center border-gray-200"
              >
                {{ q }}
              </div>
            </div>
          </div>
          <div v-else class="text-lg text-center">
            <span class="font-semibold mr-4">Part {{ index + 1 }}</span>
            <!-- <span class="font-light">0 of 13 questions</span> -->
            <span class="font-light">{{ p.question_count }} questions</span>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Card, Col, Row } from 'ant-design-vue';
  import Quiz from './Quiz.vue';
  import { ExamPartItem } from '@/api/exam/examModel';
  import { ref } from 'vue';
  import { QuestionItem } from '../test/types/question';

  const props = defineProps({
    value: {
      type: Array as PropType<ExamPartItem[]>,
      default: () => [],
    },
  });
  const tabActive = ref(0);
  const subjectRef = ref('');
  const questionsRef = ref<QuestionItem[]>([]);

  function clickTab(index: number) {
    const { subject } = props.value[index];
    subjectRef.value = subject;
  }
</script>
