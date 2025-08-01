<template>
  <div>
    <Row :gutter="[16, 16]" class="h-[87.5vh] w-[100vw] border-t-1 border-gray-200">
      <Col
        :span="12"
        class="border-r-2 border-gray h-full overflow-auto"
        :class="isDark ? '' : 'bg-[aliceblue]'"
      >
        <div class="p-4">
          <p class="text-lg font-600 text-primary">Writing Task {{ state.tabActive + 1 }}</p>
          <div v-html="questions[state.tabActive].question_text"></div>
        </div>
      </Col>
      <Col :span="12" class="border-gray border-l-2 h-full overflow-auto py-4">
        <div class="mx-2">
          <InputTextArea
            v-model:value="
              studentAnswer.answers[state.tabActive].question_answer[
                `question_${state.tabActive + 1}`
              ]
            "
            :rows="25"
            @paste.prevent="handlePaste"
            placeholder="Type your essay here..."
          />
          <div class="mt-4">Word counts: {{ wordCount }}</div>
        </div>
      </Col>
    </Row>

    <div class="absolute bottom-0 bg-white box-shadow border-t w-full border-gray-200 border-t-1">
      <div class="flex gap-4 py-2 px-2">
        <div
          v-for="(p, index) in questions"
          :key="index"
          @click="clickTab(index)"
          :class="
            state.tabActive === index
              ? 'flex-1 border-[#e8202a]'
              : 'flex-1 cursor-pointer border-gray'
          "
          class="border-1 py-2 px-4 rounded-xl"
        >
          <div class="text-xl font-semibold text-center">Task {{ index + 1 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue';
  import { GroupQuestionItem, SkillItem, StudentAnswer } from '../test/types/question';
  import { Col, Input, Row } from 'ant-design-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';

  const InputTextArea = Input.TextArea;

  const props = defineProps({
    value: {
      type: Object as PropType<SkillItem>,
      default: () => {},
    },
  });

  const emit = defineEmits(['change']);
  const { isDark } = useDarkModeTheme();
  const state = reactive({
    tabActive: 0,
  });

  const questions = ref<GroupQuestionItem[]>(props.value.parts[0].question_groups);

  const studentAnswer = reactive({
    type: 'Writing',
    answers: [] as StudentAnswer[],
  });

  const wordCount = computed(() => {
    const text =
      studentAnswer.answers[state.tabActive].question_answer[`question_${state.tabActive + 1}`];
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word).length;
  });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  function clickTab(index: number) {
    state.tabActive = index;
    // getInputValues();
  }

  studentAnswer.answers = questions.value.map((question) => {
    return {
      id: question.id as number,
      question_count: question.question_count,
      question_answer: question.question_no.reduce((ob, no) => {
        ob[`question_${no}`] = '';
        return ob;
      }, {}),
    };
  });

  const handlePaste = (event) => {
    event.preventDefault();
    createMessage.error(t('common.blockPaste'));
  };

  watch(
    () => studentAnswer,
    (newVal) => {
      emit('change', newVal);
    },
    { deep: true },
  );
</script>
