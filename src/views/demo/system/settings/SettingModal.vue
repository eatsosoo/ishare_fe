<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :width="640"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import {
    createSystemSettingApi,
    getSystemSettingApi,
    updateSystemSettingApi,
  } from '@/api/system-settings/systemSettings';
  import { SystemSettingParams } from '@/api/system-settings/systemSettingsModel';
  import { systemSettingFormSchema } from './settings.data';

  defineOptions({ name: 'SystemSettingModal' });

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(false);
  const settingId = ref<number>();

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: systemSettingFormSchema,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    settingId.value = data?.record?.id;

    if (unref(isUpdate) && settingId.value) {
      const result = await getSystemSettingApi(settingId.value);
      setFieldsValue(result?.items || data.record);
      return;
    }

    setFieldsValue({
      is_public: true,
    });
  });

  const getTitle = computed(() =>
    unref(isUpdate) ? 'Cập nhật cấu hình hệ thống' : 'Thêm cấu hình hệ thống',
  );

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      const params: SystemSettingParams = {
        key: values.key,
        value: values.value,
        type: values.type,
        group: values.group,
        description: values.description || '',
        is_public: values.is_public,
      };

      if (unref(isUpdate) && settingId.value) {
        await updateSystemSettingApi(settingId.value, params);
      } else {
        await createSystemSettingApi(params);
      }

      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
