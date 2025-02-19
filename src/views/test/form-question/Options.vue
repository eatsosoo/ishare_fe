<template>
  <BasicModal
    v-bind="$attrs"
    title="Chỉnh sửa lựa chọn câu hỏi"
    width="600px"
    :can-fullscreen="false"
    @ok="submitForm"
  >
    <Form :model="formModel" :rules="rules" ref="formRef">
      <div v-for="(_, index) in formData" :key="index" class="flex justify-between">
        <!-- Nhãn -->
        <Form.Item
          :label="'Nhãn'"
          :name="`label_${index}`"
          :label-col="{ xl: 6, xxl: 6 }"
          label-align="left"
        >
          <Input v-model:value="formModel[`label_${index}`]" allow-clear />
        </Form.Item>

        <!-- Giá trị -->
        <Form.Item
          :label="'Giá trị'"
          :name="`value_${index}`"
          :label-col="{ xl: 6, xxl: 6 }"
          label-align="left"
        >
          <Input v-model:value="formModel[`value_${index}`]" allow-clear />
        </Form.Item>

        <!-- Xóa lựa chọn -->
        <a-button
          v-if="formData.length > 2"
          type="default"
          preIcon="ant-design:minus-outlined"
          @click="removeOption(index)"
        />
      </div>

      <!-- Thêm lựa chọn -->
      <div class="flex gap-2 mt-2">
        <a-button
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
  import { OptionAnswerType } from '@/views/test/types/question';

  const props = defineProps({
    value: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:value']);
  const { t } = useI18n();

  const formRef = ref();
  const formData = ref<{ label: string; value: string }[]>([
    { label: '', value: '' },
    { label: '', value: '' },
  ]);

  // ✅ Đồng bộ `formData` với `props.value`
  watch(
    () => props.value,
    (newVal) => {
      formData.value = newVal.length ? [...newVal] : [{ label: '', value: '' }];
    },
    { immediate: true, deep: true },
  );

  // ✅ Dùng `watch` thay vì `watchEffect()` để tránh vòng lặp vô hạn
  const formModel = ref<{ [key: string]: string }>({});
  watch(
    formData,
    (newVal) => {
      formModel.value = newVal.reduce(
        (acc, item, index) => {
          acc[`label_${index}`] = item.label || formModel.value[`label_${index}`];
          acc[`value_${index}`] = item.value || formModel.value[`value_${index}`];
          return acc;
        },
        {} as Record<string, any>,
      );
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
