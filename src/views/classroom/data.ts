import { classListApi, teacherListApi } from '@/api/demo/table';
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

export const searchGradingSchemas: FormSchema[] = [
  {
    field: 'classId',
    component: 'ApiSelect',
    label: t('form.gradingSearch.className'),
    componentProps: {
      // more details see /src/components/Form/src/components/ApiSelect.vue
      api: classListApi(),
      params: {
        id: 1,
      },

      resultField: 'items',
      // use name as label
      labelField: 'className',
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
      offset: 1,
    },
  },
  {
    field: 'typeExercise',
    label: t('form.gradingSearch.skill'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'Reading',
          value: '1',
        },
        {
          label: 'Listening',
          value: '2',
        },
        {
          label: 'Speaking',
          value: '3',
        },
        {
          label: 'Writing',
          value: '4',
        },
      ],
    },
    required: true,
    colProps: {
      offset: 1,
    },
  },
];
