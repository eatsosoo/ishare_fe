<template>
  <div class="wrap-question-form">
    <h3>Tạo câu hỏi điền từ</h3>

    <Tinymce
      v-model="questionText"
      :toolbar="toolbar"
      :plugins="plugins"
      @select-text="selectedText = $event"
    />

    <div class="flex gap-2 mt-2">
      <a-button
        v-for="no in props.questions"
        :key="no"
        @click="addAction(no)"
        :disabled="!selectedText && props.typeAnswer === 'fill_in'"
      >
        {{ no }}
      </a-button>
    </div>

    <AnswerInput :model-value="answers" :answer-type="props.typeAnswer" :options="answerOptions" />

    <Options @register="registerOptionsModal" @update:value="answerOptions = $event" />

    <PreviewText :previewText="previewText" @register="registerPreviewModal" />

    <div class="flex gap-2 mt-2">
      <!-- <a-button type="default" @click="updateAnswer">Cập nhật đáp án</a-button> -->
      <a-button v-if="props.typeAnswer != 'fill_in'" @click="openOptionsModal">Options</a-button>
      <a-button @click="activatePrivewPopup">Preview</a-button>
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
  import { OptionAnswerType, SelectQuestionType } from '@/views/test/types/question';
  import { useModal } from '@/components/Modal';
  import { classStyle, plugins, toolbar } from '@/views/test/data';

  const props = defineProps({
    questions: { type: Array as PropType<number[]>, default: () => [25, 26, 27, 28, 29] },
    typeAnswer: {
      type: String as PropType<SelectQuestionType>,
      default: 'fill_in',
    },
  });

  const [registerOptionsModal, { openModal: openOptionsModal }] = useModal();
  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();

  const questionText = ref<string>('');
  const previewText = ref<string>('');
  const selectedText = ref<string>('');
  const answers = ref<{ [key: string]: string }>({});
  const answerOptions = reactive<OptionAnswerType[]>([]);

  const mapping = { fill_in: 'blank', true_false_not_given: 'select', correct_letter: 'select' };

  const addAction = (questionNo: number) => {
    if (props.typeAnswer === 'fill_in' && selectedText.value) {
      answers.value[`${mapping[props.typeAnswer]}_${questionNo}`] = selectedText.value;
      questionText.value = questionText.value.replace(
        selectedText.value,
        `[${mapping[props.typeAnswer]}_${questionNo}]`,
      );
      selectedText.value = '';
    } else if (props.typeAnswer !== 'fill_in') {
      questionText.value += `[${mapping[props.typeAnswer]}_${questionNo}]`;
    }
  };

  const renderPreview = () => {
    const regexMap = {
      fill_in: /\[blank_(\d+)]/g,
      true_false_not_given: /\[select_(\d+)]/g,
      correct_letter: /\[select_(\d+)]/g,
    };

    const replaceFn = (_, index) =>
      `<input value="${answers.value[`blank_${index}`] || ''}" class="${classStyle}" />`;

    previewText.value = questionText.value.replace(regexMap[props.typeAnswer], replaceFn);
  };

  function activatePrivewPopup() {
    renderPreview();
    openPreviewModal();
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
      answers.value = props.questions.reduce(
        (acc, item) => {
          acc[`question_${item}`] = '';
          return acc;
        },
        {} as Record<string, any>,
      );
    },
  );

  watch(
    () => answers.value,
    () => {
      console.log(answers);
    },
  );
</script>
