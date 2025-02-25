<template>
  <BasicModal
    v-bind="$attrs"
    title="Chỉnh sửa lựa chọn câu hỏi"
    width="600px"
    :can-fullscreen="false"
    @ok="submitForm"
  >
    <Form :model="formModel" :rules="rules" ref="formRef">
      <div v-for="(value, key) in formData" :key="key" class="flex justify-between">
        <!-- Giá trị -->
        <Form.Item :label="key" :name="key" label-align="left" class="w-full mr-4">
          <Input v-model:value="formModel[key]" allow-clear :disabled="!allowAction" />
        </Form.Item>

        <!-- Xóa lựa chọn -->
        <a-button
          v-if="!hiddenRemoveBtn"
          type="dashed"
          size="small"
          preIcon="ant-design:close-outlined"
          class="mt-1"
          @click="removeOption(key)"
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

  const props = defineProps({
    value: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['update:value']);
  const { t } = useI18n();
  const formRef = ref();
  const formData = ref<Record<string, string>>({ ...props.value });
  const formModel = ref<Record<string, string>>({ ...props.value });

  const allowAction = computed(() => true);
  const hiddenRemoveBtn = computed(() => Object.keys(formData.value).length <= 1);

  // Đồng bộ `formData` với `props.value`
  watch(
    () => props.value,
    (newVal) => {
      formData.value = { ...newVal };
    },
    { immediate: true, deep: true },
  );

  // Đồng bộ `formModel` với `formData`
  watch(
    formData,
    (newVal) => {
      formModel.value = { ...newVal };
    },
    { deep: true },
  );

  // Tạo `rules` động từ `formData`
  const rules = computed(() =>
    Object.keys(formData.value).reduce(
      (acc, key) => {
        acc[key] = [{ required: true, message: t('common.inputText') }];
        return acc;
      },
      {} as Record<string, any>,
    ),
  );

  // Thêm một lựa chọn mới
  const addOption = () => {
    const alphabet = Object.keys(formData.value).length;
    const newKey = String.fromCharCode(65 + alphabet);
    formData.value[newKey] = '';
  };

  // Xóa lựa chọn theo `key`
  const removeOption = (key: string) => {
    if (Object.keys(formData.value).length > 1) {
      delete formData.value[key];
    }
  };

  // Submit form và emit dữ liệu lên cha
  const submitForm = async () => {
    try {
      await formRef.value.validate();
      emit('update:value', { ...formModel.value });
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };
</script>
