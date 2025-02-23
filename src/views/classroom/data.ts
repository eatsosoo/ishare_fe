import { classListApi } from '@/api/class/class';
import { examListApi } from '@/api/exam/exam';
import { homeworkListApi } from '@/api/exercise/exercise';
import { FormSchema } from '@/components/Form';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

// const basicOptions: LabelValueOptions = [
//   {
//     label: t('form.newClassForm.pending'),
//     value: 'pending',
//   },
//   {
//     label: t('form.newClassForm.enable'),
//     value: 'enable',
//   },
//   {
//     label: t('form.newClassForm.finished'),
//     value: 'finished',
//   },
// ];

export const schemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: t('form.newClassForm.name'),
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'description',
    component: 'Input',
    label: t('form.newClassForm.description'),
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'start_date',
    label: t('form.newClassForm.courseDuration'),
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: t('form.newClassForm.openingDay'),
    },
    required: true,
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'key',
    label: t('form.newClassForm.classType'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: 'HS',
          value: 'HS',
        },
        {
          label: 'CT',
          value: 'CT',
        },
        {
          label: 'LHP',
          value: 'LHP',
        },
        {
          label: 'TL',
          value: 'TL',
        },
        {
          label: 'JU',
          value: 'JU',
        },
      ],
    },
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
      labelField: 'title',
      // use id as value
      valueField: 'id',
      // not request untill to select
      immediate: true,
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
          value: 'Reading',
        },
        {
          label: 'Listening',
          value: 'Listening',
        },
        {
          label: 'Speaking',
          value: 'Speaking',
        },
        {
          label: 'Writing',
          value: 'Writing',
        },
      ],
    },
    required: true,
    colProps: {
      offset: 1,
    },
  },
];

export const createExamSchemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: t('form.exam.name'),
    required: true,
    colProps: {
      offset: 1,
    },
  },
  {
    field: 'deadline',
    label: t('form.exam.deadline'),
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
    },
    required: true,
    colProps: {
      offset: 1,
    },
  },
];

export const assignTestFormSchemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: t('form.gradingSearch.title'),
    required: true,
    colProps: {
      offset: 1,
      span: 12,
    },
  },
  {
    field: 'class_id',
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
      labelField: 'title',
      // use id as value
      valueField: 'id',
      // not request untill to select
      immediate: true,
    },
    required: true,
    colProps: {
      offset: 1,
      span: 12,
    },
  },
  {
    field: 'exam_id',
    component: 'ApiSelect',
    label: t('form.gradingSearch.examName'),
    componentProps: {
      // more details see /src/components/Form/src/components/ApiSelect.vue
      api: examListApi(),
      params: {
        id: 1,
      },

      resultField: 'items',
      // use name as label
      labelField: 'title',
      // use id as value
      valueField: 'id',
      // not request untill to select
      immediate: true,
    },
    required: true,
    colProps: {
      span: 12,
      offset: 1,
    },
  },
  {
    field: 'date',
    label: t('form.gradingSearch.deadline'),
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
    },
    required: true,
    colProps: {
      offset: 1,
    },
  },
];

export const assignHomeworkFormSchemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: t('form.gradingSearch.title'),
    required: true,
    colProps: {
      offset: 1,
      span: 12,
    },
  },
  {
    field: 'class_id',
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
      labelField: 'title',
      // use id as value
      valueField: 'id',
      // not request untill to select
      immediate: true,
    },
    required: true,
    colProps: {
      offset: 1,
      span: 12,
    },
  },
  {
    field: 'exam_id',
    component: 'ApiSelect',
    label: t('form.gradingSearch.homeworkName'),
    componentProps: {
      // more details see /src/components/Form/src/components/ApiSelect.vue
      api: homeworkListApi(),
      params: {
        id: 1,
      },

      resultField: 'items',
      // use name as label
      labelField: 'title',
      // use id as value
      valueField: 'id',
      // not request untill to select
      immediate: true,
    },
    required: true,
    colProps: {
      span: 12,
      offset: 1,
    },
  },
  {
    field: 'date',
    label: t('form.gradingSearch.deadline'),
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
    },
    required: true,
    colProps: {
      offset: 1,
      span: 24,
    },
  },
];
