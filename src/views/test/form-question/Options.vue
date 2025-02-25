<template>
  <BasicModal
    v-bind="$attrs"
    title="Chỉnh sửa lựa chọn câu hỏi"
    width="1000px"
    :can-fullscreen="false"
    @ok="submitForm"
  >
    <Form :model="formModel" :rules="rules" ref="formRef" disable>
      <div v-for="(_, index) in formData" :key="index" class="flex gap-2">
        <!-- Giá trị -->
        <Form.Item :label="'Giá trị'" :name="`value_${index}`" label-align="left">
          <Input
            v-model:value="formModel[`value_${index}`]"
            allow-clear
            :disabled="!allowActionLabel"
          />
        </Form.Item>

        <!-- Nhãn -->
        <Form.Item :label="'Nhãn'" :name="`label_${index}`" label-align="left" class="w-full">
          <Input v-model:value="formModel[`label_${index}`]" allow-clear :disabled="!allowAction" />
        </Form.Item>

        <!-- Xóa lựa chọn -->
        <a-button
          v-if="!hiddenRemoveBtn"
          type="dashed"
          size="small"
          preIcon="ant-design:close-outlined"
          class="mt-1"
          @click="removeOption(index)"
        />
      </div>

      <!-- Thêm lựa chọn -->
      <div class="flex gap-2 mt-2">
        <a-button
          v-if="allowAction"
          type="dashed"
          preIcon="ant-design:plus-outlined"
          block
          @click="addOption"
          class="w-full"
        />
      </div>
    </Form>
  </BasicModal>
</template>

<script setup lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import { Form, Input } from 'ant-design-vue';
  import { ref, watch, computed } from 'vue';
  import BasicModal from '@/components/Modal/src/BasicModal.vue';
  import { OptionAnswerType, SelectQuestionType } from '@/views/test/types/question';

  const props = defineProps({
    value: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => [],
    },
    typeAnswer: {
      type: String as PropType<SelectQuestionType>,
      default: 'fill_in',
    },
  });

  const emit = defineEmits(['update:value']);
  const { t } = useI18n();

  const formRef = ref();
  const formData = ref<{ label: string; value: string }[]>(props.value);
  const formModel = ref<{ [key: string]: string }>(handleFormModel(props.value, {}));
  const defLength = ref<number>(props.value.length);

  const allowAction = computed(() => {
    return props.typeAnswer !== 'true_false_not_given';
  });
  const allowActionLabel = computed(() => {
    if (props.typeAnswer === 'correct_letter') return true;
    else return false;
  });
  const hiddenRemoveBtn = computed(() => {
    if (props.typeAnswer === 'true_false_not_given') return true;
    else if (props.typeAnswer === 'multiple_choice' && formData.value.length === defLength.value)
      return true;
    else if (props.typeAnswer === 'choice' && formData.value.length < 3) return true;
    else return false;
  });

  // ✅ Đồng bộ `formData` với `props.value`
  watch(
    () => props.value,
    (newVal) => {
      formData.value = newVal.length ? [...newVal] : [];
      defLength.value = newVal.length;
    },
    { immediate: true, deep: true },
  );

  // ✅ Dùng `watch` thay vì `watchEffect()` để tránh vòng lặp vô hạn
  watch(
    formData,
    (newVal) => {
      formModel.value = handleFormModel(newVal, formModel.value);
    },
    { deep: true },
  );

  // ✅ Tạo `rules` động từ `formData`
  const rules = computed(() =>
    formData.value.reduce(
      (acc, _, index) => {
        acc[`label_${index}`] = [{ required: true, message: t('common.inputText') }];
        acc[`value_${index}`] = [{ required: true, message: t('common.inputText') }];
        return acc;
      },
      {} as Record<string, any>,
    ),
  );

  function handleFormModel(root, model) {
    return root.reduce(
      (acc, item, index) => {
        acc[`label_${index}`] = item.label || model[`label_${index}`] || '';
        acc[`value_${index}`] = item.value || model[`value_${index}`] || '';
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  // ✅ Thêm một lựa chọn mới
  const addOption = () => {
    formData.value.push({ label: '', value: '' });
  };

  // ✅ Xóa lựa chọn theo `index`
  const removeOption = (index: number) => {
    if (formData.value.length > 2) {
      formData.value.splice(index, 1);
    }
  };

  // ✅ Submit form và emit dữ liệu lên cha
  const submitForm = async () => {
    try {
      await formRef.value.validate();
      const optionsUpdated: OptionAnswerType[] = [
        ...formData.value.map((_, index) => ({
          label: formModel.value[`label_${index}`],
          value: formModel.value[`value_${index}`],
        })),
      ];
      emit('update:value', optionsUpdated); // Đảm bảo gửi bản sao (avoid mutation)
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };
</script>
