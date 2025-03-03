import { classListApi } from '@/api/class/class';
import { examListApi } from '@/api/exam/exam';
import { bookListApi } from '@/api/exercise/exercise';
import { teacherListApi } from '@/api/teacher/teacher';
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
    label: t('form.classType'),
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
  {
    field: 'level',
    label: t('form.level'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
        {
          label: '3',
          value: '3',
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
      xl: 6,
      xxl: 6,
    },
  },
  {
    field: 'skill',
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
      xl: 6,
      xxl: 4,
    },
  },
  {
    field: 'type',
    label: t('form.exeType'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('common.assignAtClass'),
          value: 'class',
        },
        {
          label: t('common.assignAtHome'),
          value: 'home',
        },
        {
          label: t('common.assignAtExam'),
          value: 'exam',
        },
      ],
    },
    required: true,
    colProps: {
      xl: 6,
      xxl: 4,
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
    field: 'level',
    label: t('form.level'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
        {
          label: '3',
          value: '3',
        },
      ],
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
      span: 12,
    },
  },
];

export const assignHomeworkFormSchemas: FormSchema[] = [
  {
    field: 'book_name',
    component: 'ApiSelect',
    label: t('form.bookName'),
    componentProps: {
      api: bookListApi(),
      resultField: 'items',
      labelField: 'title',
      valueField: 'title',
      immediate: true,
    },
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    field: 'skill',
    label: t('form.skill'),
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
      span: 12,
    },
  },

  {
    field: 'class_id',
    label: t('form.gradingSearch.className'),
    component: 'Select',
    componentProps: {
      options: [],
    },
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    field: 'shift_id',
    label: t('form.shift'),
    component: 'Select',
    componentProps: {
      options: [],
    },
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    field: 'homework_name',
    component: 'Input',
    label: t('form.gradingSearch.title'),
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    field: 'study_date',
    label: t('form.studyDate'),
    component: 'Select',
    componentProps: {
      options: [],
    },
    required: true,
    colProps: {
      span: 12,
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
      span: 12,
    },
  },
  {
    field: 'assign_at',
    label: t('form.exeType'),
    component: 'Select',
    componentProps: {
      options: [
        { label: t('form.assignAtClass'), value: 'class' },
        { label: t('form.assignAtHome'), value: 'class' },
      ],
    },
    required: true,
    colProps: {
      span: 12,
    },
  },
];

export const searchAttendanceSchemas: FormSchema[] = [
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
      xl: 6,
      xxl: 4,
      offset: 1,
    },
  },
  {
    field: 'date',
    label: t('form.date'),
    component: 'DatePicker',
    required: true,
    colProps: {
      xl: 6,
      xxl: 6,
      offset: 1,
    },
  },
];

export const assignClass: FormSchema[] = [
  {
    field: 'user_id',
    component: 'ApiSelect',
    label: t('form.teacher'),
    required: true,
    componentProps: {
      api: teacherListApi(),
      params: {
        id: 1,
      },
      resultField: 'items',
      labelField: 'name',
      valueField: 'id',
      immediate: true,
    },
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
      api: classListApi(),
      params: {
        id: 1,
      },
      resultField: 'items',
      labelField: 'title',
      valueField: 'id',
      immediate: true,
    },
    required: true,
    colProps: {
      offset: 1,
      span: 12,
    },
  },
];
