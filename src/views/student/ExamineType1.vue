<template>
  <div class="h-full relative">
    <Row :gutter="[16, 16]" class="h-full">
      <Col :span="12" class="bg-[aliceblue] border-r-2 border-gray h-full overflow-auto">
        <div class="p-4">
          <audio v-if="audioUrl" :src="audioUrl" controls class="h-8" autoplay></audio>
          <div>
            <div v-html="subjectRef"></div>
          </div>
        </div>
      </Col>
      <Col :span="12" class="border-l-2 border-gray h-full overflow-auto">
        <div v-if="questionsRef.length > 0" class="p-4">
          <h2 class="text-primary mb-4"
            >Question {{ questionsRef[0].question_no }} - {{ questionsRef.at(-1)?.question_no }}</h2
          >
          <div
            v-for="question in questionsRef"
            :key="question.question_no"
            class="mb-6"
            :question="question"
          >
            <div>
              <h3>{{ question.question_no }}. {{ question.content }}</h3>
              <div v-if="question.type === SelectQuestionType.MultipleChoice" class="mb-0">
                <CheckboxGroup
                  v-model:value="question.student_answer"
                  class="flex flex-col"
                  @change="updateAnswer(question.id, $event)"
                >
                  <Checkbox
                    v-for="option in question.options"
                    :key="`question_${question.id}_answer_${option.id}`"
                    :value="option.id"
                  >
                    {{ option.id }}. {{ option.text }}
                  </Checkbox>
                </CheckboxGroup>
              </div>
              <div v-else-if="question.type === SelectQuestionType.FillIn">
                {{ t('common.enterAnswer') }}:
                <Input
                  v-model:value="question.student_answer"
                  class="w-40"
                  @change="updateAnswer(question.id, $event.target.value)"
                />
              </div>
              <div v-else-if="question.type === SelectQuestionType.YesNoNotGiven">
                <RadioGroup
                  v-model:value="question.student_answer"
                  class="flex flex-col"
                  @change="updateAnswer(question.id, $event.target.value)"
                >
                  <Radio value="yes">Yes </Radio>
                  <Radio value="no">No </Radio>
                  <Radio value="not_given">Not given </Radio>
                </RadioGroup>
              </div>
              <div v-else-if="question.type === SelectQuestionType.TrueFalseNotGiven">
                <RadioGroup
                  v-model:value="question.student_answer"
                  class="flex flex-col"
                  @change="updateAnswer(question.id, $event.target.value)"
                >
                  <Radio value="true">True </Radio>
                  <Radio value="false">False </Radio>
                  <Radio value="not_given">Not given </Radio>
                </RadioGroup>
              </div>
              <div v-else class="mb-0">
                <RadioGroup
                  v-model:value="question.student_answer"
                  class="flex flex-col"
                  @change="updateAnswer(question.id, $event.target.value)"
                >
                  <Radio
                    v-for="option in question.options"
                    :key="`question_${question.id}_answer_${option.id}`"
                    :value="option.id"
                  >
                    {{ option.id }}. {{ option.text }}
                  </Radio>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <div
      class="absolute bottom-[65px] bg-white box-shadow border-t w-full border-gray-200 border-t-1"
    >
      <div class="flex gap-4 py-2 px-2">
        <div
          v-for="(p, index) in props.value"
          :key="p.id"
          @click="clickTab(index)"
          :class="
            tabActive === index ? 'shrink-0 border-[#e8202a]' : 'flex-1 cursor-pointer border-gray'
          "
          class="border-1 py-2 px-4 rounded-lg"
        >
          <div v-if="tabActive === index" class="flex items-center">
            <div class="text-xl font-semibold mr-2">Part {{ index + 1 }}</div>
            <div class="flex gap-2">
              <div
                v-for="q in p.questions"
                :key="q.id"
                class="rounded-full h-8 w-8 border flex items-center justify-center border-gray-200"
              >
                {{ q.question_no }}
              </div>
            </div>
          </div>
          <div v-else class="text-lg text-center">
            <span class="font-semibold mr-4">Part {{ index + 1 }}</span>
            <!-- <span class="font-light">0 of 13 questions</span> -->
            <span class="font-light"
              >{{ completeCount[index] }} of {{ p.questions_count }} questions</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Checkbox, CheckboxGroup, Col, Input, Radio, RadioGroup, Row } from 'ant-design-vue';
  import { ResponseExamPartItem } from '@/api/exam/examModel';
  import { computed, ref, watch } from 'vue';
  import { QuizItem } from '@/views/test/types/question';
  import { SelectQuestionType } from '@/views/test/data';
  import { isArray } from 'xe-utils';
  import { useI18n } from '@/hooks/web/useI18n';

  const props = defineProps({
    value: {
      type: Array as PropType<ResponseExamPartItem[]>,
      default: () => [],
    },
  });

  const { t } = useI18n();
  const tabActive = ref(0);
  const subjectRef = ref('');
  const questionsRef = ref<QuizItem[]>([]);
  const final = ref<{ question_id: number; answer: string | string[] }[]>([]);
  const audioUrl = ref<string | null>('');

  const emit = defineEmits(['updateAnswer']);

  const completeCount = computed(() => {
    const counts: number[] = [];
    props.value.forEach((part) => {
      const count = part.questions.filter((question) => question.student_answer === null).length;
      counts.push(count);
    });

    return counts;
  });

  function clickTab(index: number) {
    const { subject, questions, media } = props.value[index];
    subjectRef.value = subject;
    questionsRef.value = questions;
    audioUrl.value = media;
    tabActive.value = index;
  }

  function updateAnswer(questionId: number, value: any) {
    questionsRef.value = questionsRef.value.map((question) => {
      if (question.id === questionId) {
        question.student_answer = value;
      }
      return question;
    });

    final.value = final.value.map((item) => {
      if (item.question_id === questionId) {
        if (isArray(value)) {
          item.answer = value.join(',');
        } else {
          item.answer = value;
        }
      }
      return item;
    });

    console.log(final.value);
    emit('updateAnswer', final.value);
  }

  watch(
    () => props.value,
    (value) => {
      subjectRef.value = value[0].subject;
      questionsRef.value = value[0].questions.map((question) => ({
        ...question,
        student_answer: null,
      }));
      audioUrl.value = value[0].media;

      final.value = value.flatMap((part) =>
        part.questions.map((question) => ({
          question_id: question.id as number,
          answer: question.type === SelectQuestionType.MultipleChoice ? [] : '',
        })),
      );
    },
  );
</script>
