<template>
  <div class="wrap-question-form">
    <h2 class="text-primary"
      >Questions
      {{
        props.group.question_no.length > 1
          ? `${props.group.question_no[0]} - ${props.group.question_no[1]}`
          : props.group.question_no[0]
      }}</h2
    >

    <div class="flex gap-2 items-center mb-4">
      <label for="" class="w-30">Dạng câu hỏi</label>
      <Select
        v-model:value="changeData.type"
        :options="questionTypeOps"
        class="w-[20rem]"
        @change="handleChangeType"
      />
      <label for="" class="w-30">Số lượng câu</label>
      <InputNumber :value="props.group.question_no.length" :min="1" disabled />
    </div>

    <Tinymce
      v-model="changeData.questionText"
      :toolbar="toolbar"
      :plugins="plugins"
      @insert-text="handleInsertText"
    />

    <div class="flex gap-2 mt-2">
      <template v-if="changeData.type !== 'multiple_choice'">
        <a-button v-for="no in props.group.question_no" :key="no" @click="addAction(no.toString())">
          {{ no }}
        </a-button>
      </template>
      <template v-else>
        <a-button @click="addAction(props.group.question_no.join('_'))">{{
          props.group.question_no.join(' - ')
        }}</a-button>
      </template>
    </div>

    <AnswerInput
      :model-value="changeData.answers"
      :answer-type="changeData.type"
      :options="changeData.answerOptions"
      @change-options="changeData.answerOptions = $event"
    />

    <Options
      v-if="isArray(changeData.answerOptions)"
      @register="registerOptionsModal"
      :value="changeData.answerOptions"
      :type-answer="changeData.type"
      @update:value="updateAnswerOptions"
    />

    <PreviewText :previewText="previewText" @register="registerPreviewModal" />

    <div class="flex gap-2 mt-2">
      <!-- <a-button type="default" @click="updateAnswer">Cập nhật đáp án</a-button> -->
      <a-button
        v-if="changeData.type !== 'fill_in' && changeData.type !== 'choice'"
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
    GroupQuestionItem,
    OptionAnswerType,
    SelectQuestionType,
  } from '@/views/test/types/question';
  import { useModal } from '@/components/Modal';
  import { handleAnswerOptions, plugins, questionTypeOps, toolbar } from '@/views/test/data';
  import { useMessage } from '@/hooks/web/useMessage';
  import { isArray } from 'lodash-es';
  import { InputNumber, Select } from 'ant-design-vue';

  interface FormData {
    type: SelectQuestionType;
    questionText: string;
    answers: { [key: string]: string };
    answerOptions: any; // OptionAnswerType[] | ExtendOptionAnswerType | null;
  }

  const props = defineProps({
    // questionsNo: { type: Array as PropType<number[]>, default: () => [] },
    // groupType: {
    //   type: String as PropType<SelectQuestionType>,
    //   default: 'fill_in',
    // },
    // text: {
    //   type: String,
    //   default: '',
    // },
    // answerList: {
    //   type: Object as PropType<{ [key: string]: string }>,
    //   default: () => {},
    // },
    // options: {
    //   type: [Array, Object],
    //   default: () => [],
    // },
    group: {
      type: Object as PropType<GroupQuestionItem>,
      required: true,
    },
  });

  const emit = defineEmits(['delete', 'update-group']);

  const [registerOptionsModal, { openModal: openOptionsModal, closeModal }] = useModal();
  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  const { createMessage } = useMessage();

  const previewText = ref<string>('');
  const changeData: FormData = reactive({
    type: props.group.question_type,
    questionText: props.group.question_text,
    answers: props.group.question_answer,
    answerOptions: props.group.question_options,
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
      return `<select value="${answers[matchFormat] || ''}" name="${matchFormat}" class="${classStyle} w-22 pb-[5px]" >
          ${answerOptions.map((option) => `<option value="${option.value}" ${answers[matchFormat] === option.value ? 'selected' : ''}>${option.label}</option>`)}
      </select>`;
    };

    const generateFn3 = (match: string) => {
      if (isArray(answerOptions) || !answerOptions) return '';
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
      regexMap[changeData.type],
      fnMap[changeData.type],
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

  function handleInsertText(fn) {
    insertTextFunction.value = fn;
  }

  function handleChangeType(type: any) {
    changeData.answerOptions = handleAnswerOptions(type, props.group.question_no);
    changeData.answers = handleAnswersInit(props.group.question_no);
  }

  const saveQuestion = () => {
    // console.log('Dữ liệu gửi lên DB:', changeData);
    const { questionText, type, answers, answerOptions } = changeData;
    emit('update-group', {
      question_type: type,
      question_text: questionText,
      question_answer: answers,
      question_options: answerOptions,
    });
    createMessage.success('Đã lưu');
  };

  watch(
    () => props.group,
    (newVal) => {
      changeData.type = newVal.question_type;
      changeData.questionText = newVal.question_text;
      changeData.answers = newVal.question_answer;
      changeData.answerOptions = newVal.question_options;
    },
  );

  // watch(
  //   () => changeData,
  //   (newVal) => {
  //     // console.log(newVal);
  //     const { questionText, type, answers, answerOptions } = newVal;
  //     emit('update-group', {
  //       question_type: type,
  //       question_text: questionText,
  //       question_answer: answers,
  //       question_options: answerOptions,
  //     });
  //   },
  //   { deep: true },
  // );
</script>
