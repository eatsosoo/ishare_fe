<template>
  <div>
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
      :show-image-upload="false"
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
    <div v-html="previewText" class="preview line-height-[2]"></div>

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
  const plugins = [];

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

  const renderPreview = () => {
    if (props.typeAnswer === 'fill_in') {
      previewText.value = questionText.value.replace(/\[blank_(\d+)]/g, (match) => {
        const formatMatch = match.slice(1, -1);
        return `<input value="${answers.value[formatMatch]}" class="rounded-full border-red border-1 outline-red bg-white text-center" disabled h-7 />`;
      });
    } else if (props.typeAnswer === 'true_false_not_given') {
      previewText.value = questionText.value.replace(/\[select_(\d+)]/g, (match) => {
        const formatMatch = match.slice(1, -1);
        return `<select value="${answers.value[formatMatch]}" class="rounded-full border-red border-1 outline-red bg-white text-center" disabled h-7>
          <option value="true">True</option>
          <option value="false">False</option>
          <option value="not_given">Not given</option>
        </select>`;
      });
    } else if (props.typeAnswer === 'correct_letter') {
      const abc = Array.from({ length: props.questions.length }, (_, i) =>
        String.fromCharCode(65 + i),
      );
      const genOptions = abc
        .map((value) => `<option value="${value}">${value}</option>`)
        .join('\n'); // Thêm dấu xuống dòng cho đẹp
      previewText.value = questionText.value.replace(/\[correct_letter_(\d+)]/g, (match) => {
        const formatMatch = match.slice(1, -1);
        return `<select value="${answers.value[formatMatch]}" class="rounded-full border-red border-1 outline-red bg-white text-center" disabled h-7>
          ${genOptions}
        </select>`;
      });
    }
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

  const handleChange = debounce(() => {
    renderPreview();
  }, 1000);
</script>

<style>
  .text-input {
    width: 100%;
    height: 100px;
    padding: 5px;
    border: 1px solid #ccc;
  }

  .preview {
    margin-top: 10px;
    padding: 10px;
    background: #f8f8f8;
  }
</style>
