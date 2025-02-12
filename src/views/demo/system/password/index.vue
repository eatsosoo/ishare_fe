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

  defineOptions({ name: 'ChangePassword' });

  const { t } = useI18n();
  const [register, { validate, resetFields }] = useForm({
    size: 'large',
    baseColProps: { span: 24 },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: formSchema,
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      const { passwordOld, passwordNew } = values;

      // TODO custom api
      console.log(passwordOld, passwordNew);
      // const { router } = useRouter();
      // router.push(pageEnum.BASE_LOGIN);
    } catch (error) {
      console.error(error);
    }
  }
</script>
