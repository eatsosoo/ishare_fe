<template>
  <div>
    <div v-for="(_, key) in localModel" :key="key" class="my-2">
      <label v-if="typeof key === 'string'" class="min-w-[116px] inline-block">
        {{ t('common.questionAnswer') }} {{ key.replace(/^question_/, '') }}:
      </label>
      <Input
        v-if="props.answerType === 'fill_in'"
        v-model:value="localModel[key]"
        class="w-[10rem] ml-2"
      />
      <Select
        v-else-if="props.answerType === 'true_false_not_given'"
        v-model:value="localModel[key]"
        :options="options as OptionAnswerType[]"
        class="w-[10rem] ml-2"
      />
      <Select
        v-else-if="props.answerType === 'yes_no_not_given'"
        v-model:value="localModel[key]"
        :options="options as OptionAnswerType[]"
        class="w-[10rem] ml-2"
      />
      <Select
        v-else-if="props.answerType === 'correct_letter'"
        v-model:value="localModel[key]"
        :options="options as OptionAnswerType[]"
        :fieldNames="{ label: 'value', value: 'value' }"
        class="w-[10rem] ml-2"
      />
      <div v-else-if="props.answerType === 'choice'" class="flex items-center gap-4">
        <RadioGroup v-model:value="localModel[key]">
          <Radio v-for="op in props.options[key]" :key="key + op.value" :value="op.value">{{
            op.value
          }}</Radio>
        </RadioGroup>
        <a-button
          type="dashed"
          size="small"
          preIcon="ant-design:edit-filled"
          @click="activateModal(key)"
        />
      </div>
      <div v-else-if="props.answerType === 'multiple_choice'" class="flex items-center gap-4">
        <CheckboxGroup v-model:value="localModel[key]">
          <Checkbox v-for="(op, key) in props.options" :key="key" :value="op.value">{{
            op.value
          }}</Checkbox>
        </CheckboxGroup>
      </div>
    </div>

    <Options
      @register="registerOptionsModal"
      :value="modifyOps"
      :type-answer="props.answerType"
      @update:value="updateAnswerOptions"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { Input, Select, RadioGroup, Radio, CheckboxGroup, Checkbox } from 'ant-design-vue';
  import { OptionAnswerType, SelectQuestionType } from '@/views/test/types/question';
  import { useModal } from '@/components/Modal';
  import Options from './Options.vue';
  import { useI18n } from '@/hooks/web/useI18n';

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
    answerType: {
      type: String as PropType<SelectQuestionType>,
      default: 'fill_in',
    },
    options: {
      type: [Array, Object],
      default: () => [],
    },
  });
  const emit = defineEmits(['update:modelValue', 'change-options']);
  const modifyOps = ref<OptionAnswerType[]>([]);
  const keyPresent = ref<string>('');

  const { t } = useI18n();
  const [registerOptionsModal, { openModal: openOptionsModal, closeModal }] = useModal();

  // ✅ Tạo `computed` để phản chiếu `modelValue` và cập nhật qua `emit`
  const localModel = computed({
    get: () => props.modelValue,
    set: (newValue) => emit('update:modelValue', newValue),
  });

  function activateModal(key: string) {
    modifyOps.value = props.options[key];
    keyPresent.value = key;
    openOptionsModal();
  }

  function updateAnswerOptions(items: OptionAnswerType[]) {
    const newOps = props.options;
    newOps[keyPresent.value] = items;
    emit('change-options', newOps);
    closeModal();
  }
</script>
