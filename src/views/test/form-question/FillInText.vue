<template>
  <div class="wrap-question-form">
    <h3>Tạo câu hỏi điền từ</h3>

    <!-- Ô nhập đoạn văn -->
    <!-- <textarea
      v-model="questionText"
      @mouseup="getSelectionText"
      class="text-input mb-2 rounded-md outline-red"
      @input="handleChange"
    ></textarea> -->

    <Tinymce
      v-model="questionText"
      :toolbar="toolbar"
      :plugins="plugins"
      @select-text="selectedText = $event"
      @change="handleChange"
    />

    <!-- Nút thêm input -->
    <div class="flex gap-2 mt-2">
      <a-button
        v-for="no in props.questions"
        :key="no"
        @click="addInput(no)"
        :disabled="!selectedText && props.typeAnswer === 'fill_in'"
        >{{ no }}</a-button
      >
    </div>

    <!-- Xem trước đoạn văn với placeholders -->
    <div v-html="previewText" class="html-preview"></div>

    <!-- Nhập đáp án đúng cho từng input -->
    <div v-for="(value, key) in answers" :key="key" class="my-2">
      <label v-if="isString(key)">Đáp án {{ key.split('_')[1] }}:</label>
      <Input v-model:value="answers[key]" class="w-[10rem] ml-2" />
    </div>

    <!-- Nút lưu dữ liệu -->
    <div class="flex gap-2 mt-2">
      <a-button type="default" @click="updateAnswer">Cập nhật đáp án</a-button>
      <a-button type="primary" @click="saveQuestion">Lưu câu hỏi</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Tinymce } from '@/components/Tinymce';
  import { Input } from 'ant-design-vue';
  import { isString, debounce } from 'lodash-es';
  import { ref } from 'vue';

  const toolbar = [
    'fontsizeselect lineheight bold italic underline undo redo removeformat bullist numlist preview fullscreen',
  ];
  const plugins = ['table'];

  const props = defineProps({
    questions: {
      type: Array as PropType<number[]>,
      default: () => [25, 26, 27, 28, 29],
    },
    typeAnswer: {
      type: String as PropType<'fill_in' | 'true_false_not_given' | 'correct_letter'>,
      default: () => 'fill_in',
    },
  });

  const mapping = {
    fill_in: 'blank',
    true_false_not_given: 'select',
    correct_letter: 'letter',
  };

  const handleAnswerInit = (numbers: number[]) => {
    if (props.typeAnswer === 'fill_in') {
      return numbers.reduce((acc, num) => {
        acc[`blank_${num}`] = '';
        return acc;
      }, {});
    } else if (props.typeAnswer === 'true_false_not_given') {
      return numbers.reduce((acc, num) => {
        acc[`select_${num}`] = 'true';
        return acc;
      }, {});
    } else {
      const abc = Array.from({ length: props.questions.length }, (_, i) =>
        String.fromCharCode(65 + i),
      );
      return numbers.reduce((acc, num, index) => {
        acc[`select_${num}`] = abc[index];
        return acc;
      }, {});
    }
  };

  const questionText = ref<string>(''); // Văn bản gốc nhập vào
  const previewText = ref<string>(''); // Văn bản hiển thị với placeholders
  const answers = ref<{ [key: string]: string }>(handleAnswerInit(props.questions)); // Mảng lưu các đáp án
  const selectedText = ref<string>(''); // Văn bản được chọn

  // Thêm input vào đoạn văn
  const addInput = (questionNo: number) => {
    if (props.typeAnswer === 'fill_in') {
      if (!selectedText.value || !isString(selectedText.value)) return;
      // Thêm đáp án vào danh sách
      answers.value[`${mapping[props.typeAnswer]}_${questionNo}`] = selectedText.value;

      // Thay thế đoạn được chọn bằng placeholder
      questionText.value = questionText.value.replace(
        selectedText.value,
        `[${mapping[props.typeAnswer]}_${questionNo}]`,
      );
      // Reset selection
      selectedText.value = '';
    } else if (props.typeAnswer === 'true_false_not_given') {
      questionText.value += `[${mapping[props.typeAnswer]}_${questionNo}]`;
    }

    renderPreview();
  };

  const generateOptions = (length) => {
    return Array.from({ length }, (_, i) => {
      const value = String.fromCharCode(65 + i); // A, B, C, ...
      return `<option value="${value}">${value}</option>`;
    }).join('\n');
  };

  const renderPreview = () => {
    let regex, replaceFn;

    switch (props.typeAnswer) {
      case 'fill_in':
        regex = /\[blank_(\d+)]/g;
        replaceFn = (_, index) =>
          `<input value="${answers.value[`blank_${index}`] || ''}" 
        class="rounded-full border-red border-1 outline-red bg-white text-center h-7" disabled />`;
        break;

      case 'true_false_not_given':
        regex = /\[select_(\d+)]/g;
        replaceFn = (_, index) =>
          `<select value="${answers.value[`select_${index}`] || ''}" 
          class="rounded-full border-red border-1 outline-red bg-white text-center h-7" disabled>
            <option value="true">True</option>
            <option value="false">False</option>
            <option value="not_given">Not given</option>
          </select>`;
        break;

      case 'correct_letter':
        regex = /\[correct_letter_(\d+)]/g;
        const genOptions = generateOptions(props.questions.length);
        replaceFn = (_, index) =>
          `<select value="${answers.value[`correct_letter_${index}`] || ''}" 
        class="rounded-full border-red border-1 outline-red bg-white text-center h-7" disabled>
          ${genOptions}
        </select>`;
        break;

      default:
        console.warn(`Unknown typeAnswer: ${props.typeAnswer}`);
        return;
    }

    previewText.value = questionText.value.replace(regex, replaceFn);
    console.log(previewText.value);
  };

  // Hàm lưu vào DB
  const saveQuestion = () => {
    const payload = {
      question_text: questionText.value,
      answers: answers.value,
    };

    console.log('Dữ liệu gửi lên DB:', payload);
  };

  const updateAnswer = () => {
    renderPreview();
  };

  const handleChange = debounce((text: string) => {
    console.log('text', text);
    renderPreview();
  }, 1000);
</script>

<style lang="scss" scoped>
  /* .text-input {
    width: 100%;
    height: 100px;
    padding: 5px;
    border: 1px solid #ccc;
  } */
  .html-preview {
    margin-top: 10px;
    padding: 10px;
    background: #f8f8f8;

    table,
    th,
    td {
      border-collapse: collapse;
      border: 1px solid black;
    }
  }
</style>
