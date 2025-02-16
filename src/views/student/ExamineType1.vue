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
              <h2 class="text-primary mb-0">Question {{ question.question_no }}</h2>
              <h3 class="mb-0">{{ question.question_no }}. {{ question.content }}</h3>
              <div v-if="question.type === SelectQuestionType.MultipleChoice" class="mb-0">
                <CheckboxGroup
                  v-model:value="question.your_answer"
                  class="flex flex-col"
                  @change="updateAnswer(question.id, $event)"
                >
                  <Checkbox
                    v-for="value in question.options"
                    :key="`question_${question.id}_answer_${value.id}`"
                    :value="value.id"
                  >
                    {{ value.text }}
                  </Checkbox>
                </CheckboxGroup>
              </div>
              <div v-else-if="question.type === SelectQuestionType.FillIn">
                <Input
                  v-model:value="question.your_answer"
                  @change="updateAnswer(question.id, $event.target.value)"
                />
              </div>
              <div v-else-if="question.type === SelectQuestionType.YesNoNotGiven">
                <RadioGroup
                  v-model:value="question.your_answer"
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
                  v-model:value="question.your_answer"
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
                  v-model:value="question.your_answer"
                  class="flex flex-col"
                  @change="updateAnswer(question.id, $event.target.value)"
                >
                  <Radio
                    v-for="value in question.options"
                    :key="`question_${question.id}_answer_${value.id}`"
                    :value="value.id"
                  >
                    {{ value.text }}
                  </Radio>
                </RadioGroup>
              </div>
              <div v-else class="mb-0">
                <RadioGroup
                  v-model:value="question.your_answer"
                  class="flex flex-col"
                  @change="updateAnswer(question.id, $event.target.value)"
                >
                  <Radio
                    v-for="value in question.options"
                    :key="`question_${question.id}_answer_${value.id}`"
                    :value="value.id"
                  >
                    {{ value.text }}
                  </Radio>
                </RadioGroup>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
    <div class="absolute bottom-[68px] bg-white box-shadow border-t w-full border-gray">
      <div class="flex gap-4 py-2 px-2">
        <Card
          v-for="(p, index) in props.value"
          :key="p.id"
          @click="clickTab(index)"
          :class="tabActive === index ? 'shrink-0 border-[#0960bd]' : 'flex-1 cursor-pointer'"
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
            <span class="font-light">{{ p.questions_count }} questions</span>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    Card,
    Checkbox,
    CheckboxGroup,
    Col,
    Input,
    Radio,
    RadioGroup,
    Row,
  } from 'ant-design-vue';
  import { ExamPartItem } from '@/api/exam/examModel';
  import { ref, watch } from 'vue';
  import { QuestionItem } from '../test/types/question';
  import { SelectQuestionType } from '../test/data';
  import { isArray } from 'xe-utils';

  const props = defineProps({
    value: {
      type: Array as PropType<ExamPartItem[]>,
      default: () => [],
    },
  });
  const tabActive = ref(0);
  const subjectRef = ref('');
  const questionsRef = ref<QuestionItem[]>([]);
  const final = ref<{ question_id: number; answer: string | string[] }[]>([]);
  const audioUrl = ref<string | null>('');

  const emit = defineEmits(['updateAnswer']);

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
        question.your_answer = value;
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
        your_answer: null,
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

  // watch(
  //   () => questionsRef.value,
  //   (value) => {
  //     const updateData = value.map((question) => ({
  //       question_id: question.id,
  //       answer: question.your_answer,
  //     }));
  //     console.log(updateData);
  //     emit('updateAnswer', updateData);
  //   },
  // );
</script>
