<template>
  <PageWrapper :title="t('sys.changePassword.title')" :content="t('sys.changePassword.content')">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> {{ t('common.resetText') }} </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit">
          {{ t('common.saveText') }}
        </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { BasicForm, useForm } from '@/components/Form';

  import { formSchema } from './pwd.data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { changePassword } from '@/api/sys/user';
  import { useUserStore } from '@/store/modules/user';

  defineOptions({ name: 'ChangePassword' });

  const useStore = useUserStore();
  const { t } = useI18n();
  const [register, { validate, resetFields }] = useForm({
    size: 'default',
    baseColProps: { span: 24 },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: formSchema,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      const { passwordOld, passwordNew, confirmPassword } = values;

      const result = await changePassword({
        current_password: passwordOld,
        password: passwordNew,
        password_confirmation: confirmPassword,
      });
      if (result) {
        useStore.logout();
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>
