<template>
  <div>
    <Form :model="questionFormData" :rules="rulesMain" ref="formRef">
      <div>
        <h3>{{ t('common.questionInformation') }}</h3>
        <Form.Item :label="t('common.questionContent')" name="content" required>
          <Input v-model:value="questionFormData.content" :placeholder="t('common.inputText')" />
        </Form.Item>

        <Form.Item :label="t('common.questionType')" name="type" required>
          <Select
            v-model:value="questionFormData.type"
            placeholder="Enter question"
            :options="questionTypes"
          />
        </Form.Item>
      </div>

      <Form
        :model="optionFormData"
        ref="optionFormRef"
        v-if="
          questionFormData.type === SelectQuestionType.SingleChoice ||
          questionFormData.type === SelectQuestionType.MultipleChoice
        "
        class="mb-4"
      >
        <h3>{{ t('common.answerOptions') }}</h3>
        <div>
          <Form.Item
            v-for="(value, key) in optionFormData"
            :key="`answer_${key}`"
            :label="`${t('common.answer')} ${key}`"
            :name="key"
            :rules="[{ required: true, message: t('common.inputText') + key }]"
            required
            class="flex items-center w-1/2 mb-2"
          >
            <Input v-model:value="optionFormData[key]" :placeholder="t('common.inputText')" />
          </Form.Item>
          <a-button type="success" ghost @click="handleAddAnswer">{{ t('common.add') }}</a-button>
          <a-button
            v-if="Object.keys(optionFormData).length > 1"
            type="error"
            ghost
            class="ml-2"
            @click="handleRemoveAnswer"
            >{{ t('common.delText') }}</a-button
          >
        </div>
      </Form>

      <div class="mb-4">
        <h3>{{ t('common.correctAnswer') }}</h3>
        <Form.Item
          v-if="questionFormData.type === SelectQuestionType.SingleChoice"
          name="answer"
          required
        >
          <RadioGroup v-model:value="questionFormData.answer">
            <Radio
              v-for="(value, key) in optionFormData"
              :key="`correct_answer_${key}`"
              :value="key"
            >
              {{ key }}
            </Radio>
          </RadioGroup>
        </Form.Item>

        <Form.Item
          v-else-if="questionFormData.type === SelectQuestionType.MultipleChoice"
          name="answer"
          required
        >
          <CheckboxGroup v-model:value="questionFormData.answer">
            <Checkbox
              v-for="(value, key) in optionFormData"
              :key="`correct_answer_${key}`"
              :value="key"
            >
              {{ key }}
            </Checkbox>
          </CheckboxGroup>
        </Form.Item>

        <Form.Item v-else-if="questionFormData.type === 'fill_in'" name="answer" required>
          <Input
            v-model:value="questionFormData.answer"
            :placeholder="t('common.enterAnswerText')"
            class="mb-4 w-1/2"
          />
        </Form.Item>

        <Form.Item
          v-else-if="questionFormData.type === SelectQuestionType.TrueFalseNotGiven"
          name="answer"
          required
        >
          <RadioGroup v-model:value="questionFormData.answer">
            <Radio
              v-for="option in trueFalseNotGivenOptions"
              :key="option.value"
              :value="option.value"
              >{{ option.label }}</Radio
            >
          </RadioGroup>
        </Form.Item>
      </div>

      <a-button type="primary" ghost @click="submitForm">{{ t('common.confirm') }}</a-button>
    </Form>
  </div>
</template>

<script lang="ts" setup>
  import { Select, Input, Radio, RadioGroup, Checkbox, CheckboxGroup, Form } from 'ant-design-vue';
  import { alphabet, questionTypes, trueFalseNotGivenOptions, SelectQuestionType } from './data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { QuestionItem, QuestionOptionItem } from './types/question';
  import { computed, ref, watch } from 'vue';

  const { t } = useI18n();
  interface Props {
    value: QuestionItem;
  }

  const props = defineProps<Props>();
  const questionFormData = ref<QuestionItem>(props.value);
  const optionFormData = computed(() => handleInitOptions(questionFormData.value.options));
  const emit = defineEmits(['update:value']);

  const rulesMain = ref({
    content: [{ required: true, message: t('common.inputText') }],
    type: [{ required: true, message: t('common.chooseText') }],
    answer: [{ required: true, message: t('common.chooseAnswerText') }],
  });

  const formRef = ref();
  const optionFormRef = ref();

  const submitForm = async () => {
    try {
      await formRef.value.validate();
      await optionFormRef.value.validate();

      const options: QuestionOptionItem[] = Object.entries(optionFormData.value).map(
        ([key, value]) => ({
          id: key,
          text: value as string,
        }),
      );
      questionFormData.value.options = options;

      emit('update:value', { ...questionFormData.value });
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handleInitOptions = (options: QuestionOptionItem[]) => {
    const optionsObject = options.reduce((acc, option) => {
      acc[option.id] = option.text;
      return acc;
    }, {});

    return optionsObject;
  };

  const handleAddAnswer = () => {
    questionFormData.value.options.push({
      id: alphabet[questionFormData.value.options.length],
      text: '',
    });
  };

  const handleRemoveAnswer = () => {
    questionFormData.value.options.pop();
  };

  watch(
    () => questionFormData.value.type,
    (value) => {
      if (value === SelectQuestionType.FillIn) {
        questionFormData.value.answer = [];
      }
    },
  );

  watch(
    () => props.value,
    () => {
      console.log(props.value);
      questionFormData.value = props.value;
      formRef.value.resetFields();
      optionFormRef.value.resetFields();
    },
  );
</script>
