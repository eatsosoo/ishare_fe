<template>
  <PageWrapper :title="t('form.newClassForm.title')">
    <div class="mb-4">
      <a-button @click="validateForm" class="mr-2"> {{ t('form.validateForm') }} </a-button>
      <a-button @click="resetValidate" class="mr-2"> {{ t('form.resetValidate') }} </a-button>
      <a-button @click="getFormValues" class="mr-2"> {{ t('form.getFormValues') }} </a-button>
      <a-button @click="setFormValues" class="mr-2"> {{ t('form.setFormValues') }} </a-button>
      <a-button @click="resetFields" class="mr-2"> {{ t('form.resetFields') }} </a-button>
    </div>
    <CollapseContainer title="表单校验">
      <BasicForm @register="register" @submit="handleSubmit" />
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { CollapseContainer } from '@/components/Container';
  import { useMessage } from '@/hooks/web/useMessage';
  import { PageWrapper } from '@/components/Page';
  import { isAccountExist } from '@/api/demo/system';
  import { useI18n } from '@/hooks/web/useI18n';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: `${t('form.field')}1`,
      colProps: {
        span: 8,
      },
      required: true,
    },
    {
      field: 'field2',
      component: 'Input',
      label: `${t('form.field')}2`,
      colProps: {
        span: 8,
      },
      required: true,
    },
    {
      field: 'id',
      label: 'id',
      required: true,
      defaultValue: 0,
      component: 'InputNumber',
      show: false,
    },
    {
      field: 'field3',
      component: 'DatePicker',
      label: `${t('form.field')}3`,
      colProps: {
        span: 8,
      },
      required: true,
    },
    {
      field: 'field33',
      component: 'DatePicker',
      label: `${t('form.field')}33`,
      colProps: {
        span: 8,
      },
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
      },
      rules: [{ required: true, type: 'string' }],
    },
    {
      field: 'field44',
      component: 'InputCountDown',
      label: '验证码',
      colProps: {
        span: 8,
      },
      required: true,
    },
    {
      field: 'field4',
      component: 'Select',
      label: `${t('form.field')}4`,
      colProps: {
        span: 8,
      },
      componentProps: {
        mode: 'multiple',
        options: [
          {
            label: '选项1',
            value: '1',
            key: '1',
          },
          {
            label: '选项2',
            value: '2',
            key: '2',
          },
        ],
        onChange: (value) => {
          console.log(value, '123');
        },
      },
      rules: [
        {
          required: true,
          message: '请输入aa',
          type: 'array',
        },
      ],
    },
    {
      field: 'field441',
      component: 'Input',
      label: '自定义校验',
      colProps: {
        span: 8,
      },
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject('值不能为空');
            }
            if (value === '1') {
              return Promise.reject('值不能为1');
            }
            return Promise.resolve();
          },
          trigger: 'change',
        },
      ],
    },
    {
      field: 'field5',
      component: 'CheckboxGroup',
      label: `${t('form.field')}5`,
      colProps: {
        span: 8,
      },
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
      rules: [{ required: true }],
    },
    {
      field: 'field7',
      component: 'RadioGroup',
      label: `${t('form.field')}7`,
      colProps: {
        span: 8,
      },
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
      rules: [{ required: true, message: '覆盖默认生成的校验信息' }],
    },
    {
      field: 'field8',
      component: 'Input',
      label: '后端异步验证',
      colProps: {
        span: 8,
      },
      helpMessage: ['本字段演示异步验证', '本地规则：必须填写', '后端规则：不能包含admin'],
      rules: [
        {
          required: true,
          message: '请输入数据',
        },
        {
          trigger: 'blur',
          validator(_, value) {
            return new Promise((resolve, reject) => {
              if (!value) return resolve();
              isAccountExist(value)
                .then(resolve)
                .catch((err) => {
                  reject(err.message || '验证失败');
                });
            });
          },
        },
      ],
    },
  ];

  const { createMessage } = useMessage();
  const [register, { validateFields, clearValidate, getFieldsValue, resetFields, setFieldsValue }] =
    useForm({
      labelWidth: 120,
      schemas,
      actionColOptions: {
        span: 24,
      },
    });
  async function validateForm() {
    try {
      const res = await validateFields();
      console.log('passing', res);
    } catch (error) {
      console.log('not passing', error);
    }
  }
  async function resetValidate() {
    clearValidate();
  }
  function getFormValues() {
    const values = getFieldsValue();
    createMessage.success('values:' + JSON.stringify(values));
  }
  function setFormValues() {
    setFieldsValue({
      field1: 1111,
      field4: ['1'],
      field5: ['1'],
      field7: '1',
      field33: '2020-12-12',
      field3: dayjs('2020-12-12', 'YYYY-MM-DD'),
    });
  }

  function handleSubmit(values: any) {
    createMessage.success('click search,values:' + JSON.stringify(values));
  }
</script>
