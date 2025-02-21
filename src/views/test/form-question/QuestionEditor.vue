<template>
  <div class="wrap-question-form">
    <h2 class="text-primary"
      >Questions
      {{
        props.questions.length > 1
          ? `${props.questions[0]} - ${props.questions[1]}`
          : props.questions[0]
      }}</h2
    >

    <Tinymce
      v-model="changeData.questionText"
      :toolbar="toolbar"
      :plugins="plugins"
      @insert-text="handleInsertText"
    />

    <div class="flex gap-2 mt-2">
      <template v-if="props.typeAnswer !== 'multiple_choice'">
        <a-button v-for="no in props.questions" :key="no" @click="addAction(no.toString())">
          {{ no }}
        </a-button>
      </template>
      <template v-else>
        <a-button @click="addAction(props.questions.join('_'))">{{
          props.questions.join(' - ')
        }}</a-button>
      </template>
    </div>

    <AnswerInput
      :model-value="changeData.answers"
      :answer-type="props.typeAnswer"
      :options="changeData.answerOptions"
      @change-options="changeData.answerOptions = $event"
    />

    <Options
      v-if="isArray(changeData.answerOptions)"
      @register="registerOptionsModal"
      :value="changeData.answerOptions"
      :type-answer="props.typeAnswer"
      @update:value="updateAnswerOptions"
    />

    <PreviewText :previewText="previewText" @register="registerPreviewModal" />

    <div class="flex gap-2 mt-2">
      <!-- <a-button type="default" @click="updateAnswer">Cập nhật đáp án</a-button> -->
      <a-button
        v-if="props.typeAnswer !== 'fill_in' && props.typeAnswer !== 'choice'"
        @click="openOptionsModal"
        >Options</a-button
      >
      <a-button @click="emit('delete')">Delete Group</a-button>
      <a-button @click="activatePreviewPopup">Preview</a-button>
      <a-button type="primary" @click="saveQuestion">Lưu câu hỏi</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Tinymce } from '@/components/Tinymce';
  import { reactive, ref, watch } from 'vue';
  import AnswerInput from '@/views/test/form-question/AnswerInput.vue';
  import PreviewText from '@/views/test/form-question/PreviewText.vue';
  import Options from '@/views/test/form-question/Options.vue';
  import {
    ExtendOptionAnswerType,
    OptionAnswerType,
    SelectQuestionType,
  } from '@/views/test/types/question';
  import { useModal } from '@/components/Modal';
  import { plugins, toolbar } from '@/views/test/data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { isArray } from 'lodash-es';

  interface FormData {
    questionText: string;
    answers: { [key: string]: string };
    answerOptions: OptionAnswerType[] | ExtendOptionAnswerType;
  }

  const props = defineProps({
    questions: { type: Array as PropType<number[]>, default: () => [] },
    typeAnswer: {
      type: String as PropType<SelectQuestionType>,
      default: 'fill_in',
    },
    text: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['delete', 'update-group']);

  const [registerOptionsModal, { openModal: openOptionsModal, closeModal }] = useModal();
  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  const { createMessage } = useMessage();

  const previewText = ref<string>('');
  const changeData: FormData = reactive({
    questionText: props.text,
    answers: handleAnswersInit(props.questions),
    answerOptions: handleAnswerOptions(props.typeAnswer),
  });
  const insertTextFunction = ref<Function | null>(null);

  const classStyle =
    'bg-white rounded-full text-center outline-red-400 outline-1 border-gray-300 border-1 p-1 shadow-md h-[32px]';

  const addAction = (questionNo: string) => {
    const text = `[question_${questionNo}]`;
    if (insertTextFunction.value) {
      insertTextFunction.value(text);
    } else {
      createMessage.warning('Chưa có function để chèn text!');
    }
  };

  const renderPreview = () => {
    const { answers, answerOptions } = changeData;
    const regexMap = {
      fill_in: /\[question_(\d+)]/g,
      true_false_not_given: /\[question_(\d+)]/g,
      correct_letter: /\[question_(\d+)]/g,
      choice: /\[question_(\d+)]/g,
      multiple_choice: /\[question_(\d+(?:_\d+)*)]/g,
    };

    const generateFn = (match: string) => {
      const matchFormat = match.slice(1, -1);
      return `<input type="text" value="${answers[matchFormat] || ''}" name="${matchFormat}" class="${classStyle} w-38" />`;
    };

    const generateFn2 = (match: string) => {
      if (!isArray(answerOptions)) return '';
      const matchFormat = match.slice(1, -1);
      return `<select value="${answers.value[matchFormat] || ''}" name="${matchFormat}" class="${classStyle} w-22 pb-[5px]" >
          ${answerOptions.map((option) => `<option value="${option.value}" ${answers[matchFormat] === option.value ? 'selected' : ''}>${option.label}</option>`)}
      </select>`;
    };

    const generateFn3 = (match: string) => {
      if (isArray(answerOptions)) return '';
      const matchFormat = match.slice(1, -1);
      const html = answerOptions[matchFormat].map(
        (option) =>
          `<div class="flex items-center mb-2">
            <span class="bg-gray-200 font-bold mr-[10px] w-[24px] rounded-full text-center">
              ${option.value}
            </span>
            <label class="custom-input custom-radio">
              <input type="radio" name="${matchFormat}" value="${option.value}" />
              <span class="checkmark"></span>
              ${option.label}
            </label>
          </div>`,
      );

      return html.join('\n');
    };

    const generateFn4 = (match: string) => {
      if (!isArray(answerOptions)) return '';
      const matchFormat = match.slice(1, -1);
      const html = answerOptions.map(
        (option) => `<div class="flex items-center mb-2">
            <span class="bg-gray-200 font-bold mr-[10px] w-[24px] rounded-full text-center">
              ${option.value}
            </span>
            <label class="custom-input custom-checkbox">
              <input type="checkbox" name="${matchFormat}" value="${option.value}" />
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
      multiple_choice: generateFn4,
    };

    previewText.value = changeData.questionText.replace(
      regexMap[props.typeAnswer],
      fnMap[props.typeAnswer],
    );
  };

  function activatePreviewPopup() {
    renderPreview();
    openPreviewModal();
  }

  function updateAnswerOptions(items: OptionAnswerType[]) {
    changeData.answerOptions = items;
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
    let genOps: OptionAnswerType[] | ExtendOptionAnswerType = [];
    switch (type) {
      case 'true_false_not_given':
        genOps = [
          { label: 'True', value: 'true' },
          { label: 'False', value: 'false' },
          { label: 'Not Given', value: 'not_given' },
        ];
        break;
      case 'choice':
        genOps = props.questions.reduce((acc, item) => {
          acc[`question_${item}`] = [
            { value: 'A', label: '' },
            { value: 'B', label: '' },
            { value: 'C', label: '' },
            { value: 'D', label: '' },
          ];
          return acc;
        }, {});
        break;
      case 'multiple_choice':
        genOps = Array.from({ length: props.questions.length + 1 }, (_, i) => ({
          value: String.fromCharCode(65 + i),
          label: '',
        }));
        break;
      default:
        genOps = [];
    }

    return genOps;
  }

  function handleInsertText(fn) {
    insertTextFunction.value = fn;
  }

  const saveQuestion = () => {
    console.log('Dữ liệu gửi lên DB:', changeData);
  };

  watch(
    () => [props.typeAnswer, props.questions],
    () => {
      changeData.questionText = '';
      changeData.answers = handleAnswersInit(props.questions);
      changeData.answerOptions = handleAnswerOptions(props.typeAnswer);
    },
  );

  watch(
    () => changeData,
    (newVal) => {
      console.log(newVal);
      // emit('update-group', newVal);
    },
    { deep: true },
  );
</script>
