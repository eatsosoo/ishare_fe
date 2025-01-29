<template>
  <div>
    <div class="mb-4">
      <h3>{{ t('common.questionInformation') }}</h3>
      <div class="flex mb-4">
        <span class="w-1/3">{{ t('common.questionContent') }}</span>
        <Input
          v-model:value="questionFormData.content"
          placeholder="Nhập tên câu hỏi"
          class="w-2/3"
        />
      </div>

      <div class="flex">
        <span class="w-1/3">{{ t('common.questionType') }}</span>
        <Select
          :options="questionTypes"
          v-model:value="questionFormData.type"
          placeholder="Chọn loại câu hỏi"
          class="w-2/3"
        />
      </div>
    </div>

    <div class="mb-4">
      <h3>{{ t('common.answer') }}</h3>
      <div v-if="questionFormData.type === 'choice' || questionFormData.type === 'multiple_choice'">
        <div
          v-for="(answer, index) in numAnswers"
          :key="`answer_${index}`"
          class="flex items-center w-1/2 mb-2"
          >{{ alphabet[index] }}.
          <Input :placeholder="`Đáp án ${alphabet[index]}`" class="mx-2" />
          <a-button
            size="small"
            preIcon="ant-design:minus-outlined"
            class="mr-2 !bg-red-500 !text-white"
            @click="numAnswers--"
          />
        </div>
        <a-button type="default" @click="numAnswers++">{{ t('common.add') }}</a-button>
      </div>
    </div>

    <div class="mb-4">
      <h3>{{ t('common.correctAnswer') }}</h3>
      <div v-if="questionFormData.type === 'choice'">
        <RadioGroup v-model:value="questionFormData.answer">
          <Radio
            v-for="(answer, index) in numAnswers"
            :key="`answer_${index}`"
            :value="alphabet[index]"
          >
            {{ alphabet[index] }}
          </Radio>
        </RadioGroup>
      </div>
      <div v-else-if="questionFormData.type === 'multiple_choice'">
        <CheckboxGroup v-model:value="questionFormData.answer">
          <Checkbox
            v-for="(answer, index) in numAnswers"
            :key="`answer_${index}`"
            :value="alphabet[index]"
          >
            {{ alphabet[index] }}
          </Checkbox>
        </CheckboxGroup>
      </div>
      <div v-else-if="questionFormData.type === 'fill_in'">
        <Input placeholder="Nhập đáp án" class="mb-4 w-1/2" />
      </div>
      <div v-else-if="questionFormData.type === 'true_false_not_given'">
        <RadioGroup v-model:value="questionFormData.answer">
          <Radio
            v-for="answer in ['True', 'False', 'Not Given']"
            :key="`answer_${answer}`"
            :value="alphabet[answer]"
          >
            {{ answer }}
          </Radio>
        </RadioGroup>
      </div>
    </div>

    <div class="text-right border border-b-0 border-x-0 border-t-gray mt-8 pt-4">
      <a-button type="primary">{{ t('common.confirm') }}</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Select, Input, Radio, RadioGroup, Checkbox, CheckboxGroup } from 'ant-design-vue';
  import { alphabet, questionTypes } from './data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { QuestionItem } from './types/question';
  import { ref, toRef, watch } from 'vue';

  const { t } = useI18n();
  const props = defineProps<{
    value: QuestionItem;
  }>();
  const numAnswers = ref(4);

  const questionFormData = toRef(props, 'value');

  watch(
    () => questionFormData.value.type,
    () => {
      if (questionFormData.value.type === 'true_false_not_given') {
        numAnswers.value = 3;
      }
    },
  );
</script>
