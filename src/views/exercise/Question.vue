<template>
  <div>
    <Form :model="questionFormData" :rules="rulesMain" ref="formRef">
      <div>
        <h3>{{ t('common.questionInformation') }}</h3>
        <Form.Item :label="t('common.questionContent')" name="content" required>
          <Input
            v-model:value="questionFormData.content"
            :placeholder="t('common.inputText')"
            allow-clear
          />
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
        :rules="rulesOption"
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
            class="flex items-center w-1/2 mb-2"
            required
          >
            <Input
              v-model:value="optionFormData[key]"
              :placeholder="t('common.inputText')"
              allow-clear
            />
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
  import { ref, watch } from 'vue';

  const { t } = useI18n();
  interface Props {
    value: QuestionItem;
  }

  const props = defineProps<Props>();
  const questionFormData = ref<QuestionItem>(props.value);
  const optionFormData = ref<{ [key: string]: string }>({ A: '', B: '', C: '', D: '' });
  const emit = defineEmits(['update:value']);

  const rulesMain = {
    content: [{ required: true, message: t('common.inputText') }],
    type: [{ required: true, message: t('common.chooseText') }],
    answer: [{ required: true, message: t('common.chooseAnswerText') }],
  };
  const rulesOption = ref({
    A: [{ required: true, message: t('common.inputText') }],
    B: [{ required: true, message: t('common.inputText') }],
    C: [{ required: true, message: t('common.inputText') }],
    D: [{ required: true, message: t('common.inputText') }],
  });

  const formRef = ref();
  const optionFormRef = ref();

  const submitForm = async () => {
    try {
      await formRef.value.validate();
      await optionFormRef.value?.validate();

      const options: QuestionOptionItem[] = Object.entries(optionFormData.value).map(
        ([key, value]) => ({
          id: key,
          text: value as string,
        }),
      );
      questionFormData.value.options = options;

      emit('update:value', { ...questionFormData.value });
      console.log('submitForm', questionFormData.value);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handleInitOptions = (options: QuestionOptionItem[]) => {
    const optionsObject = options.reduce((acc, option) => {
      acc[option.id] = option.text;
      return acc;
    }, {});

    optionFormData.value = optionsObject;
  };

  const handleAddAnswer = () => {
    const newKey = alphabet[Object.keys(optionFormData.value).length];
    questionFormData.value.options.push({
      id: newKey,
      text: '',
    });
    rulesOption.value[newKey] = [{ required: true, message: t('common.inputText') }];
    console.log(rulesOption.value);
  };

  const handleRemoveAnswer = () => {
    questionFormData.value.options.pop();
    const keys = Object.keys(optionFormData.value);
    if (keys.length > 1) {
      const lastKey = keys[keys.length - 1];
      delete rulesOption.value[lastKey];
    }
    console.log(rulesOption.value);
  };

  watch(
    () => props.value,
    () => {
      questionFormData.value = { ...props.value };
      handleInitOptions(questionFormData.value.options);
      console.log(questionFormData.value);
    },
  );
</script>
