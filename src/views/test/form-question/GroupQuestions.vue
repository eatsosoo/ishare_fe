<template>
  <div class="wrap-question-form">
    <h2 class="text-primary font-bold"
      >Questions
      {{
        props.group.question_no.length > 1
          ? `${props.group.question_no[0]} - ${props.group.question_no.at(-1)}`
          : props.group.question_no[0]
      }}</h2
    >

    <div class="flex gap-6 items-center mb-4">
      <div>
        <label for="">{{ t('common.questionType') }}</label>
        <Select
          v-model:value="changeData.type"
          :options="questionTypeOps"
          class="w-50 ml-2"
          @change="handleChangeType"
        />
      </div>
      <div class="flex items-center">
        <label for="">{{ t('common.numOfQuestions') }}</label>
        <div class="ml-2">
          <InputNumber :value="props.group.question_no.length" :min="1" disabled />
        </div>
      </div>
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

    <template v-if="isArray(changeData.answerOptions)">
      <Options
        @register="registerOptionsModal"
        :value="changeData.answerOptions"
        :type-answer="changeData.type"
        @update:value="updateAnswerOptions"
      />
    </template>
    <!-- <template v-else
      ><MultipleChoice
        @register="registerOptionsModal"
        :value="changeData.answerOptions"
        :type-answer="changeData.type"
        @update:value="updateAnswerOptions"
    /></template> -->

    <PreviewText :previewText="previewText" @register="registerPreviewModal" />

    <div class="flex gap-2 mt-2">
      <a-button
        v-if="changeData.type !== 'fill_in' && changeData.type !== 'choice'"
        @click="activateOptionPopup"
        >{{ t('common.option') }}</a-button
      >
      <!-- <a-button @click="emit('delete')">Delete Group</a-button> -->
      <a-button @click="activatePreviewPopup">{{ t('common.preview') }}</a-button>
      <a-button type="primary" @click="saveQuestion">{{ t('common.saveQuestion') }}</a-button>
      <a-button
        type="dashed"
        preIcon="ant-design:delete-twotone"
        class="bg-orange"
        @click="deleteQuestion"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Tinymce } from '@/components/Tinymce';
  import { h, reactive, ref, watch } from 'vue';
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
  import { renderGroupQuestions } from '@/views/take/helpers';
  import { useI18n } from '@/hooks/web/useI18n';
  import { deleteGroupQuestion } from '@/api/exercise/exercise';
  // import MultipleChoice from '@/views/test/form-question/MultipleChoice.vue';

  interface FormData {
    type: SelectQuestionType;
    questionText: string;
    answers: { [key: string]: string | string[] };
    answerOptions: any; // OptionAnswerType[] | ExtendOptionAnswerType | null;
  }

  const props = defineProps({
    group: {
      type: Object as PropType<GroupQuestionItem>,
      required: true,
    },
  });

  const emit = defineEmits(['delete', 'update-group']);

  const { t } = useI18n();
  const [registerOptionsModal, { openModal: openOptionsModal, closeModal }] = useModal();
  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();
  const { createMessage, createConfirm } = useMessage();

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
      createMessage.warning(t('common.warning.addActionEditor'));
    }
  };

  function activatePreviewPopup() {
    const { questionText, answerOptions, type } = changeData;
    const data = {
      question_text: questionText,
      question_options: answerOptions,
      question_type: type,
    };
    previewText.value = renderGroupQuestions(data, classStyle);
    openPreviewModal();
  }

  function activateOptionPopup() {
    openOptionsModal();
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

  function deleteQuestion() {
    if (!props.group.id) {
      emit('delete');
      return;
    }

    const data = {
      questions: [
        {
          id: props.group.id,
        },
      ],
    };
    createConfirm({
      iconType: 'warning',
      title: () => h('span', t('sys.app.logoutTip')),
      content: () => h('span', t('common.warning.deleteQuestion')),
      onOk: async () => {
        try {
          const res = await deleteGroupQuestion(data);
          if (res && res.items) {
            emit('delete');
          }
        } catch (error) {
          console.error('API error:', error);
        }
      },
    });
  }

  const saveQuestion = () => {
    const { questionText, type, answers, answerOptions } = changeData;
    emit('update-group', {
      question_type: type,
      question_text: questionText,
      question_answer: answers,
      question_options: answerOptions,
    });
    createMessage.success(t('common.saveTemp'));
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
