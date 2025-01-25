import { teacherListApi } from '@/api/demo/table';
import { FormSchema } from '@/components/Form';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

const basicOptions: LabelValueOptions = [
  {
    label: t('form.newClassForm.pending'),
    value: 'pending',
  },
  {
    label: t('form.newClassForm.enable'),
    value: 'enable',
  },
  {
    label: t('form.newClassForm.finished'),
    value: 'finished',
  },
];

const storeTypeOptions: LabelValueOptions = [
  {
    label: '私密',
    value: '1',
  },
  {
    label: '公开',
    value: '2',
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: t('form.newClassForm.name'),
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'teacher',
    component: 'ApiSelect',
    label: t('form.newClassForm.teacher'),
    componentProps: {
      // more details see /src/components/Form/src/components/ApiSelect.vue
      api: teacherListApi(),
      params: {
        id: 1,
      },

      resultField: 'list',
      // use name as label
      labelField: 'name',
      // use id as value
      valueField: 'id',
      // not request untill to select
      immediate: true,
      onChange: (e, v) => {
        console.log('ApiSelect====>:', e, v);
      },
      // atfer request callback
      onOptionsChange: (options) => {
        console.log('get options', options.length, options);
      },
    },
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'status',
    component: 'RadioButtonGroup',
    label: t('form.newClassForm.status'),
    componentProps: {
      options: basicOptions,
    },
    defaultValue: 'pending',
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'openingDay',
    component: 'DatePicker',
    label: t('form.newClassForm.openingDay'),
    required: true,
    colProps: {
      offset: 2,
    },
  },
];
export const taskSchemas: FormSchema[] = [
  {
    field: 't1',
    component: 'Input',
    label: '任务名',
    required: true,
  },
  {
    field: 't2',
    component: 'Input',
    label: '任务描述',
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 't3',
    component: 'Select',
    label: '执行人',
    componentProps: {
      options: basicOptions,
    },
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 't4',
    component: 'Select',
    label: '责任人',
    componentProps: {
      options: basicOptions,
    },
    required: true,
  },
  {
    field: 't5',
    component: 'TimePicker',
    label: '生效日期',
    required: true,
    componentProps: {
      style: { width: '100%' },
    },
    colProps: {
      offset: 2,
    },
  },
  {
    field: 't6',
    component: 'Select',
    label: '任务类型',
    componentProps: {
      options: storeTypeOptions,
    },
    required: true,
    colProps: {
      offset: 2,
    },
  },
];
