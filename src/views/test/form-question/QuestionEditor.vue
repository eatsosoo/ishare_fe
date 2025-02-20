<template>
  <div class="wrap-question-form">
    <h3>Tạo câu hỏi điền từ</h3>

    <Tinymce
      v-model="questionText"
      :toolbar="toolbar"
      :plugins="plugins"
      @insert-text="handleInsertText"
    />

    <div class="flex gap-2 mt-2">
      <a-button v-for="no in props.questions" :key="no" @click="addAction(no)">
        {{ no }}
      </a-button>
    </div>

    <AnswerInput :model-value="answers" :answer-type="props.typeAnswer" :options="answerOptions" />

    <Options
      @register="registerOptionsModal"
      :value="answerOptions"
      :type-answer="props.typeAnswer"
      @update:value="updateAnswerOptions"
    />

    <PreviewText :previewText="previewText" @register="registerPreviewModal" />

    <div class="flex gap-2 mt-2">
      <!-- <a-button type="default" @click="updateAnswer">Cập nhật đáp án</a-button> -->
      <a-button v-if="props.typeAnswer != 'fill_in'" @click="openOptionsModal">Options</a-button>
      <a-button @click="emit('delete')">Delete Group</a-button>
      <a-button @click="activatePreviewPopup">Preview</a-button>
      <a-button type="primary" @click="saveQuestion">Lưu câu hỏi</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Tinymce } from '@/components/Tinymce';
  import { ref, watch } from 'vue';
  import AnswerInput from '@/views/test/form-question/AnswerInput.vue';
  import PreviewText from '@/views/test/form-question/PreviewText.vue';
  import Options from '@/views/test/form-question/Options.vue';
  import { OptionAnswerType, SelectQuestionType } from '@/views/test/types/question';
  import { useModal } from '@/components/Modal';
  import { plugins, toolbar } from '@/views/test/data';
  import { useMessage } from '@/hooks/web/useMessage';

  const props = defineProps({
    questions: { type: Array as PropType<number[]>, default: () => [] },
    typeAnswer: {
      type: String as PropType<SelectQuestionType>,
      default: 'fill_in',
    },
  });

  const emit = defineEmits(['delete']);

  const [registerOptionsModal, { openModal: openOptionsModal, closeModal }] = useModal();
  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  const { createMessage } = useMessage();

  const questionText = ref<string>('');
  const previewText = ref<string>('');
  const answers = ref<{ [key: string]: string }>(handleAnswersInit(props.questions));
  const answerOptions = ref<OptionAnswerType[]>(handleAnswerOptions(props.typeAnswer));
  const insertTextFunction = ref<Function | null>(null);

  const mapping = { fill_in: 'blank', true_false_not_given: 'select', correct_letter: 'select' };
  const classStyle =
    'bg-white rounded-full text-center outline-red-400 outline-1 border-gray-300 border-1 p-1 shadow-md h-[32px]';

  const addAction = (questionNo: number) => {
    const text = `[question_${questionNo}]`;
    if (insertTextFunction.value) {
      insertTextFunction.value(text);
    } else {
      createMessage.warning('Chưa có function để chèn text!');
    }
  };

  const renderPreview = () => {
    const regexMap = {
      fill_in: /\[question_(\d+)]/g,
      true_false_not_given: /\[question_(\d+)]/g,
      correct_letter: /\[question_(\d+)]/g,
      choice: /\[question_(\d+)]/g,
    };

    const generateFn = (match, index) =>
      `<input type="text" value="${answers.value[match] || ''}" name="${match}" class="${classStyle} w-38" />`;
    const generateFn2 = (match, index) =>
      `<select value="${answers.value[match] || ''}" name="${match}" class="${classStyle} w-22 pb-[5px]" >
          ${answerOptions.value.map((option) => `<option value="${option.value}" ${answers.value[match] === option.value ? 'selected' : ''}>${option.label}</option>`)}
      </select>`;
    const generateFn3 = (match, index) => {
      const html = answerOptions.value.map(
        (option) =>
          `<div class="flex items-center mb-2">
            <span class="bg-gray-400 font-bold mr-[10px] w-[24px] rounded-full text-center">
              ${option.value}
            </span>
            <label class="custom-radio">
              <input type="radio" name="${match}" value="${option.value}" />
              <span class="checkmark"></span>
              ${option.label}
            </label>
          </div>`,
      );

      return html.join('\n');
    };

    const fnMap = {
      fill_in: generateFn,
      true_false_not_given: generateFn2,
      correct_letter: generateFn2,
      choice: generateFn3,
    };

    previewText.value = questionText.value.replace(
      regexMap[props.typeAnswer],
      fnMap[props.typeAnswer],
    );
  };

  function activatePreviewPopup() {
    renderPreview();
    openPreviewModal();
  }

  function updateAnswerOptions(items: OptionAnswerType[]) {
    answerOptions.value = items;
    closeModal();
  }

  function handleAnswersInit(items: number[]) {
    return items.reduce(
      (acc, item) => {
        acc[`question_${item}`] = '';
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  function handleAnswerOptions(type: SelectQuestionType) {
    return type === 'true_false_not_given'
      ? [
          { label: 'True', value: 'true' },
          { label: 'False', value: 'false' },
          { label: 'Not Given', value: 'not_given' },
        ]
      : [];
  }

  function handleInsertText(fn) {
    insertTextFunction.value = fn;
  }

  const saveQuestion = () => {
    console.log('Dữ liệu gửi lên DB:', {
      question_text: questionText.value,
      answers: answers.value,
    });
  };

  watch(
    () => [props.typeAnswer, props.questions],
    () => {
      questionText.value = '';
      answers.value = handleAnswersInit(props.questions);
      answerOptions.value = handleAnswerOptions(props.typeAnswer);
    },
  );

  watch(
    () => answers.value,
    () => {
      console.log(answers);
    },
  );
</script>
